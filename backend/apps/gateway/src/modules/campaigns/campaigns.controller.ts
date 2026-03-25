import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { CampaignStatus } from './entities/campaign.entity';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard }   from '../../../../../libs/common/src/guards/roles.guard';
import { Roles }        from '../../../../../libs/common/src/decorators/roles.decorator';
import { Role }         from '../../../../../libs/common/src/enums/role.enum';
import { Public }       from '../../../../../libs/common/src/decorators/public.decorator';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly service: CampaignsService) {}

  /** Public — list active campaigns (creator hub + store) */
  @Get()
  @Public()
  @ApiOperation({ summary: 'List active campaigns (public)' })
  findAll(
    @Query('status') status?: CampaignStatus,
    @Query('type')   type?: string,
  ) {
    return this.service.findAll({ status, type });
  }

  /** Public — single campaign */
  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a campaign by id (public)' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /** Admin — create campaign */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a campaign (admin)' })
  create(@Body() dto: CreateCampaignDto) {
    return this.service.create(dto);
  }

  /** Admin — update campaign */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a campaign (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    return this.service.update(id, dto);
  }

  /** Admin — delete campaign */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a campaign (admin)' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
