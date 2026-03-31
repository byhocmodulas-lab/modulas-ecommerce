import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

/* ── Room data ─────────────────────────────────────────────────────── */

const ROOMS: Record<
  string,
  {
    label: string;
    tagline: string;
    description: string;
    heroImage: string;
    products: { label: string; category: string; href: string; image: string }[];
    tip: string;
  }
> = {
  "living-room": {
    label: "Living Room",
    tagline: "The heart of your home",
    description:
      "Curate a living room that balances comfort and style. From modular sofas and coffee tables to shelving and TV consoles — every piece designed to work together.",
    heroImage:
      "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1600",
    products: [
      {
        label: "Sofas & Sectionals",
        category: "Seating",
        href: "/furniture/seating?type=sofas",
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
      },
      {
        label: "Coffee Tables",
        category: "Living",
        href: "/furniture/living?type=coffee-tables",
        image:
          "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "TV Consoles",
        category: "Living",
        href: "/furniture/living?type=tv-consoles",
        image:
          "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Shelving Units",
        category: "Living",
        href: "/furniture/living?type=shelving",
        image:
          "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
    tip: "Layer your lighting — ambient, task, and accent — for a living room that adapts from morning to midnight.",
  },
  kitchen: {
    label: "Kitchen",
    tagline: "Where everything comes together",
    description:
      "From modular kitchen systems with German hardware to matching dining sets — design a kitchen that works as hard as you do, and looks twice as good.",
    heroImage:
      "https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=1600",
    products: [
      {
        label: "Modular Kitchens",
        category: "Modular Solutions",
        href: "/modular-solutions/kitchens",
        image:
          "https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Dining Tables",
        category: "Dining",
        href: "/furniture/dining?type=tables",
        image:
          "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Bar Units",
        category: "Dining",
        href: "/furniture/dining?type=bar",
        image:
          "https://images.pexels.com/photos/2762247/pexels-photo-2762247.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Crockery Units",
        category: "Storage",
        href: "/modular-solutions/storage?type=crockery",
        image:
          "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
    tip: "The kitchen triangle (sink, hob, fridge) is your workflow core. Plan your layout around it before choosing finishes.",
  },
  bedroom: {
    label: "Bedroom",
    tagline: "Your sanctuary",
    description:
      "Rest, recharge, and wake up to a space you love. Platform beds, fitted wardrobes, bedside tables, and dressing tables — designed as a complete bedroom collection.",
    heroImage:
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1600",
    products: [
      {
        label: "Beds & Bed Frames",
        category: "Bedroom",
        href: "/furniture/beds?type=beds",
        image:
          "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Modular Wardrobes",
        category: "Modular Solutions",
        href: "/modular-solutions/wardrobes",
        image:
          "https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Bedside Tables",
        category: "Bedroom",
        href: "/furniture/beds?type=bedside",
        image:
          "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Dressing Tables",
        category: "Bedroom",
        href: "/furniture/beds?type=dressing",
        image:
          "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
    tip: "Design around your primary wall — typically the bed headboard wall. Everything else should frame it, not compete with it.",
  },
  "dining-room": {
    label: "Dining Room",
    tagline: "Tables that bring people together",
    description:
      "Solid wood and marble dining tables, upholstered chairs, and matching sideboards — designed to make every meal feel like an occasion.",
    heroImage:
      "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1600",
    products: [
      {
        label: "Dining Tables",
        category: "Dining",
        href: "/furniture/dining?type=tables",
        image:
          "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Dining Chairs",
        category: "Dining",
        href: "/furniture/dining?type=chairs",
        image:
          "https://images.pexels.com/photos/2180883/pexels-photo-2180883.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Sideboards",
        category: "Dining",
        href: "/furniture/dining?type=buffets",
        image:
          "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Crockery & Display",
        category: "Storage",
        href: "/modular-solutions/storage?type=crockery",
        image:
          "https://images.pexels.com/photos/2762247/pexels-photo-2762247.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
    tip: "Allow 90cm between your dining table edge and the wall — enough to pull out a chair and walk behind a seated guest.",
  },
  study: {
    label: "Study & Home Office",
    tagline: "Your best work starts here",
    description:
      "Standing desks, fitted bookshelves, ergonomic chairs, and cable-managed workstations — a home office that inspires focus and looks the part on video calls.",
    heroImage:
      "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=1600",
    products: [
      {
        label: "Study Desks",
        category: "Study",
        href: "/furniture/study?type=desks",
        image:
          "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Bookshelves",
        category: "Study",
        href: "/furniture/study?type=bookshelves",
        image:
          "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Study Storage",
        category: "Storage",
        href: "/modular-solutions/storage?type=study",
        image:
          "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Office Chairs",
        category: "Study",
        href: "/furniture/study?type=chairs",
        image:
          "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
    tip: "Position your desk perpendicular to a window — you get natural light without glare on your screen.",
  },
  "walk-in-closet": {
    label: "Walk-in Closet",
    tagline: "The wardrobe you've always wanted",
    description:
      "Custom walk-in wardrobes with hanging sections, drawers, shelving islands, and integrated lighting — designed to fit your exact space and clothing collection.",
    heroImage:
      "https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg?auto=compress&cs=tinysrgb&w=1600",
    products: [
      {
        label: "Walk-in Wardrobes",
        category: "Modular Wardrobes",
        href: "/modular-solutions/wardrobes?type=walk-in",
        image:
          "https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Sliding Door Wardrobes",
        category: "Modular Wardrobes",
        href: "/modular-solutions/wardrobes?type=sliding",
        image:
          "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Dressing Tables",
        category: "Bedroom",
        href: "/furniture/beds?type=dressing",
        image:
          "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Shoe Storage",
        category: "Storage",
        href: "/modular-solutions/storage?type=shoe",
        image:
          "https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
    tip: "Plan for one linear metre of hanging space per person, minimum. Then add 30% — you'll fill it.",
  },
  "kids-room": {
    label: "Kids Room",
    tagline: "Rooms that grow with them",
    description:
      "Bunk beds, study zones, toy storage, and wardrobes that adapt as your children grow — safe, durable, and genuinely fun to be in.",
    heroImage:
      "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=1600",
    products: [
      {
        label: "Kids Wardrobes",
        category: "Modular Wardrobes",
        href: "/modular-solutions/wardrobes?type=kids",
        image:
          "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Study Desks",
        category: "Study",
        href: "/furniture/study?type=desks",
        image:
          "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Bookshelves",
        category: "Study",
        href: "/furniture/study?type=bookshelves",
        image:
          "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Bedroom Storage",
        category: "Bedroom",
        href: "/furniture/beds?type=storage",
        image:
          "https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
    tip: "Build upward — children's rooms are small. Loft beds, tall wardrobes, and wall shelving free the floor for play.",
  },
  foyer: {
    label: "Foyer & Entry",
    tagline: "First impressions, lasting impact",
    description:
      "A foyer that sets the tone for your entire home — from statement console tables and mirrors to practical shoe cabinets and coat hooks.",
    heroImage:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600",
    products: [
      {
        label: "Entry & Foyer Units",
        category: "Storage",
        href: "/modular-solutions/storage?type=foyer",
        image:
          "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Shoe Storage",
        category: "Storage",
        href: "/modular-solutions/storage?type=shoe",
        image:
          "https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Console Tables",
        category: "Living",
        href: "/furniture/living",
        image:
          "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
      {
        label: "Shelving Units",
        category: "Living",
        href: "/furniture/living?type=shelving",
        image:
          "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=600",
      },
    ],
    tip: "A foyer needs three things: a surface to put things down, storage to put things away, and a mirror to check yourself on the way out.",
  },
};

type Props = { params: Promise<{ room: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { room } = await params;
  const data = ROOMS[room];
  if (!data) return { title: "Not Found" };
  return {
    title: `${data.label} Design Ideas & Furniture — Modulas`,
    description: data.description,
  };
}

export default async function SpacesRoomPage({ params }: Props) {
  const { room } = await params;
  const data = ROOMS[room];
  if (!data) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal-950 min-h-[60vh] flex items-end">
        <img
          src={data.heroImage}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/10 via-transparent to-charcoal-950/90" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12 pb-16 pt-36 w-full">
          <nav className="mb-4 flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-cream/30">
            <Link href="/spaces" className="hover:text-gold transition-colors">Spaces</Link>
            <span>/</span>
            <span className="text-cream/60">{data.label}</span>
          </nav>
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">
            {data.label}
          </p>
          <h1 className="font-serif text-5xl text-cream md:text-6xl mb-4 max-w-2xl leading-tight">
            {data.tagline}
          </h1>
          <p className="font-sans text-[15px] text-cream/55 max-w-lg leading-relaxed">
            {data.description}
          </p>
        </div>
      </section>

      {/* Shop this space */}
      <section className="bg-white py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Shop This Space</p>
          <h2 className="font-serif text-3xl text-charcoal mb-12">
            Everything for your {data.label.toLowerCase()}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.products.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-cream"
              >
                <img
                  src={p.image}
                  alt={p.label}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/65 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold mb-1">
                    {p.category}
                  </p>
                  <p className="font-serif text-lg text-cream group-hover:text-gold transition-colors">
                    {p.label}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Design tip */}
      <section className="bg-cream py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] max-w-2xl mx-auto text-center">
          <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Design Tip</p>
          <p className="font-serif text-2xl text-charcoal leading-relaxed">
            &ldquo;{data.tip}&rdquo;
          </p>
        </div>
      </section>

      {/* Other spaces */}
      <section className="bg-white py-16 px-6 lg:px-12 border-t border-black/6">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Explore</p>
          <h2 className="font-serif text-2xl text-charcoal mb-8">More spaces</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(ROOMS)
              .filter(([slug]) => slug !== room)
              .map(([slug, r]) => (
                <Link
                  key={slug}
                  href={`/spaces/${slug}`}
                  className="rounded-full border border-charcoal/15 px-5 py-2.5 font-sans text-[12px] text-charcoal/60 hover:border-gold hover:text-gold transition-colors"
                >
                  {r.label}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-charcoal-950 py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] text-center">
          <h2 className="font-serif text-3xl text-cream mb-4">
            Ready to design your {data.label.toLowerCase()}?
          </h2>
          <p className="font-sans text-[14px] text-cream/50 mb-8">
            Our designers come to you — free home visit, 3D planning, no obligation.
          </p>
          <Link
            href="/book-consultation"
            className="inline-flex rounded-full bg-gold px-8 py-4 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
          >
            Book Free Design Visit
          </Link>
        </div>
      </section>
    </>
  );
}
