import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum ApplicationType {
  Vendor  = 'vendor',
  Creator = 'creator',
  Intern  = 'intern',
}

export enum ApplicationStatus {
  Pending  = 'pending',
  Reviewing = 'reviewing',
  Approved = 'approved',
  Rejected = 'rejected',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', enum: ApplicationType })
  type: ApplicationType;

  @Column({ type: 'varchar', enum: ApplicationStatus, default: ApplicationStatus.Pending })
  status: ApplicationStatus;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  /** All form-specific fields stored as JSONB */
  @Column({ type: 'jsonb', default: {} })
  payload: Record<string, unknown>;

  @Column({ type: 'text', nullable: true })
  reviewNotes: string;

  @Column({ name: 'reviewed_by', nullable: true })
  reviewedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
