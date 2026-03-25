import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @ManyToOne(() => Category, (c) => c.id, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sku: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @ManyToOne(() => Category, { eager: false, nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'base_price', type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'compare_at_price', type: 'numeric', precision: 10, scale: 2, nullable: true })
  compareAtPrice: number;

  @Column({ default: 'INR', length: 3 })
  currency: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ name: 'stock_qty', type: 'int', default: 0 })
  stockQty: number;

  @Column({ name: 'lead_time_days', type: 'int', default: 21 })
  leadTimeDays: number;

  @Column({ name: 'seo_title', nullable: true })
  seoTitle: string;

  @Column({ name: 'seo_description', nullable: true, type: 'text' })
  seoDescription: string;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ nullable: true })
  material: string;

  @Column({ name: 'finish_options', type: 'text', array: true, default: [] })
  finishOptions: string[];

  @Column({ type: 'jsonb', nullable: true })
  dimensions: Record<string, unknown>;

  @Column({ name: 'weight_kg', type: 'numeric', precision: 6, scale: 2, nullable: true })
  weightKg: number;

  @Column({ name: 'is_configurable', default: false })
  isConfigurable: boolean;

  @Column({ name: 'has_ar_model', default: false })
  hasArModel: boolean;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, unknown>;

  @OneToMany(() => ProductImage, (img) => img.product, { eager: true })
  images: ProductImage[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (p) => p.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'file_key' })
  fileKey: string;

  @Column()
  url: string;

  @Column({ name: 'alt_text', nullable: true })
  altText: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_primary', default: false })
  isPrimary: boolean;
}
