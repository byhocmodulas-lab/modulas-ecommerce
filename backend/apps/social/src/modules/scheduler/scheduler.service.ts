import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ScheduledPost } from './entities/scheduled-post.entity';
import {
  CreateScheduledPostDto,
  UpdateScheduledPostDto,
  ScheduledPostQueryDto,
} from './dto/scheduler.dto';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(ScheduledPost)
    private readonly postRepo: Repository<ScheduledPost>,
  ) {}

  async list(query: ScheduledPostQueryDto): Promise<ScheduledPost[]> {
    const qb = this.postRepo.createQueryBuilder('p');

    if (query.status) {
      qb.andWhere('p.status = :status', { status: query.status });
    }
    if (query.platform) {
      qb.andWhere(':platform = ANY(p.platforms)', { platform: query.platform });
    }
    if (query.campaign) {
      qb.andWhere('p.campaign ILIKE :c', { c: `%${query.campaign}%` });
    }
    if (query.month && query.year) {
      const start = new Date(query.year, query.month - 1, 1);
      const end   = new Date(query.year, query.month,     0, 23, 59, 59);
      qb.andWhere('p.scheduled_at BETWEEN :start AND :end', { start, end });
    }

    return qb.orderBy('p.scheduled_at', 'ASC').getMany();
  }

  async findOne(id: string): Promise<ScheduledPost> {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException(`Post ${id} not found`);
    return post;
  }

  async create(dto: CreateScheduledPostDto, userId: string): Promise<ScheduledPost> {
    const post = this.postRepo.create({
      ...dto,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
      status: dto.scheduledAt ? 'scheduled' : 'draft',
      createdBy: { id: userId },
    } as any);
    return this.postRepo.save(post) as unknown as Promise<ScheduledPost>;
  }

  async update(id: string, dto: UpdateScheduledPostDto): Promise<ScheduledPost> {
    const post = await this.findOne(id);
    const updates: any = { ...dto };
    if (dto.scheduledAt) updates.scheduledAt = new Date(dto.scheduledAt);
    Object.assign(post, updates);
    return this.postRepo.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepo.remove(post);
  }

  async getSummary() {
    const [total, scheduled, published, drafts] = await Promise.all([
      this.postRepo.count(),
      this.postRepo.count({ where: { status: 'scheduled' } }),
      this.postRepo.count({ where: { status: 'published' } }),
      this.postRepo.count({ where: { status: 'draft' } }),
    ]);
    return { total, scheduled, published, drafts };
  }
}
