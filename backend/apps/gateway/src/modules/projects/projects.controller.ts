import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  Query, UseGuards, ParseUUIDPipe, HttpCode, HttpStatus, Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectStatus } from './entities/project.entity';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new project' })
  create(@Req() req: any, @Body() dto: CreateProjectDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List my projects' })
  findAll(
    @Req() req: any,
    @Query('status') status?: ProjectStatus,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.service.findAll(req.user.id, { status, page: +page, limit: +limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single project' })
  findOne(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  update(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.service.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a project' })
  remove(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id, req.user.id);
  }
}
