import {
  Entity, PrimaryGeneratedColumn, Column, Index,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export interface AddressData {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  country: string;
  pincode: string;
}

export interface RequirementsData {
  projectType?: 'home' | 'office' | 'hospitality' | 'retail' | 'other';
  budgetRange?: string;
  timeline?: string;
  notes?: string;
}

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'full_name', nullable: true })
  fullName: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ type: 'jsonb', nullable: true })
  address: AddressData;

  @Column({ name: 'company_name', nullable: true })
  companyName: string;

  @Column({ nullable: true })
  website: string;

  /** Targeting / CRM data — collected at checkout or from profile page */
  @Column({ type: 'jsonb', nullable: true })
  requirements: RequirementsData;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
