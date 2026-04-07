import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story — Modulas | Luxury Furniture Studio, Gurgaon",
  description:
    "Founded on a belief that furniture should last a lifetime. Learn how Modulas began in Gurgaon and the values that guide every piece we make.",
  keywords: [
    "Modulas furniture brand story",
    "luxury furniture studio Gurgaon",
    "about Modulas furniture",
    "Indian furniture brand",
    "bespoke furniture company India",
  ],
  alternates: { canonical: "https://modulas.in/our-story" },
  openGraph: {
    title: "Our Story — Modulas | Luxury Furniture Studio, Gurgaon",
    description: "Founded on a belief that furniture should last a lifetime — learn how Modulas began and the values that guide us.",
    url: "https://modulas.in/our-story",
  },
};

const MILESTONES = [
  {
    year: "2021",
    title: "The Studio Opens",
    body: "Modulas is founded in Gurgaon with a singular mission: to redefine how interiors are experienced through bespoke furniture built around the client's life.",
  },
  {
    year: "2022",
    title: "First 100 Projects",
    body: "Word spreads through architects and interior designers across Delhi-NCR. The studio completes its first 100 fully customised residential projects.",
  },
  {
    year: "2023",
    title: "The Digital Configurator",
    body: "Real-time 3D configuration launches — clients design their own pieces down to material, finish, and dimension before a single cut is made.",
  },
  {
    year: "2024",
    title: "850+ Projects Completed",
    body: "Modulas crosses 850 completed projects with a 98% client satisfaction rate. The team expands to serve clients across major Indian cities.",
  },
  {
    year: "2025",
    title: "The Next Chapter",
    body: "Expanding the Gurgaon Experience Centre, deepening our craft partnerships, and scaling the platform to serve architects, developers, and homeowners across India.",
  },
];

const VALUES = [
  {
    label: "Craftsmanship",
    description:
      "Every joint is hand-fitted. Every surface hand-finished. We employ seven master joiners who have spent decades perfecting their trade.",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=85",
  },
  {
    label: "Longevity",
    description:
      "We design for 50 years of use, not 5. Structural components are replaceable. Upholstery is re-upholsterable. Heirloom is not a marketing word — it is our engineering brief.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85",
  },
  {
    label: "Adaptability",
    description:
      "Life changes. Your home changes. Modulas pieces are designed to change with you — reconfigured, extended, or repurposed as your needs evolve.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=85",
  },
];

const TEAM = [
  {
    name: "Rohan Mehta",
    role: "Founder & Head of Design",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=85",
    quote: "I grew up watching my grandfather repair the same chair for forty years. That taught me everything.",
  },
  {
    name: "Clara Hoffmann",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=85",
    quote: "Good furniture disappears into a room. You stop seeing the piece and start seeing how you live.",
  },
  {
    name: "James Webb",
    role: "Head of Workshop",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=85",
    quote: "There is no shortcut in joinery. The joint either holds or it doesn't. We make sure it holds.",
  },
];

export default function OurStoryPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[520px] overflow-hidden bg-charcoal-950">
        <img
          src="https://images.unsplash.com/photo-1614268745612-e3f5da1e20c1?w=1600&q=90"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/30 via-transparent to-charcoal-950/70" />
        <div className="relative flex h-full flex-col justify-end px-6 pb-16 lg:px-20 lg:pb-24 max-w-[1440px] mx-auto">
          <p className="mb-4 font-sans text-[11px] tracking-[0.35em] uppercase text-cream/50">
            Est. 2021 · Gurgaon, India
          </p>
          <h1 className="font-serif text-5xl leading-tight text-cream md:text-6xl lg:text-7xl max-w-2xl">
            Where luxury feels<br />personal.
          </h1>
        </div>
      </section>

      {/* ── Opening statement ─────────────────────────────────────── */}
      <section className="bg-white py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="mb-6 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">
              Our Philosophy
            </p>
            <h2 className="font-serif text-4xl text-charcoal leading-snug mb-8">
              We started with one conviction: your interior should feel entirely your own.
            </h2>
            <div className="space-y-5 font-sans text-[15px] leading-relaxed text-charcoal/65">
              <p>
                Founded in 2021, Modulas is a contemporary luxury furniture studio based in Gurgaon, dedicated to redefining the way interiors are experienced. We design and craft bespoke furniture that seamlessly blends architectural precision with refined aesthetics.
              </p>
              <p>
                Our mission is to create spaces where luxury feels personal, design is intentional, and every interior stands out. Whether it's a modular kitchen, a bespoke wardrobe, or a fully configured living space — every Modulas piece begins with your brief.
              </p>
              <p>
                Modulas was never built around a catalogue. It was built around the conviction that furniture should adapt to your life — not the other way around.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=900&q=85"
              alt="The Modulas design studio"
              className="rounded-2xl w-full object-cover aspect-[4/5]"
            />
            <div className="absolute -bottom-6 -left-6 hidden lg:block bg-cream px-6 py-5 rounded-xl shadow-luxury max-w-[220px]">
              <p className="font-serif text-3xl text-charcoal">500+</p>
              <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/50 mt-1">happy clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────── */}
      <section className="bg-cream py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">What We Stand For</p>
          <h2 className="font-serif text-4xl text-charcoal mb-16 max-w-lg">Three principles that never change</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.label} className="group relative overflow-hidden rounded-2xl bg-white">
                <div className="overflow-hidden h-56">
                  <img
                    src={v.image}
                    alt={v.label}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-7">
                  <h3 className="font-serif text-2xl text-charcoal mb-3">{v.label}</h3>
                  <p className="font-sans text-[14px] leading-relaxed text-charcoal/60">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────── */}
      <section className="bg-white py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">The Journey</p>
          <h2 className="font-serif text-4xl text-charcoal mb-16 max-w-lg">Fourteen years of building something real</h2>
          <div className="relative">
            {/* vertical rule */}
            <div className="absolute left-[90px] top-0 bottom-0 w-px bg-black/8 hidden md:block" />
            <div className="space-y-10">
              {MILESTONES.map((m) => (
                <div key={m.year} className="flex gap-8 md:gap-12 items-start">
                  <div className="shrink-0 w-[70px] text-right">
                    <span className="font-serif text-[15px] text-charcoal/40">{m.year}</span>
                  </div>
                  {/* dot */}
                  <div className="hidden md:flex shrink-0 items-center justify-center w-5 h-5 mt-0.5">
                    <span className="block w-2 h-2 rounded-full bg-charcoal/30" />
                  </div>
                  <div className="flex-1 pb-10 border-b border-black/6 last:border-0 last:pb-0">
                    <h3 className="font-serif text-xl text-charcoal mb-2">{m.title}</h3>
                    <p className="font-sans text-[14px] leading-relaxed text-charcoal/60 max-w-xl">{m.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────── */}
      <section className="bg-charcoal-950 py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-cream/30">The People</p>
          <h2 className="font-serif text-4xl text-cream mb-16 max-w-lg">Made by people who care obsessively about what they make</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {TEAM.map((person) => (
              <div key={person.name} className="group">
                <div className="overflow-hidden rounded-2xl mb-6 aspect-[3/4]">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105 grayscale"
                  />
                </div>
                <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-cream/35 mb-1">{person.role}</p>
                <h3 className="font-serif text-xl text-cream mb-3">{person.name}</h3>
                <p className="font-sans text-[13px] leading-relaxed text-cream/50 italic">"{person.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-cream py-24 px-6 text-center">
        <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">See the Work</p>
        <h2 className="font-serif text-4xl text-charcoal mb-8 max-w-lg mx-auto">
          Every piece tells part of the story
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-charcoal-950 px-8 py-4 font-sans text-[12px] tracking-[0.2em] uppercase text-cream hover:bg-charcoal-800 transition-colors"
          >
            Explore the Collection
          </Link>
          <Link
            href="/sustainability"
            className="inline-flex items-center justify-center gap-2 border border-black/20 px-8 py-4 font-sans text-[12px] tracking-[0.2em] uppercase text-charcoal/70 hover:border-charcoal hover:text-charcoal transition-colors"
          >
            Our Sustainability Pledge
          </Link>
        </div>
      </section>
    </>
  );
}
