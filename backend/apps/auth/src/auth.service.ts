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
import { EmailService } from './email.service';

/** Roles that require admin approval before access is granted */
const PENDING_APPROVAL_ROLES: Role[] = [Role.Architect, Role.Vendor, Role.Intern];

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  // ─── Registration ──────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email.toLowerCase() } });
    if (existing) throw new ConflictException('An account with this email already exists');

    this.validatePasswordStrength(dto.password);

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const requestedRole = dto.role ?? Role.Customer;
    const needsApproval = PENDING_APPROVAL_ROLES.includes(requestedRole);

    const user = this.userRepo.create({
      email: dto.email.toLowerCase(),
      fullName: dto.fullName,
      clerkId: `local_${crypto.randomUUID()}`,
      role: requestedRole,
      isVerified: !needsApproval,
      pendingApproval: needsApproval,
      passwordHash,
      metadata: { registeredAt: new Date().toISOString() },
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
    // Load with secret columns explicitly selected
    const user = await this.userRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email: dto.email.toLowerCase() })
      .getOne();

    // Constant-time comparison to prevent user enumeration
    const dummyHash = '$2b$12$invalidhashpadding000000000000000000000000000000000000000';
    const hash = user?.passwordHash ?? dummyHash;
    const valid = await bcrypt.compare(dto.password, hash);

    if (!user || !valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      ...(await this.issueTokenPair(user)),
      pendingApproval: user.pendingApproval,
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

    const user = await this.userRepo
      .createQueryBuilder('u')
      .addSelect('u.refreshTokenHash')
      .where('u.id = :id', { id: payload.sub })
      .getOne();

    if (!user) throw new UnauthorizedException('User not found');

    if (!user.refreshTokenHash) throw new UnauthorizedException('No active session');

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Guard against length mismatch before timingSafeEqual
    if (user.refreshTokenHash.length !== tokenHash.length) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    const hashMatch = crypto.timingSafeEqual(
      Buffer.from(user.refreshTokenHash, 'hex'),
      Buffer.from(tokenHash, 'hex'),
    );
    if (!hashMatch) throw new UnauthorizedException('Refresh token revoked');

    return await this.issueTokenPair(user);
  }

  // ─── Logout ────────────────────────────────────────────────────

  async logout(userId: string): Promise<void> {
    await this.userRepo.update(userId, { refreshTokenHash: null });
  }

  // ─── Current user ──────────────────────────────────────────────

  async me(userId: string): Promise<ReturnType<AuthService['sanitize']>> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return this.sanitize(user);
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
      passwordResetHash: tokenHash,
      passwordResetExpiry: expiresAt,
    });

    await this.emailService.sendPasswordReset(user.email, user.fullName ?? user.email, token);

    return { message: 'If an account exists, a reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');

    // Load with select:false columns explicitly
    const user = await this.userRepo
      .createQueryBuilder('u')
      .addSelect(['u.passwordResetHash', 'u.passwordResetExpiry'])
      .where('u.passwordResetHash = :hash', { hash: tokenHash })
      .getOne();

    if (!user) throw new BadRequestException('Invalid or expired reset token');

    // Guard against length mismatch before timingSafeEqual
    const storedHash = user.passwordResetHash ?? '';
    if (storedHash.length !== tokenHash.length) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const match = crypto.timingSafeEqual(
      Buffer.from(storedHash, 'hex'),
      Buffer.from(tokenHash, 'hex'),
    );
    if (!match) throw new BadRequestException('Invalid or expired reset token');

    if (!user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    this.validatePasswordStrength(dto.newPassword);
    const passwordHash = await bcrypt.hash(dto.newPassword, 12);

    await this.userRepo.update(user.id, {
      passwordHash,
      passwordResetHash: null,
      passwordResetExpiry: null,
      refreshTokenHash: null, // invalidate all sessions
    });

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
    if (dto.role === Role.MasterAdmin && requestingUser.role !== Role.MasterAdmin) {
      throw new ForbiddenException('Only a master admin can assign the master admin role');
    }

    const user = await this.userRepo.findOne({ where: { id: targetId } });
    if (!user) throw new NotFoundException('User not found');

    const needsApproval = PENDING_APPROVAL_ROLES.includes(dto.role);

    await this.userRepo.update(targetId, {
      role: dto.role,
      isVerified: !needsApproval,
      pendingApproval: needsApproval,
    });

    return (await this.userRepo.findOne({ where: { id: targetId } }))!;
  }

  async approveUser(targetId: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: targetId } });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepo.update(targetId, {
      isVerified: true,
      pendingApproval: false,
    });

    await this.emailService.sendApprovalNotification(user.email, user.fullName ?? user.email, user.role);

    return (await this.userRepo.findOne({ where: { id: targetId } }))!;
  }

  // ─── Bootstrap ─────────────────────────────────────────────────

  async bootstrapMasterAdmin(dto: { setupToken: string; email: string; password: string; fullName?: string }) {
    const expectedToken = this.config.get<string>('ADMIN_SETUP_TOKEN');
    if (!expectedToken || dto.setupToken !== expectedToken) {
      throw new UnauthorizedException('Invalid setup token');
    }

    const existing = await this.userRepo.findOne({ where: { role: Role.MasterAdmin } });
    if (existing) {
      throw new ConflictException('Master admin already exists. Bootstrap is disabled.');
    }

    this.validatePasswordStrength(dto.password);
    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = this.userRepo.create({
      email: dto.email.toLowerCase(),
      fullName: dto.fullName ?? 'Master Admin',
      clerkId: `local_${crypto.randomUUID()}`,
      role: Role.MasterAdmin,
      isVerified: true,
      pendingApproval: false,
      passwordHash,
      metadata: { registeredAt: new Date().toISOString() },
    });

    const saved = await this.userRepo.save(user);
    return { message: 'Master admin created successfully.', ...(await this.issueTokenPair(saved)) };
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

    const refreshPayload = { sub: user.id, type: 'refresh' };

    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: '15m',
      secret: this.config.getOrThrow('JWT_SECRET'),
    });

    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: '30d',
      secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
    });

    // Store hashed refresh token — awaited to prevent race on immediate refresh call
    const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.userRepo.update(user.id, { refreshTokenHash: refreshHash });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
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
      pendingApproval: user.pendingApproval,
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
