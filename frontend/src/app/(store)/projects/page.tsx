import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Real Homes, Real Spaces | Modulas",
  description: "Browse Modulas project portfolio — residential kitchens, wardrobes, complete home interiors, commercial and hospitality projects. Real homes, real results.",
};

const CATEGORIES = ["All", "Residential", "Kitchen", "Wardrobe", "Commercial", "Hospitality"] as const;

const PROJECTS = [
  {
    id: "p1",
    title: "The Mehta Residence",
    subtitle: "Complete modular home — 3 BHK, Mumbai",
    category: "Residential",
    imageUrl: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=900",
    scope: ["Modular Kitchen", "3 Wardrobes", "Living Room Storage", "Study"],
    finish: "Dark Oak with Matte Black",
    year: "2024",
  },
  {
    id: "p2",
    title: "Kapoor Kitchen",
    subtitle: "U-Shape island kitchen — Delhi NCR",
    category: "Kitchen",
    imageUrl: "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=900",
    scope: ["U-Shape Kitchen", "Island with Seating", "Integrated Appliances"],
    finish: "Handleless White with Quartz Counters",
    year: "2024",
  },
  {
    id: "p3",
    title: "The Singh Walk-in",
    subtitle: "Luxury walk-in wardrobe — Chandigarh",
    category: "Wardrobe",
    imageUrl: "https://images.pexels.com/photos/6890343/pexels-photo-6890343.jpeg?auto=compress&cs=tinysrgb&w=900",
    scope: ["Walk-in Wardrobe", "Dressing Island", "Full LED Lighting", "Mirror Wall"],
    finish: "Champagne Acrylic with Brushed Gold",
    year: "2024",
  },
  {
    id: "p4",
    title: "Studio 14, Bengaluru",
    subtitle: "Compact studio transformation — 420 sq ft",
    category: "Residential",
    imageUrl: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=900",
    scope: ["Compact Kitchen", "Wall Wardrobe", "Murphy Bed Unit", "TV Wall"],
    finish: "Light Oak with White Gloss",
    year: "2024",
  },
  {
    id: "p5",
    title: "Arora Dining Room",
    subtitle: "Crockery & dining furniture — Pune",
    category: "Residential",
    imageUrl: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=900",
    scope: ["Crockery Cabinet", "Bar Unit", "Dining Table", "4 Chairs"],
    finish: "Walnut Veneer with Fluted Glass",
    year: "2023",
  },
  {
    id: "p6",
    title: "The Patel Home Office",
    subtitle: "Home office build-out — Ahmedabad",
    category: "Residential",
    imageUrl: "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=900",
    scope: ["L-Shape Desk", "Bookshelf Wall", "Storage Credenza", "Cable Management"],
    finish: "Natural Sheesham with Matte Black Metal",
    year: "2023",
  },
  {
    id: "p7",
    title: "Skyline Boutique Hotel",
    subtitle: "12-room hospitality project — Goa",
    category: "Hospitality",
    imageUrl: "https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=900",
    scope: ["12 Room Wardrobes", "Lobby Furniture", "Restaurant Seating", "TV Panels"],
    finish: "Teak Veneer with Matte White",
    year: "2023",
  },
  {
    id: "p8",
    title: "Verma L-Shape Kitchen",
    subtitle: "L-shape kitchen with breakfast bar — Hyderabad",
    category: "Kitchen",
    imageUrl: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=900",
    scope: ["L-Shape Kitchen", "Breakfast Bar", "Tall Pantry Unit"],
    finish: "Woodgrain with Acrylic Accents",
    year: "2023",
  },
  {
    id: "p9",
    title: "Nexus Co-working",
    subtitle: "Commercial fit-out — Bengaluru",
    category: "Commercial",
    imageUrl: "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=900",
    scope: ["30 Workstations", "Cabin Furniture", "Reception Desk", "Breakout Area"],
    finish: "Grey Linen with White and Warm Wood",
    year: "2023",
  },
];

const STATS = [
  { value: "500+", label: "Projects Completed" },
  { value: "₹4.5Cr+", label: "Homes Transformed" },
  { value: "4.9★", label: "Average Rating" },
  { value: "98%", label: "On-Time Delivery" },
];

export default function ProjectsPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-charcoal-950 min-h-[52vh] flex items-end">
        <img
          src="https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-charcoal-950/90" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12 pb-16 pt-32 w-full">
          <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Our Work</p>
          <h1 className="font-serif text-5xl text-cream md:text-7xl mb-5 max-w-2xl leading-tight">
            Real homes. Real results.
          </h1>
          <p className="font-sans text-[15px] text-cream/55 max-w-lg mb-12">
            From compact studio apartments to sprawling residences — every project we complete is a testament to what careful design and skilled manufacturing can do.
          </p>
          {/* Stats */}
          <div className="flex flex-wrap gap-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-3xl text-gold">{s.value}</p>
                <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-cream/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filter tabs ───────────────────────────────────────── */}
      <div className="bg-white border-b border-black/6 sticky top-[var(--nav-height)] z-30">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 overflow-x-auto">
          <div className="flex gap-0 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`py-4 px-4 font-sans text-[11px] tracking-[0.15em] uppercase border-b-2 transition-colors ${
                  cat === "All"
                    ? "border-charcoal text-charcoal"
                    : "border-transparent text-charcoal/45 hover:text-charcoal"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Projects grid ─────────────────────────────────────── */}
      <section className="bg-white py-14 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">

          {/* Featured first project */}
          <div className="group relative overflow-hidden rounded-2xl aspect-[16/7] mb-4 bg-cream">
            <img
              src={PROJECTS[0].imageUrl}
              alt={PROJECTS[0].title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-103 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/70 via-charcoal-950/20 to-transparent" />
            <div className="absolute inset-0 flex items-end lg:items-center px-8 lg:px-14 pb-10 lg:pb-0">
              <div className="max-w-lg">
                <span className="inline-block rounded-full bg-gold/20 border border-gold/30 px-3 py-1 font-sans text-[9px] tracking-[0.2em] uppercase text-gold mb-4">
                  {PROJECTS[0].category} · {PROJECTS[0].year}
                </span>
                <h2 className="font-serif text-4xl text-cream mb-2">{PROJECTS[0].title}</h2>
                <p className="font-sans text-[14px] text-cream/60 mb-4">{PROJECTS[0].subtitle}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {PROJECTS[0].scope.map((s) => (
                    <span key={s} className="font-sans text-[10px] text-cream/50 bg-white/10 rounded-full px-2.5 py-1">{s}</span>
                  ))}
                </div>
                <p className="font-sans text-[11px] text-gold/70">Finish: {PROJECTS[0].finish}</p>
              </div>
            </div>
          </div>

          {/* Masonry-style grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {PROJECTS.slice(1).map((project) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-2xl break-inside-avoid bg-cream"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block rounded-full bg-white/90 px-2.5 py-1 font-sans text-[9px] tracking-[0.12em] uppercase text-charcoal/70">
                      {project.category} · {project.year}
                    </span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <h3 className="font-serif text-lg text-cream group-hover:text-gold transition-colors mb-0.5">
                      {project.title}
                    </h3>
                    <p className="font-sans text-[11px] text-cream/55">{project.subtitle}</p>
                  </div>
                </div>
                <div className="p-4 bg-white border border-black/6 border-t-0 rounded-b-2xl">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.scope.map((s) => (
                      <span key={s} className="font-sans text-[10px] text-charcoal/50 bg-charcoal/4 rounded-full px-2 py-0.5">{s}</span>
                    ))}
                  </div>
                  <p className="font-sans text-[11px] text-charcoal/40">Finish: {project.finish}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Start your project CTA ────────────────────────────── */}
      <section className="bg-charcoal-950 py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Start your project</p>
            <h2 className="font-serif text-4xl text-cream mb-5">Your home could be next</h2>
            <p className="font-sans text-[15px] text-cream/55 leading-relaxed mb-8">
              Every project starts with a free home visit. Our designer comes to you, understands your vision, and creates a 3D plan. No cost, no obligation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/book-consultation"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
              >
                Book Free Home Visit
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-7 py-3.5 font-sans text-[12px] tracking-[0.15em] uppercase text-cream/70 hover:border-cream hover:text-cream transition-colors"
              >
                Talk to a Designer
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden aspect-square">
              <img src="https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" aria-hidden className="h-full w-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-square mt-6">
              <img src="https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" aria-hidden className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
