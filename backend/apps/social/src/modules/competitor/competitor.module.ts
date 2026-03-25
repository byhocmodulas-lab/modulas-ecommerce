import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetitorProfile }    from './entities/competitor.entity';
import { CompetitorPost }       from './entities/competitor-post.entity';
import { CompetitorService }    from './competitor.service';
import { CompetitorController } from './competitor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CompetitorProfile, CompetitorPost])],
  controllers: [CompetitorController],
  providers:   [CompetitorService],
  exports:     [CompetitorService],
})
export class CompetitorModule {}
