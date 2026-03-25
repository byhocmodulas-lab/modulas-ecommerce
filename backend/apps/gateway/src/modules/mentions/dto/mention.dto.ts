import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { MentionPlatform, MentionSentiment } from '../entities/mention.entity';

export class CreateMentionDto {
  @IsEnum(MentionPlatform)  platform: MentionPlatform;
  @IsString()               author: string;
  @IsString()               handle: string;
  @IsString()               content: string;
  @IsOptional() @IsEnum(MentionSentiment) sentiment?: MentionSentiment;
  @IsOptional() @IsNumber()  likes?: number;
  @IsOptional() @IsBoolean() requiresResponse?: boolean;
  @IsOptional() @IsString()  url?: string;
  @IsOptional() @IsString()  detectedAt?: string;
}

export class UpdateMentionDto {
  @IsOptional() @IsEnum(MentionSentiment) sentiment?: MentionSentiment;
  @IsOptional() @IsBoolean() responded?: boolean;
  @IsOptional() @IsBoolean() requiresResponse?: boolean;
  @IsOptional() @IsBoolean() isArchived?: boolean;
}
