import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfiguratorService } from './configurator.service';

@ApiTags('configurator')
@Controller('configurator')
export class ConfiguratorController {
  constructor(private readonly service: ConfiguratorService) {}

  @Get(':productId')
  @ApiOperation({ summary: 'Get configuration options for a product (public)' })
  getOptions(@Param('productId') productId: string) {
    return this.service.getOptions(productId);
  }
}
