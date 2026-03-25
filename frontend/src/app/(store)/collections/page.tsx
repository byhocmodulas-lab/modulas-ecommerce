import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections — Curated Furniture Edits | Modulas",
  description:
    "Explore Modulas signature collections — Modern Living, Luxury Residence, Compact Home, Studio Apartment, and more. Curated furniture edits for every style.",
  openGraph: {
    title: "Collections — Curated Furniture Edits | Modulas",
    description:
      "Each collection built around a design language, a lifestyle, and a way of living.",
    images: [
      {
        url: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1200",
        width: 1200,
        height: 630,
      },
    ],
  },
};

/* ── Data ──────────────────────────────────────────────────────────── */

interface FeaturedProduct {
  name:     string;
  price:    string;
  imageUrl: string;
  href:     string;
}

interface Collection {
  slug:              string;
  label:             string;
  tagline:           string;
  philosophy:        string;
  body:              string;
  imageUrl:          string;
  accent:            string;
  materials:         string[];
  pieces:            number;
  featuredProducts?: FeaturedProduct[];
}

const COLLECTIONS: Collection[] = [
  {
    slug:        "modern-living",
    label:       "Modern Living",
    tagline:     "Clean lines. Warm materials.",
    philosophy:  "A collection that believes beauty lives in restraint.",
    body:        "Contemporary furniture for the modern Indian home — solid sheesham, warm neutrals, and forms that are simple but never plain.",
    imageUrl:    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=85",
    accent:      "Sheesham · Linen · Marble",
    materials:   ["Sheesham", "Linen", "Marble", "Natural Oak"],
    pieces:      24,
    featuredProducts: [
      { name: "Avec Modular Sofa",   price: "₹3,85,000", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",                                         href: "/products/avec-modular-sofa" },
      { name: "Arc Coffee Table",    price: "₹1,24,000", imageUrl: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=600",             href: "/products/arc-coffee-table" },
      { name: "Span Bookshelf",      price: "₹98,000",   imageUrl: "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600",              href: "/products/span-bookshelf" },
      { name: "Noir Floor Lamp",     price: "₹52,000",   imageUrl: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600",              href: "/products/noir-floor-lamp" },
    ],
  },
  {
    slug:        "luxury-residence",
    label:       "Luxury Residence",
    tagline:     "The art of living well.",
    philosophy:  "For those who understand that true luxury is quiet.",
    body:        "Premium materials, museum-quality craft. Walnut veneers, full-grain leather, hand-woven fabrics. For those who refuse to compromise.",
    imageUrl:    "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1200",
    accent:      "Walnut · Leather · Brass",
    materials:   ["Walnut", "Full-grain Leather", "Brushed Brass", "Boucle"],
    pieces:      18,
    featuredProducts: [
      { name: "Cate Dining Chair",   price: "₹1,28,000", imageUrl: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=600",            href: "/products/cate-dining-chair" },
      { name: "Span Dining Table",   price: "₹4,20,000", imageUrl: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=600",            href: "/products/span-dining-table" },
      { name: "Ribbon Pendant",      price: "₹38,000",   imageUrl: "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=600",            href: "/products/ribbon-pendant" },
      { name: "Heritage Sideboard",  price: "₹2,85,000", imageUrl: "https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=600",           href: "/products/heritage-sideboard" },
    ],
  },
  {
    slug:       "compact-home",
    label:      "Compact Home",
    tagline:    "Small space. Big life.",
    philosophy: "Every centimetre earns its place.",
    body:       "Space-smart furniture for 1 and 2 BHK apartments. Multi-functional, storage-integrated, and designed to make compact spaces feel generous.",
    imageUrl:   "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1200",
    accent:     "Light Oak · White · Compact",
    materials:  ["Light Oak", "White Lacquer", "Cane", "Cotton"],
    pieces:     20,
  },
  {
    slug:       "studio-apartment",
    label:      "Studio Apartment",
    tagline:    "One room, infinite possibilities.",
    philosophy: "Small footprint. Full life.",
    body:       "Furniture engineered for studio living. Modular, multi-purpose, and light — everything pulls double duty without feeling cramped.",
    imageUrl:   "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200",
    accent:     "Beige · Natural Wood · Minimal",
    materials:  ["Beige Linen", "Natural Pine", "Glass", "Steel"],
    pieces:     16,
  },
  {
    slug:       "hospitality",
    label:      "Hospitality",
    tagline:    "Spaces that impress.",
    philosophy: "Contract-grade craft. Residential heart.",
    body:       "Contract-grade furniture and modular solutions for hotels, offices, co-living, and commercial interiors. Bulk pricing available.",
    imageUrl:   "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1200",
    accent:     "Contract Grade · Bulk Orders",
    materials:  ["Commercial Fabric", "Steel", "Engineered Wood", "Vinyl"],
    pieces:     30,
  },
  {
    slug:       "signature",
    label:      "Signature Edit",
    tagline:    "Modulas at its finest.",
    philosophy: "Limited production. Exceptional craft. Permanent memory.",
    body:       "Our most iconic designs — the pieces that define what Modulas stands for. Limited production, exceptional craft.",
    imageUrl:   "https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=1800",
    accent:     "Limited · Handcrafted · Iconic",
    materials:  ["Calacatta Marble", "Solid Walnut", "Hand-forged Steel", "Bespoke"],
    pieces:     12,
  },
];

/* Split for sections */
const PRIMARY_FEATURED   = COLLECTIONS[1]; // Luxury Residence — full detail treatment
const SECONDARY_FEATURED = COLLECTIONS[0]; // Modern Living — inverted detail treatment
const EXPLORE_MORE       = COLLECTIONS.slice(2); // 4 compact cards

/* ── Page ──────────────────────────────────────────────────────────── */

export default function CollectionsPage() {
  return (
    <>
      {/* ① HERO ────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-charcoal-950 min-h-[90vh] flex flex-col justify-end"
        aria-labelledby="collections-hero-heading"
      >
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1800"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.42]"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/98 via-charcoal-950/40 to-transparent" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/75 via-transparent to-transparent" aria-hidden="true" />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 lg:px-12 pb-16 pt-40">

          <div className="max-w-3xl">
            <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold mb-5">
              Curated
            </p>
            <h1
              id="collections-hero-heading"
              className="font-serif text-5xl text-cream leading-[1.05] lg:text-7xl xl:text-8xl"
            >
              Every Collection,<br />a World.
            </h1>
            <p className="mt-6 font-sans text-[15px] text-cream/45 leading-relaxed max-w-lg">
              Each collection is built around a design language, a way of living,
              and the conviction that the objects around you shape the life you lead.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="#collections-grid"
                className="inline-flex h-12 items-center gap-3 bg-gold px-8 font-sans text-[11px] tracking-[0.18em] uppercase text-charcoal-950 hover:bg-cream transition-colors duration-200"
              >
                Explore Collections
                <ArrowRight size={11} />
              </Link>
              <Link
                href="/book-consultation"
                className="inline-flex h-12 items-center gap-3 border border-white/20 px-8 font-sans text-[11px] tracking-[0.18em] uppercase text-cream/65 hover:border-cream/50 hover:text-cream transition-colors duration-200"
              >
                Book Free Consultation
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/8 pt-10 sm:flex sm:flex-wrap sm:gap-14">
            {[
              { value: "6",     label: "Collections" },
              { value: "120+",  label: "Curated pieces" },
              { value: "100%",  label: "Customisable" },
              { value: "Free",  label: "Design consultation" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-serif text-2xl text-cream">{s.value}</p>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-cream/30 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ② COLLECTION MOSAIC GRID ─────────────────────────────────── */}
      <section
        id="collections-grid"
        className="bg-white dark:bg-charcoal-950 py-20 lg:py-28"
        aria-labelledby="collections-grid-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">

          {/* Section header */}
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-3">
                The Edits
              </p>
              <h2
                id="collections-grid-heading"
                className="font-serif text-4xl text-charcoal dark:text-cream lg:text-5xl"
              >
                The Collections.
              </h2>
            </div>
            <p className="font-sans text-sm text-charcoal/40 dark:text-cream/40 max-w-sm leading-relaxed">
              Six distinct design worlds. Each one a complete vision — from
              materials to silhouettes to the life it creates around you.
            </p>
          </div>

          {/* ── Editorial mosaic: 6 cards ── */}
          <div className="space-y-3">

            {/* Row 1: 2/3 landscape + 1/3 portrait */}
            <div className="grid lg:grid-cols-3 gap-3">
              <div className="lg:col-span-2">
                <CollectionCard col={COLLECTIONS[0]} size="large" />
              </div>
              <CollectionCard col={COLLECTIONS[1]} size="portrait" />
            </div>

            {/* Row 2: 3 equal compact portrait cards */}
            <div className="grid sm:grid-cols-3 gap-3">
              <CollectionCard col={COLLECTIONS[2]} size="compact" />
              <CollectionCard col={COLLECTIONS[3]} size="compact" />
              <CollectionCard col={COLLECTIONS[4]} size="compact" />
            </div>

            {/* Row 3: full-width cinematic — Signature Edit */}
            <CollectionCard col={COLLECTIONS[5]} size="cinematic" />
          </div>
        </div>
      </section>

      {/* ③ FEATURED COLLECTION DETAIL — Luxury Residence ─────────── */}
      <FeaturedDetail
        collection={PRIMARY_FEATURED}
        imageLeft
        label="Featured Collection"
        sectionId="featured-luxury"
      />

      {/* ④ SECOND FEATURED — Modern Living (inverted) ─────────────── */}
      <FeaturedDetail
        collection={SECONDARY_FEATURED}
        imageLeft={false}
        label="The Everyday Edit"
        sectionId="featured-modern"
        bg="bg-cream dark:bg-charcoal-900"
      />

      {/* ⑤ EXPLORE MORE ─────────────────────────────────────────── */}
      <section
        className="bg-white dark:bg-charcoal-950 py-20 lg:py-28"
        aria-labelledby="explore-more-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">

          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-3">
                More Worlds
              </p>
              <h2
                id="explore-more-heading"
                className="font-serif text-4xl text-charcoal dark:text-cream lg:text-5xl"
              >
                Explore More.
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.18em] uppercase text-charcoal/40 dark:text-cream/40 hover:text-gold transition-colors border-b border-black/10 dark:border-white/10 hover:border-gold pb-0.5"
            >
              Browse all products
              <ArrowRight size={10} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {EXPLORE_MORE.map((col) => (
              <ExploreCard key={col.slug} col={col} />
            ))}
          </div>
        </div>
      </section>

      {/* ⑥ BESPOKE CTA ─────────────────────────────────────────────── */}
      <section
        className="relative bg-charcoal-950 overflow-hidden"
        aria-labelledby="collections-cta-heading"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1800&q=85"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.08]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-charcoal-950/90 to-charcoal-950/60"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12 py-section">
          {/* Header */}
          <div className="mb-16 max-w-xl">
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-4">
              Bespoke
            </p>
            <h2
              id="collections-cta-heading"
              className="font-serif text-4xl text-cream lg:text-5xl"
            >
              Collections are starting<br />points — not constraints.
            </h2>
            <p className="mt-4 font-sans text-[14px] text-cream/40 leading-relaxed max-w-md">
              Every piece in every collection can be ordered in your choice of
              wood, fabric, finish, or dimension.
            </p>
          </div>

          {/* 3-column service grid */}
          <div className="grid gap-px bg-white/6 lg:grid-cols-3">
            {[
              {
                num:  "01",
                label: "Choose your collection",
                body:  "Start with a curated edit that matches your design language, then make every piece your own.",
                cta:   "Browse collections",
                href:  "#collections-grid",
              },
              {
                num:  "02",
                label: "Configure each piece",
                body:  "Our 3D configurator lets you change wood species, fabric, finish, and dimensions in real time.",
                cta:   "Open configurator",
                href:  "/configurator",
              },
              {
                num:  "03",
                label: "Book a free visit",
                body:  "A Modulas designer visits your home, takes measurements, and builds the final proposal with you.",
                cta:   "Book free visit",
                href:  "/book-consultation",
              },
            ].map((item) => (
              <div key={item.label} className="group flex flex-col gap-5 bg-charcoal-950 p-8 lg:p-10">
                <span
                  className="font-serif text-[4.5rem] leading-none text-cream/5 tabular-nums select-none"
                  aria-hidden="true"
                >
                  {item.num}
                </span>
                <div className="flex-1 space-y-3">
                  <h3 className="font-serif text-xl text-cream leading-snug">{item.label}</h3>
                  <p className="font-sans text-[13px] text-cream/38 leading-relaxed">{item.body}</p>
                </div>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 self-start border-b border-transparent font-sans text-[10px] tracking-[0.22em] uppercase text-cream/30 pb-0.5 hover:text-gold hover:border-gold transition-colors duration-200"
                >
                  {item.cta}
                  <ArrowRight size={9} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Featured Collection Detail ────────────────────────────────────── */

function FeaturedDetail({
  collection,
  imageLeft,
  label,
  sectionId,
  bg = "bg-white dark:bg-charcoal-950",
}: {
  collection: Collection;
  imageLeft:  boolean;
  label:      string;
  sectionId:  string;
  bg?:        string;
}) {
  return (
    <section
      className={bg}
      aria-labelledby={`${sectionId}-heading`}
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid lg:grid-cols-5">

          {/* Image pane — moves to right when imageLeft={false} */}
          <div
            className={[
              "lg:col-span-3 relative overflow-hidden bg-charcoal-800",
              imageLeft ? "" : "lg:order-last",
            ].join(" ")}
          >
            <div className="aspect-[3/4] lg:aspect-auto lg:min-h-[680px] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={collection.imageUrl}
                alt={collection.label}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Subtle gradient for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/30 via-transparent to-charcoal-950/50" aria-hidden="true" />

              {/* Label overlay — top left */}
              <div className="absolute top-6 left-6">
                <span className="inline-block bg-gold px-3 py-1.5 font-sans text-[9px] tracking-[0.25em] uppercase text-charcoal-950">
                  {label}
                </span>
              </div>

              {/* Piece count — bottom left */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <p className="font-serif text-3xl text-cream leading-none">{collection.pieces}</p>
                  <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-cream/45 mt-1">Pieces</p>
                </div>
                <Link
                  href={`/collections/${collection.slug}`}
                  className="inline-flex items-center gap-2 bg-charcoal-950/80 backdrop-blur-sm px-5 py-2.5 font-sans text-[10px] tracking-[0.18em] uppercase text-cream/70 hover:bg-gold hover:text-charcoal-950 transition-colors duration-200"
                >
                  Shop the Edit
                  <ArrowRight size={9} />
                </Link>
              </div>
            </div>
          </div>

          {/* Content pane */}
          <div className="lg:col-span-2 flex flex-col justify-center px-8 py-14 lg:px-12 lg:py-20 xl:px-16">
            <div className="max-w-md">

              {/* Label */}
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-4">
                {collection.label}
              </p>

              {/* Tagline */}
              <h2
                id={`${sectionId}-heading`}
                className="font-serif text-3xl text-charcoal dark:text-cream lg:text-4xl leading-snug"
              >
                {collection.tagline}
              </h2>

              {/* Philosophy — italic serif quote */}
              <p className="mt-4 font-serif italic text-lg text-charcoal/40 dark:text-cream/35 leading-relaxed">
                &ldquo;{collection.philosophy}&rdquo;
              </p>

              {/* Body */}
              <p className="mt-5 font-sans text-[14px] text-charcoal/55 dark:text-cream/50 leading-relaxed">
                {collection.body}
              </p>

              {/* Material tags */}
              <div className="mt-7 flex flex-wrap gap-2">
                {collection.materials.map((mat) => (
                  <span
                    key={mat}
                    className="border border-black/12 dark:border-white/12 px-3 py-1.5 font-sans text-[10px] tracking-[0.1em] uppercase text-charcoal/50 dark:text-cream/50"
                  >
                    {mat}
                  </span>
                ))}
              </div>

              {/* Product preview thumbnails */}
              {collection.featuredProducts && (
                <div className="mt-10">
                  <p className="font-sans text-[9px] tracking-[0.28em] uppercase text-charcoal/30 dark:text-cream/30 mb-4">
                    From this collection
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {collection.featuredProducts.map((product) => (
                      <Link
                        key={product.href}
                        href={product.href}
                        className="group/thumb flex flex-col gap-1.5"
                        title={product.name}
                      >
                        <div className="relative aspect-square overflow-hidden bg-cream dark:bg-charcoal-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover/thumb:scale-[1.08]"
                          />
                        </div>
                        <p className="font-sans text-[9px] text-charcoal/45 dark:text-cream/40 leading-tight line-clamp-2 group-hover/thumb:text-gold transition-colors duration-200">
                          {product.name}
                        </p>
                        <p className="font-sans text-[9px] text-charcoal/60 dark:text-cream/55 font-medium">
                          {product.price}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA row */}
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href={`/collections/${collection.slug}`}
                  className="inline-flex h-11 items-center gap-3 bg-charcoal-950 dark:bg-cream px-7 font-sans text-[11px] tracking-[0.18em] uppercase text-cream dark:text-charcoal-950 hover:bg-gold dark:hover:bg-gold dark:hover:text-charcoal-950 transition-colors duration-200"
                >
                  Shop the Edit — {collection.pieces} pieces
                </Link>
                <Link
                  href="/book-consultation"
                  className="inline-flex h-11 items-center gap-3 border border-black/15 dark:border-white/15 px-7 font-sans text-[11px] tracking-[0.18em] uppercase text-charcoal/60 dark:text-cream/60 hover:border-charcoal dark:hover:border-cream hover:text-charcoal dark:hover:text-cream transition-colors duration-200"
                >
                  Get a design consultation
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ── Collection mosaic card ─────────────────────────────────────────── */

type CardSize = "large" | "portrait" | "compact" | "cinematic";

const CARD_ASPECT: Record<CardSize, string> = {
  large:     "aspect-[4/3]",
  portrait:  "aspect-[3/4]",
  compact:   "aspect-[3/4] sm:aspect-[4/5]",
  cinematic: "aspect-[21/9] lg:aspect-[3/1]",
};

function CollectionCard({ col, size }: { col: Collection; size: CardSize }) {
  const isCompact   = size === "compact";
  const isCinematic = size === "cinematic";

  return (
    <Link
      href={`/collections/${col.slug}`}
      className={`group relative block overflow-hidden bg-charcoal-800 ${CARD_ASPECT[size]}`}
      aria-label={`${col.label} — ${col.tagline}`}
    >
      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={col.imageUrl}
        alt={col.label}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/15 to-transparent" aria-hidden="true" />

      {/* Hover darkening */}
      <div
        className="absolute inset-0 bg-charcoal-950/0 group-hover:bg-charcoal-950/20 transition-colors duration-500"
        aria-hidden="true"
      />

      {/* Content — pinned bottom-left */}
      <div
        className={[
          "absolute inset-x-0 bottom-0",
          isCinematic ? "p-8 lg:p-12" : isCompact ? "p-4 lg:p-5" : "p-6 lg:p-8",
        ].join(" ")}
      >
        <p
          className={[
            "font-sans tracking-[0.3em] uppercase text-gold mb-2",
            isCompact ? "text-[8px]" : "text-[10px]",
          ].join(" ")}
        >
          {col.label}
        </p>
        <h3
          className={[
            "font-serif text-cream group-hover:text-gold transition-colors duration-300 leading-snug",
            isCinematic ? "text-3xl lg:text-5xl" : isCompact ? "text-base" : "text-2xl lg:text-3xl",
          ].join(" ")}
        >
          {col.tagline}
        </h3>

        {/* Accent + pieces — hide on compact */}
        {!isCompact && (
          <div className="mt-3 flex items-center gap-4 opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <p className="font-sans text-[10px] text-cream/45">{col.accent}</p>
            <span className="h-px w-4 bg-cream/20" aria-hidden="true" />
            <p className="font-sans text-[10px] text-cream/45">{col.pieces} pieces</p>
          </div>
        )}
      </div>

      {/* Shop badge — appears on hover, top-left */}
      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="inline-flex items-center gap-1.5 bg-gold px-3 py-1.5 font-sans text-[9px] tracking-[0.18em] uppercase text-charcoal-950">
          Explore
          <ArrowRight size={8} />
        </span>
      </div>

      {/* Philosophy — cinematic only, centered */}
      {isCinematic && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <p className="font-serif italic text-xl text-cream/55 text-center max-w-md px-8">
            &ldquo;{col.philosophy}&rdquo;
          </p>
        </div>
      )}
    </Link>
  );
}

/* ── Explore More card (compact, editorial) ─────────────────────────── */

function ExploreCard({ col }: { col: Collection }) {
  return (
    <Link
      href={`/collections/${col.slug}`}
      className="group flex flex-col overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={col.imageUrl}
          alt={col.label}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent" aria-hidden="true" />

        {/* Quick-view pill on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="inline-flex items-center gap-2 bg-white/95 dark:bg-charcoal-950/90 px-4 py-2.5 font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal dark:text-cream">
            View collection
            <ArrowRight size={9} />
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 pb-3 flex flex-col gap-1.5">
        <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-gold">
          {col.label}
        </p>
        <h3 className="font-serif text-lg text-charcoal dark:text-cream leading-snug group-hover:text-gold transition-colors duration-200">
          {col.tagline}
        </h3>
        <p className="font-sans text-[12px] text-charcoal/40 dark:text-cream/40 italic">
          {col.philosophy}
        </p>
        <p className="font-sans text-[11px] text-charcoal/30 dark:text-cream/30 mt-1">
          {col.pieces} pieces &middot; {col.accent}
        </p>
      </div>

      {/* Gold underline wipe */}
      <div className="h-px bg-black/6 dark:bg-white/6 overflow-hidden mt-auto">
        <div className="h-full w-0 bg-gold transition-all duration-500 group-hover:w-full" />
      </div>
    </Link>
  );
}

/* ── Shared icon ────────────────────────────────────────────────────── */

function ArrowRight({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
