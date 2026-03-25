import {
  Entity, PrimaryGeneratedColumn, Column, Index,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum InvoiceStatus {
  Issued   = 'issued',
  Paid     = 'paid',
  Void     = 'void',
  Refunded = 'refunded',
}

export interface BillingDetails {
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    country: string;
    pincode: string;
  };
}

export interface InvoiceLineItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  finish?: string;
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'order_id' })
  orderId: string;

  @Index()
  @Column({ name: 'user_id' })
  userId: string;

  @Index({ unique: true })
  @Column({ name: 'invoice_number', length: 30 })
  invoiceNumber: string;

  /** Full billing snapshot — never changes even if user updates profile */
  @Column({ name: 'billing_details', type: 'jsonb' })
  billingDetails: BillingDetails;

  @Column({ type: 'jsonb' })
  items: InvoiceLineItem[];

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  subtotal: number;

  /** Tax amount (GST / VAT etc) — 0 by default */
  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  total: number;

  @Column({ default: 'INR', length: 3 })
  currency: string;

  @Column({ name: 'pdf_url', nullable: true })
  pdfUrl: string;

  @Column({
    type: 'varchar',
    enum: InvoiceStatus,
    default: InvoiceStatus.Issued,
  })
  status: InvoiceStatus;

  @Column({ name: 'due_date', type: 'timestamptz', nullable: true })
  dueDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
