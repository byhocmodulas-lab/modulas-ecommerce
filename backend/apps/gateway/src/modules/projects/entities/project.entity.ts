import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';

export enum ProjectStatus {
  Planning      = 'planning',
  InProduction  = 'in_production',
  Installed     = 'installed',
  Archived      = 'archived',
}

@Entity('architect_projects')
@Index(['userId'])
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  clientName?: string;

  @Column({ nullable: true })
  clientEmail?: string;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.Planning })
  status: ProjectStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
