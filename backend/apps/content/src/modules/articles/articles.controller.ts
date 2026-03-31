import {
  Controller, Get, Post, Patch, Delete, Param, Body,
  Query, UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleQueryDto } from './dto/article-query.dto';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard }   from '../../../../../libs/common/src/guards/roles.guard';
import { Roles }        from '../../../../../libs/common/src/decorators/roles.decorator';
import { Role }         from '../../../../../libs/common/src/enums/role.enum';
import { Public }       from '../../../../../libs/common/src/decorators/public.decorator';

const CONTENT_ROLES = [Role.MasterAdmin, Role.Editor];

@Controller('cms/articles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  /** Admin — all articles across all statuses */
  @Get()
  @Roles(...CONTENT_ROLES)
  adminList(@Query() query: ArticleQueryDto) {
    return this.articlesService.adminList(query);
  }

  /** Public — paginated published articles */
  @Get('published')
  @Public()
  findPublished(@Query() query: ArticleQueryDto) {
    return this.articlesService.findPublished(query);
  }

  /** Public — single published article by slug */
  @Get(':slug/published')
  @Public()
  findBySlug(@Param('slug') slug: string) {
    return this.articlesService.findBySlug(slug);
  }

  @Post()
  @Roles(...CONTENT_ROLES)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateArticleDto, @Request() req: any) {
    return this.articlesService.create(dto, req.user.id);
  }

  @Patch(':id/status')
  @Roles(...CONTENT_ROLES)
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.articlesService.updateStatus(id, status);
  }

  @Patch(':id')
  @Roles(...CONTENT_ROLES)
  update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.articlesService.updateArticle(id, dto);
  }

  @Delete(':id')
  @Roles(Role.MasterAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}
