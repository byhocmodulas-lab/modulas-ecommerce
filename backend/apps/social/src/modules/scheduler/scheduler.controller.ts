import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, Request, UseGuards,
  HttpCode, HttpStatus, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SchedulerService } from './scheduler.service';
import {
  CreateScheduledPostDto,
  UpdateScheduledPostDto,
  ScheduledPostQueryDto,
} from './dto/scheduler.dto';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard }   from '../../../../../libs/common/src/guards/roles.guard';
import { Roles }        from '../../../../../libs/common/src/decorators/roles.decorator';
import { Role }         from '../../../../../libs/common/src/enums/role.enum';

const CONTENT_ROLES = [Role.MasterAdmin, Role.Editor];

@ApiTags('scheduler')
@Controller('social/posts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Get()
  @Roles(...CONTENT_ROLES)
  list(@Query() query: ScheduledPostQueryDto) {
    return this.schedulerService.list(query);
  }

  @Get('summary')
  @Roles(...CONTENT_ROLES)
  summary() {
    return this.schedulerService.getSummary();
  }

  @Get(':id')
  @Roles(...CONTENT_ROLES)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.schedulerService.findOne(id);
  }

  @Post()
  @Roles(...CONTENT_ROLES)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateScheduledPostDto, @Request() req: any) {
    return this.schedulerService.create(dto, req.user.id);
  }

  @Patch(':id')
  @Roles(...CONTENT_ROLES)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateScheduledPostDto) {
    return this.schedulerService.update(id, dto);
  }

  @Delete(':id')
  @Roles(...CONTENT_ROLES)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.schedulerService.remove(id);
  }
}
