import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Article } from './entities/article.entity';
import { ArticlesService }    from './articles.service';
import { ArticlesController } from './articles.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    // Elasticsearch is optional — only register if ELASTICSEARCH_NODE is set
    ...(process.env.ELASTICSEARCH_NODE
      ? [ElasticsearchModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            node: config.get<string>('ELASTICSEARCH_NODE'),
          }),
        })]
      : []),
  ],
  controllers: [ArticlesController],
  providers:   [ArticlesService],
  exports:     [ArticlesService],
})
export class ArticlesModule {}
