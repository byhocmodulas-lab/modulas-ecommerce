import {
  IsString, IsOptional, IsEnum, IsArray, IsDateString,
  IsObject,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateScheduledPostDto {
  @IsString()
  title: string;

  @IsString()
  caption: string;

  @IsOptional()
  @IsString()
  hashtags?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaUrls?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(['instagram','facebook','linkedin','pinterest'], { each: true })
  platforms?: string[];

  @IsOptional()
  @IsEnum(['image','carousel','reel','story','text','article'])
  postType?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsObject()
  platformVariants?: Record<string, string>;

  @IsOptional()
  @IsString()
  campaign?: string;

  @IsOptional()
  @IsString()
  reachEst?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateScheduledPostDto extends PartialType(CreateScheduledPostDto) {
  @IsOptional()
  @IsEnum(['draft','scheduled','published','failed','cancelled'])
  status?: string;
}

export class ScheduledPostQueryDto {
  @IsOptional()
  @IsEnum(['draft','scheduled','published','failed','cancelled'])
  status?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  campaign?: string;

  @IsOptional()
  month?: number;

  @IsOptional()
  year?: number;
}
