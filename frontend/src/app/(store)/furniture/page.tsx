import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Furniture — Sofas, Beds, Dining & More | Modulas",
  description: "Handcrafted furniture for every room. Sofas, armchairs, beds, dining tables, study desks — made to order in solid hardwood and premium fabrics.",
};

const CATEGORIES = [
  {
    slug: "seating",
    label: "Seating",
    tagline: "Sofas, armchairs & ottomans",
    body: "Modular sectionals that reshape to your room. Deep-seat armchairs. Ottomans that double as coffee tables. Every piece made to order.",
    href: "/furniture/seating",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85",
    items: ["Sofas & Sectionals", "Armchairs", "Ottomans", "Recliners"],
  },
  {
    slug: "beds",
    label: "Beds & Bedroom",
    tagline: "Rest, elevated",
    body: "Platform beds, upholstered headboards, storage beds, and companion pieces — designed as a collection, beautiful individually.",
    href: "/furniture/beds",
    imageUrl: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
    items: ["Beds & Bed Frames", "Bedside Tables", "Dressing Tables", "Bedroom Storage"],
  },
  {
    slug: "dining",
    label: "Dining",
    tagline: "Tables that bring people together",
    body: "Solid oak, walnut, and marble dining tables. Upholstered dining chairs. Sideboards and bar units. Sized to your dining room.",
    href: "/furniture/dining",
    imageUrl: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800",
    items: ["Dining Tables", "Dining Chairs", "Sideboards & Buffets", "Bar Units"],
  },
  {
    slug: "study",
    label: "Study & Office",
    tagline: "Your best work starts here",
    body: "Standing desks, fitted home offices, bookshelves, ergonomic chairs, and cable-managed workstations — built around how you work.",
    href: "/furniture/study",
    imageUrl: "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=800",
    items: ["Study Desks", "Bookshelves", "Filing & Cabinets", "Office Chairs"],
  },
  {
    slug: "living",
    label: "Living Room",
    tagline: "The room you come home to",
    body: "Coffee tables, TV consoles, shelving units, side tables, and display cabinets — the finishing pieces for a complete living space.",
    href: "/furniture/living",
    imageUrl: "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=800",
    items: ["Coffee Tables", "TV Consoles", "Shelving Units", "Side Tables"],
  },
];

const CRAFTSMANSHIP = [
  { label: "Solid Hardwoods", body: "Sheesham, teak, oak, and walnut from certified sustainable sources." },
  { label: "Premium Fabrics", body: "Belgian linen, boucle, velvet, and full-grain leather — tested to 50,000 rubs." },
  { label: "Hand-finished", body: "Every joint, edge, and surface is finished by hand in our workshop." },
  { label: "Made to Order", body: "Nothing sits in a warehouse. Your piece is made when you order it." },
  { label: "10-Year Warranty", body: "Structural warranty on every frame and joint." },
  { label: "Free Delivery", body: "White-glove delivery and room placement included." },
];

export default function FurniturePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-charcoal-950 min-h-[62vh] flex items-end">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=85"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/10 via-transparent to-charcoal-950/85" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12 pb-20 pt-40 w-full">
          <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Furniture</p>
          <h1 className="font-serif text-5xl text-cream md:text-7xl mb-5 max-w-2xl leading-tight">
            Made to last. Made for you.
          </h1>
          <p className="font-sans text-[15px] text-cream/55 max-w-lg leading-relaxed mb-10">
            Handcrafted furniture for every room — solid hardwoods, premium upholstery, made to your dimensions.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
            >
              Browse Collections
            </Link>
            <Link
              href="/custom-furniture"
              className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-7 py-3.5 font-sans text-[12px] tracking-[0.15em] uppercase text-cream/80 hover:border-cream hover:text-cream transition-colors"
            >
              Custom Orders
            </Link>
          </div>
        </div>
      </section>

      {/* ── Category cards ────────────────────────────────────── */}
      <section className="bg-white py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Categories</p>
          <h2 className="font-serif text-4xl text-charcoal mb-14">Shop by room</h2>

          {/* Hero pair */}
          <div className="grid lg:grid-cols-2 gap-4 mb-4">
            {CATEGORIES.slice(0, 2).map((cat) => (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-cream"
              >
                <img
                  src={cat.imageUrl}
                  alt={cat.label}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-charcoal-950/10 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold mb-1">{cat.label}</p>
                  <h3 className="font-serif text-2xl text-cream mb-1 group-hover:text-gold transition-colors">{cat.tagline}</h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {cat.items.map((item) => (
                      <span key={item} className="font-sans text-[10px] text-cream/50 bg-white/10 rounded-full px-2.5 py-1">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Remaining three */}
          <div className="grid sm:grid-cols-3 gap-4">
            {CATEGORIES.slice(2).map((cat) => (
              <Link
                key={cat.slug}
                href={cat.href}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-cream"
              >
                <img
                  src={cat.imageUrl}
                  alt={cat.label}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-charcoal-950/10 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold mb-1">{cat.label}</p>
                  <h3 className="font-serif text-xl text-cream group-hover:text-gold transition-colors">{cat.tagline}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Craftsmanship ─────────────────────────────────────── */}
      <section className="bg-cream py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Our Promise</p>
          <h2 className="font-serif text-4xl text-charcoal mb-12">Crafted differently</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CRAFTSMANSHIP.map((item) => (
              <div key={item.label} className="rounded-2xl bg-white border border-black/6 p-6">
                <h3 className="font-serif text-lg text-charcoal mb-2">{item.label}</h3>
                <p className="font-sans text-[13px] text-charcoal/55 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Custom CTA ────────────────────────────────────────── */}
      <section className="bg-charcoal-950 py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Custom Furniture</p>
            <h2 className="font-serif text-4xl text-cream mb-5">Can't find exactly what you need?</h2>
            <p className="font-sans text-[15px] text-cream/55 leading-relaxed mb-8">
              Every dimension, material, finish, and configuration is adjustable. Our designers will create exactly what you have in mind — from a single piece to a complete room.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/custom-furniture"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
              >
                Explore Custom Furniture
              </Link>
              <Link
                href="/book-consultation"
                className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-7 py-3.5 font-sans text-[12px] tracking-[0.15em] uppercase text-cream/70 hover:border-cream hover:text-cream transition-colors"
              >
                Book a Design Visit
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <img
              src="https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="Bespoke furniture in a modern home"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
