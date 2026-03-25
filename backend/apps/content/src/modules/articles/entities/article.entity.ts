import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, UpdateDateColumn, JoinColumn,
} from 'typeorm';
import { User } from '../../../../../auth/src/entities/user.entity';

export type ArticleStatus = 'draft' | 'review' | 'published' | 'archived';
export type ContentType   = 'article' | 'guide' | 'project' | 'trend';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  @Column({ type: 'text', default: '' })
  content: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ name: 'content_type', type: 'varchar', default: 'article' })
  contentType: ContentType;

  @Column({ type: 'varchar', default: 'draft' })
  status: ArticleStatus;

  @Column({ nullable: true })
  locale: string;

  @Column({ name: 'cover_image_url', nullable: true })
  coverImageUrl: string;

  @Column({ name: 'reading_time_min', nullable: true, type: 'int' })
  readingTimeMin: number;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'published_at', nullable: true, type: 'timestamptz' })
  publishedAt: Date | null;

  @Column({ name: 'author_id', nullable: true })
  authorId: string;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
