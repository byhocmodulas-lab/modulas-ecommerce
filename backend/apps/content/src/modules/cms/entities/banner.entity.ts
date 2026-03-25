import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export type BannerPlacement = 'announcement' | 'hero' | 'category' | 'product' | 'checkout';
export type BannerStatus    = 'active' | 'scheduled' | 'inactive';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', default: 'announcement' })
  placement: BannerPlacement;

  @Column({ type: 'varchar', default: 'inactive' })
  status: BannerStatus;

  /** For text-based banners (announcement bar, promo strip) */
  @Column({ nullable: true, type: 'text' })
  message: string;

  @Column({ name: 'cta_label', nullable: true })
  ctaLabel: string;

  @Column({ name: 'cta_href', nullable: true })
  ctaHref: string;

  /** For image-based hero/category banners */
  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ name: 'mobile_image_url', nullable: true })
  mobileImageUrl: string;

  /** Background colour override (hex) */
  @Column({ name: 'bg_color', nullable: true })
  bgColor: string;

  /** Scheduling */
  @Column({ name: 'starts_at', nullable: true, type: 'timestamptz' })
  startsAt: Date | null;

  @Column({ name: 'ends_at', nullable: true, type: 'timestamptz' })
  endsAt: Date | null;

  /** Display order within a placement slot */
  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
