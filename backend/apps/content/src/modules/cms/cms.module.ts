import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmsPage }         from './entities/cms-page.entity';
import { Banner }          from './entities/banner.entity';
import { MediaItem }       from './entities/media-item.entity';
import { Popup }           from './entities/popup.entity';
import { NavigationMenu }  from './entities/navigation.entity';
import { CmsService }      from './cms.service';
import { CmsController }   from './cms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CmsPage, Banner, MediaItem, Popup, NavigationMenu])],
  controllers: [CmsController],
  providers:   [CmsService],
  exports:     [CmsService],
})
export class CmsModule {}
