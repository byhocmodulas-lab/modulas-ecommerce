import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote, QuoteStatus } from './entities/quote.entity';
import { CreateQuoteDto, UpdateQuoteDto } from './dto/quote.dto';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote)
    private readonly repo: Repository<Quote>,
  ) {}

  create(userId: string, dto: CreateQuoteDto) {
    const quote = this.repo.create({ ...dto, userId });
    return this.repo.save(quote);
  }

  findAll(userId: string, params: { status?: QuoteStatus; page?: number; limit?: number } = {}) {
    const { status, page = 1, limit = 50 } = params;
    const qb = this.repo.createQueryBuilder('q')
      .where('q.userId = :userId', { userId })
      .orderBy('q.createdAt', 'DESC');
    if (status) qb.andWhere('q.status = :status', { status });
    qb.skip((page - 1) * limit).take(limit);
    return qb.getManyAndCount().then(([data, total]) => ({
      data,
      meta: { total, page, limit },
    }));
  }

  async findOne(id: string, userId: string) {
    const quote = await this.repo.findOne({ where: { id } });
    if (!quote) throw new NotFoundException(`Quote ${id} not found`);
    if (quote.userId !== userId) throw new ForbiddenException();
    return quote;
  }

  async update(id: string, userId: string, dto: UpdateQuoteDto) {
    const quote = await this.findOne(id, userId);
    Object.assign(quote, dto);
    return this.repo.save(quote);
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.repo.delete(id);
  }
}
