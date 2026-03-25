import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateArticleDto } from './create-article.dto';
import type { ArticleStatus } from '../entities/article.entity';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @IsOptional()
  @IsEnum(['draft', 'review', 'published', 'archived'])
  status?: ArticleStatus;
}
