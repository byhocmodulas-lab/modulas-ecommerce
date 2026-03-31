import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
// @ts-ignore — install bullmq separately: npm install bullmq
import { Queue } from 'bullmq';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductSearchDto, ProductSortOption } from './dto/product-search.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly elasticsearchService: ElasticsearchService,
    @InjectQueue('asset-processing')
    private readonly assetQueue: Queue,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create(dto);
    const saved   = await this.productRepo.save(product);

    // Index in Elasticsearch for full-text search (best-effort)
    try {
      await (this.elasticsearchService as any).index({
        index: 'products',
        id:    saved.id,
        document: this.toSearchDocument(saved),
      });
    } catch { /* ES optional — continue without it */ }

    // Queue 3D asset optimisation if model provided
    if (dto.modelFileKey) {
      await this.assetQueue.add('optimize-model', {
        productId: saved.id,
        fileKey:   dto.modelFileKey,
      });
    }

    return saved;
  }

  /**
   * Primary search via TypeORM QueryBuilder — works without Elasticsearch.
   * Falls back to empty aggregations (aggregations are computed from DB).
   */
  async search(dto: ProductSearchDto) {
    const page  = dto.page  ?? 1;
    const limit = dto.limit ?? 24;

    const qb = this.productRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'cat')
      .leftJoinAndSelect('p.images', 'img')
      .where('p.isActive = true')
      .andWhere('p.deletedAt IS NULL');

    // Full-text search on name + description
    if (dto.q) {
      qb.andWhere(
        '(p.name ILIKE :q OR p.description ILIKE :q OR :qtag = ANY(p.tags))',
        { q: `%${dto.q}%`, qtag: dto.q.toLowerCase() },
      );
    }

    // Category filter
    if (dto.category) {
      qb.andWhere('cat.slug = :category', { category: dto.category });
    }

    // Subcategory filter — stored as a tag with prefix "subcategory:<slug>"
    if (dto.subcategory) {
      qb.andWhere(':subTag = ANY(p.tags)', {
        subTag: `subcategory:${dto.subcategory}`,
      });
    }

    // Material filter
    if (dto.material) {
      qb.andWhere('p.material = :material', { material: dto.material });
    }

    // Brand filter
    if (dto.brand) {
      qb.andWhere('p.brand = :brand', { brand: dto.brand });
    }

    // Finish filter — stored in finish_options array
    if (dto.finish) {
      qb.andWhere(':finish = ANY(p.finishOptions)', { finish: dto.finish });
    }

    // Price range
    if (dto.min !== undefined) {
      qb.andWhere('p.price >= :min', { min: dto.min });
    }
    if (dto.max !== undefined) {
      qb.andWhere('p.price <= :max', { max: dto.max });
    }

    // Configurable (3D) only
    if (dto.configurable) {
      qb.andWhere('p.isConfigurable = true');
    }

    // In-stock only
    if (dto.instock) {
      qb.andWhere('p.stockQty > 0');
    }

    // On-sale only (compare_at_price > base_price)
    if (dto.sale) {
      qb.andWhere('p.compareAtPrice > p.price');
    }

    // Sort — use entity property names (camelCase), not DB column names
    switch (dto.sort) {
      case ProductSortOption.PriceAsc:
        qb.orderBy('p.price', 'ASC');
        break;
      case ProductSortOption.PriceDesc:
        qb.orderBy('p.price', 'DESC');
        break;
      case ProductSortOption.Newest:
        qb.orderBy('p.createdAt', 'DESC');
        break;
      case ProductSortOption.Popular:
        qb.orderBy('p.createdAt', 'DESC');
        break;
      default:
        qb.orderBy('p.isFeatured', 'DESC').addOrderBy('p.createdAt', 'DESC');
    }

    const [products, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { products, total };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'images'],
    });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { slug },
      relations: ['category', 'images'],
    });
    if (!product) throw new NotFoundException(`Product "${slug}" not found`);
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    await this.productRepo.update(id, dto as any);
    const updated = await this.findOne(id);

    // Update Elasticsearch index (best-effort)
    try {
      await (this.elasticsearchService as any).update({
        index: 'products',
        id,
        doc: this.toSearchDocument(updated),
      });
    } catch { /* ES optional */ }

    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.productRepo.softDelete(id);

    try {
      await (this.elasticsearchService as any).delete({ index: 'products', id });
    } catch { /* ES optional */ }
  }

  private toSearchDocument(product: Product) {
    return {
      id:             product.id,
      name:           product.name,
      slug:           product.slug,
      description:    product.description,
      price:          product.price,
      material:       product.material,
      brand:          (product as any).brand,
      category:       product.category,
      tags:           product.tags,
      images:         product.images,
      isConfigurable: product.isConfigurable,
      isActive:       product.isActive,
    };
  }
}
