import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
} from 'typeorm';
import { Role } from '../../../../libs/common/src/enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'clerk_id', unique: true })
  clerkId: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'full_name', nullable: true })
  fullName: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({
    type: 'varchar',
    enum: Role,
    default: Role.Customer,
  })
  role: Role;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'pending_approval', default: false })
  pendingApproval: boolean;

  // ── Auth credentials (dedicated columns — not JSONB) ──────────────

  @Column({ name: 'password_hash', type: 'text', nullable: true, select: false })
  passwordHash: string | null;

  /** SHA-256 hex of the current refresh token — cleared on logout */
  @Column({ name: 'refresh_token_hash', type: 'text', nullable: true, select: false })
  refreshTokenHash: string | null;

  /** SHA-256 hex of the password-reset token — cleared after use */
  @Column({ name: 'password_reset_hash', type: 'text', nullable: true, select: false })
  passwordResetHash: string | null;

  @Column({ name: 'password_reset_expiry', type: 'timestamptz', nullable: true, select: false })
  passwordResetExpiry: Date | null;

  /** Extensible metadata for non-auth data (registeredAt, etc.) */
  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
