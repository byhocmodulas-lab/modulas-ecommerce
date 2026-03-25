import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
  BeforeInsert,
} from 'typeorm';

export enum QuoteStatus {
  Draft    = 'draft',
  Sent     = 'sent',
  Accepted = 'accepted',
  Declined = 'declined',
  Expired  = 'expired',
}

export interface QuoteItem {
  name: string;
  qty: number;
  unitPrice: number;
  configuration?: string;
}

@Entity('architect_quotes')
@Index(['userId'])
export class Quote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ unique: true })
  reference: string;

  @Column()
  clientName: string;

  @Column({ nullable: true })
  clientEmail?: string;

  @Column({ nullable: true })
  projectName?: string;

  @Column({ type: 'enum', enum: QuoteStatus, default: QuoteStatus.Draft })
  status: QuoteStatus;

  @Column({ type: 'jsonb', default: [] })
  items: QuoteItem[];

  @Column({ type: 'float', nullable: true })
  discount?: number;

  @Column({ type: 'date', nullable: true })
  validUntil?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateReference() {
    if (!this.reference) {
      const year = new Date().getFullYear();
      const rand = Math.floor(1000 + Math.random() * 9000);
      this.reference = `QT-${year}-${rand}`;
    }
  }
}
