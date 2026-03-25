import {
  IsString, IsEmail, IsOptional, IsEnum, IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationType, ApplicationStatus } from '../entities/application.entity';

export class CreateApplicationDto {
  @ApiProperty({ enum: ApplicationType }) @IsEnum(ApplicationType) type: ApplicationType;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiPropertyOptional() @IsString() @IsOptional() phone?: string;
  @ApiPropertyOptional() @IsObject() @IsOptional() payload?: Record<string, unknown>;
}

export class UpdateApplicationDto {
  @ApiPropertyOptional({ enum: ApplicationStatus }) @IsEnum(ApplicationStatus) @IsOptional() status?: ApplicationStatus;
  @ApiPropertyOptional() @IsString() @IsOptional() reviewNotes?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() reviewedBy?: string;
}
