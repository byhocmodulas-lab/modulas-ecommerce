import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MentionsService } from './mentions.service';
import { CreateMentionDto, UpdateMentionDto } from './dto/mention.dto';
import { MentionSentiment } from './entities/mention.entity';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard }   from '../../../../../libs/common/src/guards/roles.guard';
import { Roles }        from '../../../../../libs/common/src/decorators/roles.decorator';
import { Role }         from '../../../../../libs/common/src/enums/role.enum';

@ApiTags('mentions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.MasterAdmin, Role.Editor)
@Controller('mentions')
export class MentionsController {
  constructor(private readonly service: MentionsService) {}

  @Get()
  @ApiOperation({ summary: 'List brand mentions' })
  findAll(
    @Query('sentiment')    sentiment?: MentionSentiment,
    @Query('platform')     platform?: string,
    @Query('needsResponse') needsResponse?: string,
  ) {
    return this.service.findAll({
      sentiment,
      platform,
      needsResponse: needsResponse === 'true',
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a brand mention (webhook or manual)' })
  create(@Body() dto: CreateMentionDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a mention (mark responded / archive)' })
  update(@Param('id') id: string, @Body() dto: UpdateMentionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a mention' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
