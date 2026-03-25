import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mention, MentionSentiment } from './entities/mention.entity';
import { CreateMentionDto, UpdateMentionDto } from './dto/mention.dto';

@Injectable()
export class MentionsService {
  constructor(
    @InjectRepository(Mention)
    private readonly repo: Repository<Mention>,
  ) {}

  findAll(params: { sentiment?: MentionSentiment; platform?: string; needsResponse?: boolean } = {}) {
    const qb = this.repo.createQueryBuilder('m')
      .where('m.isArchived = false')
      .orderBy('m.detectedAt', 'DESC');

    if (params.sentiment)    qb.andWhere('m.sentiment = :sentiment', { sentiment: params.sentiment });
    if (params.platform)     qb.andWhere('m.platform = :platform',  { platform: params.platform });
    if (params.needsResponse) qb.andWhere('m.requiresResponse = true AND m.responded = false');

    return qb.getMany();
  }

  async findOne(id: string) {
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException(`Mention ${id} not found`);
    return m;
  }

  create(dto: CreateMentionDto) {
    const mention = this.repo.create(dto);
    if (dto.detectedAt) mention.detectedAt = new Date(dto.detectedAt);
    return this.repo.save(mention);
  }

  async update(id: string, dto: UpdateMentionDto) {
    const m = await this.findOne(id);
    Object.assign(m, dto);
    return this.repo.save(m);
  }

  async remove(id: string) {
    const m = await this.findOne(id);
    return this.repo.remove(m);
  }
}
