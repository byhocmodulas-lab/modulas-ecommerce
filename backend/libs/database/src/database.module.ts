import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: config.get<string>('NODE_ENV') === 'development',
        logging: config.get<string>('NODE_ENV') === 'development',
        ssl: config.get<string>('NODE_ENV') === 'production'
          ? { rejectUnauthorized: false }
          : false,
        // Railway free tier: max 25 connections. Keep pool small.
        extra: {
          max: config.get<string>('NODE_ENV') === 'production' ? 10 : 5,
          idleTimeoutMillis: 30_000,
          connectionTimeoutMillis: 5_000,
        },
        retryAttempts: 5,
        retryDelay: 3_000,
      }),
    }),
  ],
})
export class DatabaseModule {}
