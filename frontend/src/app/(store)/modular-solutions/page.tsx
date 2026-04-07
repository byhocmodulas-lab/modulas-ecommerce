import Link from "next/link";
import type { Metadata } from "next";
import { ProductCard } from "@/components/store/product-card";
import type { Product } from "@/lib/types/product";

export const metadata: Metadata = {
  title: "Modular Solutions — Kitchens, Wardrobes & Storage | Modulas",
  description:
    "Design your perfect modular kitchen, wardrobe, or storage system with Modulas. " +
    "Engineered for Indian homes. Factory-direct pricing, 10-year warranty, free 3D design.",
  keywords: [
    "modular furniture India",
    "modular kitchen India",
    "modular wardrobe India",
    "modular storage solutions",
    "custom modular furniture Gurgaon",
    "modular solutions India",
  ],
  alternates: { canonical: "https://modulas.in/modular-solutions" },
  openGraph: {
    title:       "Modular Solutions — Kitchens, Wardrobes & Storage | Modulas",
    description: "Design your perfect modular kitchen, wardrobe, or storage. Engineered for Indian homes, 10-year warranty.",
    url:         "https://modulas.in/modular-solutions",
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */

const SOLUTIONS = [
  {
    slug:     "kitchens",
    label:    "Modular Kitchens",
    tagline:  "Cook in a kitchen\nbuilt for you.",
    body:     "From compact straight kitchens to expansive island configurations — every cabinet, drawer, and finish chosen by you. German hardware, soft-close everywhere, structural warranty for a decade.",
    href:     "/modular-solutions/kitchens",
    imageUrl: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1600",
    stats: [
      { label: "Layouts",  value: "6+"     },
      { label: "Finishes", value: "120+"   },
      { label: "Lead Time",value: "21 days"},
    ],
    links: [
      { label: "Straight Kitchen", href: "/modular-solutions/kitchens?layout=straight" },
      { label: "L-Shape",          href: "/modular-solutions/kitchens?layout=l-shape"  },
      { label: "U-Shape",          href: "/modular-solutions/kitchens?layout=u-shape"  },
      { label: "Island Kitchen",   href: "/modular-solutions/kitchens?layout=island"   },
    ],
  },
  {
    slug:     "wardrobes",
    label:    "Modular Wardrobes",
    tagline:  "Storage that works\nas hard as you do.",
    body:     "Sliding, hinged, walk-in, or loft — designed around your clothes, your space, and your budget. Every wardrobe is modular, so you can extend it as your life changes.",
    href:     "/modular-solutions/wardrobes",
    imageUrl: "https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg?auto=compress&cs=tinysrgb&w=1600",
    stats: [
      { label: "Door Styles",      value: "30+" },
      { label: "Interior Modules", value: "50+" },
      { label: "Lead Time",        value: "14 days" },
    ],
    links: [
      { label: "Sliding Door",     href: "/modular-solutions/wardrobes?type=sliding"  },
      { label: "Hinged Door",      href: "/modular-solutions/wardrobes?type=hinged"   },
      { label: "Walk-in Wardrobe", href: "/modular-solutions/wardrobes?type=walk-in"  },
      { label: "Kids Wardrobe",    href: "/modular-solutions/wardrobes?type=kids"     },
    ],
  },
  {
    slug:     "storage",
    label:    "Modular Storage",
    tagline:  "Every room,\nperfectly organised.",
    body:     "TV units, crockery cabinets, shoe racks, foyer storage, study shelving — built with the same modular precision as our kitchens and wardrobes. Configure, extend, rearrange.",
    href:     "/modular-solutions/storage",
    imageUrl: "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1600",
    stats: [
      { label: "Unit Types",      value: "12+"       },
      { label: "Configurations",  value: "Unlimited" },
      { label: "Lead Time",       value: "10 days"   },
    ],
    links: [
      { label: "TV & Media Units", href: "/modular-solutions/storage?type=tv"       },
      { label: "Crockery Units",   href: "/modular-solutions/storage?type=crockery" },
      { label: "Shoe Storage",     href: "/modular-solutions/storage?type=shoe"     },
      { label: "Study & Office",   href: "/modular-solutions/storage?type=study"    },
    ],
  },
];

const USE_CASES = [
  {
    label:    "Living Room",
    body:     "TV units, media consoles, and shelving that adapt as your collection grows.",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85",
    href:     "/modular-solutions/storage?type=tv",
    tag:      "Sofas & Storage",
  },
  {
    label:    "Home Office",
    body:     "Study systems, display shelving, and desk configurations for deep focus.",
    imageUrl: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=900&q=85",
    href:     "/modular-solutions/storage?type=study",
    tag:      "Workspaces",
  },
  {
    label:    "Master Bedroom",
    body:     "Walk-in wardrobes, bedside systems, and loft storage — every inch considered.",
    imageUrl: "https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg?auto=compress&cs=tinysrgb&w=900",
    href:     "/modular-solutions/wardrobes",
    tag:      "Wardrobes",
  },
  {
    label:    "Kitchen",
    body:     "Precision modular kitchens from compact L-shapes to grand island layouts.",
    imageUrl: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=900",
    href:     "/modular-solutions/kitchens",
    tag:      "Kitchens",
  },
];

const PROCESS_STEPS = [
  {
    step:  "01",
    title: "Book a Free Home Visit",
    body:  "Our designer comes to you — measures your space, understands your needs, and suggests the best configuration.",
  },
  {
    step:  "02",
    title: "3D Design Walkthrough",
    body:  "We create a photorealistic 3D render of your space. See exactly what you're getting before any work begins.",
  },
  {
    step:  "03",
    title: "Factory-Direct Manufacturing",
    body:  "Your order goes straight to our plant. No middlemen, no markup. Production starts within 48 hours.",
  },
  {
    step:  "04",
    title: "Professional Installation",
    body:  "Our trained crew installs everything in 1–3 days, cleans up, and walks you through every feature.",
  },
];

const BENEFITS = [
  { metric: "10yr",    label: "Structural warranty",      body: "Every cabinet, fitting, and joint — covered without question." },
  { metric: "120+",    label: "Finish combinations",      body: "Lacquered, laminate, veneer, glass — in any colour or texture you choose." },
  { metric: "48 hr",   label: "Production start time",    body: "Your job enters our factory floor within two working days of sign-off." },
  { metric: "850+",    label: "Homes completed",          body: "From Gurgaon penthouses to Chennai apartments and everything between." },
  { metric: "0",       label: "Middlemen",                body: "Factory-direct means you pay production cost, not dealer margin." },
  { metric: "100%",    label: "Modular — extend anytime", body: "Add a column, swap a finish, reconfigure a section. Your design stays current." },
];

const FEATURED_PRODUCTS: Product[] = [
  {
    id: "ms-1", sku: "MOD-GRD-001", slug: "grid-shelving-system",
    name: "Grid Shelving System",
    description: "Fully modular wall-mounted shelving in smoked solid oak. Configure shelves, drawers, and cabinet doors in any combination you need.",
    category: { id: "cat-storage", name: "Storage", slug: "storage" },
    price: 210000, currency: "INR",
    material: "Smoked Solid Oak", finish_options: ["Smoked Oak", "Natural Oak", "Painted Chalk"],
    dimensions: { width: 180, height: 210, depth: 32, unit: "cm" },
    is_configurable: true, is_featured: true, tags: [],
    lead_time_days: 35, rating: 4.8, review_count: 38,
    images: [
      { url: "https://images.unsplash.com/photo-1595347097560-69238724e7ad?w=800&q=85", is_primary: true, alt_text: "Grid Shelving System in Smoked Oak" },
    ],
  },
  {
    id: "ms-2", sku: "MOD-AVC-002", slug: "avec-modular-sofa",
    name: "Avec Modular Sofa",
    description: "A cloud-soft modular sofa in performance boucle over kiln-dried hardwood. Fully reconfigurable — add or remove modules as your space evolves.",
    category: { id: "cat-sofas", name: "Sofas", slug: "sofas" },
    price: 385000, compare_at_price: 480000, currency: "INR",
    material: "Boucle Fabric", finish_options: ["Oatmeal", "Slate", "Warm Sand"],
    dimensions: { width: 268, height: 80, depth: 102, unit: "cm" },
    is_configurable: true, is_featured: true, tags: ["bestseller"],
    lead_time_days: 28, rating: 4.9, review_count: 124,
    images: [
      { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85", is_primary: true, alt_text: "Avec Modular Sofa in Oatmeal Boucle" },
      { url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=85", is_primary: false, alt_text: "Avec Sofa — living room setting" },
    ],
  },
  {
    id: "ms-3", sku: "MOD-MLW-003", slug: "mellow-sectional",
    name: "Mellow Sectional",
    description: "A generous L-shape sectional in performance linen. Deep cushions, wide arms, completely reconfigurable. Built to last 25 years.",
    category: { id: "cat-sofas", name: "Sofas", slug: "sofas" },
    price: 640000, currency: "INR",
    material: "Performance Linen", finish_options: ["Natural Flax", "Stone", "Charcoal", "Terracotta"],
    dimensions: { width: 310, height: 82, depth: 160, unit: "cm" },
    is_configurable: true, is_featured: true, tags: ["new", "bestseller"],
    lead_time_days: 42, rating: 4.9, review_count: 41,
    images: [
      { url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=85", is_primary: true, alt_text: "Mellow Sectional in Natural Flax Linen" },
    ],
  },
  {
    id: "ms-4", sku: "MOD-GRD-004", slug: "grid-shelving-system-compact",
    name: "Grid Compact Shelving",
    description: "The Grid system in a compact 90cm width — perfect for a study alcove, bedroom corner, or hallway niche. Same modular logic, smaller footprint.",
    category: { id: "cat-storage", name: "Storage", slug: "storage" },
    price: 98000, currency: "INR",
    material: "Painted MDF & Steel", finish_options: ["Painted Chalk", "Matte Black", "Natural Oak"],
    dimensions: { width: 90, height: 180, depth: 32, unit: "cm" },
    is_configurable: true, is_featured: false, tags: [],
    lead_time_days: 21, rating: 4.6, review_count: 22,
    images: [
      { url: "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=800", is_primary: true, alt_text: "Grid Compact Shelving in Painted Chalk" },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */

export default function ModularSolutionsPage() {
  return (
    <>

      {/* ①  HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-charcoal-950 min-h-[88vh] flex flex-col justify-end">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.48]"
        />
        {/* Gradient: dark left for text + dark bottom for stats */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/90 via-charcoal-950/50 to-charcoal-950/10" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent"   aria-hidden />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 lg:px-12 pb-0 pt-32">
          <div className="max-w-2xl">
            <p className="mb-5 font-sans text-[11px] tracking-[0.35em] uppercase text-gold/80">
              Modular Solutions
            </p>
            <h1 className="font-serif text-display-xl text-cream leading-none mb-6 [text-shadow:0_3px_28px_rgba(0,0,0,0.95)]">
              Your home,<br />
              perfectly<br />
              <em className="not-italic text-gold">fitted.</em>
            </h1>
            <p className="font-sans text-[15px] text-cream/65 max-w-md leading-relaxed mb-10">
              Factory-built modular kitchens, wardrobes, and storage — designed around your exact space, manufactured to order, installed in days.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/book-consultation"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 font-medium hover:bg-gold-400 transition-colors shadow-[0_4px_28px_rgba(201,169,110,0.6)]"
              >
                Start Customising
                <ArrowRight />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-cream/25 bg-white/8 px-8 py-3.5 font-sans text-[12px] tracking-[0.15em] uppercase text-cream/80 backdrop-blur-sm hover:border-cream/50 hover:text-cream transition-all"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar — pinned to bottom of hero */}
        <div className="relative z-10 mt-16 border-t border-cream/8 bg-charcoal-950/60 backdrop-blur-md">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: "850+",   label: "Rooms Completed"    },
              { value: "120+",   label: "Finish Combinations"},
              { value: "10yr",   label: "Structural Warranty"},
              { value: "21 days",label: "Avg. Lead Time"     },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-serif text-2xl text-gold leading-none mb-1">{s.value}</p>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-cream/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ②  SOLUTIONS SHOWCASE ───────────────────────────────────────────── */}
      <section className="bg-white dark:bg-charcoal-950 py-24 lg:py-32" aria-labelledby="solutions-heading">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">

          <div className="mb-16 lg:mb-20">
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-4">
              What We Build
            </p>
            <h2
              id="solutions-heading"
              className="font-serif text-display-md text-charcoal dark:text-cream leading-tight"
            >
              Three systems.<br className="hidden lg:block" /> Infinite configurations.
            </h2>
          </div>

          <div className="space-y-28 lg:space-y-36">
            {SOLUTIONS.map((sol, i) => (
              <div
                key={sol.slug}
                id={sol.slug}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3] bg-cream dark:bg-charcoal-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sol.imageUrl}
                    alt={sol.label}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                  {/* Stats overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-charcoal-950/82 backdrop-blur-sm px-6 py-4 flex gap-8">
                    {sol.stats.map((s) => (
                      <div key={s.label}>
                        <p className="font-serif text-xl text-gold leading-none mb-1">{s.value}</p>
                        <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-cream/45">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-7">
                  <div>
                    <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
                      {sol.label}
                    </p>
                    <h2 className="font-serif text-display-sm text-charcoal dark:text-cream leading-tight whitespace-pre-line">
                      {sol.tagline}
                    </h2>
                  </div>
                  <p className="font-sans text-[14px] text-charcoal/60 dark:text-cream/55 leading-relaxed">
                    {sol.body}
                  </p>

                  {/* Layout/type pills */}
                  <div className="flex flex-wrap gap-2">
                    {sol.links.map((l) => (
                      <Link
                        key={l.label}
                        href={l.href}
                        className="inline-flex items-center rounded-full border border-black/12 dark:border-white/12 px-4 py-2 font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/55 dark:text-cream/55 hover:border-gold hover:text-gold dark:hover:border-gold dark:hover:text-gold transition-colors"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>

                  <Link
                    href={sol.href}
                    className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.18em] uppercase text-charcoal/50 dark:text-cream/50 hover:text-gold transition-colors border-b border-black/10 dark:border-white/10 hover:border-gold pb-0.5"
                  >
                    Explore {sol.label}
                    <ArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ③  USE CASES ─────────────────────────────────────────────────────── */}
      <section className="bg-cream dark:bg-charcoal-900 py-24 lg:py-32" aria-labelledby="use-cases-heading">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">

          <div className="mb-14 lg:mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-4">
                Designed For Every Space
              </p>
              <h2
                id="use-cases-heading"
                className="font-serif text-display-md text-charcoal dark:text-cream leading-tight"
              >
                Where will yours live?
              </h2>
            </div>
            <Link
              href="/products?is_configurable=true"
              className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.18em] uppercase text-charcoal/40 dark:text-cream/40 hover:text-gold transition-colors border-b border-black/10 dark:border-white/10 hover:border-gold pb-0.5 shrink-0"
            >
              Browse all modular
              <ArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
            {USE_CASES.map((uc) => (
              <Link
                key={uc.label}
                href={uc.href}
                className="group block overflow-hidden"
                aria-label={uc.label}
              >
                {/* Portrait image — 2:3 */}
                <div className="relative aspect-[2/3] overflow-hidden bg-charcoal-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={uc.imageUrl}
                    alt={uc.label}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/88 via-charcoal-950/20 to-transparent" />
                  {/* Hover darkening */}
                  <div className="absolute inset-0 bg-charcoal-950/0 group-hover:bg-charcoal-950/15 transition-colors duration-500" />

                  {/* Text pinned bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                    <p className="font-sans text-[9px] tracking-[0.28em] uppercase text-cream/45 mb-2">
                      {uc.tag}
                    </p>
                    <h3 className="font-serif text-xl text-cream leading-snug group-hover:text-gold transition-colors duration-300 lg:text-2xl">
                      {uc.label}
                    </h3>
                    <p className="font-sans text-[12px] text-cream/55 leading-snug mt-2 hidden lg:block">
                      {uc.body}
                    </p>
                  </div>
                </div>

                {/* CTA row */}
                <div className="flex items-center justify-between px-0.5 pt-3.5 pb-1">
                  <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/40 dark:text-cream/40 group-hover:text-gold transition-colors duration-200">
                    Explore
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                    className="text-charcoal/22 dark:text-cream/22 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
                {/* Gold underline */}
                <div className="h-px bg-black/6 dark:bg-white/6 overflow-hidden">
                  <div className="h-full w-0 bg-gold transition-all duration-500 group-hover:w-full" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ④  HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-charcoal-950 py-24 lg:py-32" aria-labelledby="process-heading">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">

          <div className="mb-16 lg:mb-20 grid lg:grid-cols-2 lg:gap-16 items-end">
            <div>
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-4">
                The Process
              </p>
              <h2
                id="process-heading"
                className="font-serif text-display-md text-charcoal dark:text-cream leading-tight"
              >
                From idea to installation<br className="hidden sm:block" /> in 4 steps.
              </h2>
            </div>
            <p className="font-sans text-sm text-charcoal/45 dark:text-cream/45 leading-relaxed lg:max-w-sm">
              Most of our projects are fully installed within 3–4 weeks of your first conversation. No surprises, no delays.
            </p>
          </div>

          {/* Steps — relative wrapper for the connector line */}
          <div className="relative">
            {/* Connecting line — desktop only */}
            <div className="hidden lg:block absolute top-[2.25rem] left-[calc(12.5%-2px)] right-[calc(12.5%-2px)] h-px bg-black/8 dark:bg-white/8" aria-hidden />

            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8" role="list">
              {PROCESS_STEPS.map((step) => (
                <li key={step.step} className="relative flex flex-col">
                  {/* Step number — acts as the connector node */}
                  <div className="relative z-10 mb-6">
                    <span className="inline-flex h-11 w-11 items-center justify-center border border-black/12 dark:border-white/12 bg-white dark:bg-charcoal-950 font-serif text-lg text-charcoal dark:text-cream">
                      {step.step}
                    </span>
                  </div>
                  {/* Large decorative number behind */}
                  <span
                    className="absolute -top-1 -left-1 font-serif text-[5rem] leading-none text-charcoal/4 dark:text-cream/4 select-none pointer-events-none"
                    aria-hidden
                  >
                    {step.step}
                  </span>
                  <h3 className="font-serif text-xl text-charcoal dark:text-cream mb-3 leading-snug">
                    {step.title}
                  </h3>
                  <p className="font-sans text-[13px] text-charcoal/50 dark:text-cream/50 leading-relaxed flex-1">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-14 flex flex-wrap gap-4">
            <Link
              href="/book-consultation"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-gold px-8 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
            >
              Book Free Home Visit
              <ArrowRight />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-black/15 dark:border-white/15 px-8 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal/70 dark:text-cream/70 hover:border-charcoal dark:hover:border-cream hover:text-charcoal dark:hover:text-cream transition-colors"
            >
              Full Process Detail
            </Link>
          </div>
        </div>
      </section>

      {/* ⑤  CONFIGURATOR HIGHLIGHT ───────────────────────────────────────── */}
      <section className="bg-charcoal-950 py-section overflow-hidden" aria-labelledby="configurator-heading">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left: copy */}
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="font-sans text-[11px] tracking-[0.35em] uppercase text-gold">
                  3D Configurator
                </p>
                <h2
                  id="configurator-heading"
                  className="font-serif text-display-md text-cream leading-tight"
                >
                  Design it exactly<br />as you imagined.
                </h2>
                <p className="font-sans text-sm text-cream/50 leading-relaxed max-w-md">
                  Our real-time 3D configurator lets you build your perfect kitchen, wardrobe, or storage system from scratch — choose every module, material, and dimension before placing the order.
                </p>
              </div>

              <ol className="space-y-5" aria-label="Configurator steps">
                {[
                  { n: "01", title: "Select your base unit",   body: "Choose the cabinet type and core dimensions." },
                  { n: "02", title: "Add modules & sections",  body: "Drawers, shelves, appliance bays, tall units." },
                  { n: "03", title: "Pick your finish",        body: "120+ lacquer, laminate, veneer and glass options." },
                  { n: "04", title: "Get your quote",          body: "Instant pricing with a detailed PDF to share." },
                ].map((step) => (
                  <li key={step.n} className="flex gap-5">
                    <span className="font-serif text-2xl text-gold/30 leading-none w-8 shrink-0 pt-0.5">
                      {step.n}
                    </span>
                    <div>
                      <h3 className="font-sans text-sm font-medium text-cream mb-0.5">{step.title}</h3>
                      <p className="font-sans text-sm text-cream/40 leading-relaxed">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/configurator"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-gold px-8 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-all active:scale-[0.98]"
                >
                  Design Your Setup
                  <ArrowRight />
                </Link>
                <Link
                  href="/workshops"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-cream/20 px-8 font-sans text-[12px] tracking-[0.15em] uppercase text-cream/70 hover:border-cream/50 hover:text-cream transition-all active:scale-[0.98]"
                >
                  Watch Tutorial
                </Link>
              </div>
            </div>

            {/* Right: kitchen module CSS art mockup */}
            <div className="relative aspect-square max-w-xl mx-auto w-full lg:max-w-none">
              <div className="absolute inset-0 bg-gold/5 blur-3xl scale-90" aria-hidden />
              <div className="relative h-full border border-cream/6 bg-charcoal-900 flex flex-col overflow-hidden">

                {/* Toolbar */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-cream/5">
                  <div className="flex items-center gap-2">
                    {["bg-[#c9a96e]","bg-[#5a4e3e]","bg-[#e8e0d4]","bg-[#2d2926]"].map((bg) => (
                      <div key={bg} className={`h-6 w-6 border-2 border-white/10 ${bg}`} />
                    ))}
                  </div>
                  <span className="rounded-full bg-black/40 px-3 py-1 font-sans text-[10px] tracking-[0.15em] uppercase text-cream/70">
                    L-Shape · Matte Sand
                  </span>
                </div>

                {/* Kitchen plan CSS art */}
                <div className="flex-1 flex items-center justify-center relative overflow-hidden p-6">
                  {/* Grid lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-[0.05]" viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" aria-hidden>
                    {[0,1,2,3,4,5,6,7].map((i) => <line key={`v${i}`} x1={50 * i} y1={0} x2={50 * i} y2={320} stroke="white" strokeWidth="0.5"/>)}
                    {[0,1,2,3,4,5,6].map((i) => <line key={`h${i}`} x1={0} y1={50 * i} x2={400} y2={50 * i} stroke="white" strokeWidth="0.5"/>)}
                  </svg>

                  {/* Kitchen SVG floor plan */}
                  <svg viewBox="0 0 320 260" className="w-full max-w-xs drop-shadow-2xl" fill="none" aria-label="Kitchen floor plan" role="img">
                    {/* Base cabinets — horizontal run */}
                    <rect x="20"  y="200" width="200" height="40" fill="#c9a96e" fillOpacity="0.9"/>
                    <rect x="20"  y="200" width="200" height="8"  fill="#ddb96a"/>
                    {[20,60,100,140,180].map((x) => <line key={x} x1={x+39} y1={200} x2={x+39} y2={240} stroke="#9e7d52" strokeWidth="1"/>)}
                    {/* Handles */}
                    {[20,60,100,140,180].map((x) => <rect key={x} x={x+12} y={219} width="14" height="3" rx="1.5" fill="#9e7d52"/>)}

                    {/* Vertical run — L-shape */}
                    <rect x="260" y="20"  width="40" height="200" fill="#c9a96e" fillOpacity="0.9"/>
                    <rect x="260" y="20"  width="8"  height="200" fill="#ddb96a"/>
                    {[20,60,100,140].map((y) => <line key={y} x1={260} y1={y+39} x2={300} y2={y+39} stroke="#9e7d52" strokeWidth="1"/>)}
                    {[20,60,100,140].map((y) => <rect key={y} x={278} y={y+12} width="3" height="14" rx="1.5" fill="#9e7d52"/>)}

                    {/* Counter top */}
                    <rect x="20"  y="195" width="200" height="8" fill="#e8d4b2" fillOpacity="0.6"/>
                    <rect x="257" y="20"  width="8"  height="200" fill="#e8d4b2" fillOpacity="0.6"/>

                    {/* Sink */}
                    <rect x="55" y="198" width="50" height="16" rx="1" fill="#b8a080" fillOpacity="0.5"/>
                    <circle cx="80" cy="206" r="4" fill="none" stroke="#9e7d52" strokeWidth="1"/>

                    {/* Hob */}
                    <rect x="130" y="197" width="55" height="18" rx="1" fill="#3a3028" fillOpacity="0.6"/>
                    {[[145,204],[157,204],[145,212],[157,212]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="4" stroke="#c9a96e" strokeWidth="0.8" fill="none"/>)}

                    {/* Wall cabinets hint */}
                    <rect x="22" y="160" width="195" height="28" fill="#d4b882" fillOpacity="0.2" stroke="#c9a96e" strokeWidth="0.5" strokeDasharray="4 3"/>
                    <rect x="262" y="22"  width="34"  height="155" fill="#d4b882" fillOpacity="0.2" stroke="#c9a96e" strokeWidth="0.5" strokeDasharray="4 3"/>

                    {/* Corner junction */}
                    <rect x="220" y="200" width="40" height="40" fill="#c9a96e" fillOpacity="0.7"/>

                    {/* Dimension annotation */}
                    <line x1="20" y1="250" x2="220" y2="250" stroke="#c9a96e" strokeWidth="0.6" strokeOpacity="0.4" strokeDasharray="3 2"/>
                    <text x="120" y="259" textAnchor="middle" fill="#c9a96e" fillOpacity="0.5" fontSize="7" fontFamily="sans-serif">3,200 mm</text>
                    <line x1="310" y1="20" x2="310" y2="220" stroke="#c9a96e" strokeWidth="0.6" strokeOpacity="0.4" strokeDasharray="3 2"/>
                    <text x="318" y="125" textAnchor="middle" fill="#c9a96e" fillOpacity="0.5" fontSize="7" fontFamily="sans-serif" transform="rotate(90 318 125)">2,400 mm</text>
                  </svg>

                  {/* Overlay labels */}
                  <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm px-2.5 py-1.5">
                    <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-cream/40 mb-0.5">Layout</p>
                    <p className="font-sans text-[11px] text-gold font-medium">L-Shape · 3.2 × 2.4m</p>
                  </div>
                  <div className="absolute bottom-4 left-4 flex gap-1.5">
                    {[1,2,3,4].map((s) => (
                      <div key={s} className={`h-1 transition-all ${s === 3 ? "w-6 bg-gold" : "w-2 bg-cream/20"}`} />
                    ))}
                  </div>
                </div>

                {/* Price bar */}
                <div className="border-t border-cream/5 bg-charcoal-950/60 backdrop-blur-md px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-cream/40 mb-0.5">Your configuration</p>
                    <p className="font-serif text-2xl text-cream">₹3,20,000</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="rounded-full bg-gold/12 border border-gold/22 px-3 py-1.5 font-sans text-[10px] uppercase tracking-wider text-gold">
                      Save Design
                    </div>
                    <div className="rounded-full bg-gold px-4 py-1.5 font-sans text-[10px] uppercase tracking-wider text-charcoal-950 font-medium">
                      Get Quote
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⑥  BENEFITS ─────────────────────────────────────────────────────── */}
      <section className="bg-cream dark:bg-charcoal-900 py-24 lg:py-32" aria-labelledby="benefits-heading">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">

          <div className="mb-16 lg:mb-20 grid lg:grid-cols-2 items-end gap-8">
            <div>
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-4">
                Why Modulas
              </p>
              <h2
                id="benefits-heading"
                className="font-serif text-display-md text-charcoal dark:text-cream leading-tight"
              >
                Factory-direct.<br />No compromises.
              </h2>
            </div>
            <p className="font-sans text-sm text-charcoal/45 dark:text-cream/45 leading-relaxed lg:max-w-sm">
              We design, manufacture, and install everything ourselves. No dealers, no markups, no subcontractors passing the blame.
            </p>
          </div>

          <div className="grid grid-cols-1 divide-y divide-black/8 dark:divide-white/8 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3 lg:divide-x">
            {BENEFITS.map((b, i) => (
              <div key={b.label} className={`py-10 space-y-3 ${i % 2 === 0 ? "sm:pr-12" : "sm:pl-12 lg:pl-0"} ${i >= 2 ? "lg:pl-12" : ""} lg:px-12 lg:first:pl-0 lg:last:pr-0`}>
                <p className="font-serif text-[3.5rem] leading-none text-gold/40 tabular-nums select-none">
                  {b.metric}
                </p>
                <h3 className="font-serif text-lg text-charcoal dark:text-cream leading-snug">
                  {b.label}
                </h3>
                <p className="font-sans text-[13px] text-charcoal/50 dark:text-cream/50 leading-relaxed">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑦  FEATURED MODULAR PRODUCTS ────────────────────────────────────── */}
      <section className="bg-white dark:bg-charcoal-950 py-24 lg:py-32" aria-labelledby="products-heading">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 space-y-10">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-4">
                Configurable Pieces
              </p>
              <h2
                id="products-heading"
                className="font-serif text-display-md text-charcoal dark:text-cream leading-tight"
              >
                Build it your way.
              </h2>
              <p className="font-sans text-sm text-charcoal/55 dark:text-cream/55 leading-relaxed mt-3 max-w-md">
                Every piece in this selection ships with our 3D configurator — customise dimensions, materials, and finishes before you order.
              </p>
            </div>
            <Link
              href="/products?is_configurable=true"
              className="inline-flex items-center gap-2 shrink-0 font-sans text-[11px] tracking-[0.18em] uppercase text-charcoal/40 dark:text-cream/40 hover:text-gold transition-colors border-b border-black/10 dark:border-white/10 hover:border-gold pb-0.5"
            >
              View all configurable
              <ArrowRight />
            </Link>
          </div>

          <ul role="list" className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {FEATURED_PRODUCTS.map((product, i) => (
              <li key={product.id}>
                <ProductCard product={product} priority={i < 2} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ⑧  FOOTER CTA ───────────────────────────────────────────────────── */}
      <section className="relative bg-charcoal-950 py-section overflow-hidden" aria-labelledby="footer-cta-heading">
        {/* Subtle background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-[0.12]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/60 to-charcoal-950/90" aria-hidden />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12 text-center">
          <p className="mb-5 font-sans text-[11px] tracking-[0.35em] uppercase text-gold/70">
            Free. No obligation.
          </p>
          <h2
            id="footer-cta-heading"
            className="font-serif text-display-lg text-cream mb-5 leading-tight"
          >
            Build your space today.
          </h2>
          <p className="font-sans text-[15px] text-cream/50 max-w-lg mx-auto mb-12 leading-relaxed">
            Book a free home visit. Our designer comes to you, measures your space, and creates a 3D plan — completely free, zero obligation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/book-consultation"
              className="inline-flex h-13 items-center gap-2 rounded-full bg-gold px-10 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 font-medium hover:bg-gold-400 transition-colors shadow-[0_4px_32px_rgba(201,169,110,0.5)]"
            >
              Book Free Home Visit
              <ArrowRight />
            </Link>
            <Link
              href="/products"
              className="inline-flex h-13 items-center gap-2 rounded-full border border-cream/20 px-10 font-sans text-[12px] tracking-[0.15em] uppercase text-cream/70 hover:border-cream/50 hover:text-cream transition-all"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}

/* ── Shared icon ────────────────────────────────────────────────────────── */
function ArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
