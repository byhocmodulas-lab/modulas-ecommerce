import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard }   from '../../../../../libs/common/src/guards/roles.guard';
import { Public }       from '../../../../../libs/common/src/decorators/public.decorator';

@ApiTags('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('catalog/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /** GET /catalog/categories — flat list of top-level categories */
  @Public()
  @Get()
  @ApiOperation({ summary: 'List all top-level categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  /** GET /catalog/categories/tree — full nested tree */
  @Public()
  @Get('tree')
  @ApiOperation({ summary: 'Full nested category tree' })
  findTree() {
    return this.categoriesService.findTree();
  }

  /** GET /catalog/categories/:slug/subcategories */
  @Public()
  @Get(':slug/subcategories')
  @ApiOperation({ summary: 'Subcategories of a given category slug' })
  findSubcategories(@Param('slug') slug: string) {
    return this.categoriesService.findSubcategories(slug);
  }

  /** GET /catalog/categories/:slug */
  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get a category by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }
}
