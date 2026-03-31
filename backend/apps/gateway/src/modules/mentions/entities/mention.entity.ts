import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum MentionPlatform {
  Instagram = 'instagram',
  Twitter   = 'twitter',
  Pinterest = 'pinterest',
  TikTok    = 'tiktok',
}

export enum MentionSentiment {
  Positive = 'positive',
  Neutral  = 'neutral',
  Negative = 'negative',
  Mixed    = 'mixed',
}

@Entity('brand_mentions')
export class Mention {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: MentionPlatform })
  platform: MentionPlatform;

  @Column()
  author: string;

  @Column()
  handle: string;

  @Column('text')
  content: string;

  @Column({ type: 'enum', enum: MentionSentiment, default: MentionSentiment.Neutral })
  sentiment: MentionSentiment;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: false })
  requiresResponse: boolean;

  @Column({ default: false })
  responded: boolean;

  @Column({ type: 'varchar', nullable: true })
  url: string | null;

  @Column({ default: false })
  isArchived: boolean;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  detectedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
