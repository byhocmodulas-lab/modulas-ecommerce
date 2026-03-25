import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mention } from './entities/mention.entity';
import { MentionsService } from './mentions.service';
import { MentionsController } from './mentions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Mention])],
  controllers: [MentionsController],
  providers: [MentionsService],
  exports: [MentionsService],
})
export class MentionsModule {}
