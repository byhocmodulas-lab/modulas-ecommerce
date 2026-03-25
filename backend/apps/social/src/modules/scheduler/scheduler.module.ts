import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledPost }       from './entities/scheduled-post.entity';
import { SchedulerService }    from './scheduler.service';
import { SchedulerController } from './scheduler.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduledPost])],
  controllers: [SchedulerController],
  providers:   [SchedulerService],
  exports:     [SchedulerService],
})
export class SchedulerModule {}
