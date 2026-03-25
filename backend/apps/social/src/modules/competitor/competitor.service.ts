import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompetitorProfile } from './entities/competitor.entity';
import { CompetitorPost }    from './entities/competitor-post.entity';

export interface CreateCompetitorDto {
  name: string;
  handle?: string;
  platforms?: string[];
  website?: string;
  segment?: string;
  notes?: string;
  followerCount?: number;
  postFrequency?: number;
  avgEngagement?: number;
}

export interface CreateCompetitorPostDto {
  competitorId: string;
  postUrl?: string;
  imageUrl?: string;
  caption?: string;
  platform?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  format?: string;
  theme?: string;
  notes?: string;
  postedAt?: string;
}

@Injectable()
export class CompetitorService {
  constructor(
    @InjectRepository(CompetitorProfile) private readonly profileRepo: Repository<CompetitorProfile>,
    @InjectRepository(CompetitorPost)    private readonly postRepo:    Repository<CompetitorPost>,
  ) {}

  /* ── Profiles ───────────────────────────────────────────── */

  async listProfiles(): Promise<CompetitorProfile[]> {
    return this.profileRepo.find({ order: { name: 'ASC' } });
  }

  async getProfile(id: string): Promise<CompetitorProfile> {
    const profile = await this.profileRepo.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!profile) throw new NotFoundException(`Competitor ${id} not found`);
    return profile;
  }

  async createProfile(dto: CreateCompetitorDto): Promise<CompetitorProfile> {
    const profile = this.profileRepo.create(dto as any);
    return this.profileRepo.save(profile) as unknown as Promise<CompetitorProfile>;
  }

  async updateProfile(id: string, dto: Partial<CreateCompetitorDto>): Promise<CompetitorProfile> {
    const profile = await this.getProfile(id);
    Object.assign(profile, dto);
    return this.profileRepo.save(profile);
  }

  async deleteProfile(id: string): Promise<void> {
    const profile = await this.getProfile(id);
    await this.profileRepo.remove(profile);
  }

  /* ── Posts ──────────────────────────────────────────────── */

  async listPosts(competitorId: string): Promise<CompetitorPost[]> {
    return this.postRepo.find({
      where: { competitor: { id: competitorId } },
      order: { postedAt: 'DESC', trackedAt: 'DESC' },
    });
  }

  async addPost(dto: CreateCompetitorPostDto): Promise<CompetitorPost> {
    const competitor = await this.profileRepo.findOne({ where: { id: dto.competitorId } });
    if (!competitor) throw new NotFoundException(`Competitor ${dto.competitorId} not found`);
    const post = this.postRepo.create({
      ...dto,
      competitor,
      postedAt: dto.postedAt ? new Date(dto.postedAt) : null,
    } as any);
    return this.postRepo.save(post) as unknown as Promise<CompetitorPost>;
  }

  async updatePost(id: string, dto: Partial<CreateCompetitorPostDto>): Promise<CompetitorPost> {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException(`Post ${id} not found`);
    Object.assign(post, dto);
    return this.postRepo.save(post);
  }

  async deletePost(id: string): Promise<void> {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException(`Post ${id} not found`);
    await this.postRepo.remove(post);
  }

  /* ── Analytics summary ───────────────────────────────────── */

  async getInsights(competitorId: string) {
    const posts = await this.listPosts(competitorId);
    if (posts.length === 0) return { posts: 0, avgLikes: 0, avgComments: 0, topFormat: null, topTheme: null };

    const avgLikes    = Math.round(posts.reduce((a, p) => a + p.likes, 0) / posts.length);
    const avgComments = Math.round(posts.reduce((a, p) => a + p.comments, 0) / posts.length);

    const formatCounts: Record<string, number> = {};
    const themeCounts:  Record<string, number> = {};
    posts.forEach(p => {
      if (p.format) formatCounts[p.format] = (formatCounts[p.format] ?? 0) + 1;
      if (p.theme)  themeCounts[p.theme]   = (themeCounts[p.theme]   ?? 0) + 1;
    });

    const topFormat = Object.entries(formatCounts).sort((a,b) => b[1]-a[1])[0]?.[0] ?? null;
    const topTheme  = Object.entries(themeCounts ).sort((a,b) => b[1]-a[1])[0]?.[0] ?? null;

    return { posts: posts.length, avgLikes, avgComments, topFormat, topTheme };
  }
}
