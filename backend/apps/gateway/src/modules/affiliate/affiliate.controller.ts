import {
  Controller, Get, Post, Delete, Body, Param,
  UseGuards, HttpCode, HttpStatus, Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AffiliateService } from './affiliate.service';
import { IsString } from 'class-validator';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';
import { Public } from '../../../../../libs/common/src/decorators/public.decorator';

class CreateLinkDto {
  @IsString() label: string;
  @IsString() targetUrl: string;
}

@ApiTags('affiliate')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('affiliate')
export class AffiliateController {
  constructor(private readonly service: AffiliateService) {}

  @Get('links')
  @ApiOperation({ summary: 'List my affiliate links' })
  findAll(@Req() req: any) {
    return this.service.findAll(req.user.id);
  }

  @Post('links')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an affiliate link' })
  create(@Req() req: any, @Body() dto: CreateLinkDto) {
    return this.service.create(req.user.id, dto);
  }

  @Delete('links/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an affiliate link' })
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(id, req.user.id);
  }

  /** Public — track a click redirect */
  @Get('click/:slug')
  @Public()
  @ApiOperation({ summary: 'Track click and get redirect URL (public)' })
  trackClick(@Param('slug') slug: string) {
    return this.service.trackClick(slug);
  }
}
