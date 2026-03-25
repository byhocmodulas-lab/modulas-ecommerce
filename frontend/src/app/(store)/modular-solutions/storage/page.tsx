import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modular Storage — TV Units, Shoe Racks, Crockery Cabinets | Modulas",
  description: "Custom modular storage for every room — TV & media units, crockery cabinets, shoe racks, entry units, study shelving, utility storage. Factory-direct.",
};

const STORAGE_TYPES = [
  {
    slug: "tv",
    label: "TV & Media Units",
    tagline: "Your living room, centred",
    body: "Floor-to-ceiling TV panels, floating units, wall-mounted shelving with wire management. Designed around your screen size and room width.",
    imageUrl: "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    slug: "crockery",
    label: "Crockery & Bar Units",
    tagline: "Display what you love",
    body: "Glass-fronted crockery cabinets, built-in bar units with bottle pull-outs, and buffets that match your dining table finish.",
    imageUrl: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    slug: "shoe",
    label: "Shoe Storage",
    tagline: "Every pair, perfectly stored",
    body: "Vertical pull-out racks, tilted shelves, flip-front boxes. From 20 pairs to 200 — we design the right solution for your collection.",
    imageUrl: "https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    slug: "foyer",
    label: "Entry & Foyer Units",
    tagline: "First impressions, last a lifetime",
    body: "Slim console cabinets, key trays, shoe benches, coat hooks, and above-door storage — all in a unit that fits your entry perfectly.",
    imageUrl: "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    slug: "study",
    label: "Study & Office Storage",
    tagline: "A workspace worth working in",
    body: "Bookshelves, file drawers, cable management desktops, credenzas, and overhead cabinets — designed for focus and functionality.",
    imageUrl: "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    slug: "utility",
    label: "Utility & Laundry",
    tagline: "The hardest-working room, sorted",
    body: "Tall pull-out brooms, detergent drawers, washing machine surrounds, drying areas, and fold-out ironing board cabinets.",
    imageUrl: "https://images.pexels.com/photos/4569339/pexels-photo-4569339.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
];

interface StoragePageProps {
  searchParams: { type?: string };
}

export default function StoragePage({ searchParams }: StoragePageProps) {
  const activeType = searchParams.type;
  const filtered = activeType ? STORAGE_TYPES.filter((t) => t.slug === activeType) : STORAGE_TYPES;

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative h-[50vh] min-h-[340px] overflow-hidden bg-charcoal-950">
        <img
          src="https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-charcoal-950/80" />
        <div className="relative flex h-full flex-col justify-end px-6 pb-12 lg:px-12 max-w-[1440px] mx-auto">
          <nav className="flex items-center gap-2 mb-4 font-sans text-[11px] tracking-[0.12em] uppercase text-cream/35">
            <Link href="/modular-solutions" className="hover:text-cream/60 transition-colors">Modular Solutions</Link>
            <span>/</span>
            <span className="text-cream/60">Storage</span>
          </nav>
          <h1 className="font-serif text-4xl text-cream md:text-6xl mb-3">Modular Storage</h1>
          <p className="font-sans text-[14px] text-cream/55 max-w-xl">
            Every room, every need — TV units, crockery cabinets, shoe racks, study shelving, and more.
          </p>
        </div>
      </div>

      {/* ── Type nav ──────────────────────────────────────────── */}
      <div className="bg-white border-b border-black/6 sticky top-[var(--nav-height)] z-30">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 overflow-x-auto">
          <div className="flex gap-0 min-w-max">
            <Link
              href="/modular-solutions/storage"
              className={`py-4 px-4 font-sans text-[11px] tracking-[0.15em] uppercase border-b-2 transition-colors ${
                !activeType ? "border-charcoal text-charcoal" : "border-transparent text-charcoal/45 hover:text-charcoal"
              }`}
            >
              All Storage
            </Link>
            {STORAGE_TYPES.map((t) => (
              <Link
                key={t.slug}
                href={`/modular-solutions/storage?type=${t.slug}`}
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

      {/* ── Grid ──────────────────────────────────────────────── */}
      <section className="bg-white py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((type) => (
              <Link
                key={type.slug}
                href={`/modular-solutions/storage?type=${type.slug}`}
                className="group rounded-2xl overflow-hidden border border-black/6 hover:shadow-luxury-lg transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={type.imageUrl}
                    alt={type.label}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
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

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-charcoal-950 py-16 px-6 lg:px-12 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="font-serif text-4xl text-cream mb-4">Tell us your storage challenge</h2>
          <p className="font-sans text-[14px] text-cream/50 mb-8 leading-relaxed">
            Book a free consultation. We'll come to your home, assess the space, and design a storage solution that actually works.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/book-consultation"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
            >
              Book Free Visit
            </Link>
            <Link
              href="/modular-solutions"
              className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-8 py-4 font-sans text-[12px] tracking-[0.15em] uppercase text-cream/70 hover:border-cream hover:text-cream transition-colors"
            >
              All Modular Solutions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
