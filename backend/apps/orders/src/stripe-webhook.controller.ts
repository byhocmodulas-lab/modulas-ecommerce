import {
  Controller, Post, Headers, Req, HttpCode, HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Public } from '../../../libs/common/src/decorators/public.decorator';
import { PaymentsService } from './payments.service';
import { Request } from 'express';

/**
 * Stripe sends a raw application/json body — the global JSON body-parser
 * must NOT consume it before signature verification.
 *
 * In main.ts add:
 *   app.use('/api/v1/orders/webhook/stripe', express.raw({ type: 'application/json' }));
 * BEFORE app.useGlobalPipes(...) and BEFORE the app listens.
 */
@ApiTags('stripe-webhook')
@Controller('orders/webhook')
export class StripeWebhookController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // V-12: rate-limit webhook to 300 req/min — Stripe bursts during batch retries
  // but sustained abuse beyond this is not expected from a legitimate Stripe IP.
  @Post('stripe')
  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 300 } })
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  async handleStripeWebhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody ?? (req.body as Buffer);
    await this.paymentsService.handleWebhook(rawBody, signature);
    return { received: true };
  }
}
