import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, JoinColumn,
} from 'typeorm';
import { CompetitorProfile } from './competitor.entity';

@Entity('competitor_posts')
export class CompetitorPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CompetitorProfile, c => c.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'competitor_id' })
  competitor: CompetitorProfile;

  @Column({ name: 'post_url', nullable: true })
  postUrl: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ type: 'text', nullable: true })
  caption: string;

  @Column({ type: 'varchar', nullable: true })
  platform: string;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @Column({ type: 'int', default: 0 })
  comments: number;

  @Column({ type: 'int', default: 0 })
  shares: number;

  @Column({ type: 'int', default: 0 })
  saves: number;

  /** Post type: reel, carousel, image, story, etc. */
  @Column({ type: 'varchar', nullable: true })
  format: string;

  /** Admin-observed content theme / category */
  @Column({ nullable: true })
  theme: string;

  /** Admin notes about this post */
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'posted_at', type: 'timestamptz', nullable: true })
  postedAt: Date | null;

  @CreateDateColumn({ name: 'tracked_at' })
  trackedAt: Date;
}
