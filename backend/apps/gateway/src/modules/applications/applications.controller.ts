import {
  Controller, Get, Post, Patch, Body, Param, Query,
  UseGuards, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto, UpdateApplicationDto } from './dto/application.dto';
import { ApplicationStatus, ApplicationType } from './entities/application.entity';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../../libs/common/src/guards/roles.guard';
import { Roles } from '../../../../../libs/common/src/decorators/roles.decorator';
import { Public } from '../../../../../libs/common/src/decorators/public.decorator';
import { Role } from '../../../../../libs/common/src/enums/role.enum';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly service: ApplicationsService) {}

  /** Public — vendor/creator/intern join form submissions */
  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a join application (public)' })
  create(@Body() dto: CreateApplicationDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin] List all applications' })
  @ApiQuery({ name: 'type',   enum: ApplicationType,   required: false })
  @ApiQuery({ name: 'status', enum: ApplicationStatus, required: false })
  @ApiQuery({ name: 'page',   type: Number,            required: false })
  @ApiQuery({ name: 'limit',  type: Number,            required: false })
  findAll(
    @Query('type')   type?: ApplicationType,
    @Query('status') status?: ApplicationStatus,
    @Query('page')   page  = 1,
    @Query('limit')  limit = 50,
  ) {
    return this.service.findAll({ type, status, page: +page, limit: +limit });
  }

  /** Public — applicant checks their own status by email + type */
  @Get('status')
  @Public()
  @ApiOperation({ summary: 'Check own application status by email (public)' })
  checkStatus(
    @Query('email') email: string,
    @Query('type') type?: ApplicationType,
  ) {
    return this.service.findAll({ type, page: 1, limit: 1, email }).then((res) => {
      if (res.data.length === 0) return { found: false };
      const app = res.data[0];
      return { found: true, status: app.status, type: app.type, createdAt: app.createdAt };
    });
  }

  @Get(':id')
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin] Get a single application' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin] Review an application (approve/reject)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateApplicationDto) {
    return this.service.update(id, dto);
  }
}
