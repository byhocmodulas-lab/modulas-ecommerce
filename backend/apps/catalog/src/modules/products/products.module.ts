import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductImage, Category } from './entities/product.entity';
import { CategoriesController } from '../categories/categories.controller';
import { CategoriesService } from '../categories/categories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage, Category]),
    BullModule.registerQueue({ name: 'asset-processing' }),
    ElasticsearchModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        node: config.get<string>('ELASTICSEARCH_URL', 'http://localhost:9200'),
      }),
    }),
  ],
  controllers: [ProductsController, CategoriesController],
  providers: [ProductsService, CategoriesService],
  exports: [ProductsService, CategoriesService],
})
export class ProductsModule {}
