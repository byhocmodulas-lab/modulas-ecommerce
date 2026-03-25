import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus, ApplicationType } from './entities/application.entity';
import { CreateApplicationDto, UpdateApplicationDto } from './dto/application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly repo: Repository<Application>,
  ) {}

  create(dto: CreateApplicationDto) {
    const app = this.repo.create(dto);
    return this.repo.save(app);
  }

  findAll(params: {
    type?: ApplicationType;
    status?: ApplicationStatus;
    email?: string;
    page?: number;
    limit?: number;
  }) {
    const { type, status, email, page = 1, limit = 50 } = params;
    const qb = this.repo.createQueryBuilder('app').orderBy('app.createdAt', 'DESC');
    if (type)   qb.andWhere('app.type = :type',     { type });
    if (status) qb.andWhere('app.status = :status', { status });
    if (email)  qb.andWhere('app.email = :email',   { email });
    qb.skip((page - 1) * limit).take(limit);
    return qb.getManyAndCount().then(([data, total]) => ({
      data,
      meta: { total, page, limit },
    }));
  }

  async findOne(id: string) {
    const app = await this.repo.findOne({ where: { id } });
    if (!app) throw new NotFoundException(`Application ${id} not found`);
    return app;
  }

  async update(id: string, dto: UpdateApplicationDto) {
    const app = await this.findOne(id);
    Object.assign(app, dto);
    return this.repo.save(app);
  }
}
