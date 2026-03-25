import { IsString, IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';

export class GenerateTextDto {
  @IsEnum(['caption','hashtags','platform_variants','content_ideas','product_copy','product_description','seo_tags','blog','product_names','email'])
  tool: string;

  @IsString()
  prompt: string;

  @IsOptional()
  @IsEnum(['instagram','facebook','linkedin','pinterest'])
  platform?: string;

  @IsOptional()
  @IsEnum(['luxury','informative','promotional','conversational'])
  tone?: string;

  @IsOptional()
  @IsEnum(['architect','homeowner','designer','general'])
  audience?: string;

  @IsOptional()
  @IsInt()
  @Min(64)
  @Max(4096)
  maxTokens?: number;
}

export class GenerateImagePromptDto {
  @IsString()
  category: string;

  @IsString()
  theme: string;

  @IsOptional()
  @IsString()
  audience?: string;

  @IsOptional()
  @IsString()
  style?: string;
}

export class GenerateCampaignBriefDto {
  @IsString()
  topic: string;

  @IsOptional()
  platforms?: string[];
}
