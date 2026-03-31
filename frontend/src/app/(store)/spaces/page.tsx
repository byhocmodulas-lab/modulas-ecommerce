import Link                   from "next/link";
import type { Metadata }      from "next";
import { SpacesFilterTabs }   from "@/components/store/spaces-filter-tabs";
import { HotspotPin }         from "@/components/store/hotspot-pin";

export const metadata: Metadata = {
  title:       "Design by Space — Modulas",
  description: "Explore complete room designs by living room, bedroom, kitchen, dining, study, and outdoor. Curated furniture solutions for every space in your home.",
  openGraph: {
    title:       "Design by Space — Modulas",
    description: "Room-by-room inspiration for every corner of your home. Click any space to shop the look.",
    images:      [{ url: "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1200", width: 1200, height: 630 }],
  },
};

/* ── Room data ─────────────────────────────────────────────────────── */
interface Room {
  slug:            string;
  label:           string;
  tagline:         string;
  body:            string;
  imageUrl:        string;
  productCategory: string;
  solutions:       string[];
  stats?:          { value: string; label: string }[];
}

const ROOMS: Room[] = [
  {
    slug:            "living-room",
    label:           "Living Room",
    tagline:         "Where every evening begins.",
    body:            "Sofas, coffee tables, shelving, and accent pieces — curated to work together beautifully in any floor plan.",
    imageUrl:        "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1200",
    productCategory: "sofas",
    solutions:       ["Sofas & Seating", "Coffee Tables", "Display Shelving", "Accent Chairs"],
    stats:           [{ value: "240+", label: "Configurations" }, { value: "18", label: "Finish options" }],
  },
  {
    slug:            "bedroom",
    label:           "Bedroom",
    tagline:         "A sanctuary, precisely designed.",
    body:            "Beds, wardrobes, bedside tables, and dressing areas that make every morning and night effortless.",
    imageUrl:        "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200",
    productCategory: "bedroom",
    solutions:       ["Modular Wardrobes", "Beds & Frames", "Bedside Tables", "Dressing Tables"],
    stats:           [{ value: "180+", label: "Wardrobe layouts" }, { value: "12", label: "Wood finishes" }],
  },
  {
    slug:            "kitchen",
    label:           "Kitchen",
    tagline:         "The heart of every home.",
    body:            "Modular kitchen systems that balance beauty and function — from compact galleys to generous island configurations.",
    imageUrl:        "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1200",
    productCategory: "modular-solutions",
    solutions:       ["Modular Kitchens", "Kitchen Storage", "Countertops", "Appliance Integration"],
    stats:           [{ value: "320+", label: "Kitchen projects" }, { value: "40+", label: "Cabinet finishes" }],
  },
  {
    slug:            "dining-room",
    label:           "Dining",
    tagline:         "Every meal, an occasion.",
    body:            "Dining tables, chairs, sideboards, and crockery units — pieces that make gathering a pleasure.",
    imageUrl:        "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1200",
    productCategory: "tables",
    solutions:       ["Dining Tables", "Dining Chairs", "Crockery Units", "Bar & Buffet"],
  },
  {
    slug:            "study",
    label:           "Study & Office",
    tagline:         "Work that flows.",
    body:            "Study desks, bookshelves, file cabinets, and cable-managed workstations designed for sustained focus.",
    imageUrl:        "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=1200",
    productCategory: "storage",
    solutions:       ["Study Desks", "Bookshelves", "Storage Cabinets", "Ergonomic Setup"],
  },
  {
    slug:            "walk-in-closet",
    label:           "Walk-in Closet",
    tagline:         "Your personal dressing room.",
    body:            "Full walk-in wardrobe systems with hanging rails, drawers, shoe racks, and a dedicated dressing mirror.",
    imageUrl:        "https://images.pexels.com/photos/6890343/pexels-photo-6890343.jpeg?auto=compress&cs=tinysrgb&w=1200",
    productCategory: "storage",
    solutions:       ["Walk-in Wardrobe", "Shoe Storage", "Jewellery Drawers", "Full-length Mirror"],
  },
  {
    slug:            "outdoor",
    label:           "Outdoor",
    tagline:         "Refined living, extended outside.",
    body:            "Weather-resistant furniture that brings the same refinement of your interiors to terraces and gardens.",
    imageUrl:        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85",
    productCategory: "outdoor",
    solutions:       ["Outdoor Sofas", "Dining Sets", "Sun Loungers", "Planter Stools"],
  },
  {
    slug:            "foyer",
    label:           "Foyer & Entry",
    tagline:         "The first impression that lasts.",
    body:            "Console cabinets, shoe benches, coat hooks — everything a well-designed entry deserves.",
    imageUrl:        "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=1200",
    productCategory: "storage",
    solutions:       ["Entry Cabinets", "Shoe Storage", "Console Tables", "Coat & Key Storage"],
  },
];

/* ── Featured curated spaces with product hotspots ─────────────────── */
interface Hotspot {
  top:     string;
  left:    string;
  product: string;
  price:   string;
  href:    string;
}

interface FeaturedSpace {
  room:     string;
  headline: string;
  image:    string;
  href:     string;
  hotspots: Hotspot[];
}

const FEATURED_SPACES: FeaturedSpace[] = [
  {
    room:     "Living Room",
    headline: "The Avec Arrangement",
    image:    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=85",
    href:     "/products?category=sofas",
    hotspots: [
      { top: "52%", left: "30%", product: "Avec Modular Sofa",  price: "₹3,85,000", href: "/products/avec-modular-sofa" },
      { top: "74%", left: "52%", product: "Arc Side Table",      price: "₹79,000",   href: "/products/arc-side-table" },
      { top: "28%", left: "74%", product: "Noir Arc Lamp",       price: "₹52,000",   href: "/products/noir-arc-lamp" },
    ],
  },
  {
    room:     "Dining Room",
    headline: "The Span Setting",
    image:    "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=1400&q=85",
    href:     "/products?category=tables",
    hotspots: [
      { top: "42%", left: "45%", product: "Span Dining Table",    price: "₹4,20,000", href: "/products/span-dining-table" },
      { top: "60%", left: "20%", product: "Cate Swivel Chair",    price: "₹1,28,000", href: "/products/cate-swivel-chair" },
      { top: "18%", left: "62%", product: "Ribbon Pendant",       price: "₹38,000",   href: "/products/ribbon-pendant" },
    ],
  },
];

/* ── Editorial inspiration cards ──────────────────────────────────── */
const EDITORIAL = [
  {
    tag:      "Styling Guide",
    headline: "Small Space, Big Impact",
    body:     "How to make a 12×14 living room feel twice its size — without knocking down a single wall.",
    image:    "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800",
    href:     "/journal/small-space-solutions",
  },
  {
    tag:      "Material Story",
    headline: "Why Solid Oak Ages Better",
    body:     "The science of why some woods improve with every year — and how to choose the right one for your home.",
    image:    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=85",
    href:     "/journal/oak-vs-walnut",
  },
  {
    tag:      "Project",
    headline: "A Whole Home in Gurgaon",
    body:     "Six rooms. One vision. How a 4BHK in Sector 82 became a complete Modulas home.",
    image:    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=85",
    href:     "/projects",
  },
];

/* ── Page ──────────────────────────────────────────────────────────── */
interface SpacesPageProps {
  searchParams: Promise<{ room?: string }>;
}

export default async function SpacesPage({ searchParams }: SpacesPageProps) {
  const { room } = await searchParams;
  const activeRoom  = room ?? "";
  const visibleRooms = activeRoom
    ? ROOMS.filter((r) => r.slug === activeRoom)
    : ROOMS;

  return (
    <>
      {/* ①  HERO ────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-charcoal-950 min-h-[88vh] flex flex-col justify-end"
        aria-labelledby="spaces-hero-heading"
      >
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1800"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.52]"
        />
        {/* Layered gradients — dark bottom for text, dark left edge */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/95 via-charcoal-950/30 to-transparent" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/70 via-transparent to-transparent" aria-hidden />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 lg:px-12 pb-16 pt-36">
          <div className="max-w-2xl">
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-4">
              Room by Room
            </p>
            <h1
              id="spaces-hero-heading"
              className="font-serif text-5xl text-cream leading-tight lg:text-7xl"
            >
              Design<br />by Space.
            </h1>
            <p className="mt-5 font-sans text-[15px] text-cream/50 leading-relaxed max-w-md">
              Every room tells a story. Start with yours — browse curated furniture solutions for every corner of your home.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/book-consultation"
                className="inline-flex h-12 items-center gap-3 bg-gold px-7 font-sans text-[11px] tracking-[0.18em] uppercase text-charcoal-950 hover:bg-cream transition-colors duration-200"
              >
                Book Free Visit
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="#spaces-grid"
                className="inline-flex h-12 items-center gap-3 border border-white/25 px-7 font-sans text-[11px] tracking-[0.18em] uppercase text-cream/75 hover:border-cream hover:text-cream transition-colors duration-200"
              >
                Explore Rooms
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-14 flex flex-wrap gap-10 border-t border-white/8 pt-8">
            {[
              { value: "850+", label: "Rooms completed" },
              { value: "8",    label: "Spaces covered" },
              { value: "100%", label: "Custom designed" },
              { value: "Free", label: "Home visit" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-serif text-2xl text-cream">{s.value}</p>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-cream/35 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ②  FILTER TABS + GRID ───────────────────────────────────── */}
      <section
        id="spaces-grid"
        className="bg-white dark:bg-charcoal-950 py-20 lg:py-28"
        aria-labelledby="spaces-grid-heading"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">

          {/* Section header */}
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-3">
                All Spaces
              </p>
              <h2
                id="spaces-grid-heading"
                className="font-serif text-4xl text-charcoal dark:text-cream lg:text-5xl"
              >
                {activeRoom
                  ? (ROOMS.find((r) => r.slug === activeRoom)?.label ?? "Spaces")
                  : "Every Room, Transformed."}
              </h2>
            </div>
            <p className="font-sans text-sm text-charcoal/40 dark:text-cream/40 max-w-xs leading-relaxed">
              Select a room to see curated furniture solutions, or browse the full collection below.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="mb-10">
            <SpacesFilterTabs active={activeRoom} />
          </div>

          {/* ── Bento grid ─────────────────────────────────────── */}
          {visibleRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-serif text-2xl text-charcoal/25 dark:text-cream/25">No rooms match</p>
              <p className="font-sans text-sm text-charcoal/40 dark:text-cream/40 mt-2">Try selecting a different filter.</p>
            </div>
          ) : (
            <RoomBentoGrid rooms={visibleRooms} />
          )}
        </div>
      </section>

      {/* ③  FEATURED SPACES — curated setups with product hotspots ── */}
      <section className="bg-cream dark:bg-charcoal-900 py-20 lg:py-28" aria-labelledby="featured-spaces-heading">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">

          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-3">
                Shop the Look
              </p>
              <h2
                id="featured-spaces-heading"
                className="font-serif text-4xl text-charcoal dark:text-cream lg:text-5xl"
              >
                Curated Spaces.
              </h2>
            </div>
            <p className="font-sans text-sm text-charcoal/40 dark:text-cream/40 max-w-xs leading-relaxed">
              Tap the&nbsp;
              <span className="inline-flex h-4 w-4 items-center justify-center bg-gold text-charcoal-950 text-[9px] font-bold align-middle">+</span>
              &nbsp;markers to explore the pieces in each scene.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {FEATURED_SPACES.map((space) => (
              <FeaturedSpaceCard key={space.headline} space={space} />
            ))}
          </div>
        </div>
      </section>

      {/* ④  EDITORIAL / INSPIRATION ─────────────────────────────── */}
      <section className="bg-white dark:bg-charcoal-950 py-20 lg:py-28" aria-labelledby="inspiration-heading">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">

          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-3">Stories</p>
              <h2
                id="inspiration-heading"
                className="font-serif text-4xl text-charcoal dark:text-cream lg:text-5xl"
              >
                Spaces, Told.
              </h2>
            </div>
            <Link
              href="/journal"
              className="hidden sm:inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.18em] uppercase text-charcoal/40 dark:text-cream/40 hover:text-gold transition-colors border-b border-black/10 dark:border-white/10 hover:border-gold pb-0.5"
            >
              View all stories
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {EDITORIAL.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="group flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-cream dark:bg-charcoal-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.image}
                    alt={article.headline}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/30 via-transparent to-transparent" />
                </div>
                <div className="pt-5 pb-2 flex flex-col gap-2">
                  <span className="font-sans text-[9px] tracking-[0.28em] uppercase text-gold">
                    {article.tag}
                  </span>
                  <h3 className="font-serif text-xl text-charcoal dark:text-cream leading-snug group-hover:text-gold transition-colors duration-200">
                    {article.headline}
                  </h3>
                  <p className="font-sans text-[13px] text-charcoal/45 dark:text-cream/45 leading-relaxed">
                    {article.body}
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal/35 dark:text-cream/35 group-hover:text-gold transition-colors mt-2">
                    Read
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
                {/* Gold underline on hover */}
                <div className="h-px bg-black/6 dark:bg-white/6 overflow-hidden mt-1">
                  <div className="h-full w-0 bg-gold transition-all duration-500 group-hover:w-full" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ⑤  BOOK CONSULTATION CTA ──────────────────────────────── */}
      <section className="relative bg-charcoal-950 overflow-hidden" aria-labelledby="spaces-cta-heading">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1800&q=85"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-[0.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/80 to-charcoal-950/40" aria-hidden />

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12 py-section">
          <div className="grid lg:grid-cols-3 gap-px bg-white/6">

            {[
              {
                num:   "01",
                label: "Start with a free visit",
                body:  "Our designer comes to your home, maps every room, and walks you through possibilities — free of charge.",
                cta:   "Book Free Visit",
                href:  "/book-consultation",
              },
              {
                num:   "02",
                label: "Browse real projects",
                body:  "See how we've transformed real homes across India — kitchens, bedrooms, living rooms, and more.",
                cta:   "View Projects",
                href:  "/projects",
              },
              {
                num:   "03",
                label: "Explore all solutions",
                body:  "Browse every modular solution and product collection — kitchens, wardrobes, storage, and living furniture.",
                cta:   "All Solutions",
                href:  "/modular-solutions",
              },
            ].map((item) => (
              <div key={item.label} className="group flex flex-col gap-5 bg-charcoal-950 p-8 lg:p-10">
                <span className="font-serif text-[4rem] leading-none text-cream/6 tabular-nums select-none" aria-hidden>
                  {item.num}
                </span>
                <div className="space-y-3 flex-1">
                  <h3 className="font-serif text-xl text-cream leading-snug">{item.label}</h3>
                  <p className="font-sans text-[13px] text-cream/40 leading-relaxed">{item.body}</p>
                </div>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.22em] uppercase text-cream/35 hover:text-gold transition-colors border-b border-transparent hover:border-gold pb-0.5 self-start"
                >
                  {item.cta}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    className="transition-transform duration-200 group-hover:translate-x-0.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Bento grid ────────────────────────────────────────────────────── */
/**
 * Adaptive bento layout:
 * - 1 room  → single full-width hero card
 * - 2 rooms → two equal columns
 * - 3 rooms → one 2/3 + one 1/3 top row, then one full-width
 * - 4+      → editorial mosaic: [large | tall stack] then [3-col row] repeating
 */
function RoomBentoGrid({ rooms }: { rooms: Room[] }) {
  if (rooms.length === 1) {
    return <RoomCard room={rooms[0]} size="hero" />;
  }

  if (rooms.length === 2) {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        {rooms.map((r) => <RoomCard key={r.slug} room={r} size="large" />)}
      </div>
    );
  }

  if (rooms.length === 3) {
    return (
      <div className="space-y-4">
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><RoomCard room={rooms[0]} size="large" /></div>
          <RoomCard room={rooms[1]} size="portrait" />
        </div>
        <RoomCard room={rooms[2]} size="wide" />
      </div>
    );
  }

  // 4+ rooms — full editorial mosaic
  const firstTwo  = rooms.slice(0, 2);
  const nextThree = rooms.slice(2, 5);
  const rest      = rooms.slice(5);

  return (
    <div className="space-y-4">
      {/* Row 1: one dominant (2/3) + one portrait (1/3) */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RoomCard room={firstTwo[0]} size="large" />
        </div>
        <RoomCard room={firstTwo[1]} size="portrait" />
      </div>

      {/* Row 2: three equal portrait cards */}
      {nextThree.length > 0 && (
        <div className={`grid gap-4 ${nextThree.length === 3 ? "sm:grid-cols-3" : nextThree.length === 2 ? "sm:grid-cols-2" : ""}`}>
          {nextThree.map((r) => <RoomCard key={r.slug} room={r} size="compact" />)}
        </div>
      )}

      {/* Row 3+: remaining rooms in 2/3 + 1/3 inverted */}
      {rest.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-4">
          <RoomCard room={rest[0]} size="portrait" />
          {rest[1] && (
            <div className="lg:col-span-2">
              <RoomCard room={rest[1]} size="large" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Room card ─────────────────────────────────────────────────────── */
type CardSize = "hero" | "large" | "portrait" | "compact" | "wide";

const ASPECT: Record<CardSize, string> = {
  hero:     "aspect-[21/9] lg:aspect-[3/1]",
  large:    "aspect-[4/3]",
  portrait: "aspect-[3/4]",
  compact:  "aspect-[3/4] sm:aspect-[4/5]",
  wide:     "aspect-[21/9]",
};

function RoomCard({ room, size }: { room: Room; size: CardSize }) {
  const isHero    = size === "hero";
  const isCompact = size === "compact";

  return (
    <Link
      href={`/products?category=${room.productCategory}`}
      className={`group relative block overflow-hidden bg-charcoal-800 ${ASPECT[size]}`}
      aria-label={`Shop ${room.label} — ${room.tagline}`}
    >
      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={room.imageUrl}
        alt={room.label}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/15 to-transparent" />

      {/* Hover darkening */}
      <div className="absolute inset-0 bg-charcoal-950/0 group-hover:bg-charcoal-950/20 transition-colors duration-500" aria-hidden />

      {/* Content — pinned bottom */}
      <div className={`absolute inset-x-0 bottom-0 ${isHero ? "p-10 lg:p-14" : isCompact ? "p-4 lg:p-5" : "p-5 lg:p-7"}`}>
        <p className={`font-sans tracking-[0.28em] uppercase text-gold ${isCompact ? "text-[8px]" : "text-[10px]"} mb-1.5`}>
          {room.label}
        </p>
        <h3 className={`font-serif text-cream leading-snug group-hover:text-gold transition-colors duration-300 ${isHero ? "text-3xl lg:text-5xl" : isCompact ? "text-base" : "text-xl lg:text-2xl"}`}>
          {room.tagline}
        </h3>

        {/* Solution tags — only on larger cards */}
        {!isCompact && (
          <div className="flex flex-wrap gap-1.5 mt-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            {room.solutions.slice(0, 3).map((s) => (
              <span
                key={s}
                className="font-sans text-[9px] tracking-[0.1em] text-cream/60 bg-white/10 border border-white/10 px-2.5 py-1"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Room stats overlay — top right on hover for large cards */}
      {room.stats && !isCompact && (
        <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {room.stats.map((s) => (
            <div key={s.label} className="text-right bg-charcoal-950/60 backdrop-blur-sm px-3 py-1.5">
              <p className="font-serif text-lg text-cream leading-none">{s.value}</p>
              <p className="font-sans text-[8px] tracking-[0.15em] uppercase text-cream/45 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* "Shop" badge — appears on hover */}
      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="inline-flex items-center gap-1.5 bg-gold px-3 py-1.5 font-sans text-[9px] tracking-[0.18em] uppercase text-charcoal-950">
          Shop
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

/* ── Featured space card with product hotspots ─────────────────────── */
function FeaturedSpaceCard({ space }: { space: FeaturedSpace }) {
  return (
    <div className="group relative overflow-hidden bg-charcoal-800 aspect-[4/3]">
      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={space.image}
        alt={space.headline}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-charcoal-950/10 to-transparent" />

      {/* Product hotspots */}
      {space.hotspots.map((hotspot) => (
        <HotspotPin key={hotspot.product} hotspot={hotspot} />
      ))}

      {/* Bottom label */}
      <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
        <p className="font-sans text-[9px] tracking-[0.28em] uppercase text-gold mb-2">{space.room}</p>
        <div className="flex items-end justify-between gap-4">
          <h3 className="font-serif text-2xl text-cream lg:text-3xl">{space.headline}</h3>
          <Link
            href={space.href}
            className="flex-none inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.18em] uppercase text-cream/50 hover:text-gold transition-colors border-b border-white/15 hover:border-gold pb-0.5 whitespace-nowrap"
          >
            Shop all
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

