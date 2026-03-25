import {
  IsString, IsNumber, IsBoolean, IsOptional,
  IsArray, IsUUID, Min, MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty() @IsString() @MaxLength(255) sku: string;
  @ApiProperty() @IsString() @MaxLength(255) slug: string;
  @ApiProperty() @IsString() @MaxLength(255) name: string;

  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;

  @ApiPropertyOptional() @IsUUID() @IsOptional() categoryId?: string;

  @ApiProperty() @IsNumber() @Min(0) @Type(() => Number) price: number;

  @ApiPropertyOptional({ default: 'GBP' })
  @IsString() @IsOptional() currency?: string;

  @ApiPropertyOptional() @IsString() @IsOptional() material?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray() @IsString({ each: true }) @IsOptional() finishOptions?: string[];

  @ApiPropertyOptional() @IsOptional() dimensions?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsNumber() @IsOptional() @Type(() => Number) weightKg?: number;

  @ApiPropertyOptional() @IsBoolean() @IsOptional() isConfigurable?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsArray() @IsString({ each: true }) @IsOptional() tags?: string[];

  @ApiPropertyOptional({ description: 'R2 file key of 3D model (triggers optimization job)' })
  @IsString() @IsOptional() modelFileKey?: string;
}
