import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign, CampaignStatus } from './entities/campaign.entity';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly repo: Repository<Campaign>,
  ) {}

  /** Public — list active campaigns */
  findAll(params: { status?: CampaignStatus; type?: string } = {}) {
    const qb = this.repo.createQueryBuilder('c')
      .where('c.isActive = true')
      .orderBy('c.createdAt', 'DESC');

    if (params.status) qb.andWhere('c.status = :status', { status: params.status });
    if (params.type)   qb.andWhere('c.type = :type', { type: params.type });

    return qb.getMany();
  }

  async findOne(id: string) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException(`Campaign ${id} not found`);
    return c;
  }

  create(dto: CreateCampaignDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateCampaignDto) {
    const c = await this.findOne(id);
    Object.assign(c, dto);
    return this.repo.save(c);
  }

  async remove(id: string) {
    const c = await this.findOne(id);
    return this.repo.remove(c);
  }
}
