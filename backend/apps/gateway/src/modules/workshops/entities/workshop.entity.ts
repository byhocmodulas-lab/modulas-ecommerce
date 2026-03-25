import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum WorkshopType {
  Workshop   = 'workshop',
  Masterclass= 'masterclass',
  Course     = 'course',
  Internship = 'internship',
}

export enum SkillLevel {
  Beginner     = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced     = 'Advanced',
  AllLevels    = 'All Levels',
}

@Entity('workshops')
export class Workshop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: WorkshopType, default: WorkshopType.Workshop })
  type: WorkshopType;

  @Column({ type: 'enum', enum: SkillLevel, default: SkillLevel.AllLevels })
  skillLevel: SkillLevel;

  @Column({ type: 'float', default: 0 })
  price: number;

  @Column({ nullable: true })
  thumbnail?: string;

  @Column({ type: 'timestamptz', nullable: true })
  startsAt?: Date;

  @Column({ type: 'int', nullable: true })
  durationHours?: number;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ type: 'int', nullable: true })
  maxSeats?: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
