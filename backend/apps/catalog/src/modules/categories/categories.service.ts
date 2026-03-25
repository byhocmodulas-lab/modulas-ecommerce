import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from '../products/entities/product.entity';

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
}
