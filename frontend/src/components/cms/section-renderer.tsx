"use client";

/**
 * CMS Section Renderer
 *
 * Converts the `content.sections` array stored in a CmsPage into live UI.
 * Each section has a `type` field that maps to a renderer component.
 *
 * Section schema (content JSON structure):
 * {
 *   sections: [
 *     {
 *       type: "hero" | "text" | "image_text" | "banner" | "cta" | "faq" | "product_grid" | "custom",
 *       id: string,          // unique within the page
 *       order: number,
 *       ...type-specific fields
 *     }
 *   ]
 * }
 */

import Link from "next/link";
import Image from "next/image";

// ── Section type definitions ────────────────────────────────────

export interface BaseSection {
  type: string;
  id: string;
  order?: number;
}

export interface HeroSection extends BaseSection {
  type: "hero";
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
  bgColor?: string;
  textColor?: string;
  align?: "left" | "center" | "right";
}

export interface TextSection extends BaseSection {
  type: "text";
  heading?: string;
  body: string;
  align?: "left" | "center" | "right";
}

export interface ImageTextSection extends BaseSection {
  type: "image_text";
  heading?: string;
  body: string;
  imageUrl: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
  ctaLabel?: string;
  ctaHref?: string;
}

export interface BannerSection extends BaseSection {
  type: "banner";
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
  bgColor?: string;
  textColor?: string;
}

export interface CtaSection extends BaseSection {
  type: "cta";
  heading: string;
  subheading?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  bgColor?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSection extends BaseSection {
  type: "faq";
  heading?: string;
  items: FaqItem[];
}

export interface ProductGridSection extends BaseSection {
  type: "product_grid";
  heading?: string;
  productIds?: string[];
  category?: string;
  limit?: number;
}

export interface CustomSection extends BaseSection {
  type: "custom";
  html: string;
}

export type CmsSection =
  | HeroSection
  | TextSection
  | ImageTextSection
  | BannerSection
  | CtaSection
  | FaqSection
  | ProductGridSection
  | CustomSection;

// ── Individual section renderers ────────────────────────────────

function RenderHero({ s }: { s: HeroSection }) {
  const align = s.align ?? "center";
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: s.bgColor ?? "#1a1a1a" }}>
      {s.imageUrl && (
        <div className="absolute inset-0">
          <Image src={s.imageUrl} alt={s.heading} fill className="object-cover opacity-50" />
        </div>
      )}
      <div className={`relative z-10 mx-auto max-w-4xl px-6 py-24 text-${align}`}>
        <h1
          className="font-serif text-4xl font-light leading-tight md:text-5xl lg:text-6xl"
          style={{ color: s.textColor ?? "#ffffff" }}>
          {s.heading}
        </h1>
        {s.subheading && (
          <p className="mt-4 text-lg opacity-80" style={{ color: s.textColor ?? "#ffffff" }}>
            {s.subheading}
          </p>
        )}
        {s.ctaLabel && s.ctaHref && (
          <div className={`mt-8 flex ${align === "center" ? "justify-center" : align === "right" ? "justify-end" : ""}`}>
            <Link href={s.ctaHref}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-sans text-sm font-semibold text-charcoal hover:bg-white/90 transition-colors">
              {s.ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function RenderText({ s }: { s: TextSection }) {
  const align = s.align ?? "left";
  return (
    <section className={`mx-auto max-w-3xl px-6 py-16 text-${align}`}>
      {s.heading && (
        <h2 className="font-serif text-3xl font-light text-charcoal mb-6">{s.heading}</h2>
      )}
      <div
        className="font-sans text-base leading-relaxed text-charcoal/70 prose prose-charcoal max-w-none"
        dangerouslySetInnerHTML={{ __html: s.body }} />
    </section>
  );
}

function RenderImageText({ s }: { s: ImageTextSection }) {
  const imgRight = s.imagePosition === "right";
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className={`flex flex-col gap-12 md:flex-row ${imgRight ? "md:flex-row-reverse" : ""} items-center`}>
        <div className="flex-1 relative h-80 w-full rounded-2xl overflow-hidden bg-stone-100">
          <Image src={s.imageUrl} alt={s.imageAlt ?? s.heading ?? ""} fill className="object-cover" />
        </div>
        <div className="flex-1 space-y-4">
          {s.heading && <h2 className="font-serif text-3xl font-light text-charcoal">{s.heading}</h2>}
          <div
            className="font-sans text-base leading-relaxed text-charcoal/60"
            dangerouslySetInnerHTML={{ __html: s.body }} />
          {s.ctaLabel && s.ctaHref && (
            <Link href={s.ctaHref}
              className="inline-flex items-center gap-2 rounded-full border border-charcoal px-6 py-2.5 font-sans text-sm font-medium text-charcoal hover:bg-charcoal hover:text-white transition-colors">
              {s.ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function RenderBanner({ s }: { s: BannerSection }) {
  return (
    <section
      className="w-full px-6 py-4 text-center"
      style={{ background: s.bgColor ?? "#1a1a1a" }}>
      <p className="font-sans text-sm font-medium" style={{ color: s.textColor ?? "#ffffff" }}>
        {s.message}
        {s.ctaLabel && s.ctaHref && (
          <Link href={s.ctaHref} className="ml-3 underline underline-offset-2 hover:no-underline">
            {s.ctaLabel}
          </Link>
        )}
      </p>
    </section>
  );
}

function RenderCta({ s }: { s: CtaSection }) {
  return (
    <section
      className="w-full px-6 py-20 text-center"
      style={{ background: s.bgColor ?? "#f8f7f5" }}>
      <div className="mx-auto max-w-2xl">
        <h2 className="font-serif text-4xl font-light text-charcoal">{s.heading}</h2>
        {s.subheading && <p className="mt-3 text-base text-charcoal/50">{s.subheading}</p>}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href={s.primaryHref}
            className="rounded-full bg-charcoal px-8 py-3.5 font-sans text-sm font-semibold text-white hover:bg-charcoal/90 transition-colors">
            {s.primaryLabel}
          </Link>
          {s.secondaryLabel && s.secondaryHref && (
            <Link href={s.secondaryHref}
              className="rounded-full border border-charcoal/20 px-8 py-3.5 font-sans text-sm font-medium text-charcoal hover:border-charcoal transition-colors">
              {s.secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function RenderFaq({ s }: { s: FaqSection }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      {s.heading && <h2 className="font-serif text-3xl font-light text-charcoal mb-8">{s.heading}</h2>}
      <div className="divide-y divide-black/8">
        {s.items.map((item, i) => (
          <details key={i} className="group py-5">
            <summary className="flex cursor-pointer items-center justify-between gap-4 list-none font-sans text-base font-medium text-charcoal">
              {item.question}
              <span className="shrink-0 rounded-full border border-black/10 p-1 transition-transform group-open:rotate-45">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M8 2v12M2 8h12" strokeLinecap="round" />
                </svg>
              </span>
            </summary>
            <p className="mt-4 font-sans text-sm leading-relaxed text-charcoal/60">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function RenderCustom({ s }: { s: CustomSection }) {
  return (
    <section
      className="cms-custom-section"
      dangerouslySetInnerHTML={{ __html: s.html }} />
  );
}

function RenderProductGrid({ s }: { s: ProductGridSection }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      {s.heading && <h2 className="font-serif text-3xl font-light text-charcoal mb-8">{s.heading}</h2>}
      <div className="rounded-xl border border-dashed border-black/15 p-8 text-center text-sm text-charcoal/30">
        Product grid — connects to catalog API (category: {s.category ?? "all"}, limit: {s.limit ?? 8})
      </div>
    </section>
  );
}

// ── Main renderer ───────────────────────────────────────────────

export function SectionRenderer({ section }: { section: CmsSection }) {
  switch (section.type) {
    case "hero":         return <RenderHero s={section} />;
    case "text":         return <RenderText s={section} />;
    case "image_text":   return <RenderImageText s={section} />;
    case "banner":       return <RenderBanner s={section} />;
    case "cta":          return <RenderCta s={section} />;
    case "faq":          return <RenderFaq s={section} />;
    case "product_grid": return <RenderProductGrid s={section} />;
    case "custom":       return <RenderCustom s={section} />;
    default:             return null;
  }
}

/**
 * Render all sections of a CMS page in order.
 * Usage in a Next.js page:
 *
 *   const page = await cmsApi.getPublishedPage("homepage");
 *   const sections = (page.content?.sections ?? []) as CmsSection[];
 *   return <PageSectionRenderer sections={sections} />;
 */
export function PageSectionRenderer({ sections }: { sections: CmsSection[] }) {
  const sorted = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return (
    <>
      {sorted.map(section => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  );
}
