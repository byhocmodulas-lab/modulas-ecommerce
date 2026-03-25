import { IsString, IsOptional, IsEnum, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { QuoteStatus } from '../entities/quote.entity';

export class QuoteItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(1)
  qty: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsString()
  @IsOptional()
  configuration?: string;
}

export class CreateQuoteDto {
  @IsString()
  clientName: string;

  @IsString()
  @IsOptional()
  clientEmail?: string;

  @IsString()
  @IsOptional()
  projectName?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteItemDto)
  items: QuoteItemDto[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  discount?: number;

  @IsString()
  @IsOptional()
  validUntil?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateQuoteDto {
  @IsEnum(QuoteStatus)
  @IsOptional()
  status?: QuoteStatus;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => QuoteItemDto)
  items?: QuoteItemDto[];

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsString()
  @IsOptional()
  validUntil?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
