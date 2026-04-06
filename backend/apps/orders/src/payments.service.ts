import {
  Injectable, Logger, NotFoundException,
  BadRequestException, InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { InvoicesService } from './invoices.service';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly config: ConfigService,
    private readonly invoicesService: InvoicesService,
  ) {
    const stripeKey = this.config.get<string>('STRIPE_SECRET_KEY');
    if (stripeKey) {
      this.stripe = new Stripe(stripeKey, { apiVersion: '2024-04-10' });
    } else {
      this.logger.warn('STRIPE_SECRET_KEY not set — payment endpoints are disabled');
    }
  }

  private get stripeClient(): Stripe {
    if (!this.stripe) throw new InternalServerErrorException('Payments are not configured');
    return this.stripe;
  }

  // ── Create PaymentIntent for an order ────────────────────────

  async createPaymentIntent(
    orderId: string,
    userId: string,
    customerEmail: string,
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const order = await this.orderRepo.findOne({ where: { id: orderId, userId } });
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    if (order.status !== OrderStatus.Pending) {
      throw new BadRequestException('Order is not in pending state');
    }

    const amountInPaise = Math.round(Number(order.totalAmount) * 100);

    const intent = await this.stripeClient.paymentIntents.create({
      amount: amountInPaise,
      currency: (order.currency ?? 'inr').toLowerCase(),
      metadata: { orderId: order.id, userId },
      receipt_email: customerEmail,
      automatic_payment_methods: { enabled: true },
    });

    // Store paymentIntentId on the order for reference
    await this.orderRepo.update(orderId, { stripePaymentIntentId: intent.id });

    return { clientSecret: intent.client_secret!, paymentIntentId: intent.id };
  }

  // ── Webhook: called by Stripe when events occur ───────────────

  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    const webhookSecret = this.config.getOrThrow<string>('STRIPE_WEBHOOK_SECRET');

    let event: Stripe.Event;
    try {
      event = this.stripeClient.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      this.logger.error('Stripe webhook signature verification failed', err);
      throw new BadRequestException('Invalid Stripe webhook signature');
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        this.logger.debug(`Unhandled Stripe event: ${event.type}`);
    }
  }

  private async handlePaymentSucceeded(intent: Stripe.PaymentIntent): Promise<void> {
    const orderId = intent.metadata?.orderId;
    const userId  = intent.metadata?.userId;
    if (!orderId || !userId) return;

    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) return;

    // Idempotency: skip if already processed
    if (order.status !== OrderStatus.Pending) return;

    // Update order to Confirmed
    order.status = OrderStatus.Confirmed;
    order.stripePaymentIntentId = intent.id;
    await this.orderRepo.save(order);

    // Create Payment record
    const payment = this.paymentRepo.create({
      orderId,
      userId,
      stripePaymentIntentId: intent.id,
      amount: intent.amount / 100,
      currency: intent.currency.toUpperCase(),
      status: PaymentStatus.Succeeded,
      metadata: { charges: intent.latest_charge },
    });
    await this.paymentRepo.save(payment);

    // Generate invoice — fire and forget with error boundary
    try {
      await this.invoicesService.generateForOrder(order, userId);
    } catch (err) {
      this.logger.error(`Invoice generation failed for order ${orderId}`, err);
    }
  }

  private async handlePaymentFailed(intent: Stripe.PaymentIntent): Promise<void> {
    const orderId = intent.metadata?.orderId;
    const userId  = intent.metadata?.userId;
    if (!orderId) return;

    // Upsert payment record for the failure
    const existing = await this.paymentRepo.findOne({
      where: { stripePaymentIntentId: intent.id },
    });
    if (existing) {
      existing.status = PaymentStatus.Failed;
      await this.paymentRepo.save(existing);
    } else {
      await this.paymentRepo.save(
        this.paymentRepo.create({
          orderId,
          userId: userId ?? '',
          stripePaymentIntentId: intent.id,
          amount: intent.amount / 100,
          currency: intent.currency.toUpperCase(),
          status: PaymentStatus.Failed,
        }),
      );
    }
  }

  // ── Queries ───────────────────────────────────────────────────

  async findByOrder(orderId: string): Promise<Payment | null> {
    return this.paymentRepo.findOne({ where: { orderId } });
  }

  async adminList(page = 1, limit = 50) {
    const [data, total] = await this.paymentRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
