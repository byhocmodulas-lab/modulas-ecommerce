import {
  Controller, Post, Get, Patch, Delete, Body, Param, Query,
  UseGuards, HttpCode, HttpStatus, ParseUUIDPipe, Res, Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiCookieAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard } from '../../../libs/common/src/guards/roles.guard';
import { Roles } from '../../../libs/common/src/decorators/roles.decorator';
import { Public } from '../../../libs/common/src/decorators/public.decorator';
import { CurrentUser } from '../../../libs/common/src/decorators/current-user.decorator';
import { Role } from '../../../libs/common/src/enums/role.enum';
import { User } from './entities/user.entity';

const REFRESH_COOKIE = 'modulas_refresh';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const, // V-09: strict prevents cookie from being sent on cross-site requests
  path: '/api/v1/auth',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

@ApiTags('auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─── Public: Register ──────────────────────────────────────────

  @Public()
  @Post('register')
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @ApiOperation({ summary: 'Create a new account' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto);
    this.setRefreshCookie(res, result.refreshToken);
    return result;
  }

  // ─── Public: Login ─────────────────────────────────────────────

  @Public()
  @Post('login')
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and receive access + refresh tokens' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    this.setRefreshCookie(res, result.refreshToken);
    return result;
  }

  // ─── Public: Refresh ───────────────────────────────────────────

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth(REFRESH_COOKIE)
  @ApiOperation({ summary: 'Exchange refresh token for a new access token' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (!token) throw new UnauthorizedException('No refresh token');

    const result = await this.authService.refresh(token);
    this.setRefreshCookie(res, result.refreshToken);
    return result;
  }

  // ─── Authenticated: Logout ─────────────────────────────────────

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke refresh token and clear cookie' })
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.id);
    res.clearCookie(REFRESH_COOKIE, { path: cookieOptions.path });
  }

  // ─── Authenticated: Current user ───────────────────────────────

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  me(@CurrentUser() user: User) {
    return this.authService.me(user.id);
  }

  // ─── Public: Password reset ────────────────────────────────────

  @Public()
  @Post('forgot-password')
  @Throttle({ default: { ttl: 60_000, limit: 3 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset email' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using token from email' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // ─── Admin: user management ────────────────────────────────────

  @Get('users')
  @ApiBearerAuth()
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin] List all users' })
  @ApiQuery({ name: 'role', enum: Role, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  listUsers(
    @Query('role') role?: Role,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.authService.listUsers({ role, page: +page, limit: Math.min(+limit, 100) });
  }

  @Patch('users/:id/role')
  @ApiBearerAuth()
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin] Update user role' })
  updateRole(
    @CurrentUser() requestingUser: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.authService.updateRole(requestingUser, id, dto);
  }

  @Patch('users/:id/approve')
  @ApiBearerAuth()
  @Roles(Role.MasterAdmin, Role.Editor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Admin] Approve pending architect / vendor / intern' })
  approveUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.approveUser(id);
  }

  @Delete('users/:id')
  @ApiBearerAuth()
  @Roles(Role.MasterAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[MasterAdmin] Soft-delete a user account' })
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.deleteUser(id);
  }

  // ─── Helper ────────────────────────────────────────────────────

  private setRefreshCookie(res: Response, token: string) {
    res.cookie(REFRESH_COOKIE, token, cookieOptions);
  }
}