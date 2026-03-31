import { Suspense }              from "react";
import { ProductGrid }           from "@/components/store/product-grid";
import { ProductsPageClient }    from "@/components/store/products-page-client";
import { CategoryTiles }         from "@/components/store/category-tiles";
import { SubcategoryNav }        from "@/components/store/subcategory-nav";
import { CategoryFAQ }           from "@/components/store/category-faq";
import { ModularHighlight }      from "@/components/store/modular-highlight";
import { generateCollectionSchema } from "@/lib/seo/structured-data";
import { CATEGORY_MAP }          from "@/lib/config/categories";
import type { Metadata }         from "next";
import Link                      from "next/link";

interface ProductsSearchParams {
  category?:     string;
  subcategory?:  string;
  material?:     string;
  brand?:        string;
  finish?:       string;
  min?:          string;
  max?:          string;
  sort?:         string;
  q?:            string;
  page?:         string;
  configurable?: string;
  instock?:      string;
  sale?:         string;
}

interface ProductsPageProps {
  searchParams: Promise<ProductsSearchParams>;
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const cat = params.category ? CATEGORY_MAP[params.category] : null;
  return {
    title:       cat ? cat.seoTitle       : "Shop Furniture — Modulas",
    description: cat ? cat.seoDescription : "Explore the full Modulas collection — luxury bespoke furniture for living spaces, bedrooms, kitchens, and offices. Fully customised, crafted in India.",
  };
}

const DEFAULT_HERO = {
  headline: "The Full Collection",
  sub:      "200+ bespoke pieces. Every one crafted in India.",
  image:    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1600&q=85",
};

/* ── Grid skeleton ────────────────────────────────────────────────── */
function GridSkeleton() {
  return (
    <div className="space-y-8 mt-8">
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-[4/5] animate-pulse bg-black/5 dark:bg-white/5" />
            <div className="h-3 w-3/4 animate-pulse bg-black/5 dark:bg-white/5 rounded" />
            <div className="h-3 w-1/3 animate-pulse bg-black/5 dark:bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const collectionSchema = generateCollectionSchema({
    name: "Modulas Collection",
    url:  "https://modulas.in/products",
  });

  const activeCat   = resolvedParams.category;
  const activeSub   = resolvedParams.subcategory;
  const catConfig   = activeCat ? CATEGORY_MAP[activeCat] : null;
  const hero        = catConfig ?? DEFAULT_HERO;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* ① HERO BANNER ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-charcoal-950 min-h-[260px] lg:min-h-[320px] flex flex-col justify-end">
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={catConfig?.hero ?? DEFAULT_HERO.image}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-[0.38]"
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/40 to-transparent" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/60 via-transparent to-transparent" aria-hidden />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 lg:px-12 pb-10 pt-32">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-4 font-sans text-[10px] tracking-[0.2em] uppercase text-cream/35" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-cream/60 transition-colors">Home</Link>
            <span aria-hidden>/</span>
            {activeCat ? (
              <>
                <Link href="/products" className="hover:text-cream/60 transition-colors">Shop</Link>
                <span aria-hidden>/</span>
                <span className="text-cream/60 capitalize">{catConfig?.name ?? activeCat}</span>
                {activeSub && (
                  <>
                    <span aria-hidden>/</span>
                    <span className="text-cream/60 capitalize">{activeSub.replace(/-/g, " ")}</span>
                  </>
                )}
              </>
            ) : (
              <span className="text-cream/60">Shop</span>
            )}
          </nav>

          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold mb-3">
            Modulas Collection
          </p>
          <h1 className="font-serif text-4xl text-cream leading-tight lg:text-5xl">
            {hero.headline}
          </h1>
          <p className="mt-3 font-sans text-sm text-cream/45 max-w-md leading-relaxed">
            {hero.sub}
          </p>
        </div>
      </section>

      {/* ② CATEGORY TILES ─────────────────────────────────────────── */}
      <CategoryTiles active={activeCat} />

      {/* ③ SUBCATEGORY NAV (only when a category is active) ──────── */}
      {catConfig && (
        <SubcategoryNav
          subcategories={catConfig.subcategories}
          activeSubcategory={activeSub}
        />
      )}

      {/* ④ FILTER SIDEBAR + PRODUCT GRID ──────────────────────────── */}
      <ProductsPageClient searchParams={resolvedParams}>
        <Suspense fallback={<GridSkeleton />}>
          <ProductGrid searchParams={resolvedParams} />
        </Suspense>
      </ProductsPageClient>

      {/* ⑤ MODULAR HIGHLIGHT (configurator CTA) ──────────────────── */}
      {catConfig && (
        <ModularHighlight
          headline={catConfig.highlightHeadline}
          body={catConfig.highlightBody}
          cta={catConfig.highlightCta}
          href={catConfig.highlightHref}
          accentColor={catConfig.accentColor}
        />
      )}

      {/* ⑥ CATEGORY FAQ ───────────────────────────────────────────── */}
      {catConfig && catConfig.faqs.length > 0 && (
        <CategoryFAQ
          items={catConfig.faqs}
          categoryName={catConfig.name}
          categoryUrl={`https://modulas.in/products?category=${catConfig.slug}`}
        />
      )}

      {/* ⑦ BOTTOM EDITORIAL ───────────────────────────────────────── */}
      <section className="bg-cream dark:bg-charcoal-900 py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-3 gap-px bg-black/8 dark:bg-white/8 border border-black/8 dark:border-white/8">
          {[
            {
              label: "Can't find what you need?",
              body:  "Every piece can be made to your exact dimensions, materials, and finish — no surcharge.",
              cta:   "Bespoke Orders",
              href:  "/bespoke",
            },
            {
              label: "Specifying for a project?",
              body:  "Architects and designers get dedicated pricing, a personal account manager, and material samples.",
              cta:   "Trade Programme",
              href:  "/architects",
            },
            {
              label: "Want to see it in person?",
              body:  "Visit our Gurgaon Experience Centre — Sector 95. Open Monday to Saturday, 10am – 7pm.",
              cta:   "Find Our Studio",
              href:  "/contact",
            },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-4 p-8 bg-cream dark:bg-charcoal-900">
              <h3 className="font-serif text-lg text-charcoal dark:text-cream leading-snug">{item.label}</h3>
              <p className="font-sans text-[13px] leading-relaxed text-charcoal/50 dark:text-cream/50 flex-1">{item.body}</p>
              <Link
                href={item.href}
                className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.18em] uppercase text-charcoal/55 dark:text-cream/55 hover:text-gold transition-colors self-start border-b border-transparent hover:border-gold pb-0.5"
              >
                {item.cta}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
