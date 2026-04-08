import {
  IsString, IsOptional, IsEnum, IsObject, IsUrl,
  IsInt, Min, IsDateString, IsArray, MaxLength,
  IsBoolean, ValidateNested,
} from 'class-validator';
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import type { CmsPageStatus, CmsPageType } from '../entities/cms-page.entity';
import type { BannerPlacement, BannerStatus } from '../entities/banner.entity';
import type { MediaFolder } from '../entities/media-item.entity';
import type { PopupTrigger } from '../entities/popup.entity';

/* ── CMS Pages ──────────────────────────────────────────────── */

export class CreateCmsPageDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsEnum(['homepage', 'about', 'contact', 'static', 'landing'])
  pageType: CmsPageType;

  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: CmsPageStatus;

  @IsOptional()
  @IsObject()
  content?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(70)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  seoDescription?: string;

  @IsOptional()
  @IsString()
  ogImage?: string;
}

export class UpdateCmsPageDto extends PartialType(CreateCmsPageDto) {
  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: CmsPageStatus;
}

export class CmsPageQueryDto {
  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: CmsPageStatus;

  @IsOptional()
  @IsEnum(['homepage', 'about', 'contact', 'static', 'landing'])
  pageType?: CmsPageType;
}

/* ── Banners ────────────────────────────────────────────────── */

export class CreateBannerDto {
  @IsString()
  name: string;

  @IsEnum(['announcement', 'hero', 'category', 'product', 'checkout'])
  placement: BannerPlacement;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  message?: string;

  @IsOptional()
  @IsString()
  ctaLabel?: string;

  @IsOptional()
  @IsString()
  ctaHref?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  mobileImageUrl?: string;

  @IsOptional()
  @IsString()
  bgColor?: string;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class UpdateBannerDto extends PartialType(CreateBannerDto) {
  @IsOptional()
  @IsEnum(['active', 'scheduled', 'inactive'])
  status?: BannerStatus;
}

export class BannerQueryDto {
  @IsOptional()
  @IsEnum(['announcement', 'hero', 'category', 'product', 'checkout'])
  placement?: BannerPlacement;

  @IsOptional()
  @IsEnum(['active', 'scheduled', 'inactive'])
  status?: BannerStatus;
}

/* ── Media ──────────────────────────────────────────────────── */

export class UpdateMediaItemDto {
  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsEnum(['products', 'projects', 'blog', 'homepage', 'banners', 'misc'])
  folder?: MediaFolder;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class MediaQueryDto {
  @IsOptional()
  @IsEnum(['products', 'projects', 'blog', 'homepage', 'banners', 'misc'])
  folder?: MediaFolder;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}

/* ── Popups ─────────────────────────────────────────────────── */

export class CreatePopupDto {
  @IsString()
  name: string;

  @IsEnum(['onload', 'exit_intent', 'scroll'])
  trigger: PopupTrigger;

  @IsOptional()
  @IsInt()
  @Min(0)
  triggerValue?: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  ctaLabel?: string;

  @IsOptional()
  @IsString()
  ctaHref?: string;

  @IsOptional()
  @IsBoolean()
  ctaNewTab?: boolean;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  bgColor?: string;

  @IsOptional()
  @IsBoolean()
  showOnce?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePopupDto extends PartialType(CreatePopupDto) {}

/* ── Navigation Menus ───────────────────────────────────────── */

export class NavLinkDto {
  @IsString()
  label: string;

  @IsString()
  href: string;

  @IsOptional()
  @IsBoolean()
  openInNewTab?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavLinkDto)
  children?: NavLinkDto[];
}

export class CreateNavigationMenuDto {
  @IsString()
  name: string;

  @IsString()
  label: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavLinkDto)
  items?: NavLinkDto[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateNavigationMenuDto extends PartialType(CreateNavigationMenuDto) {}
