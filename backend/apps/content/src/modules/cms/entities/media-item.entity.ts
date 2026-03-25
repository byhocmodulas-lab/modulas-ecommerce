import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, JoinColumn,
} from 'typeorm';
import { User } from '../../../../../auth/src/entities/user.entity';

export type MediaFolder = 'products' | 'projects' | 'blog' | 'homepage' | 'banners' | 'misc';

@Entity('media_items')
export class MediaItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column({ name: 'original_name' })
  originalName: string;

  @Column({ name: 'file_key' })
  fileKey: string;

  /** Full CDN/S3 URL */
  @Column()
  url: string;

  @Column({ name: 'mime_type' })
  mimeType: string;

  /** Bytes */
  @Column({ name: 'file_size', type: 'int' })
  fileSize: number;

  @Column({ nullable: true, type: 'int' })
  width: number | null;

  @Column({ nullable: true, type: 'int' })
  height: number | null;

  @Column({ name: 'alt_text', nullable: true })
  altText: string;

  @Column({ type: 'varchar', default: 'misc' })
  folder: MediaFolder;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
