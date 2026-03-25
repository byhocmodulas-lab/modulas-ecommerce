import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, LeadStage } from './entities/lead.entity';
import { CreateLeadDto, UpdateLeadDto } from './dto/leads.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly repo: Repository<Lead>,
  ) {}

  create(dto: CreateLeadDto) {
    const lead = this.repo.create(dto);
    return this.repo.save(lead);
  }

  findAll(params: { stage?: LeadStage; page?: number; limit?: number }) {
    const { stage, page = 1, limit = 50 } = params;
    const qb = this.repo.createQueryBuilder('lead').orderBy('lead.createdAt', 'DESC');
    if (stage) qb.where('lead.stage = :stage', { stage });
    qb.skip((page - 1) * limit).take(limit);
    return qb.getManyAndCount().then(([data, total]) => ({ data, meta: { total, page, limit } }));
  }

  async findOne(id: string) {
    const lead = await this.repo.findOne({ where: { id } });
    if (!lead) throw new NotFoundException(`Lead ${id} not found`);
    return lead;
  }

  async update(id: string, dto: UpdateLeadDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  stageSummary() {
    return this.repo
      .createQueryBuilder('lead')
      .select('lead.stage', 'stage')
      .addSelect('COUNT(*)', 'count')
      .groupBy('lead.stage')
      .getRawMany<{ stage: string; count: string }>();
  }
}
