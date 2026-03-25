import { IsString, IsEnum, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { CampaignType, CampaignStatus } from '../entities/campaign.entity';

export class CreateCampaignDto {
  @IsString() title: string;
  @IsString() description: string;
  @IsEnum(CampaignType) type: CampaignType;
  @IsArray() platforms: string[];
  @IsOptional() @IsString() deadline?: string;
  @IsOptional() @IsString() fee?: string;
  @IsOptional() @IsArray() deliverables?: string[];
  @IsOptional() @IsEnum(CampaignStatus) status?: CampaignStatus;
}

export class UpdateCampaignDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(CampaignType) type?: CampaignType;
  @IsOptional() @IsArray() platforms?: string[];
  @IsOptional() @IsString() deadline?: string;
  @IsOptional() @IsString() fee?: string;
  @IsOptional() @IsArray() deliverables?: string[];
  @IsOptional() @IsEnum(CampaignStatus) status?: CampaignStatus;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
