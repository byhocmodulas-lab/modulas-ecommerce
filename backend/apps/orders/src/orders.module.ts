import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderItem } from './entities/order.entity';
import { Cart } from './entities/cart.entity';
import { Payment } from './entities/payment.entity';
import { Invoice } from './entities/invoice.entity';
import { PaymentsService } from './payments.service';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { StripeWebhookController } from './stripe-webhook.controller';
import { User } from '../../auth/src/entities/user.entity';
import { UserProfile } from '../../auth/src/entities/user-profile.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Order, OrderItem, Cart,
      Payment, Invoice,
      User, UserProfile,     // needed by InvoicesService for billing details
    ]),
  ],
  controllers: [OrdersController, InvoicesController, StripeWebhookController],
  providers: [OrdersService, PaymentsService, InvoicesService],
  exports: [OrdersService, InvoicesService],
})
export class OrdersModule {}
