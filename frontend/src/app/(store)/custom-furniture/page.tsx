import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Furniture — Made to Your Exact Specifications | Modulas",
  description:
    "Every dimension, material, and finish is adjustable. Our designers create bespoke furniture exactly as you imagine it — from a single piece to a complete room.",
};

const PROCESS = [
  {
    step: "01",
    label: "Design Consultation",
    body: "Tell us what you need. Bring photos, measurements, or just an idea. Our designers will sketch it out with you.",
  },
  {
    step: "02",
    label: "3D Visualisation",
    body: "We build a photorealistic 3D render of your piece — so you can see exactly what you're getting before we start.",
  },
  {
    step: "03",
    label: "Material Selection",
    body: "Choose from 80+ woods, 50+ fabrics, 30+ leathers, and 20+ metal finishes. We send physical samples to your door.",
  },
  {
    step: "04",
    label: "Handcrafted Production",
    body: "Your piece is built to order in our workshop by master craftsmen. No shortcuts. No particle board. Just solid construction.",
  },
  {
    step: "05",
    label: "White-Glove Delivery",
    body: "Delivered and placed in your room. Packaging removed. Final inspection done. You approve before we leave.",
  },
];

const POPULAR_CUSTOMS = [
  {
    label: "Bespoke Sofas",
    body: "Any width. Any depth. Any configuration. Any fabric.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    href: "/furniture/seating",
  },
  {
    label: "Custom Dining Tables",
    body: "Solid slabs, custom lengths, any wood species or stone top.",
    image: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/furniture/dining",
  },
  {
    label: "Built-in Wardrobes",
    body: "Floor-to-ceiling fitted to your exact alcove or room width.",
    image: "https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/modular-solutions/wardrobes",
  },
  {
    label: "Home Office Systems",
    body: "Fitted desks, bookshelves, and cabinets built around your workflow.",
    image: "https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "/furniture/study",
  },
];

const GUARANTEES = [
  { label: "10-Year Structural Warranty", body: "Every joint, frame, and mechanism." },
  { label: "Handcrafted in India", body: "Skilled craftsmen. Sustainable materials." },
  { label: "Free Home Visit", body: "Measure, plan, and design — at no cost." },
  { label: "Exact Pricing Upfront", body: "Fixed quote before production begins. No surprises." },
];

export default function CustomFurniturePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal-950 min-h-[65vh] flex items-end">
        <img
          src="https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/10 via-transparent to-charcoal-950/92" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12 pb-20 pt-40 w-full">
          <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">
            Custom Furniture
          </p>
          <h1 className="font-serif text-5xl text-cream md:text-7xl mb-5 max-w-3xl leading-tight">
            Exactly what you imagined.
          </h1>
          <p className="font-sans text-[15px] text-cream/55 max-w-lg leading-relaxed mb-10">
            Every dimension, material, finish, and configuration is yours to define.
            Our craftsmen bring it to life — one piece at a time.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/book-consultation"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
            >
              Start Your Custom Order
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-8 py-4 font-sans text-[12px] tracking-[0.15em] uppercase text-cream/70 hover:border-cream hover:text-cream transition-colors"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Popular custom pieces */}
      <section className="bg-white py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Popular</p>
          <h2 className="font-serif text-4xl text-charcoal mb-12">What we make most</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_CUSTOMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-cream"
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <h3 className="font-serif text-xl text-cream mb-1 group-hover:text-gold transition-colors">
                    {item.label}
                  </h3>
                  <p className="font-sans text-[12px] text-cream/55">{item.body}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-cream py-24 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">How It Works</p>
          <h2 className="font-serif text-4xl text-charcoal mb-16">
            From idea to your room in 5 steps
          </h2>
          <div className="space-y-0">
            {PROCESS.map((p, i) => (
              <div
                key={p.step}
                className={`flex gap-8 items-start py-8 ${
                  i < PROCESS.length - 1 ? "border-b border-black/8" : ""
                }`}
              >
                <span className="font-serif text-5xl text-gold/30 leading-none shrink-0 w-16">
                  {p.step}
                </span>
                <div>
                  <h3 className="font-serif text-xl text-charcoal mb-2">{p.label}</h3>
                  <p className="font-sans text-[14px] text-charcoal/55 leading-relaxed max-w-xl">
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="bg-charcoal-950 py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Our Promise</p>
          <h2 className="font-serif text-4xl text-cream mb-12">Built with confidence</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GUARANTEES.map((g) => (
              <div key={g.label} className="border border-white/8 rounded-2xl p-6">
                <h3 className="font-serif text-lg text-cream mb-2">{g.label}</h3>
                <p className="font-sans text-[13px] text-cream/40 leading-relaxed">{g.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 px-6 lg:px-12 border-t border-black/6">
        <div className="mx-auto max-w-[1440px] text-center">
          <h2 className="font-serif text-4xl text-charcoal mb-4">
            Ready to create something unique?
          </h2>
          <p className="font-sans text-[14px] text-charcoal/50 max-w-md mx-auto mb-8">
            Book a free home visit. Our designers will measure your space and bring your idea to life — at no cost, no obligation.
          </p>
          <Link
            href="/book-consultation"
            className="inline-flex rounded-full bg-gold px-10 py-4 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
          >
            Book Your Free Design Visit
          </Link>
        </div>
      </section>
    </>
  );
}
