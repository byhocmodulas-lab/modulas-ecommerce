import {
  Entity, PrimaryGeneratedColumn, Column, Index,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export interface CartItemData {
  productId: string;
  configurationId?: string;
  quantity: number;
  unitPrice: number;
  finish?: string;
  customSpecs?: Record<string, unknown>;
}

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'jsonb', default: [] })
  items: CartItemData[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
