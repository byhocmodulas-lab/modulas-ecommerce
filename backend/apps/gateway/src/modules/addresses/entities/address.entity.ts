import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('user_addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  label: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column()
  phone: string;

  @Column()
  line1: string;

  @Column({ nullable: true })
  line2: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column()
  postcode: string;

  @Column({ default: 'GB', length: 2 })
  country: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
