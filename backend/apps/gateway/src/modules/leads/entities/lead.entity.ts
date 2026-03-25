import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum LeadStage {
  New       = 'new',
  Contacted = 'contacted',
  Converted = 'converted',
  Closed    = 'closed',
}

export enum LeadSource {
  VendorApply  = 'vendor_apply',
  CreatorApply = 'creator_apply',
  InternApply  = 'intern_apply',
  Manual       = 'manual',
  Website      = 'website',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  company: string;

  @Column({ type: 'varchar', enum: LeadStage, default: LeadStage.New })
  stage: LeadStage;

  @Column({ type: 'varchar', enum: LeadSource, default: LeadSource.Manual })
  source: LeadSource;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, unknown>;

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
