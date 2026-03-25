import {
  Injectable, CanActivate, ExecutionContext, ForbiddenException,
} from '@nestjs/common';

/**
 * Enforces that the authenticated user has `isVerified = true`.
 *
 * Apply to any portal controller that requires admin-approved access:
 *   @UseGuards(JwtAuthGuard, RolesGuard, VerifiedGuard)
 *
 * This prevents pending-approval accounts (architects, vendors, interns)
 * from accessing their portals before an admin confirms them.
 */
@Injectable()
export class VerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    if (!user?.isVerified) {
      throw new ForbiddenException(
        'Your account is pending admin approval. You will receive an email when access is granted.',
      );
    }

    return true;
  }
}
