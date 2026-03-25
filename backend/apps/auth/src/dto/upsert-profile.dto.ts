import {
  IsString, IsOptional, IsUrl, MaxLength,
  ValidateNested, IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AddressDto {
  @ApiPropertyOptional() @IsString() @MaxLength(200) line1: string;
  @ApiPropertyOptional() @IsString() @MaxLength(200) @IsOptional() line2?: string;
  @ApiPropertyOptional() @IsString() @MaxLength(100) city: string;
  @ApiPropertyOptional() @IsString() @MaxLength(100) @IsOptional() state?: string;
  @ApiPropertyOptional() @IsString() @MaxLength(100) country: string;
  @ApiPropertyOptional() @IsString() @MaxLength(20) pincode: string;
}

export class RequirementsDto {
  @ApiPropertyOptional({ enum: ['home', 'office', 'hospitality', 'retail', 'other'] })
  @IsEnum(['home', 'office', 'hospitality', 'retail', 'other'])
  @IsOptional()
  projectType?: 'home' | 'office' | 'hospitality' | 'retail' | 'other';

  @ApiPropertyOptional() @IsString() @MaxLength(100) @IsOptional() budgetRange?: string;
  @ApiPropertyOptional() @IsString() @MaxLength(200) @IsOptional() timeline?: string;
  @ApiPropertyOptional() @IsString() @MaxLength(2000) @IsOptional() notes?: string;
}

export class UpsertProfileDto {
  @ApiPropertyOptional() @IsString() @MaxLength(100) @IsOptional() fullName?: string;
  @ApiPropertyOptional() @IsString() @MaxLength(20) @IsOptional() phone?: string;

  @ApiPropertyOptional({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  @ApiPropertyOptional() @IsString() @MaxLength(200) @IsOptional() companyName?: string;

  @ApiPropertyOptional()
  @IsUrl({}, { message: 'website must be a valid URL' })
  @MaxLength(500)
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ type: RequirementsDto })
  @ValidateNested()
  @Type(() => RequirementsDto)
  @IsOptional()
  requirements?: RequirementsDto;
}
