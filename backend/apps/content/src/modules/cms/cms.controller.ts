import {
  Controller, Get, Post, Patch, Delete, Param, Body,
  Query, UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { CmsService } from './cms.service';
import {
  CreateCmsPageDto, UpdateCmsPageDto, CmsPageQueryDto,
  CreateBannerDto, UpdateBannerDto, BannerQueryDto,
  UpdateMediaItemDto, MediaQueryDto,
  CreatePopupDto, UpdatePopupDto,
  CreateNavigationMenuDto, UpdateNavigationMenuDto,
} from './dto/cms.dto';
import { JwtAuthGuard } from '../../../../../libs/common/src/guards/jwt-auth.guard';
import { RolesGuard }   from '../../../../../libs/common/src/guards/roles.guard';
import { Roles }        from '../../../../../libs/common/src/decorators/roles.decorator';
import { Role }         from '../../../../../libs/common/src/enums/role.enum';
import { Public }       from '../../../../../libs/common/src/decorators/public.decorator';

const CONTENT_ROLES = [Role.MasterAdmin, Role.Editor];

@Controller('cms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  /* ── Summary (dashboard) ──────────────────────────────────── */
  @Get('summary')
  @Roles(...CONTENT_ROLES)
  getSummary() {
    return this.cmsService.getSummary();
  }

  /* ══════════════════════════════════════════════════════════
   *  PAGES
   * ══════════════════════════════════════════════════════════ */

  @Get('pages')
  @Roles(...CONTENT_ROLES)
  listPages(@Query() query: CmsPageQueryDto) {
    return this.cmsService.listPages(query);
  }

  @Get('pages/:slug/published')
  @Public()
  getPublishedPage(@Param('slug') slug: string) {
    return this.cmsService.getPage(slug);
  }

  @Get('pages/:slug')
  @Roles(...CONTENT_ROLES)
  getPage(@Param('slug') slug: string) {
    return this.cmsService.getPage(slug);
  }

  @Post('pages')
  @Roles(...CONTENT_ROLES)
  @HttpCode(HttpStatus.CREATED)
  createPage(@Body() dto: CreateCmsPageDto, @Request() req: any) {
    return this.cmsService.createPage(dto, req.user.id);
  }

  @Patch('pages/:slug')
  @Roles(...CONTENT_ROLES)
  updatePage(
    @Param('slug') slug: string,
    @Body() dto: UpdateCmsPageDto,
    @Request() req: any,
  ) {
    return this.cmsService.updatePage(slug, dto, req.user.id);
  }

  @Post('pages/:slug/clone')
  @Roles(...CONTENT_ROLES)
  @HttpCode(HttpStatus.CREATED)
  clonePage(
    @Param('slug') slug: string,
    @Body('newSlug') newSlug: string,
    @Request() req: any,
  ) {
    return this.cmsService.clonePage(slug, newSlug, req.user.id);
  }

  @Delete('pages/:slug')
  @Roles(Role.MasterAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePage(@Param('slug') slug: string) {
    return this.cmsService.deletePage(slug);
  }

  /* ══════════════════════════════════════════════════════════
   *  BANNERS
   * ══════════════════════════════════════════════════════════ */

  @Get('banners')
  @Roles(...CONTENT_ROLES)
  listBanners(@Query() query: BannerQueryDto) {
    return this.cmsService.listBanners(query);
  }

  @Get('banners/active/:placement')
  @Public()
  getActiveBanners(@Param('placement') placement: string) {
    return this.cmsService.getActiveBanners(placement);
  }

  @Get('banners/:id')
  @Roles(...CONTENT_ROLES)
  getBanner(@Param('id') id: string) {
    return this.cmsService.getBanner(id);
  }

  @Post('banners')
  @Roles(...CONTENT_ROLES)
  @HttpCode(HttpStatus.CREATED)
  createBanner(@Body() dto: CreateBannerDto) {
    return this.cmsService.createBanner(dto);
  }

  @Patch('banners/:id')
  @Roles(...CONTENT_ROLES)
  updateBanner(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.cmsService.updateBanner(id, dto);
  }

  @Delete('banners/:id')
  @Roles(Role.MasterAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBanner(@Param('id') id: string) {
    return this.cmsService.deleteBanner(id);
  }

  /* ══════════════════════════════════════════════════════════
   *  MEDIA LIBRARY
   * ══════════════════════════════════════════════════════════ */

  @Get('media')
  @Roles(...CONTENT_ROLES)
  listMedia(@Query() query: MediaQueryDto) {
    return this.cmsService.listMedia(query);
  }

  @Patch('media/:id')
  @Roles(...CONTENT_ROLES)
  updateMedia(@Param('id') id: string, @Body() dto: UpdateMediaItemDto) {
    return this.cmsService.updateMediaItem(id, dto);
  }

  @Delete('media/:id')
  @Roles(Role.MasterAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteMedia(@Param('id') id: string) {
    return this.cmsService.deleteMediaItem(id);
  }

  @Post('media/register')
  @Roles(...CONTENT_ROLES)
  @HttpCode(HttpStatus.CREATED)
  registerUpload(@Body() data: any, @Request() req: any) {
    return this.cmsService.registerUpload(data, req.user.id);
  }

  /* ══════════════════════════════════════════════════════════
   *  POPUPS
   * ══════════════════════════════════════════════════════════ */

  @Get('popups')
  @Roles(...CONTENT_ROLES)
  listPopups() {
    return this.cmsService.listPopups();
  }

  /** Public — storefront fetches active popups on page load */
  @Get('popups/active')
  @Public()
  getActivePopups() {
    return this.cmsService.getActivePopups();
  }

  @Get('popups/:id')
  @Roles(...CONTENT_ROLES)
  getPopup(@Param('id') id: string) {
    return this.cmsService.getPopup(id);
  }

  @Post('popups')
  @Roles(...CONTENT_ROLES)
  @HttpCode(HttpStatus.CREATED)
  createPopup(@Body() dto: CreatePopupDto) {
    return this.cmsService.createPopup(dto);
  }

  @Patch('popups/:id')
  @Roles(...CONTENT_ROLES)
  updatePopup(@Param('id') id: string, @Body() dto: UpdatePopupDto) {
    return this.cmsService.updatePopup(id, dto);
  }

  @Delete('popups/:id')
  @Roles(Role.MasterAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePopup(@Param('id') id: string) {
    return this.cmsService.deletePopup(id);
  }

  /* ══════════════════════════════════════════════════════════
   *  NAVIGATION MENUS
   * ══════════════════════════════════════════════════════════ */

  @Get('nav')
  @Roles(...CONTENT_ROLES)
  listNavMenus() {
    return this.cmsService.listNavMenus();
  }

  /** Public — storefront fetches nav by name (e.g. 'main', 'footer') */
  @Get('nav/:name/public')
  @Public()
  getNavMenuPublic(@Param('name') name: string) {
    return this.cmsService.getNavMenu(name);
  }

  @Get('nav/:name')
  @Roles(...CONTENT_ROLES)
  getNavMenu(@Param('name') name: string) {
    return this.cmsService.getNavMenu(name);
  }

  @Post('nav')
  @Roles(...CONTENT_ROLES)
  @HttpCode(HttpStatus.CREATED)
  upsertNavMenu(@Body() dto: CreateNavigationMenuDto) {
    return this.cmsService.upsertNavMenu(dto);
  }

  @Patch('nav/:name')
  @Roles(...CONTENT_ROLES)
  updateNavMenu(
    @Param('name') name: string,
    @Body() dto: UpdateNavigationMenuDto,
  ) {
    return this.cmsService.updateNavMenu(name, dto);
  }

  @Delete('nav/:name')
  @Roles(Role.MasterAdmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteNavMenu(@Param('name') name: string) {
    return this.cmsService.deleteNavMenu(name);
  }
}
