import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export interface NavLink {
  label: string;
  href: string;
  openInNewTab?: boolean;
  children?: NavLink[];
}

@Entity('navigation_menus')
export class NavigationMenu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Unique key: 'main' | 'footer' | 'mobile' | custom */
  @Column({ unique: true })
  name: string;

  /** Human-readable display label */
  @Column()
  label: string;

  @Column({ type: 'jsonb', default: [] })
  items: NavLink[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
