import {
  Entity, PrimaryGeneratedColumn, Column, Index,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum PaymentStatus {
  Pending   = 'pending',
  Succeeded = 'succeeded',
  Failed    = 'failed',
  Refunded  = 'refunded',
  Cancelled = 'cancelled',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'order_id' })
  orderId: string;

  @Index()
  @Column({ name: 'user_id' })
  userId: string;

  @Index({ unique: true })
  @Column({ name: 'stripe_payment_intent_id' })
  stripePaymentIntentId: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: number;

  @Column({ default: 'INR', length: 3 })
  currency: string;

  @Column({
    type: 'varchar',
    enum: PaymentStatus,
    default: PaymentStatus.Pending,
  })
  status: PaymentStatus;

  /** Raw Stripe event metadata stored for audit */
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
