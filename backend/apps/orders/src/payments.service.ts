import {
  Injectable, Logger, NotFoundException,
  BadRequestException, InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import * as crypto from 'crypto';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { InvoicesService } from './invoices.service';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Razorpay = require('razorpay');

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  private readonly razorpay: any;
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
      this.logger.warn('STRIPE_SECRET_KEY not set — Stripe payment endpoints disabled');
    }

    const rzpKeyId     = this.config.get<string>('RAZORPAY_KEY_ID');
    const rzpKeySecret = this.config.get<string>('RAZORPAY_KEY_SECRET');
    if (rzpKeyId && rzpKeySecret) {
      this.razorpay = new Razorpay({ key_id: rzpKeyId, key_secret: rzpKeySecret });
    } else {
      this.logger.warn('RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set — Razorpay endpoints disabled');
    }
  }

  private get stripeClient(): Stripe {
    if (!this.stripe) throw new InternalServerErrorException('Stripe payments are not configured');
    return this.stripe;
  }

  private get razorpayClient() {
    if (!this.razorpay) throw new InternalServerErrorException('Razorpay payments are not configured');
    return this.razorpay;
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

  // ── Razorpay: Create order ────────────────────────────────────

  async createRazorpayOrder(
    orderId: string,
    userId: string,
  ): Promise<{ razorpayOrderId: string; amount: number; currency: string; orderId: string }> {
    const order = await this.orderRepo.findOne({ where: { id: orderId, userId } });
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);
    if (order.status !== OrderStatus.Pending) {
      throw new BadRequestException('Order is not in pending state');
    }

    // Razorpay expects amount in smallest currency unit (paise for INR)
    const amountInPaise = Math.round(Number(order.totalAmount) * 100);
    const currency = (order.currency ?? 'INR').toUpperCase();

    const rzpOrder = await this.razorpayClient.orders.create({
      amount: amountInPaise,
      currency,
      receipt: `order_${orderId.slice(0, 30)}`,
      notes: { orderId, userId },
    });

    // Store the Razorpay order ID on the order record for verification later
    await this.orderRepo.update(orderId, { razorpayOrderId: rzpOrder.id });

    return {
      razorpayOrderId: rzpOrder.id,
      amount: amountInPaise,
      currency,
      orderId,
    };
  }

  // ── Razorpay: Verify payment signature ───────────────────────

  async verifyRazorpayPayment(
    orderId: string,
    userId: string,
    dto: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    },
  ): Promise<{ success: boolean }> {
    const order = await this.orderRepo.findOne({ where: { id: orderId, userId } });
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);

    // Signature verification: HMAC-SHA256 of "razorpay_order_id|razorpay_payment_id"
    const keySecret = this.config.getOrThrow<string>('RAZORPAY_KEY_SECRET');
    const body      = `${dto.razorpay_order_id}|${dto.razorpay_payment_id}`;
    const expected  = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    if (expected !== dto.razorpay_signature) {
      throw new BadRequestException('Invalid Razorpay payment signature');
    }

    // Idempotency guard
    if (order.status !== OrderStatus.Pending) {
      return { success: true }; // already processed
    }

    // Confirm order
    order.status = OrderStatus.Confirmed;
    await this.orderRepo.save(order);

    // Record payment
    const payment = this.paymentRepo.create({
      orderId,
      userId,
      razorpayPaymentId: dto.razorpay_payment_id,
      razorpayOrderId:   dto.razorpay_order_id,
      amount: Number(order.totalAmount),
      currency: order.currency ?? 'INR',
      status: PaymentStatus.Succeeded,
      metadata: { razorpay_signature: dto.razorpay_signature },
    });
    await this.paymentRepo.save(payment);

    // Generate invoice
    try {
      await this.invoicesService.generateForOrder(order, userId);
    } catch (err) {
      this.logger.error(`Invoice generation failed for Razorpay order ${orderId}`, err);
    }

    return { success: true };
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
