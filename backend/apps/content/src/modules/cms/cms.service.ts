import {
  Injectable, NotFoundException, ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CmsPage }        from './entities/cms-page.entity';
import { Banner }         from './entities/banner.entity';
import { MediaItem }      from './entities/media-item.entity';
import { Popup }          from './entities/popup.entity';
import { NavigationMenu } from './entities/navigation.entity';
import {
  CreateCmsPageDto, UpdateCmsPageDto, CmsPageQueryDto,
  CreateBannerDto, UpdateBannerDto, BannerQueryDto,
  UpdateMediaItemDto, MediaQueryDto,
  CreatePopupDto, UpdatePopupDto,
  CreateNavigationMenuDto, UpdateNavigationMenuDto,
} from './dto/cms.dto';

@Injectable()
export class CmsService {

  constructor(
    @InjectRepository(CmsPage)        private readonly pageRepo:   Repository<CmsPage>,
    @InjectRepository(Banner)         private readonly bannerRepo:  Repository<Banner>,
    @InjectRepository(MediaItem)      private readonly mediaRepo:   Repository<MediaItem>,
    @InjectRepository(Popup)          private readonly popupRepo:   Repository<Popup>,
    @InjectRepository(NavigationMenu) private readonly navRepo:     Repository<NavigationMenu>,
  ) {}

  /* ══════════════════════════════════════════════════════════
   *  CMS PAGES
   * ══════════════════════════════════════════════════════════ */

  async listPages(query: CmsPageQueryDto): Promise<CmsPage[]> {
    const where: Partial<CmsPage> = {};
    if (query.status)   where.status   = query.status;
    if (query.pageType) where.pageType = query.pageType;
    return this.pageRepo.find({ where: where as any, order: { updatedAt: 'DESC' } });
  }

  async getPage(slug: string): Promise<CmsPage> {
    const page = await this.pageRepo.findOne({ where: { slug } });
    if (!page) throw new NotFoundException(`CMS page "${slug}" not found`);
    return page;
  }

  async createPage(dto: CreateCmsPageDto, userId: string): Promise<CmsPage> {
    const exists = await this.pageRepo.findOne({ where: { slug: dto.slug } });
    if (exists) throw new ConflictException(`Slug "${dto.slug}" already exists`);
    const page = this.pageRepo.create({ ...dto, updatedBy: { id: userId } as any });
    return this.pageRepo.save(page);
  }

  async updatePage(slug: string, dto: UpdateCmsPageDto, userId: string): Promise<CmsPage> {
    const page = await this.getPage(slug);
    const updates: Partial<CmsPage> = { ...dto, updatedBy: { id: userId } as any };
    if (dto.status === 'published' && page.status !== 'published') {
      updates.publishedAt = new Date();
    }
    Object.assign(page, updates);
    return this.pageRepo.save(page);
  }

  async deletePage(slug: string): Promise<void> {
    const page = await this.getPage(slug);
    await this.pageRepo.remove(page);
  }

  async clonePage(slug: string, newSlug: string, userId: string): Promise<CmsPage> {
    const source = await this.getPage(slug);
    const clone = this.pageRepo.create({
      ...source,
      id:          undefined,
      slug:        newSlug,
      title:       `${source.title} (copy)`,
      status:      'draft',
      publishedAt: null,
      updatedBy:   { id: userId } as any,
    });
    return this.pageRepo.save(clone);
  }

  /* ══════════════════════════════════════════════════════════
   *  BANNERS
   * ══════════════════════════════════════════════════════════ */

  async listBanners(query: BannerQueryDto): Promise<Banner[]> {
    const where: Partial<Banner> = {};
    if (query.placement) where.placement = query.placement;
    if (query.status)    where.status    = query.status;
    return this.bannerRepo.find({ where: where as any, order: { sortOrder: 'ASC', createdAt: 'DESC' } });
  }

  async getBanner(id: string): Promise<Banner> {
    const banner = await this.bannerRepo.findOne({ where: { id } });
    if (!banner) throw new NotFoundException(`Banner ${id} not found`);
    return banner;
  }

  async createBanner(dto: CreateBannerDto): Promise<Banner> {
    const banner = this.bannerRepo.create(dto);
    return this.bannerRepo.save(banner);
  }

  async updateBanner(id: string, dto: UpdateBannerDto): Promise<Banner> {
    const banner = await this.getBanner(id);
    Object.assign(banner, dto);
    return this.bannerRepo.save(banner);
  }

  async deleteBanner(id: string): Promise<void> {
    const banner = await this.getBanner(id);
    await this.bannerRepo.remove(banner);
  }

  async getActiveBanners(placement: string): Promise<Banner[]> {
    const now = new Date();
    return this.bannerRepo
      .createQueryBuilder('b')
      .where('b.placement = :placement', { placement })
      .andWhere('b.status = :status', { status: 'active' })
      .andWhere('(b.starts_at IS NULL OR b.starts_at <= :now)', { now })
      .andWhere('(b.ends_at IS NULL OR b.ends_at >= :now)', { now })
      .orderBy('b.sort_order', 'ASC')
      .getMany();
  }

  /* ══════════════════════════════════════════════════════════
   *  MEDIA LIBRARY
   * ══════════════════════════════════════════════════════════ */

  async listMedia(query: MediaQueryDto) {
    const page  = query.page  ?? 1;
    const limit = query.limit ?? 40;

    const qb = this.mediaRepo.createQueryBuilder('m');

    if (query.folder) {
      qb.andWhere('m.folder = :folder', { folder: query.folder });
    }
    if (query.search) {
      qb.andWhere(
        '(m.original_name ILIKE :s OR m.alt_text ILIKE :s)',
        { s: `%${query.search}%` },
      );
    }

    const [items, total] = await qb
      .orderBy('m.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  async updateMediaItem(id: string, dto: UpdateMediaItemDto): Promise<MediaItem> {
    const item = await this.mediaRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Media item ${id} not found`);
    Object.assign(item, dto);
    return this.mediaRepo.save(item);
  }

  async deleteMediaItem(id: string): Promise<void> {
    const item = await this.mediaRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Media item ${id} not found`);
    await this.mediaRepo.remove(item);
    // TODO: delete from S3/CDN using item.fileKey
  }

  async registerUpload(
    data: {
      filename: string; originalName: string; fileKey: string;
      url: string; mimeType: string; fileSize: number;
      width?: number; height?: number; folder: string;
    },
    userId: string,
  ): Promise<MediaItem> {
    const item = this.mediaRepo.create({
      ...data,
      folder: data.folder as any,
      uploadedBy: { id: userId } as any,
    });
    return this.mediaRepo.save(item);
  }

  /* ══════════════════════════════════════════════════════════
   *  POPUPS
   * ══════════════════════════════════════════════════════════ */

  async listPopups(): Promise<Popup[]> {
    return this.popupRepo.find({ order: { createdAt: 'DESC' } });
  }

  async getPopup(id: string): Promise<Popup> {
    const popup = await this.popupRepo.findOne({ where: { id } });
    if (!popup) throw new NotFoundException(`Popup ${id} not found`);
    return popup;
  }

  async createPopup(dto: CreatePopupDto): Promise<Popup> {
    const popup = this.popupRepo.create(dto);
    return this.popupRepo.save(popup);
  }

  async updatePopup(id: string, dto: UpdatePopupDto): Promise<Popup> {
    const popup = await this.getPopup(id);
    Object.assign(popup, dto);
    return this.popupRepo.save(popup);
  }

  async deletePopup(id: string): Promise<void> {
    const popup = await this.getPopup(id);
    await this.popupRepo.remove(popup);
  }

  /** Public — return all active popups for the storefront */
  async getActivePopups(): Promise<Popup[]> {
    return this.popupRepo.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
  }

  /* ══════════════════════════════════════════════════════════
   *  NAVIGATION MENUS
   * ══════════════════════════════════════════════════════════ */

  async listNavMenus(): Promise<NavigationMenu[]> {
    return this.navRepo.find({ order: { name: 'ASC' } });
  }

  async getNavMenu(name: string): Promise<NavigationMenu> {
    const menu = await this.navRepo.findOne({ where: { name } });
    if (!menu) throw new NotFoundException(`Navigation menu "${name}" not found`);
    return menu;
  }

  async upsertNavMenu(dto: CreateNavigationMenuDto): Promise<NavigationMenu> {
    const existing = await this.navRepo.findOne({ where: { name: dto.name } });
    if (existing) {
      Object.assign(existing, dto);
      return this.navRepo.save(existing);
    }
    const menu = this.navRepo.create(dto);
    return this.navRepo.save(menu);
  }

  async updateNavMenu(name: string, dto: UpdateNavigationMenuDto): Promise<NavigationMenu> {
    const menu = await this.getNavMenu(name);
    Object.assign(menu, dto);
    return this.navRepo.save(menu);
  }

  async deleteNavMenu(name: string): Promise<void> {
    const menu = await this.getNavMenu(name);
    await this.navRepo.remove(menu);
  }

  /* ══════════════════════════════════════════════════════════
   *  DASHBOARD SUMMARY
   * ══════════════════════════════════════════════════════════ */

  async getSummary() {
    const [pages, banners, media, popups] = await Promise.all([
      this.pageRepo.count(),
      this.bannerRepo.count(),
      this.mediaRepo.count(),
      this.popupRepo.count(),
    ]);
    const published     = await this.pageRepo.count({ where: { status: 'published' } });
    const drafts        = await this.pageRepo.count({ where: { status: 'draft' } });
    const activeBanners = await this.bannerRepo.count({ where: { status: 'active' } });
    const activePopups  = await this.popupRepo.count({ where: { isActive: true } });
    return { pages, published, drafts, banners, activeBanners, media, popups, activePopups };
  }
}
