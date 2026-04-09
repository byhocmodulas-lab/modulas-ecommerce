import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

/* ── Shared collection data (mirrors collections/page.tsx) ─────────── */

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
    imageUrl:    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=85",
    accent:      "Sheesham · Linen · Marble",
    materials:   ["Sheesham", "Linen", "Marble", "Natural Oak"],
    pieces:      24,
    featuredProducts: [
      { name: "Avec Modular Sofa",  price: "₹3,85,000", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",                                        href: "/products/luxe-verona-3-seater-sofa" },
      { name: "Arc Coffee Table",   price: "₹1,24,000", imageUrl: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=600",            href: "/products/arc-coffee-table" },
      { name: "Span Bookshelf",     price: "₹98,000",   imageUrl: "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600",             href: "/products/span-bookshelf" },
      { name: "Noir Floor Lamp",    price: "₹52,000",   imageUrl: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600",             href: "/products/noir-floor-lamp" },
    ],
  },
  {
    slug:        "luxury-residence",
    label:       "Luxury Residence",
    tagline:     "The art of living well.",
    philosophy:  "For those who understand that true luxury is quiet.",
    body:        "Premium materials, museum-quality craft. Walnut veneers, full-grain leather, hand-woven fabrics. For those who refuse to compromise.",
    imageUrl:    "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1600",
    accent:      "Walnut · Leather · Brass",
    materials:   ["Walnut", "Full-grain Leather", "Brushed Brass", "Boucle"],
    pieces:      18,
    featuredProducts: [
      { name: "Cate Dining Chair",  price: "₹1,28,000", imageUrl: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=600",           href: "/products/cate-dining-chair" },
      { name: "Span Dining Table",  price: "₹4,20,000", imageUrl: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=600",           href: "/products/span-dining-table" },
      { name: "Ribbon Pendant",     price: "₹38,000",   imageUrl: "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=600",           href: "/products/ribbon-pendant" },
      { name: "Heritage Sideboard", price: "₹2,85,000", imageUrl: "https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=600",          href: "/products/heritage-sideboard" },
    ],
  },
  {
    slug:       "compact-home",
    label:      "Compact Home",
    tagline:    "Small space. Big life.",
    philosophy: "Every centimetre earns its place.",
    body:       "Space-smart furniture for 1 and 2 BHK apartments. Multi-functional, storage-integrated, and designed to make compact spaces feel generous.",
    imageUrl:   "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1600",
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
    imageUrl:   "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1600",
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
    imageUrl:   "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1600",
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

const COLLECTION_MAP = Object.fromEntries(COLLECTIONS.map((c) => [c.slug, c]));

/* ── Route ──────────────────────────────────────────────────────────── */

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const col = COLLECTION_MAP[slug];
  if (!col) return { title: "Collection Not Found" };
  return {
    title: `${col.label} Collection — Modulas`,
    description: col.body,
    openGraph: {
      title: `${col.label} — ${col.tagline}`,
      description: col.body,
      images: [{ url: col.imageUrl, width: 1200, height: 630 }],
    },
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const col = COLLECTION_MAP[slug];
  if (!col) notFound();

  const others = COLLECTIONS.filter((c) => c.slug !== slug).slice(0, 3);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-charcoal-950 min-h-[70vh] flex items-end">
        <img
          src={col.imageUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/60 to-transparent" />

        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12 pb-20 pt-40 w-full">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-cream/25">
            <Link href="/collections" className="hover:text-gold transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-cream/50">{col.label}</span>
          </nav>

          <p className="mb-3 font-sans text-[11px] tracking-[0.35em] uppercase text-gold">
            {col.label}
          </p>
          <h1 className="font-serif text-5xl text-cream md:text-7xl mb-4 max-w-3xl leading-[1.05]">
            {col.tagline}
          </h1>
          <p className="font-serif italic text-xl text-cream/35 mb-6 max-w-xl">
            &ldquo;{col.philosophy}&rdquo;
          </p>
          <p className="font-sans text-[15px] text-cream/50 max-w-lg leading-relaxed mb-10">
            {col.body}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-8 mb-10">
            <div>
              <p className="font-serif text-3xl text-cream leading-none">{col.pieces}</p>
              <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-cream/30 mt-1">Pieces</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex flex-wrap gap-2">
              {col.materials.map((m) => (
                <span
                  key={m}
                  className="border border-white/15 px-3 py-1.5 font-sans text-[10px] tracking-[0.12em] uppercase text-cream/45"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-none bg-gold px-8 py-3.5 font-sans text-[11px] tracking-[0.18em] uppercase text-charcoal-950 hover:bg-cream transition-colors"
            >
              Shop This Collection
            </Link>
            <Link
              href="/book-consultation"
              className="inline-flex items-center gap-2 border border-cream/20 px-8 py-3.5 font-sans text-[11px] tracking-[0.18em] uppercase text-cream/60 hover:border-cream hover:text-cream transition-colors"
            >
              Book Design Visit
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured products ───────────────────────────────────── */}
      {col.featuredProducts && col.featuredProducts.length > 0 && (
        <section className="bg-white py-20 px-6 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">
              From this collection
            </p>
            <h2 className="font-serif text-4xl text-charcoal mb-12">Selected pieces</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {col.featuredProducts.map((product) => (
                <Link
                  key={product.href}
                  href={product.href}
                  className="group flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-square overflow-hidden bg-cream">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-charcoal-950/0 group-hover:bg-charcoal-950/10 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="bg-white/90 px-4 py-2 font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal">
                        View Product
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 pb-2">
                    <h3 className="font-serif text-base text-charcoal group-hover:text-gold transition-colors mb-1">
                      {product.name}
                    </h3>
                    <p className="font-sans text-[13px] text-charcoal/50">{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 border border-charcoal/15 px-8 py-3.5 font-sans text-[11px] tracking-[0.18em] uppercase text-charcoal/60 hover:border-charcoal hover:text-charcoal transition-colors"
              >
                Browse all {col.pieces} pieces
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Product grid placeholder (future API) ───────────────── */}
      {!col.featuredProducts && (
        <section className="bg-white py-20 px-6 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Products</p>
            <h2 className="font-serif text-4xl text-charcoal mb-12">{col.pieces} pieces in this collection</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-none overflow-hidden border border-black/6">
                  <div className="aspect-square bg-cream animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-charcoal-100 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-charcoal-100 rounded animate-pulse w-1/2" />
                    <div className="h-4 bg-charcoal-100 rounded animate-pulse w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Collection philosophy ───────────────────────────────── */}
      <section className="bg-cream py-24 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">
              Design Philosophy
            </p>
            <h2 className="font-serif text-4xl text-charcoal mb-6">{col.label}</h2>
            <p className="font-serif italic text-xl text-charcoal/40 mb-6 leading-relaxed">
              &ldquo;{col.philosophy}&rdquo;
            </p>
            <p className="font-sans text-[15px] text-charcoal/55 leading-relaxed mb-8">
              {col.body}
            </p>
            <div className="flex flex-wrap gap-2">
              {col.materials.map((m) => (
                <span
                  key={m}
                  className="border border-charcoal/15 px-3 py-1.5 font-sans text-[10px] tracking-[0.12em] uppercase text-charcoal/50"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={col.imageUrl}
              alt={col.label}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Other collections ───────────────────────────────────── */}
      <section className="bg-charcoal-950 py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="mb-1 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">More Worlds</p>
              <h2 className="font-serif text-3xl text-cream">Other collections</h2>
            </div>
            <Link
              href="/collections"
              className="font-sans text-[11px] tracking-[0.15em] uppercase text-cream/30 hover:text-gold transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/collections/${other.slug}`}
                className="group relative overflow-hidden aspect-[4/3] bg-charcoal-800"
              >
                <img
                  src={other.imageUrl}
                  alt={other.label}
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-gold mb-1">{other.label}</p>
                  <p className="font-serif text-lg text-cream group-hover:text-gold transition-colors">
                    {other.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="bg-white py-16 px-6 lg:px-12 border-t border-black/6">
        <div className="mx-auto max-w-[1440px] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl text-charcoal mb-1">
              Want to customise any piece?
            </h2>
            <p className="font-sans text-[13px] text-charcoal/50">
              Every item can be made to your exact dimensions, material, and finish.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/custom-furniture"
              className="rounded-none bg-gold px-6 py-3 font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
            >
              Custom Order
            </Link>
            <Link
              href="/book-consultation"
              className="rounded-none border border-charcoal/20 px-6 py-3 font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/70 hover:border-charcoal hover:text-charcoal transition-colors"
            >
              Book Visit
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
