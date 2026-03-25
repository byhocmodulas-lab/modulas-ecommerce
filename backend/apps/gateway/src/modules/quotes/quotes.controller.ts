import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  Query, UseGuards, ParseUUIDPipe, HttpCode, HttpStatus, Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto, UpdateQuoteDto } from './dto/quote.dto';
import { QuoteStatus } from './entities/quote.entity';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';

@ApiTags('quotes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quotes')
export class QuotesController {
  constructor(private readonly service: QuotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a quote' })
  create(@Req() req: any, @Body() dto: CreateQuoteDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List my quotes' })
  findAll(
    @Req() req: any,
    @Query('status') status?: QuoteStatus,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.service.findAll(req.user.id, { status, page: +page, limit: +limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single quote' })
  findOne(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a quote' })
  update(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateQuoteDto,
  ) {
    return this.service.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a quote' })
  remove(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id, req.user.id);
  }
}
