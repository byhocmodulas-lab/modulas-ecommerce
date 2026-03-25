import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, UpdateDateColumn, JoinColumn,
} from 'typeorm';
import { User } from '../../../../../../apps/auth/src/entities/user.entity';

export type PostStatus   = 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled';
export type PostType     = 'image' | 'carousel' | 'reel' | 'story' | 'text' | 'article';
export type PostPlatform = 'instagram' | 'facebook' | 'linkedin' | 'pinterest';

@Entity('scheduled_posts')
export class ScheduledPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  caption: string;

  @Column({ type: 'text', nullable: true })
  hashtags: string;

  /** JSON array of image/video URLs */
  @Column({ type: 'jsonb', default: [] })
  mediaUrls: string[];

  /** Platforms this post targets */
  @Column({ type: 'text', array: true, default: ['instagram'] })
  platforms: PostPlatform[];

  @Column({ type: 'varchar', default: 'image' })
  postType: PostType;

  @Column({ type: 'varchar', default: 'draft' })
  status: PostStatus;

  @Column({ name: 'scheduled_at', type: 'timestamptz', nullable: true })
  scheduledAt: Date | null;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt: Date | null;

  /** AI-generated caption variants per platform */
  @Column({ type: 'jsonb', nullable: true })
  platformVariants: Record<string, string> | null;

  /** Campaign or label tag */
  @Column({ nullable: true })
  campaign: string;

  /** Estimated reach */
  @Column({ name: 'reach_est', nullable: true })
  reachEst: string;

  /** Notes from the content team */
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
