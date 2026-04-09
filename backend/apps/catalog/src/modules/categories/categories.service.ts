import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from '../products/entities/product.entity';

export interface CreateCategoryDto {
  name: string;
  slug: string;
  sortOrder?: number;
  imageUrl?: string;
  parentId?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  sortOrder?: number;
  imageUrl?: string;
  parentId?: string | null;
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  /** All top-level categories (no parent), sorted by sortOrder */
  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find({
      where: { parent: IsNull() },
      order: { sortOrder: 'ASC' },
    });
  }

  /** All categories including subcategories, nested */
  async findTree(): Promise<Category[]> {
    const all = await this.categoryRepo.find({
      order: { sortOrder: 'ASC' },
      relations: ['parent'],
    });

    const roots: (Category & { children?: Category[] })[] = [];
    const map: Record<string, Category & { children?: Category[] }> = {};

    for (const cat of all) {
      map[cat.id] = { ...cat, children: [] };
    }
    for (const cat of all) {
      if (cat.parent?.id && map[cat.parent.id]) {
        map[cat.parent.id].children!.push(map[cat.id]);
      } else if (!cat.parent) {
        roots.push(map[cat.id]);
      }
    }
    return roots;
  }

  /** Subcategories of a given parent slug */
  async findSubcategories(parentSlug: string): Promise<Category[]> {
    const parent = await this.categoryRepo.findOne({ where: { slug: parentSlug } });
    if (!parent) throw new NotFoundException(`Category "${parentSlug}" not found`);
    return this.categoryRepo.find({
      where: { parent: { id: parent.id } },
      order: { sortOrder: 'ASC' },
    });
  }

  async findBySlug(slug: string): Promise<Category> {
    const cat = await this.categoryRepo.findOne({ where: { slug } });
    if (!cat) throw new NotFoundException(`Category "${slug}" not found`);
    return cat;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepo.findOne({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Slug "${dto.slug}" is already in use`);

    let parent: Category | undefined;
    if (dto.parentId) {
      const p = await this.categoryRepo.findOne({ where: { id: dto.parentId } });
      if (!p) throw new NotFoundException(`Parent category ${dto.parentId} not found`);
      parent = p;
    }

    const cat = this.categoryRepo.create({
      name:      dto.name,
      slug:      dto.slug,
      sortOrder: dto.sortOrder ?? 0,
      imageUrl:  dto.imageUrl,
      parent,
    });
    return this.categoryRepo.save(cat);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const cat = await this.categoryRepo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException(`Category ${id} not found`);

    if (dto.slug && dto.slug !== cat.slug) {
      const existing = await this.categoryRepo.findOne({ where: { slug: dto.slug } });
      if (existing) throw new ConflictException(`Slug "${dto.slug}" is already in use`);
    }

    if (dto.name      !== undefined) cat.name      = dto.name;
    if (dto.slug      !== undefined) cat.slug      = dto.slug;
    if (dto.sortOrder !== undefined) cat.sortOrder = dto.sortOrder;
    if (dto.imageUrl  !== undefined) cat.imageUrl  = dto.imageUrl ?? undefined;

    if (dto.parentId !== undefined) {
      if (dto.parentId === null) {
        cat.parent = undefined as any;
      } else {
        const p = await this.categoryRepo.findOne({ where: { id: dto.parentId } });
        if (!p) throw new NotFoundException(`Parent category ${dto.parentId} not found`);
        cat.parent = p;
      }
    }

    return this.categoryRepo.save(cat);
  }

  async remove(id: string): Promise<void> {
    const cat = await this.categoryRepo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException(`Category ${id} not found`);
    await this.categoryRepo.remove(cat);
  }

  async findAllFlat(): Promise<Category[]> {
    return this.categoryRepo.find({
      order: { sortOrder: 'ASC' },
      relations: ['parent'],
    });
  }
}
