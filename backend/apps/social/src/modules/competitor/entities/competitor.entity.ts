import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { CompetitorPost } from './competitor-post.entity';

export type CompetitorPlatform = 'instagram' | 'facebook' | 'linkedin' | 'pinterest' | 'youtube';

@Entity('competitor_profiles')
export class CompetitorProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  /** Instagram / LinkedIn handle */
  @Column({ nullable: true })
  handle: string;

  @Column({ type: 'text', array: true, default: [] })
  platforms: CompetitorPlatform[];

  @Column({ nullable: true })
  website: string;

  @Column({ name: 'profile_image_url', nullable: true })
  profileImageUrl: string;

  /** Market segment: premium, mid-market, mass */
  @Column({ nullable: true })
  segment: string;

  /** Admin notes / strategy observations */
  @Column({ type: 'text', nullable: true })
  notes: string;

  /** Approximate follower count (manually updated) */
  @Column({ name: 'follower_count', type: 'int', nullable: true })
  followerCount: number;

  /** Estimated monthly posting frequency */
  @Column({ name: 'post_frequency', type: 'int', nullable: true })
  postFrequency: number;

  /** Avg engagement rate % (manually tracked or estimated) */
  @Column({ name: 'avg_engagement', type: 'float', nullable: true })
  avgEngagement: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => CompetitorPost, post => post.competitor, { cascade: true })
  posts: CompetitorPost[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
