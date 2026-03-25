import type { Metadata } from "next";
import { Suspense }          from "react";
import { Header }            from "@/components/nav/header";
import { Footer }            from "@/components/footer/footer";
import { CartDrawer }        from "@/components/store/cart-drawer";
import { Hero }              from "@/components/home/hero";
import { MarqueeStrip }      from "@/components/home/marquee-strip";
import { FeaturedCategories, type CmsCategory }  from "@/components/home/featured-categories";
import { EditorialPanel }    from "@/components/home/editorial-panel";
import { FeaturedProducts }  from "@/components/home/featured-products";
import { ConfiguratorCta, type CmsConfigurator } from "@/components/home/configurator-cta";
import { PressStrip }        from "@/components/home/press-strip";
import { ServicesStrip, type CmsService }        from "@/components/home/services-strip";
import { DiscoverScroll }    from "@/components/home/discover-scroll";
import { BrandStory, type CmsBrandStory }        from "@/components/home/brand-story";
import { Newsletter, type CmsNewsletter }        from "@/components/home/newsletter";
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateWebSiteSchema,
  generateFAQSchema,
} from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "Modulas — Bespoke Furniture. Elevated Interiors.",
  description:
    "A contemporary luxury furniture studio redefining the way interiors are experienced. " +
    "Bespoke modular kitchens, wardrobes, living & bedroom furniture — designed and crafted in India.",
  keywords: ["bespoke furniture", "luxury modular furniture", "modular kitchen Gurgaon", "custom furniture India", "interior design Gurgaon", "luxury wardrobes", "modular furniture"],
  openGraph: {
    title:       "Modulas — Bespoke Furniture. Elevated Interiors.",
    description: "A contemporary luxury furniture studio redefining the way interiors are experienced. Crafted for Indian homes.",
    images:      [{ url: "https://assets.modulas.in/og/homepage.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Modulas — Bespoke Furniture. Elevated Interiors.",
    description: "Luxury bespoke furniture studio in Gurgaon, India. 850+ projects. 98% client satisfaction.",
  },
  alternates: { canonical: "https://modulas.in" },
};

/* ─────────────────────────────────────────────────────────────
 *  CMS homepage content shape — mirrors what HomepageTab saves
 * ───────────────────────────────────────────────────────────── */
interface CmsHero {
  imageUrl?:          string;
  eyebrow?:           string;
  headline?:          string;
  subheading?:        string;
  primaryCtaLabel?:   string;
  primaryCtaHref?:    string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?:  string;
}

interface CmsEditorialPanel {
  eyebrow:   string;
  headline:  string;
  body:      string;
  ctaLabel:  string;
  ctaHref:   string;
  imageUrl:  string;
  overlay?:  "light" | "medium" | "dark";
  size?:     "medium" | "large" | "full";
  align?:    "left" | "center" | "right";
  ctaStyle?: "white" | "gold" | "outline";
}

interface HomepageContent {
  hero?:             CmsHero;
  categories?:       CmsCategory[];
  editorialPanels?:  CmsEditorialPanel[];
  services?:         CmsService[];
  marqueeItems?:     string[];
  pressQuotes?:      { pub: string; quote: string }[];
  brandStory?:       CmsBrandStory;
  configurator?:     CmsConfigurator;
  newsletter?:       CmsNewsletter;
}

/* ─────────────────────────────────────────────────────────────
 *  Fetch CMS homepage content at request time (server-side)
 * ───────────────────────────────────────────────────────────── */
async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
    const res = await fetch(`${api}/cms/pages/homepage/published`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return {};
    const page = await res.json() as { content?: HomepageContent };
    return page.content ?? {};
  } catch {
    return {};
  }
}

/* ─────────────────────────────────────────────────────────────
 *  Default editorial panels
 * ───────────────────────────────────────────────────────────── */
const DEFAULT_PANELS: CmsEditorialPanel[] = [
  {
    eyebrow:  "New Arrivals · Spring 2026",
    headline: "Designed for\nthe way you live.",
    body:     "Thoughtfully proportioned pieces that adapt to every room, every layout, every life stage.",
    ctaLabel: "Shop New Arrivals",
    ctaHref:  "/products?sort=newest",
    imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1600&q=85",
    overlay:  "medium", size: "large", align: "left", ctaStyle: "outline",
  },
  {
    eyebrow:  "Material Stories",
    headline: "Step into texture.",
    body:     "From hand-loomed boucle to cold-rolled brass — every material we use is chosen for how it ages, not just how it looks.",
    ctaLabel: "Explore Materials",
    ctaHref:  "/journal/return-of-boucle",
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=85",
    overlay:  "dark", size: "medium", align: "right", ctaStyle: "gold",
  },
  {
    eyebrow:  "Our Story",
    headline: "Rediscovery.",
    body:     "We believe the finest furniture isn't imported. It's designed with intent, built with mastery, and made right here in India.",
    ctaLabel: "Our Story",
    ctaHref:  "/our-story",
    imageUrl: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1600&q=85",
    overlay:  "dark", size: "large", align: "center", ctaStyle: "white",
  },
];

/* ─────────────────────────────────────────────────────────────
 *  Loading skeleton for FeaturedProducts Suspense boundary
 * ───────────────────────────────────────────────────────────── */
function ProductsSkeleton() {
  return (
    <section className="py-section bg-white dark:bg-charcoal-950" aria-hidden>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 space-y-10">
        <div className="space-y-3">
          <div className="h-3 w-20 bg-black/6 dark:bg-white/6 rounded" />
          <div className="h-8 w-56 bg-black/8 dark:bg-white/8 rounded" />
          <div className="h-4 w-96 max-w-full bg-black/5 dark:bg-white/5 rounded" />
        </div>
        <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4" role="list">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="space-y-3">
              <div className="aspect-[4/5] bg-black/5 dark:bg-white/5 animate-pulse" />
              <div className="h-3 w-3/4 bg-black/5 dark:bg-white/5 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-black/5 dark:bg-white/5 rounded animate-pulse" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  Page
 * ───────────────────────────────────────────────────────────── */
const HOME_FAQS = [
  {
    question: "What is modular furniture?",
    answer: "Modular furniture consists of standardised units that can be combined, reconfigured, and expanded to suit your space. Modulas designs each module to integrate seamlessly — so you can start with a single wardrobe and expand into a full dressing room without replacing existing pieces.",
  },
  {
    question: "How do I customise furniture online with Modulas?",
    answer: "Use the Modulas 3D Configurator — select your piece, choose materials, finishes, and dimensions in real time, and see the price update instantly. You can save your design, request a free home visit, or order directly.",
  },
  {
    question: "What materials does Modulas use for luxury furniture?",
    answer: "Modulas uses solid European oak, FSC-certified plywood, hand-loomed boucle, full-grain leather, cold-rolled brass, and natural marble — all selected for longevity and how they age rather than just their appearance.",
  },
  {
    question: "Does Modulas offer free home consultation in Gurgaon?",
    answer: "Yes. Our design team visits your home, takes precise measurements, and presents a bespoke design proposal at no charge. Book a free visit from the homepage.",
  },
  {
    question: "How long does bespoke furniture take to deliver?",
    answer: "Standard delivery is 6–8 weeks from order confirmation. Complex configurations or custom materials may take 10–12 weeks. All orders include white-glove installation.",
  },
  {
    question: "What is the warranty on Modulas furniture?",
    answer: "All Modulas pieces carry a 10-year structural warranty covering the frame, mechanism, and hardware. Upholstery and surface finishes are covered for 2 years.",
  },
];

export default async function HomePage() {
  const cms = await getHomepageContent();

  const hero   = cms.hero ?? {};
  // Use the second panel (Material Stories) as the single editorial — strongest visual
  const panels = cms.editorialPanels?.length ? cms.editorialPanels : DEFAULT_PANELS;
  const p2     = panels[1] ?? panels[0];

  const orgSchema   = generateOrganizationSchema();
  const bizSchema   = generateLocalBusinessSchema();
  const siteSchema  = generateWebSiteSchema();
  const faqSchema   = generateFAQSchema(HOME_FAQS);

  return (
    <>
      {/* ── JSON-LD: Organisation + LocalBusiness + WebSite + FAQ ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bizSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Header />
      <CartDrawer />

      <main id="main-content" tabIndex={-1} className="min-h-dvh">

        {/* ① Hero — real-time natural lighting */}
        <Hero
          imageUrl={hero.imageUrl}
          eyebrow={hero.eyebrow}
          headline={hero.headline}
          subheading={hero.subheading}
          primaryCta={hero.primaryCtaLabel
            ? { label: hero.primaryCtaLabel, href: hero.primaryCtaHref ?? "/products" }
            : undefined}
          secondaryCta={hero.secondaryCtaLabel
            ? { label: hero.secondaryCtaLabel, href: hero.secondaryCtaHref ?? "/book-consultation" }
            : undefined}
        />

        {/* ② Trust / brand-value strip */}
        <MarqueeStrip items={cms.marqueeItems} />

        {/* ③ Bestselling products — within 2 scrolls of hero */}
        <Suspense fallback={<ProductsSkeleton />}>
          <FeaturedProducts />
        </Suspense>

        {/* ④ Configurator — primary differentiator, shown while user is engaged */}
        <ConfiguratorCta config={cms.configurator} />

        {/* ⑤ Press — credibility before further discovery */}
        <PressStrip quotes={cms.pressQuotes} />

        {/* ⑥ Shop by Category */}
        <FeaturedCategories categories={cms.categories} />

        {/* ⑦ Editorial panel — single curated brand statement */}
        {p2 && (
          <EditorialPanel
            eyebrow={p2.eyebrow} headline={p2.headline} body={p2.body}
            cta={{ label: p2.ctaLabel, href: p2.ctaHref }}
            image={p2.imageUrl}
            overlay={p2.overlay} size={p2.size} align={p2.align} ctaStyle={p2.ctaStyle}
          />
        )}

        {/* ⑧ Services — how we work with you (cream bg for rhythm) */}
        <ServicesStrip services={cms.services} />

        {/* ⑨ Journal / stories — server-fetched, no layout shift */}
        <DiscoverScroll />

        {/* ⑩ Brand story — stat/copy layout before the close */}
        <BrandStory story={cms.brandStory} />

        {/* ⑪ Newsletter */}
        <Newsletter newsletter={cms.newsletter} />

      </main>

      <Footer />
    </>
  );
}
