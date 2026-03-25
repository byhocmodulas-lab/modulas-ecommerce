import { IsString, IsOptional, IsBoolean, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty()  @IsString() label:    string;
  @ApiProperty()  @IsString() fullName: string;
  @ApiProperty()  @IsString() phone:    string;
  @ApiProperty()  @IsString() line1:    string;
  @ApiPropertyOptional() @IsString() @IsOptional() line2?:    string;
  @ApiProperty()  @IsString() city:     string;
  @ApiPropertyOptional() @IsString() @IsOptional() state?:    string;
  @ApiProperty()  @IsString() postcode: string;
  @ApiPropertyOptional() @IsString() @Length(2, 2) @IsOptional() country?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isDefault?: boolean;
}

export class UpdateAddressDto {
  @ApiPropertyOptional() @IsString() @IsOptional() label?:    string;
  @ApiPropertyOptional() @IsString() @IsOptional() fullName?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() phone?:    string;
  @ApiPropertyOptional() @IsString() @IsOptional() line1?:    string;
  @ApiPropertyOptional() @IsString() @IsOptional() line2?:    string;
  @ApiPropertyOptional() @IsString() @IsOptional() city?:     string;
  @ApiPropertyOptional() @IsString() @IsOptional() state?:    string;
  @ApiPropertyOptional() @IsString() @IsOptional() postcode?: string;
  @ApiPropertyOptional() @IsString() @Length(2, 2) @IsOptional() country?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isDefault?: boolean;
}
