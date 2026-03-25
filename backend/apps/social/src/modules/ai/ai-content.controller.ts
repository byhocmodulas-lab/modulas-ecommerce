import {
  Controller, Post, Body, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AIContentService } from './ai-content.service';
import { GenerateTextDto, GenerateImagePromptDto, GenerateCampaignBriefDto } from './dto/ai-content.dto';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard }   from '../../../../../libs/common/src/guards/roles.guard';
import { Roles }        from '../../../../../libs/common/src/decorators/roles.decorator';
import { Role }         from '../../../../../libs/common/src/enums/role.enum';

const AI_ROLES = [Role.MasterAdmin, Role.Editor];

@ApiTags('ai-content')
@Controller('social/ai')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AIContentController {
  constructor(private readonly aiService: AIContentService) {}

  @Post('generate')
  @Roles(...AI_ROLES)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate text content (caption, hashtags, ideas, copy…)' })
  generate(@Body() dto: GenerateTextDto) {
    return this.aiService.generateText(dto as any);
  }

  @Post('image-prompt')
  @Roles(...AI_ROLES)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate an optimised image generation prompt' })
  imagePrompt(@Body() dto: GenerateImagePromptDto) {
    return this.aiService.generateImagePrompt(dto);
  }

  @Post('campaign-brief')
  @Roles(...AI_ROLES)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate full campaign brief (caption + hashtags + variants + ideas)' })
  campaignBrief(@Body() dto: GenerateCampaignBriefDto) {
    return this.aiService.generateCampaignBrief(dto.topic, (dto.platforms ?? ['instagram']) as any);
  }
}
