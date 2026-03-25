import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../../catalog/src/modules/products/entities/product.entity';

@Injectable()
export class ConfiguratorService {
  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  async getOptions(productIdOrSlug: string) {
    const product = await this.products.findOne({
      where: [{ id: productIdOrSlug }, { slug: productIdOrSlug }],
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product "${productIdOrSlug}" not found`);
    }

    if (!product.isConfigurable) {
      throw new NotFoundException(`Product "${productIdOrSlug}" is not configurable`);
    }

    return {
      productId: product.id,
      name:      product.name,
      basePrice: product.price,
      currency:  product.currency,
      material:  product.material,
      dimensions: product.dimensions,
      finishOptions: (product.finishOptions ?? []).map((finish) => ({
        id:    finish.toLowerCase().replace(/\s+/g, '_'),
        label: finish,
        priceDelta: 0,
      })),
      metadata: product.metadata,
    };
  }
}
