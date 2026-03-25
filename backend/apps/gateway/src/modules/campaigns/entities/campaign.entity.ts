import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum CampaignType {
  Reel    = 'reel',
  YouTube = 'youtube',
  Blog    = 'blog',
  Series  = 'series',
}

export enum CampaignStatus {
  Open   = 'open',
  Closed = 'closed',
}

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: CampaignType })
  type: CampaignType;

  @Column('simple-array')
  platforms: string[];

  @Column('text', { nullable: true })
  deadline: string | null;

  @Column({ nullable: true })
  fee: string | null;

  @Column('jsonb', { default: [] })
  deliverables: string[];

  @Column({ type: 'enum', enum: CampaignStatus, default: CampaignStatus.Open })
  status: CampaignStatus;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
