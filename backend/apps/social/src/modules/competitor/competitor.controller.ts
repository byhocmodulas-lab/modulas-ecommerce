import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, HttpCode, HttpStatus, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CompetitorService } from './competitor.service';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard }   from '../../../../../libs/common/src/guards/roles.guard';
import { Roles }        from '../../../../../libs/common/src/decorators/roles.decorator';
import { Role }         from '../../../../../libs/common/src/enums/role.enum';

const CONTENT_ROLES = [Role.MasterAdmin, Role.Editor];

@ApiTags('competitors')
@Controller('social/competitors')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CompetitorController {
  constructor(private readonly competitorService: CompetitorService) {}

  /* ── Profiles ──────────────────────────────────────────── */

  @Get()
  @Roles(...CONTENT_ROLES)
  listProfiles() {
    return this.competitorService.listProfiles();
  }

  @Get(':id')
  @Roles(...CONTENT_ROLES)
  getProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.competitorService.getProfile(id);
  }

  @Get(':id/insights')
  @Roles(...CONTENT_ROLES)
  getInsights(@Param('id', ParseUUIDPipe) id: string) {
    return this.competitorService.getInsights(id);
  }

  @Post()
  @Roles(...CONTENT_ROLES)
  @HttpCode(HttpStatus.CREATED)
  createProfile(@Body() dto: any) {
    return this.competitorService.createProfile(dto);
  }

  @Patch(':id')
  @Roles(...CONTENT_ROLES)
  updateProfile(@Param('id', ParseUUIDPipe) id: string, @Body() dto: any) {
    return this.competitorService.updateProfile(id, dto);
  }

  @Delete(':id')
  @Roles(Role.MasterAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.competitorService.deleteProfile(id);
  }

  /* ── Posts ─────────────────────────────────────────────── */

  @Get(':id/posts')
  @Roles(...CONTENT_ROLES)
  listPosts(@Param('id', ParseUUIDPipe) id: string) {
    return this.competitorService.listPosts(id);
  }

  @Post(':id/posts')
  @Roles(...CONTENT_ROLES)
  @HttpCode(HttpStatus.CREATED)
  addPost(@Param('id', ParseUUIDPipe) id: string, @Body() dto: any) {
    return this.competitorService.addPost({ ...dto, competitorId: id });
  }

  @Patch('posts/:postId')
  @Roles(...CONTENT_ROLES)
  updatePost(@Param('postId', ParseUUIDPipe) postId: string, @Body() dto: any) {
    return this.competitorService.updatePost(postId, dto);
  }

  @Delete('posts/:postId')
  @Roles(...CONTENT_ROLES)
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePost(@Param('postId', ParseUUIDPipe) postId: string) {
    return this.competitorService.deletePost(postId);
  }
}
