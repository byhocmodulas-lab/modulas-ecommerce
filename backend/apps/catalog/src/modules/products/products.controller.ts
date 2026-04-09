import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  Query, UseGuards, HttpCode, HttpStatus, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductSearchDto } from './dto/product-search.dto';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../../libs/common/src/guards/roles.guard';
import { Roles } from '../../../../../libs/common/src/decorators/roles.decorator';
import { Public } from '../../../../../libs/common/src/decorators/public.decorator';
import { Role } from '../../../../../libs/common/src/enums/role.enum';

@ApiTags('products')
@UseGuards(JwtAuthGuard, RolesGuard)
// Serve on both /products and /catalog/products so all frontend calls resolve
@Controller(['products', 'catalog/products'])
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ─── Public endpoints ────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Search / list products' })
  search(@Query() dto: ProductSearchDto) {
    return this.productsService.search(dto);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  // ─── Admin / Editor endpoints ────────────────────────────────

  @Post()
  @ApiBearerAuth()
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin|Editor] Create product' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.MasterAdmin, Role.Editor)
  @ApiOperation({ summary: '[Admin|Editor] Update product' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.MasterAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[Admin] Soft-delete product' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
