import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../../../catalog/src/modules/products/entities/product.entity';
import { ConfiguratorService } from './configurator.service';
import { ConfiguratorController } from './configurator.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ConfiguratorController],
  providers: [ConfiguratorService],
})
export class ConfiguratorModule {}
