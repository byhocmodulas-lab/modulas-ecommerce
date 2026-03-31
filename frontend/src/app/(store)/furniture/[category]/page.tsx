import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

/* ── Category data ─────────────────────────────────────────────────── */

const CATEGORIES: Record<
  string,
  {
    label: string;
    tagline: string;
    description: string;
    heroImage: string;
    subcategories: { label: string; type: string; image: string }[];
    features: { label: string; body: string }[];
  }
> = {
  seating: {
    label: "Seating",
    tagline: "Sofas, armchairs & ottomans",
    description:
      "Modular sectionals that reshape to your room. Deep-seat armchairs. Ottomans that double as coffee tables. Every piece made to order in premium fabrics and solid hardwoods.",
    heroImage:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=85",
    subcategories: [
      {
        label: "Sofas & Sectionals",
        type: "sofas",
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
      },
      {
        label: "Armchairs",
        type: "armchairs",
        image:
          "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Ottomans",
        type: "ottomans",
        image:
          "https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Recliners",
        type: "recliners",
        image:
          "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
    features: [
      {
        label: "Modular by design",
        body: "Add or remove sections. Rearrange as your room changes.",
      },
      {
        label: "50+ fabric options",
        body: "Belgian linen, boucle, velvet, full-grain leather — all tested to 50,000 rubs.",
      },
      {
        label: "Deep-seat comfort",
        body: "High-density foam with pocket spring support. Stays comfortable for years.",
      },
      {
        label: "Custom dimensions",
        body: "Every piece is made to your exact measurements — width, depth, height.",
      },
    ],
  },
  beds: {
    label: "Beds & Bedroom",
    tagline: "Rest, elevated",
    description:
      "Platform beds, upholstered headboards, storage beds, and companion pieces — designed as a collection, beautiful individually. Made to order in solid hardwood frames.",
    heroImage:
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1600",
    subcategories: [
      {
        label: "Beds & Bed Frames",
        type: "beds",
        image:
          "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Bedside Tables",
        type: "bedside",
        image:
          "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Dressing Tables",
        type: "dressing",
        image:
          "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Bedroom Storage",
        type: "storage",
        image:
          "https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
    features: [
      {
        label: "Solid hardwood frames",
        body: "Sheesham, teak, and oak — built to last a lifetime.",
      },
      {
        label: "Storage options",
        body: "Hydraulic lift, drawer, or box storage — every bed can include hidden storage.",
      },
      {
        label: "Upholstered headboards",
        body: "Tufted, panelled, or plain — in your choice of fabric or leather.",
      },
      {
        label: "King, Queen & Custom",
        body: "Standard and custom sizes available. Built to your mattress.",
      },
    ],
  },
  dining: {
    label: "Dining",
    tagline: "Tables that bring people together",
    description:
      "Solid oak, walnut, and marble dining tables. Upholstered dining chairs. Sideboards and bar units. Sized to your dining room and your family.",
    heroImage:
      "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1600",
    subcategories: [
      {
        label: "Dining Tables",
        type: "tables",
        image:
          "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Dining Chairs",
        type: "chairs",
        image:
          "https://images.pexels.com/photos/2180883/pexels-photo-2180883.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Sideboards & Buffets",
        type: "buffets",
        image:
          "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Bar Units",
        type: "bar",
        image:
          "https://images.pexels.com/photos/2762247/pexels-photo-2762247.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
    features: [
      {
        label: "Solid tops",
        body: "Solid oak, walnut, marble, and granite — not veneers.",
      },
      {
        label: "Extendable options",
        body: "Butterfly leaf, accordion, or pull-out extensions to seat more guests.",
      },
      {
        label: "Mix & match",
        body: "Pair any table with any chair — or let us design the full set.",
      },
      {
        label: "4 to 12 seaters",
        body: "Tables from compact 4-seaters to long harvest tables for 12+.",
      },
    ],
  },
  living: {
    label: "Living Room",
    tagline: "The room you come home to",
    description:
      "Coffee tables, TV consoles, shelving units, side tables, and display cabinets — the finishing pieces for a complete living space. Designed to complement our seating range.",
    heroImage:
      "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1600",
    subcategories: [
      {
        label: "Coffee Tables",
        type: "coffee-tables",
        image:
          "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "TV Consoles",
        type: "tv-consoles",
        image:
          "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Shelving Units",
        type: "shelving",
        image:
          "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Side Tables",
        type: "side-tables",
        image:
          "https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
    features: [
      {
        label: "Coordinated collections",
        body: "Every piece designed to work together — or stand alone.",
      },
      {
        label: "Natural materials",
        body: "Solid wood, stone, glass, and metal — no particle board.",
      },
      {
        label: "Storage built in",
        body: "Hidden drawers, shelves, and cable management in every console.",
      },
      {
        label: "Size to your wall",
        body: "Custom widths and heights for any wall or alcove.",
      },
    ],
  },
  study: {
    label: "Study & Office",
    tagline: "Your best work starts here",
    description:
      "Standing desks, fitted home offices, bookshelves, ergonomic chairs, and cable-managed workstations — built around how you actually work, not how offices used to look.",
    heroImage:
      "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=1600",
    subcategories: [
      {
        label: "Study Desks",
        type: "desks",
        image:
          "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Bookshelves",
        type: "bookshelves",
        image:
          "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Filing & Cabinets",
        type: "filing",
        image:
          "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Office Chairs",
        type: "chairs",
        image:
          "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
    features: [
      {
        label: "Standing desks",
        body: "Electric height-adjustable frames with solid hardwood tops.",
      },
      {
        label: "Cable management",
        body: "Integrated cable trays and grommets — no visible wire clutter.",
      },
      {
        label: "Built-in shelving",
        body: "Floor-to-ceiling fitted shelves to maximise your wall space.",
      },
      {
        label: "Ergonomic seating",
        body: "Lumbar support, adjustable arms, and breathable mesh backs.",
      },
    ],
  },
};

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) return { title: "Not Found" };
  return {
    title: `${cat.label} — Modulas Furniture`,
    description: cat.description,
  };
}

export default async function FurnitureCategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal-950 min-h-[55vh] flex items-end">
        <img
          src={cat.heroImage}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/20 via-transparent to-charcoal-950/90" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12 pb-16 pt-36 w-full">
          <nav className="mb-4 flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-cream/30">
            <Link href="/furniture" className="hover:text-gold transition-colors">Furniture</Link>
            <span>/</span>
            <span className="text-cream/60">{cat.label}</span>
          </nav>
          <h1 className="font-serif text-5xl text-cream md:text-6xl mb-4 max-w-2xl leading-tight">
            {cat.tagline}
          </h1>
          <p className="font-sans text-[15px] text-cream/55 max-w-lg leading-relaxed">
            {cat.description}
          </p>
        </div>
      </section>

      {/* Subcategories */}
      <section className="bg-white py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Browse</p>
          <h2 className="font-serif text-3xl text-charcoal mb-12">{cat.label}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cat.subcategories.map((sub) => (
              <Link
                key={sub.type}
                href={`/furniture/${category}?type=${sub.type}`}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-cream"
              >
                <img
                  src={sub.image}
                  alt={sub.label}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <p className="font-serif text-lg text-cream group-hover:text-gold transition-colors">
                    {sub.label}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products placeholder */}
      <section className="bg-cream py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="mb-1 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Products</p>
              <h2 className="font-serif text-3xl text-charcoal">All {cat.label}</h2>
            </div>
            <Link
              href="/products"
              className="font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal/50 hover:text-gold transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white overflow-hidden border border-black/5">
                <div className="aspect-square bg-charcoal-50 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-charcoal-100 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-charcoal-100 rounded animate-pulse w-1/2" />
                  <div className="h-4 bg-charcoal-100 rounded animate-pulse w-1/3" />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center font-sans text-[13px] text-charcoal/35">
            Products loading from catalog…
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-charcoal-950 py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cat.features.map((f) => (
            <div key={f.label} className="border-l border-gold/30 pl-5">
              <h3 className="font-serif text-base text-cream mb-2">{f.label}</h3>
              <p className="font-sans text-[13px] text-cream/45 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 px-6 lg:px-12 border-t border-black/6">
        <div className="mx-auto max-w-[1440px] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl text-charcoal mb-1">Need something custom?</h2>
            <p className="font-sans text-[13px] text-charcoal/50">
              Every piece can be made to your exact dimensions, material, and finish.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/custom-furniture"
              className="rounded-full bg-gold px-6 py-3 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
            >
              Custom Order
            </Link>
            <Link
              href="/book-consultation"
              className="rounded-full border border-charcoal/20 px-6 py-3 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal/70 hover:border-charcoal hover:text-charcoal transition-colors"
            >
              Book Visit
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
