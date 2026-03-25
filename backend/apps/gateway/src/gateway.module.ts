import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule }      from '../../../libs/database/src/database.module';
import { AuthModule }          from '../../auth/src/auth.module';
import { ProductsModule }      from '../../catalog/src/modules/products/products.module';
import { OrdersModule }        from '../../orders/src/orders.module';
import { CmsModule }           from '../../content/src/modules/cms/cms.module';
import { ArticlesModule }      from '../../content/src/modules/articles/articles.module';
import { SocialModule }        from '../../social/src/social.module';
import { LeadsModule }         from './modules/leads/leads.module';
import { ApplicationsModule }  from './modules/applications/applications.module';
import { AnalyticsModule }     from './modules/analytics/analytics.module';
import { AddressesModule }     from './modules/addresses/addresses.module';
import { WishlistModule }      from './modules/wishlist/wishlist.module';
import { ConfiguratorModule }  from './modules/configurator/configurator.module';
import { ProjectsModule }      from './modules/projects/projects.module';
import { QuotesModule }        from './modules/quotes/quotes.module';
import { WorkshopsModule }     from './modules/workshops/workshops.module';
import { AffiliateModule }     from './modules/affiliate/affiliate.module';
import { CampaignsModule }    from './modules/campaigns/campaigns.module';
import { MentionsModule }     from './modules/mentions/mentions.module';

@Module({
  imports: [
    // Config — loads .env from repo root
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env.local', '../../.env'],
    }),

    // Rate limiting: 100 requests / 60 s per IP
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),

    // Redis / BullMQ — shared connection for all queues
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),

    // Shared DB connection
    DatabaseModule,

    // Domain modules
    AuthModule,
    ProductsModule,
    OrdersModule,
    CmsModule,
    ArticlesModule,
    SocialModule,

    // New platform modules
    LeadsModule,
    ApplicationsModule,
    AnalyticsModule,
    AddressesModule,
    WishlistModule,
    ConfiguratorModule,
    ProjectsModule,
    QuotesModule,
    WorkshopsModule,
    AffiliateModule,
    CampaignsModule,
    MentionsModule,
  ],
  providers: [
    // Apply rate limiting globally
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class GatewayModule {}
