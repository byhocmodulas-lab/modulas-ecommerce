import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly repo: Repository<Project>,
  ) {}

  create(userId: string, dto: CreateProjectDto) {
    const project = this.repo.create({ ...dto, userId });
    return this.repo.save(project);
  }

  findAll(userId: string, params: { status?: ProjectStatus; page?: number; limit?: number } = {}) {
    const { status, page = 1, limit = 50 } = params;
    const qb = this.repo.createQueryBuilder('p')
      .where('p.userId = :userId', { userId })
      .orderBy('p.createdAt', 'DESC');
    if (status) qb.andWhere('p.status = :status', { status });
    qb.skip((page - 1) * limit).take(limit);
    return qb.getManyAndCount().then(([data, total]) => ({
      data,
      meta: { total, page, limit },
    }));
  }

  async findOne(id: string, userId: string) {
    const project = await this.repo.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    if (project.userId !== userId) throw new ForbiddenException();
    return project;
  }

  async update(id: string, userId: string, dto: UpdateProjectDto) {
    const project = await this.findOne(id, userId);
    Object.assign(project, dto);
    return this.repo.save(project);
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.repo.delete(id);
  }
}
