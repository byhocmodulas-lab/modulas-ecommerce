import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export enum ProductSortOption {
  Relevance  = 'relevance',
  PriceAsc   = 'price-asc',
  PriceDesc  = 'price-desc',
  Newest     = 'newest',
  Popular    = 'popular',
}

export class ProductSearchDto {
  @ApiPropertyOptional({ description: 'Full-text search query' })
  @IsString() @IsOptional() q?: string;

  @ApiPropertyOptional({ description: 'Category slug (e.g. sofas, bedroom)' })
  @IsString() @IsOptional() category?: string;

  @ApiPropertyOptional({ description: 'Subcategory slug (e.g. sectional-sofas)' })
  @IsString() @IsOptional() subcategory?: string;

  @ApiPropertyOptional({ description: 'Material filter (e.g. solid-oak, marble)' })
  @IsString() @IsOptional() material?: string;

  @ApiPropertyOptional({ description: 'Brand / collection filter' })
  @IsString() @IsOptional() brand?: string;

  @ApiPropertyOptional({ description: 'Finish / colour filter' })
  @IsString() @IsOptional() finish?: string;

  @ApiPropertyOptional({ description: 'Minimum price in INR' })
  @IsNumber() @IsOptional() @Type(() => Number) @Min(0) min?: number;

  @ApiPropertyOptional({ description: 'Maximum price in INR' })
  @IsNumber() @IsOptional() @Type(() => Number) @Min(0) max?: number;

  @ApiPropertyOptional({ enum: ProductSortOption })
  @IsEnum(ProductSortOption) @IsOptional() sort?: ProductSortOption;

  @ApiPropertyOptional({ default: 1 })
  @IsNumber() @IsOptional() @Type(() => Number) @Min(1) page?: number;

  @ApiPropertyOptional({ default: 24 })
  @IsNumber() @IsOptional() @Type(() => Number) @Min(1) @Max(100) limit?: number;

  @ApiPropertyOptional({ description: 'Only configurable (3D) products' })
  @IsBoolean() @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  configurable?: boolean;

  @ApiPropertyOptional({ description: 'Only in-stock products (stock_qty > 0)' })
  @IsBoolean() @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  instock?: boolean;

  @ApiPropertyOptional({ description: 'Only on-sale products (compare_at_price > price)' })
  @IsBoolean() @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  sale?: boolean;
}
