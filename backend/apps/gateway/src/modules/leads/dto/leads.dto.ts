import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeadStage, LeadSource } from '../entities/lead.entity';

export class CreateLeadDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiPropertyOptional() @IsString() @IsOptional() phone?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() company?: string;
  @ApiPropertyOptional() @IsEnum(LeadSource) @IsOptional() source?: LeadSource;
  @ApiPropertyOptional() @IsString() @IsOptional() notes?: string;
}

export class UpdateLeadDto {
  @ApiPropertyOptional() @IsString() @IsOptional() name?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() phone?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() company?: string;
  @ApiPropertyOptional() @IsEnum(LeadStage) @IsOptional() stage?: LeadStage;
  @ApiPropertyOptional() @IsString() @IsOptional() notes?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() assignedTo?: string;
}
