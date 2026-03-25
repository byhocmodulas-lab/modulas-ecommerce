import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffiliateLink } from './entities/affiliate-link.entity';
import { AffiliateService } from './affiliate.service';
import { AffiliateController } from './affiliate.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AffiliateLink])],
  controllers: [AffiliateController],
  providers: [AffiliateService],
  exports: [AffiliateService],
})
export class AffiliateModule {}
