import { Module } from '@nestjs/common';
import { AIContentModule }  from './modules/ai/ai-content.module';
import { SchedulerModule }  from './modules/scheduler/scheduler.module';
import { CompetitorModule } from './modules/competitor/competitor.module';

@Module({
  imports: [AIContentModule, SchedulerModule, CompetitorModule],
  exports: [AIContentModule, SchedulerModule, CompetitorModule],
})
export class SocialModule {}
