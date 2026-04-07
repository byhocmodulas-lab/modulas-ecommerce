import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modular Kitchens — Straight, L-Shape, U-Shape, Island | Modulas",
  description: "Custom modular kitchens designed for Indian homes. Choose from 6+ layouts — straight, L-shape, U-shape, island, parallel. 120+ finishes, German hardware, 10-year warranty. Free home visit and 3D design.",
  keywords: [
    "modular kitchen India",
    "modular kitchen Gurgaon",
    "modular kitchen Delhi",
    "L shape modular kitchen",
    "U shape modular kitchen",
    "island kitchen India",
    "custom modular kitchen price India",
    "modular kitchen design India",
  ],
  alternates: { canonical: "https://modulas.in/modular-solutions/kitchens" },
  openGraph: {
    title:       "Modular Kitchens — Straight, L-Shape, U-Shape, Island | Modulas",
    description: "Custom modular kitchens for Indian homes. 6+ layouts, 120+ finishes, German hardware, 10-year warranty.",
    url:         "https://modulas.in/modular-solutions/kitchens",
  },
};

const LAYOUTS = [
  {
    slug: "straight",
    label: "Straight Kitchen",
    tagline: "Space-smart simplicity",
    body: "Perfect for narrow spaces and studio apartments. Everything in a single run — efficient, clean, and surprisingly generous with storage.",
    imageUrl: "https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=900",
    idealFor: "1–2 BHK · Compact spaces",
  },
  {
    slug: "l-shape",
    label: "L-Shape Kitchen",
    tagline: "The most popular layout — for good reason",
    body: "Two walls working together. Creates a natural kitchen triangle between the hob, sink, and fridge. Excellent workflow, ample counter space.",
    imageUrl: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=900",
    idealFor: "2–3 BHK · Medium kitchens",
  },
  {
    slug: "u-shape",
    label: "U-Shape Kitchen",
    tagline: "Maximum storage. Maximum workspace.",
    body: "Three walls of cabinetry wrapping around you. The chef's kitchen — designed for those who cook seriously and need everything within reach.",
    imageUrl: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=900",
    idealFor: "3+ BHK · Spacious kitchens",
  },
  {
    slug: "parallel",
    label: "Parallel Kitchen",
    tagline: "Double the counter, double the efficiency",
    body: "Two parallel runs facing each other. Separates wet and dry zones naturally. Ideal when you have two cooks or want a clear prep/cooking split.",
    imageUrl: "https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=900",
    idealFor: "Large kitchens · Open plans",
  },
  {
    slug: "island",
    label: "Island Kitchen",
    tagline: "The statement kitchen",
    body: "A free-standing island adds workspace, seating, and drama. Best paired with an L or U layout for a kitchen that doubles as a social space.",
    imageUrl: "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=900",
    idealFor: "Open-plan · 3+ BHK",
  },
];

const FINISHES = [
  { name: "Acrylic High Gloss", desc: "Mirror-like sheen. Easy to wipe clean." },
  { name: "Matte Finish", desc: "Sophisticated, fingerprint-resistant." },
  { name: "Woodgrain Laminate", desc: "Natural texture, zero maintenance." },
  { name: "PU Paint", desc: "Custom RAL colour. Buttery smooth." },
  { name: "Glass Shutters", desc: "Show off your crockery in style." },
  { name: "Membrane Finish", desc: "Routed profiles, no exposed edges." },
  { name: "Veneer", desc: "Real wood face, modern durability." },
  { name: "Handleless / Profile", desc: "Integrated handle design, seamless." },
];

const INCLUSIONS = [
  "Soft-close hinges (Hettich / Blum)",
  "Tandem / box drawer systems",
  "Grain-matched 18mm E1 board",
  "Edge-banding on all visible edges",
  "Wire basket pull-outs included",
  "Full-height shutter options",
  "Under-cabinet lighting provision",
  "Granite / quartz countertop integration",
];

interface KitchensPageProps {
  searchParams: Promise<{ layout?: string; style?: string }>;
}

export default async function KitchensPage({ searchParams }: KitchensPageProps) {
  const { layout: activeLayout } = await searchParams;

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative h-[55vh] min-h-[380px] overflow-hidden bg-charcoal-950">
        <img
          src="https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-charcoal-950/80" />
        <div className="relative flex h-full flex-col justify-end px-6 pb-12 lg:px-12 max-w-[1440px] mx-auto">
          <nav className="flex items-center gap-2 mb-4 font-sans text-[11px] tracking-[0.12em] uppercase text-cream/35">
            <Link href="/modular-solutions" className="hover:text-cream/60 transition-colors">Modular Solutions</Link>
            <span>/</span>
            <span className="text-cream/60">Kitchens</span>
          </nav>
          <h1 className="font-serif text-4xl text-cream md:text-6xl mb-3">Modular Kitchens</h1>
          <p className="font-sans text-[14px] text-cream/55 max-w-xl">
            6 layouts · 120+ finishes · German hardware · Factory-direct pricing
          </p>
        </div>
      </div>

      {/* ── Layout filter nav ─────────────────────────────────── */}
      <div className="bg-white border-b border-black/6 sticky top-[var(--nav-height)] z-30">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 overflow-x-auto">
          <div className="flex gap-0 min-w-max">
            <Link
              href="/modular-solutions/kitchens"
              className={`py-4 px-4 font-sans text-[11px] tracking-[0.15em] uppercase border-b-2 transition-colors ${
                !activeLayout ? "border-charcoal text-charcoal" : "border-transparent text-charcoal/45 hover:text-charcoal"
              }`}
            >
              All Layouts
            </Link>
            {LAYOUTS.map((l) => (
              <Link
                key={l.slug}
                href={`/modular-solutions/kitchens?layout=${l.slug}`}
                className={`py-4 px-4 font-sans text-[11px] tracking-[0.15em] uppercase border-b-2 transition-colors whitespace-nowrap ${
                  activeLayout === l.slug ? "border-charcoal text-charcoal" : "border-transparent text-charcoal/45 hover:text-charcoal"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Layouts grid ──────────────────────────────────────── */}
      <section className="bg-white py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LAYOUTS.filter((l) => !activeLayout || l.slug === activeLayout).map((layout) => (
              <Link
                key={layout.slug}
                href={`/modular-solutions/kitchens?layout=${layout.slug}`}
                className="group rounded-2xl overflow-hidden border border-black/6 hover:shadow-luxury-lg transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={layout.imageUrl}
                    alt={layout.label}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block rounded-full bg-white/90 px-3 py-1 font-sans text-[9px] tracking-[0.15em] uppercase text-charcoal">
                      {layout.idealFor}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold mb-1">{layout.label}</p>
                  <h3 className="font-serif text-lg text-charcoal mb-2 group-hover:text-gold transition-colors">{layout.tagline}</h3>
                  <p className="font-sans text-[12px] text-charcoal/55 leading-relaxed">{layout.body}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Finishes ──────────────────────────────────────────── */}
      <section className="bg-cream py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Materials & Finishes</p>
          <h2 className="font-serif text-3xl text-charcoal mb-10">120+ finishes. Your choice.</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {FINISHES.map((f) => (
              <div key={f.name} className="rounded-xl bg-white border border-black/6 p-4">
                <h3 className="font-serif text-base text-charcoal mb-1">{f.name}</h3>
                <p className="font-sans text-[12px] text-charcoal/50">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's included ───────────────────────────────────── */}
      <section className="bg-white py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Standard Inclusions</p>
            <h2 className="font-serif text-3xl text-charcoal mb-4">Everything included. No surprises.</h2>
            <p className="font-sans text-[14px] text-charcoal/55 mb-8 leading-relaxed">
              Every Modulas kitchen comes with the same quality components regardless of your budget tier. We don't charge extra for what should be standard.
            </p>
            <ul className="space-y-2.5">
              {INCLUSIONS.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/15 shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="3" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <span className="font-sans text-[13px] text-charcoal/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <img
              src="https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="Modulas kitchen detail"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-charcoal-950 py-16 px-6 lg:px-12 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="font-serif text-4xl text-cream mb-4">Start with a free home visit</h2>
          <p className="font-sans text-[14px] text-cream/50 mb-8 leading-relaxed">
            Our kitchen designer visits you at home, takes measurements, and creates a full 3D design — free of charge and with no obligation to buy.
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
