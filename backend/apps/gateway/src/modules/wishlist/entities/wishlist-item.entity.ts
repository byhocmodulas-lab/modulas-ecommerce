import {
  Entity, PrimaryGeneratedColumn, Column, Unique,
  CreateDateColumn,
} from 'typeorm';

@Entity('wishlist_items')
@Unique(['userId', 'productId'])
export class WishlistItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
