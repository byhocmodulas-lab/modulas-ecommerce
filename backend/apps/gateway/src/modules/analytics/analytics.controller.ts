import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../../libs/common/src/guards/roles.guard';
import { Roles } from '../../../../../libs/common/src/decorators/roles.decorator';
import { Role } from '../../../../../libs/common/src/enums/role.enum';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.MasterAdmin, Role.Editor)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: '[Admin] Aggregated platform KPIs and charts data' })
  dashboard() {
    return this.service.dashboard();
  }
}
