import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, UpdateDateColumn, JoinColumn,
} from 'typeorm';
import { User } from '../../../../../auth/src/entities/user.entity';

export type CmsPageStatus = 'draft' | 'published' | 'archived';
export type CmsPageType   = 'homepage' | 'about' | 'contact' | 'static' | 'landing';

@Entity('cms_pages')
export class CmsPage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Machine key — e.g. "homepage", "about", "landing-kitchen" */
  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'varchar', default: 'static' })
  pageType: CmsPageType;

  @Column({ type: 'varchar', default: 'draft' })
  status: CmsPageStatus;

  /** Full page JSON (sections, blocks, component props) */
  @Column({ type: 'jsonb', default: {} })
  content: Record<string, unknown>;

  /** SEO */
  @Column({ name: 'seo_title', nullable: true })
  seoTitle: string;

  @Column({ name: 'seo_description', nullable: true, type: 'text' })
  seoDescription: string;

  @Column({ name: 'og_image', nullable: true })
  ogImage: string;

  @Column({ name: 'published_at', nullable: true, type: 'timestamptz' })
  publishedAt: Date | null;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
