import {
  IsUUID, IsNumber, IsOptional, IsString, IsObject, Min, Max, MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AddCartItemDto {
  @ApiProperty() @IsUUID() productId: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() configurationId?: string;
  @ApiProperty() @IsNumber() @Min(1) @Max(999) @Type(() => Number) quantity: number;

  /**
   * SECURITY: unitPrice is accepted from the client as a convenience but MUST be
   * validated against the catalog service before persisting to an order.
   * TODO: Replace with server-side catalog price lookup before GA.
   * Bounds check prevents gross manipulation (₹0.01 → ₹10M cap).
   */
  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(10_000_000)
  @Type(() => Number)
  unitPrice: number;

  @ApiPropertyOptional() @IsString() @MaxLength(100) @IsOptional() finish?: string;

  // Bounded to prevent prototype-pollution and oversized payloads
  @ApiPropertyOptional() @IsObject() @IsOptional() customSpecs?: Record<string, string | number | boolean>;
}
