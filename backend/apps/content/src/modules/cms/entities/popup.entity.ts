import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export type PopupTrigger = 'onload' | 'exit_intent' | 'scroll';

@Entity('popups')
export class Popup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', default: 'onload' })
  trigger: PopupTrigger;

  /**
   * onload → delay ms (e.g. 3000)
   * exit_intent → ignored (0)
   * scroll → scroll % threshold (e.g. 50)
   */
  @Column({ name: 'trigger_value', type: 'int', default: 0 })
  triggerValue: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  body: string;

  @Column({ name: 'cta_label', nullable: true })
  ctaLabel: string;

  @Column({ name: 'cta_href', nullable: true })
  ctaHref: string;

  @Column({ name: 'cta_new_tab', default: false })
  ctaNewTab: boolean;

  @Column({ name: 'coupon_code', nullable: true })
  couponCode: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ name: 'bg_color', nullable: true })
  bgColor: string;

  @Column({ name: 'show_once', default: true })
  showOnce: boolean;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
