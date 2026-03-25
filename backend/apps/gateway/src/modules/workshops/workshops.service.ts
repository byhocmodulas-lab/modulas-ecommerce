import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workshop, WorkshopType, SkillLevel } from './entities/workshop.entity';
import { CreateWorkshopDto, UpdateWorkshopDto } from './dto/workshop.dto';

@Injectable()
export class WorkshopsService {
  constructor(
    @InjectRepository(Workshop)
    private readonly repo: Repository<Workshop>,
  ) {}

  create(dto: CreateWorkshopDto) {
    const workshop = this.repo.create(dto as Partial<Workshop>);
    return this.repo.save(workshop);
  }

  findAll(params: {
    type?: WorkshopType;
    skillLevel?: SkillLevel;
    isOnline?: boolean;
    page?: number;
    limit?: number;
  } = {}) {
    const { type, skillLevel, isOnline, page = 1, limit = 20 } = params;
    const qb = this.repo.createQueryBuilder('w')
      .where('w.isActive = true')
      .orderBy('w.startsAt', 'ASC');
    if (type)       qb.andWhere('w.type = :type',             { type });
    if (skillLevel) qb.andWhere('w.skillLevel = :skillLevel', { skillLevel });
    if (isOnline !== undefined) qb.andWhere('w.isOnline = :isOnline', { isOnline });
    qb.skip((page - 1) * limit).take(limit);
    return qb.getManyAndCount().then(([data, total]) => ({
      data,
      meta: { total, page, limit },
    }));
  }

  async findBySlug(slug: string) {
    const workshop = await this.repo.findOne({ where: { slug } });
    if (!workshop) throw new NotFoundException(`Workshop "${slug}" not found`);
    return workshop;
  }

  async update(id: string, dto: UpdateWorkshopDto) {
    const workshop = await this.repo.findOne({ where: { id } });
    if (!workshop) throw new NotFoundException(`Workshop ${id} not found`);
    Object.assign(workshop, dto);
    return this.repo.save(workshop);
  }

  async remove(id: string) {
    await this.repo.delete(id);
  }
}
