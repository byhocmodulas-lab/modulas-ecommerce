import { Controller, Get } from '@nestjs/common';
import { Public } from '../../../../libs/common/src/decorators/public.decorator';

@Controller('health')
@Public()
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
