import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@ApiExcludeController()
@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  @Get()
  async check() {
    const dbOk = await this.db.query('SELECT 1').then(() => true).catch(() => false);
    return {
      status: dbOk ? 'ok' : 'degraded',
      db: dbOk ? 'up' : 'down',
      timestamp: new Date().toISOString(),
    };
  }
}
