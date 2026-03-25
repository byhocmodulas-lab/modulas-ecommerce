import {
  IsArray, IsString, IsNumber, IsOptional, IsUUID,
  ValidateNested, Min, ArrayMinSize, IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty() @IsUUID() productId: string;
  @ApiPropertyOptional() @IsUUID() @IsOptional() configurationId?: string;
  @ApiProperty() @IsNumber() @Min(1) @Type(() => Number) quantity: number;
  @ApiProperty() @IsNumber() @Min(0) @Type(() => Number) unitPrice: number;
  @ApiPropertyOptional() @IsString() @IsOptional() finish?: string;
  @ApiPropertyOptional() @IsObject() @IsOptional() customSpecs?: Record<string, unknown>;
}

export class ShippingAddressDto {
  @ApiProperty() @IsString() line1: string;
  @ApiPropertyOptional() @IsString() @IsOptional() line2?: string;
  @ApiProperty() @IsString() city: string;
  @ApiProperty() @IsString() postcode: string;
  @ApiProperty() @IsString() country: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ type: ShippingAddressDto })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @ApiPropertyOptional() @IsString() @IsOptional() notes?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() affiliateCode?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() currency?: string;
}
