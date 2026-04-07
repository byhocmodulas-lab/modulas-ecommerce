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
    // Always respond quickly — DB check has a hard 3s limit so Railway
    // health check (120s timeout) is never blocked by a slow DB.
    let dbOk = false;
    try {
      await Promise.race([
        this.db.query('SELECT 1'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
      ]);
      dbOk = true;
    } catch {
      dbOk = false;
    }

    return {
      status: 'ok', // always 200 — Railway only needs the process to be alive
      db: dbOk ? 'up' : 'down',
      timestamp: new Date().toISOString(),
    };
  }
}
