import {
  Controller, Get, Put, Body, Res, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ProfileService } from './profile.service';
import { UpsertProfileDto } from './dto/upsert-profile.dto';
import { JwtAuthGuard } from '../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard } from '../../../libs/common/src/guards/roles.guard';
import { Roles } from '../../../libs/common/src/decorators/roles.decorator';
import { CurrentUser } from '../../../libs/common/src/decorators/current-user.decorator';
import { Role } from '../../../libs/common/src/enums/role.enum';
import { User } from './entities/user.entity';

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getMyProfile(@CurrentUser() user: User) {
    return this.profileService.findByUserId(user.id);
  }

  @Put('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create or update current user profile' })
  upsertMyProfile(@CurrentUser() user: User, @Body() dto: UpsertProfileDto) {
    return this.profileService.upsert(user.id, dto);
  }

  @Get('admin/export')
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin] Export all user profiles as CSV' })
  async exportCsv(@Res() res: Response) {
    const csv = await this.profileService.exportCsv();
    const filename = `profiles-${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }
}
