import {
  IsString, IsOptional, IsEnum, IsArray, MaxLength,
} from 'class-validator';
import type { ContentType } from '../entities/article.entity';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  excerpt?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(['article', 'guide', 'project', 'trend'])
  contentType?: ContentType;

  @IsOptional()
  @IsString()
  locale?: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;
}
