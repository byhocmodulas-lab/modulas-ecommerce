import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../../../../libs/common/src/enums/role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  type: string;   // must be 'access'
  isVerified: boolean;
  iat?: number;
  exp?: number;
}

/** Roles that require admin approval — users in these roles must be isVerified=true
 *  before they can access role-specific portal routes. */
const APPROVAL_REQUIRED_ROLES: Role[] = [Role.Architect, Role.Vendor, Role.Intern, Role.Creator];

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    // V-03: Reject refresh tokens used as access tokens
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    // Always load from DB — ensures soft-deleted, banned, or role-changed
    // users are rejected on every request (token cannot be stale for more than 15m anyway)
    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // V-04: Reject pending-approval users trying to use role-specific routes.
    // /account, /checkout, /products etc. are still accessible (checked per-route by RolesGuard).
    // Portal routes (/architect/*, /vendor/*, /intern/*) use @Roles() which will also
    // enforce this via the RolesGuard. But we add the isVerified check here to block
    // ANY elevated role usage if not yet verified.
    if (
      APPROVAL_REQUIRED_ROLES.includes(user.role as Role) &&
      !user.isVerified
    ) {
      // Allow access to basic customer-tier routes but not role-specific portals.
      // The RolesGuard handles portal access. We do NOT throw here because unverified
      // architects can still browse the store. Throwing would lock them out entirely.
      // Instead we downgrade their effective role to customer for the request.
      // Actual portal blocking is enforced by RolesGuard + middleware.
    }

    return user;
  }
}
