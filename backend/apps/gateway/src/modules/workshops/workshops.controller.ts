import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { WorkshopsService } from './workshops.service';
import { CreateWorkshopDto, UpdateWorkshopDto } from './dto/workshop.dto';
import { WorkshopType, SkillLevel } from './entities/workshop.entity';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../../libs/common/src/guards/roles.guard';
import { Roles } from '../../../../../libs/common/src/decorators/roles.decorator';
import { Public } from '../../../../../libs/common/src/decorators/public.decorator';
import { Role } from '../../../../../libs/common/src/enums/role.enum';

@ApiTags('workshops')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('workshops')
export class WorkshopsController {
  constructor(private readonly service: WorkshopsService) {}

  /** Public — list upcoming workshops */
  @Get()
  @Public()
  @ApiOperation({ summary: 'List active workshops (public)' })
  @ApiQuery({ name: 'type',       enum: WorkshopType, required: false })
  @ApiQuery({ name: 'skillLevel', enum: SkillLevel,   required: false })
  @ApiQuery({ name: 'page',       type: Number,        required: false })
  @ApiQuery({ name: 'limit',      type: Number,        required: false })
  findAll(
    @Query('type')       type?: WorkshopType,
    @Query('skillLevel') skillLevel?: SkillLevel,
    @Query('page')       page  = 1,
    @Query('limit')      limit = 20,
  ) {
    return this.service.findAll({ type, skillLevel, page: +page, limit: +limit });
  }

  /** Public — get a single workshop by slug */
  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get workshop by slug (public)' })
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Post()
  @Roles(Role.MasterAdmin, Role.Editor)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '[Admin] Create a workshop' })
  create(@Body() dto: CreateWorkshopDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin] Update a workshop' })
  update(@Param('id') id: string, @Body() dto: UpdateWorkshopDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.MasterAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Admin] Delete a workshop' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
