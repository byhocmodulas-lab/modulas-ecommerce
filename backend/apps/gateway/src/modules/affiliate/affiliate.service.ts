import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AffiliateLink } from './entities/affiliate-link.entity';

@Injectable()
export class AffiliateService {
  constructor(
    @InjectRepository(AffiliateLink)
    private readonly repo: Repository<AffiliateLink>,
  ) {}

  create(userId: string, dto: { label: string; targetUrl: string }) {
    const slug = `REF-${Date.now().toString(36).toUpperCase()}`;
    const link = this.repo.create({ userId, label: dto.label, targetUrl: dto.targetUrl, slug });
    return this.repo.save(link);
  }

  findAll(userId: string) {
    return this.repo.find({ where: { userId, isActive: true }, order: { createdAt: 'DESC' } });
  }

  async trackClick(slug: string) {
    const link = await this.repo.findOne({ where: { slug } });
    if (!link) throw new NotFoundException(`Link not found`);
    await this.repo.increment({ slug }, 'clicks', 1);
    return { targetUrl: link.targetUrl };
  }

  async remove(id: string, userId: string) {
    await this.repo.update({ id, userId }, { isActive: false });
  }
}
