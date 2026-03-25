import { Module } from '@nestjs/common';
import { AIContentService }    from './ai-content.service';
import { AIContentController } from './ai-content.controller';

@Module({
  controllers: [AIContentController],
  providers:   [AIContentService],
  exports:     [AIContentService],
})
export class AIContentModule {}
