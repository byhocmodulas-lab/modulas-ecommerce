import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modular Wardrobes — Sliding, Hinged, Walk-in | Modulas",
  description: "Custom modular wardrobes for every bedroom. Sliding doors, hinged shutters, walk-in closets, kids wardrobes. 30+ door styles, 50+ interior modules, 10-year warranty. Book a free home visit.",
  keywords: [
    "modular wardrobe India",
    "modular wardrobe Gurgaon",
    "sliding door wardrobe India",
    "walk in closet India",
    "custom wardrobe design India",
    "modular almirah India",
    "bedroom wardrobe design India",
  ],
  alternates: { canonical: "https://modulas.in/modular-solutions/wardrobes" },
  openGraph: {
    title:       "Modular Wardrobes — Sliding, Hinged, Walk-in | Modulas",
    description: "Custom modular wardrobes for every bedroom. 30+ door styles, 50+ interior modules, 10-year warranty.",
    url:         "https://modulas.in/modular-solutions/wardrobes",
  },
};

const TYPES = [
  {
    slug: "sliding",
    label: "Sliding Door Wardrobes",
    tagline: "Space-saving elegance",
    body: "Sliding shutters glide silently on precision tracks — no clearance needed for opening. Perfect for bedrooms where every centimetre counts.",
    imageUrl: "https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg?auto=compress&cs=tinysrgb&w=900",
    tag: "Most Popular",
  },
  {
    slug: "hinged",
    label: "Hinged Door Wardrobes",
    tagline: "Classic. Timeless. Versatile.",
    body: "Traditional hinged shutters give full, unobstructed access to the interior. Available in any finish, profile, or panel design.",
    imageUrl: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=900",
    tag: "Classic Choice",
  },
  {
    slug: "walk-in",
    label: "Walk-in Wardrobe",
    tagline: "Your personal dressing room",
    body: "A dedicated walk-in with hanging rails, shelving, drawers, and a full-length mirror. Designed to your room's exact dimensions.",
    imageUrl: "https://images.pexels.com/photos/6890343/pexels-photo-6890343.jpeg?auto=compress&cs=tinysrgb&w=900",
    tag: "Premium",
  },
  {
    slug: "kids",
    label: "Kids Wardrobes",
    tagline: "Grows with your child",
    body: "Lower rails, adjustable shelves, pull-out baskets for toys, and playful finishes. Reconfigurable as needs change.",
    imageUrl: "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=900",
    tag: "Kids & Teens",
  },
  {
    slug: "loft",
    label: "Loft Wardrobes",
    tagline: "Use every inch overhead",
    body: "Full floor-to-ceiling wardrobes that include an overhead loft section for seasonal storage. Maximum capacity in minimum footprint.",
    imageUrl: "https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&w=900",
    tag: "Max Storage",
  },
];

const INTERIOR_MODULES = [
  { label: "Long Hang Section", desc: "Full-length rail for dresses, coats, suits" },
  { label: "Double Hang Section", desc: "Two rails stacked — doubles capacity" },
  { label: "Shelf Sections", desc: "Adjustable height, folded clothes & books" },
  { label: "Drawer Units", desc: "Smooth tandem drawers with soft-close" },
  { label: "Pull-out Trouser Rack", desc: "Keeps trousers crease-free" },
  { label: "Saree / Sari Shelves", desc: "Wide shelves sized for sarees & linens" },
  { label: "Jewellery Drawer", desc: "Velvet-lined with segmented tray" },
  { label: "Shoe Rack Pull-out", desc: "Tilted shelves for easy viewing" },
  { label: "Laundry Basket", desc: "Built-in pull-out laundry bag" },
  { label: "LED Strip Lighting", desc: "Motion-triggered interior lights" },
  { label: "Full-length Mirror", desc: "Integrated on door or interior panel" },
  { label: "Belt & Tie Rack", desc: "Pull-out rotating holder" },
];

interface WardrobesPageProps {
  searchParams: Promise<{ type?: string }>;
}

const WARDROBES_SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Modular Wardrobe Design & Installation",
  provider: {
    "@type": "LocalBusiness",
    name: "Modulas",
    url: "https://modulas.in",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gurgaon",
      addressRegion: "Haryana",
      addressCountry: "IN",
    },
  },
  serviceType: "Modular Wardrobe",
  description:
    "Custom modular wardrobes — sliding, hinged, walk-in, kids, and loft configurations. 30+ door styles, 50+ interior modules, fully configurable.",
  areaServed: { "@type": "Country", name: "India" },
  offers: { "@type": "Offer", availability: "https://schema.org/InStock", priceCurrency: "INR" },
};

export default async function WardrobesPage({ searchParams }: WardrobesPageProps) {
  const { type: activeType } = await searchParams;
  const filtered = activeType ? TYPES.filter((t) => t.slug === activeType) : TYPES;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WARDROBES_SERVICE_SCHEMA) }}
      />
      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative h-[55vh] min-h-[380px] overflow-hidden bg-charcoal-950">
        <img
          src="https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-charcoal-950/80" />
        <div className="relative flex h-full flex-col justify-end px-6 pb-12 lg:px-12 max-w-[1440px] mx-auto">
          <nav className="flex items-center gap-2 mb-4 font-sans text-[11px] tracking-[0.12em] uppercase text-cream/35">
            <Link href="/modular-solutions" className="hover:text-cream/60 transition-colors">Modular Solutions</Link>
            <span>/</span>
            <span className="text-cream/60">Wardrobes</span>
          </nav>
          <h1 className="font-serif text-4xl text-cream md:text-6xl mb-3">Modular Wardrobes</h1>
          <p className="font-sans text-[14px] text-cream/55 max-w-xl">
            5 wardrobe types · 30+ door styles · 50+ interior modules · Fully configurable
          </p>
        </div>
      </div>

      {/* ── Type filter nav ───────────────────────────────────── */}
      <div className="bg-white border-b border-black/6 sticky top-[var(--nav-height)] z-30">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 overflow-x-auto">
          <div className="flex gap-0 min-w-max">
            <Link
              href="/modular-solutions/wardrobes"
              className={`py-4 px-4 font-sans text-[11px] tracking-[0.15em] uppercase border-b-2 transition-colors ${
                !activeType ? "border-charcoal text-charcoal" : "border-transparent text-charcoal/45 hover:text-charcoal"
              }`}
            >
              All Types
            </Link>
            {TYPES.map((t) => (
              <Link
                key={t.slug}
                href={`/modular-solutions/wardrobes?type=${t.slug}`}
                className={`py-4 px-4 font-sans text-[11px] tracking-[0.15em] uppercase border-b-2 transition-colors whitespace-nowrap ${
                  activeType === t.slug ? "border-charcoal text-charcoal" : "border-transparent text-charcoal/45 hover:text-charcoal"
                }`}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Types grid ────────────────────────────────────────── */}
      <section className="bg-white py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((type) => (
              <Link
                key={type.slug}
                href={`/modular-solutions/wardrobes?type=${type.slug}`}
                className="group rounded-2xl overflow-hidden border border-black/6 hover:shadow-luxury-lg transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={type.imageUrl}
                    alt={type.label}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block rounded-full bg-gold px-3 py-1 font-sans text-[9px] tracking-[0.15em] uppercase text-charcoal-950">
                      {type.tag}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold mb-1">{type.label}</p>
                  <h3 className="font-serif text-lg text-charcoal mb-2 group-hover:text-gold transition-colors">{type.tagline}</h3>
                  <p className="font-sans text-[12px] text-charcoal/55 leading-relaxed">{type.body}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interior modules ──────────────────────────────────── */}
      <section className="bg-cream py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Interior Modules</p>
          <h2 className="font-serif text-3xl text-charcoal mb-3">50+ modules. Mix and match.</h2>
          <p className="font-sans text-[14px] text-charcoal/55 mb-10 max-w-xl">
            Every wardrobe interior is configured by you. Pick the sections that suit your wardrobe — and change them later if your needs evolve.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {INTERIOR_MODULES.map((mod) => (
              <div key={mod.label} className="rounded-xl bg-white border border-black/6 p-4">
                <h3 className="font-serif text-sm text-charcoal mb-1">{mod.label}</h3>
                <p className="font-sans text-[11px] text-charcoal/50 leading-snug">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-charcoal-950 py-16 px-6 lg:px-12 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="font-serif text-4xl text-cream mb-4">Design your wardrobe for free</h2>
          <p className="font-sans text-[14px] text-cream/50 mb-8 leading-relaxed">
            Our wardrobe specialist visits your bedroom, measures every wall, and designs your custom interior — at no cost.
          </p>
          <Link
            href="/book-consultation"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
          >
            Book Free Visit
          </Link>
        </div>
      </section>
    </>
  );
}
