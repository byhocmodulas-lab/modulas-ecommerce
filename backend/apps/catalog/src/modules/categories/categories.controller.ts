import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService, CreateCategoryDto, UpdateCategoryDto } from './categories.service';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard }   from '../../../../../libs/common/src/guards/roles.guard';
import { Roles }        from '../../../../../libs/common/src/decorators/roles.decorator';
import { Public }       from '../../../../../libs/common/src/decorators/public.decorator';
import { Role }         from '../../../../../libs/common/src/enums/role.enum';

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

  /** GET /catalog/categories/flat — all categories (for admin dropdowns) */
  @ApiBearerAuth()
  @Roles(Role.MasterAdmin, Role.Editor)
  @Get('flat')
  @ApiOperation({ summary: '[Admin] All categories flat list' })
  findAllFlat() {
    return this.categoriesService.findAllFlat();
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

  /** POST /catalog/categories */
  @ApiBearerAuth()
  @Roles(Role.MasterAdmin, Role.Editor)
  @Post()
  @ApiOperation({ summary: '[Admin] Create category' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  /** PATCH /catalog/categories/:id */
  @ApiBearerAuth()
  @Roles(Role.MasterAdmin, Role.Editor)
  @Patch(':id')
  @ApiOperation({ summary: '[Admin] Update category' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  /** DELETE /catalog/categories/:id */
  @ApiBearerAuth()
  @Roles(Role.MasterAdmin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Admin] Delete category' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
