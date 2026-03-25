import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Role, ADMIN_ROLES } from '../../../libs/common/src/enums/role.enum';

/** Roles that require admin approval before access is granted */
const PENDING_APPROVAL_ROLES: Role[] = [Role.Architect, Role.Vendor, Role.Intern];

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ─── Registration ──────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email.toLowerCase() } });
    if (existing) throw new ConflictException('An account with this email already exists');

    this.validatePasswordStrength(dto.password);

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const requestedRole = dto.role ?? Role.Customer;

    // Roles like architect/vendor start as pending — isVerified = false
    const needsApproval = PENDING_APPROVAL_ROLES.includes(requestedRole);

    const user = this.userRepo.create({
      email: dto.email.toLowerCase(),
      fullName: dto.fullName,
      clerkId: `local_${crypto.randomUUID()}`,
      role: requestedRole,
      isVerified: !needsApproval,
      metadata: {
        passwordHash,
        pendingApproval: needsApproval,
        registeredAt: new Date().toISOString(),
      },
    });

    const saved = await this.userRepo.save(user);

    return {
      ...(await this.issueTokenPair(saved)),
      pendingApproval: needsApproval,
      message: needsApproval
        ? `Your ${requestedRole} account is pending approval. You have limited access until verified.`
        : 'Account created successfully.',
    };
  }

  // ─── Login ─────────────────────────────────────────────────────

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email.toLowerCase() },
      withDeleted: false,
    });

    // Constant-time comparison to prevent user enumeration
    const dummyHash = '$2b$12$invalidhashpadding000000000000000000000000000000000000000';
    const hash = (user?.metadata as any)?.passwordHash ?? dummyHash;
    const valid = await bcrypt.compare(dto.password, hash);

    if (!user || !valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      ...(await this.issueTokenPair(user)),
      pendingApproval: !!(user.metadata as any)?.pendingApproval,
    };
  }

  // ─── Refresh Token ─────────────────────────────────────────────

  async refresh(refreshToken: string) {
    let payload: { sub: string; type: string };

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException('User not found');

    // Validate stored refresh token hash matches
    const storedHash = (user.metadata as any)?.refreshTokenHash as string | undefined;
    if (!storedHash) throw new UnauthorizedException('No active session');

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const hashMatch = crypto.timingSafeEqual(
      Buffer.from(storedHash, 'hex'),
      Buffer.from(tokenHash, 'hex'),
    );
    if (!hashMatch) throw new UnauthorizedException('Refresh token revoked');

    return await this.issueTokenPair(user);
  }

  // ─── Logout ────────────────────────────────────────────────────

  async logout(userId: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return;

    // Revoke refresh token by clearing stored hash
    const meta = { ...(user.metadata as Record<string, unknown>) };
    delete meta.refreshTokenHash;
    await this.userRepo.update(userId, { metadata: meta as any });
  }

  // ─── Current user ──────────────────────────────────────────────

  async me(userId: string): Promise<Omit<User, 'metadata'>> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Strip sensitive metadata before returning
    const { metadata: _, ...safe } = user;
    return safe as Omit<User, 'metadata'>;
  }

  // ─── Password reset ────────────────────────────────────────────

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    // Always return success to prevent user enumeration
    if (!user) {
      return { message: 'If an account exists, a reset link has been sent.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.userRepo.update(user.id, {
      metadata: {
        ...(user.metadata as Record<string, unknown>),
        passwordResetHash: tokenHash,
        passwordResetExpiry: expiresAt.toISOString(),
      } as any,
    });

    // TODO: send email via Resend — token is `token` (not the hash)
    // await this.emailService.sendPasswordReset(user.email, token);

    return { message: 'If an account exists, a reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    // V-01 FIX: Use QueryBuilder to search by token hash directly in the JSONB column.
    // This avoids the full table scan that existed previously (`find()` with no WHERE).
    // PostgreSQL can use GIN/expression indexes on JSONB if needed for scale.
    const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');

    const user = await this.userRepo
      .createQueryBuilder('u')
      .where(`u.metadata->>'passwordResetHash' = :hash`, { hash: tokenHash })
      .getOne();

    if (!user) throw new BadRequestException('Invalid or expired reset token');

    const meta = user.metadata as any;

    // V-15 FIX: Guard against length mismatch before timingSafeEqual
    const storedHash: string = meta.passwordResetHash ?? '';
    if (storedHash.length !== tokenHash.length) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Extra constant-time comparison as defence-in-depth (hash already matched above)
    const match = crypto.timingSafeEqual(
      Buffer.from(storedHash, 'hex'),
      Buffer.from(tokenHash, 'hex'),
    );
    if (!match) throw new BadRequestException('Invalid or expired reset token');

    if (new Date(meta.passwordResetExpiry) < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    this.validatePasswordStrength(dto.newPassword);
    const passwordHash = await bcrypt.hash(dto.newPassword, 12);

    const updatedMeta = { ...(user.metadata as Record<string, unknown>) };
    updatedMeta.passwordHash = passwordHash;
    delete updatedMeta.passwordResetHash;
    delete updatedMeta.passwordResetExpiry;
    delete updatedMeta.refreshTokenHash; // invalidate all sessions

    await this.userRepo.update(user.id, { metadata: updatedMeta as any });

    return { message: 'Password reset successfully. Please log in.' };
  }

  // ─── Admin: user management ────────────────────────────────────

  async listUsers(filters: { role?: Role; page?: number; limit?: number }) {
    const { role, page = 1, limit = 50 } = filters;
    const where = role ? { role } : {};
    const [users, total] = await this.userRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: users.map((u) => this.sanitize(u)),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateRole(requestingUser: User, targetId: string, dto: UpdateRoleDto): Promise<User> {
    // Only master_admin can assign master_admin
    if (dto.role === Role.MasterAdmin && requestingUser.role !== Role.MasterAdmin) {
      throw new ForbiddenException('Only a master admin can assign the master admin role');
    }

    const user = await this.userRepo.findOne({ where: { id: targetId } });
    if (!user) throw new NotFoundException('User not found');

    const needsApproval = PENDING_APPROVAL_ROLES.includes(dto.role);
    const meta = { ...(user.metadata as Record<string, unknown>) };
    if (!needsApproval) {
      delete meta.pendingApproval;
    }

    await this.userRepo.update(targetId, {
      role: dto.role,
      isVerified: !needsApproval,
      metadata: meta as any,
    });

    return (await this.userRepo.findOne({ where: { id: targetId } }))!;
  }

  async approveUser(targetId: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: targetId } });
    if (!user) throw new NotFoundException('User not found');

    const meta = { ...(user.metadata as Record<string, unknown>) };
    delete meta.pendingApproval;

    await this.userRepo.update(targetId, {
      isVerified: true,
      metadata: meta as any,
    });

    // TODO: send approval email
    return (await this.userRepo.findOne({ where: { id: targetId } }))!;
  }

  async deleteUser(targetId: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: targetId } });
    if (!user) throw new NotFoundException('User not found');
    if (ADMIN_ROLES.includes(user.role as any)) {
      throw new ForbiddenException('Cannot delete admin accounts via API');
    }
    await this.userRepo.softDelete(targetId);
  }

  // ─── Token helpers ──────────────────────────────────────────────

  private async issueTokenPair(user: User) {
    const accessPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      type: 'access',
    };

    const refreshPayload = {
      sub: user.id,
      type: 'refresh',
    };

    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: '15m',
      secret: this.config.getOrThrow('JWT_SECRET'),
    });

    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: '30d',
      secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
    });

    // Store hashed refresh token for rotation validation.
    // V-18: must be awaited — a fire-and-forget save can race with an immediate
    // refresh call, causing "No active session" errors if the hash write loses.
    const refreshHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await this.userRepo.update(user.id, {
      metadata: {
        ...(user.metadata as Record<string, unknown>),
        refreshTokenHash: refreshHash,
      } as any,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // seconds
      user: this.sanitize(user),
    };
  }

  private sanitize(user: User) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
  }

  private validatePasswordStrength(password: string) {
    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      throw new BadRequestException('Password must contain at least one letter and one number');
    }
  }
}
