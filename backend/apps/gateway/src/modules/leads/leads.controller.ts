import {
  Controller, Get, Post, Patch, Body, Param, Query,
  UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadDto } from './dto/leads.dto';
import { LeadStage } from './entities/lead.entity';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../../libs/common/src/guards/roles.guard';
import { Roles } from '../../../../../libs/common/src/decorators/roles.decorator';
import { Public } from '../../../../../libs/common/src/decorators/public.decorator';
import { Role } from '../../../../../libs/common/src/enums/role.enum';

@ApiTags('leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly service: LeadsService) {}

  /** Public — join forms post here (vendor/creator/intern applications) */
  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a lead (public — join forms)' })
  create(@Body() dto: CreateLeadDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin] List all leads with optional stage filter' })
  @ApiQuery({ name: 'stage', enum: LeadStage, required: false })
  @ApiQuery({ name: 'page',  type: Number,    required: false })
  @ApiQuery({ name: 'limit', type: Number,    required: false })
  findAll(
    @Query('stage') stage?: LeadStage,
    @Query('page')  page  = 1,
    @Query('limit') limit = 50,
  ) {
    return this.service.findAll({ stage, page: +page, limit: +limit });
  }

  @Get('summary')
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin] Lead count per pipeline stage' })
  stageSummary() {
    return this.service.stageSummary();
  }

  @Get(':id')
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin] Get a single lead' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin] Update lead stage / notes' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateLeadDto) {
    return this.service.update(id, dto);
  }
}
