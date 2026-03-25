import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, Min } from 'class-validator';
import { WorkshopType, SkillLevel } from '../entities/workshop.entity';

export class CreateWorkshopDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(WorkshopType)
  @IsOptional()
  type?: WorkshopType;

  @IsEnum(SkillLevel)
  @IsOptional()
  skillLevel?: SkillLevel;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  startsAt?: string;

  @IsNumber()
  @IsOptional()
  durationHours?: number;

  @IsBoolean()
  @IsOptional()
  isOnline?: boolean;

  @IsNumber()
  @IsOptional()
  maxSeats?: number;
}

export class UpdateWorkshopDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(WorkshopType)
  @IsOptional()
  type?: WorkshopType;

  @IsEnum(SkillLevel)
  @IsOptional()
  skillLevel?: SkillLevel;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  startsAt?: string;

  @IsNumber()
  @IsOptional()
  durationHours?: number;

  @IsBoolean()
  @IsOptional()
  isOnline?: boolean;

  @IsNumber()
  @IsOptional()
  maxSeats?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
