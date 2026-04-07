import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bespoke Custom Furniture — Commission a Piece | Modulas",
  description:
    "Commission a piece made entirely to your specification — dimensions, materials, finish, and configuration. Every Modulas bespoke order is designed for your space and crafted to your exact brief.",
  keywords: [
    "bespoke furniture India",
    "custom furniture commission India",
    "custom made furniture Gurgaon",
    "bespoke sofa India",
    "made to measure furniture India",
    "luxury custom furniture India",
    "handcrafted bespoke furniture Delhi NCR",
  ],
  alternates: { canonical: "https://modulas.in/bespoke" },
  openGraph: {
    title: "Bespoke Custom Furniture — Commission a Piece | Modulas",
    description: "Commission furniture made entirely to your specification. Designed for your space, crafted to your exact brief.",
    url: "https://modulas.in/bespoke",
  },
};

const PROCESS = [
  {
    step: "01",
    title: "Initial Consultation",
    body: "Tell us what you have in mind — a sketch, a reference image, or just a description. We'll arrange a call or showroom visit with our design team to understand your space, lifestyle, and vision.",
    duration: "1–2 days",
  },
  {
    step: "02",
    title: "Design & Specification",
    body: "We produce a detailed specification drawing with exact dimensions, material callouts, and finish selections. You'll see the piece in our 3D configurator before anything is made.",
    duration: "1–2 weeks",
  },
  {
    step: "03",
    title: "Quotation & Deposit",
    body: "We provide a fixed-price quotation with no hidden costs. A 50% deposit confirms your order and triggers production planning. The balance is due 2 weeks before dispatch.",
    duration: "2–3 days",
  },
  {
    step: "04",
    title: "Making",
    body: "Your piece is crafted by our team of skilled artisans — joinery, upholstery, and finishing completed to the highest standard. You receive progress photos at key milestones.",
    duration: "6–14 weeks",
  },
  {
    step: "05",
    title: "Quality Review",
    body: "Every bespoke piece undergoes a full structural and aesthetic quality review before dispatch. We photograph the finished piece in our studio and send you a preview.",
    duration: "3–5 days",
  },
  {
    step: "06",
    title: "White Glove Delivery",
    body: "Two-person White Glove delivery to your room of choice. We unpack, position, remove all packaging, and won't leave until you're completely satisfied.",
    duration: "Scheduled to suit",
  },
];

const WHAT_WE_MAKE = [
  {
    category: "Seating",
    items: ["Sofas & sectionals", "Armchairs", "Dining chairs", "Ottomans & benches", "Window seats"],
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=85",
  },
  {
    category: "Tables",
    items: ["Dining tables", "Coffee tables", "Console tables", "Side tables", "Desk surfaces"],
    image: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=700",
  },
  {
    category: "Storage",
    items: ["Shelving systems", "Wardrobes", "Sideboards & credenzas", "Bookcases", "Media units"],
    image: "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=700",
  },
  {
    category: "Beds",
    items: ["Bed frames (all sizes)", "Upholstered headboards", "Bedside tables", "Blanket boxes", "Dressing tables"],
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&q=85",
  },
];

const MATERIALS = [
  { name: "Solid Oak", note: "European FSC-certified, air-dried 3 years" },
  { name: "Solid Walnut", note: "American black walnut, FSC-certified" },
  { name: "Solid Ash", note: "English ash, available smoked or natural" },
  { name: "Solid Maple", note: "Hard maple, ideal for painted finishes" },
  { name: "Boucle Fabric", note: "40+ colourways, Oeko-Tex certified" },
  { name: "Linen", note: "Belgian linen, natural & dyed in 28 tones" },
  { name: "Wool", note: "100% wool bouclé and tweed, UK-woven" },
  { name: "Leather", note: "Full-grain Italian leather, 32 hides" },
  { name: "Velvet", note: "Silk-cotton velvet, 16 jewel tones" },
  { name: "Performance fabric", note: "Crypton and Sunbrella for high-use pieces" },
  { name: "Brass", note: "Solid brass hardware, unlacquered or satin" },
  { name: "Blackened steel", note: "For frame details and legs" },
];

export default function BespokePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-[65vh] min-h-[480px] overflow-hidden bg-charcoal-950">
        <img
          src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1600&q=90"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-charcoal-950/80" />
        <div className="relative flex h-full flex-col justify-end px-6 pb-16 lg:px-20 lg:pb-24 max-w-[1440px] mx-auto">
          <p className="mb-4 font-sans text-[11px] tracking-[0.35em] uppercase text-cream/40">Bespoke Orders</p>
          <h1 className="font-serif text-5xl leading-tight text-cream md:text-6xl max-w-2xl">
            Made exactly as you imagined it.
          </h1>
          <p className="mt-5 font-sans text-[15px] text-cream/55 max-w-lg leading-relaxed">
            No catalogue constraints. Every dimension, material, finish, and detail chosen by you — designed with architectural precision for your space.
          </p>
        </div>
      </section>

      {/* ── Intro ─────────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-[1fr_2fr] gap-16">
          <div>
            <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40 mb-4">Why Bespoke</p>
            <div className="space-y-1">
              {["Any dimension", "130+ fabrics & leathers", "12 timber finishes", "Lifetime structural warranty", "6–14 week lead time"].map((item) => (
                <div key={item} className="flex items-center gap-3 py-3 border-b border-black/6">
                  <span className="block h-1.5 w-1.5 rounded-full bg-charcoal/30 shrink-0" />
                  <span className="font-sans text-[13px] text-charcoal/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5 font-sans text-[15px] leading-relaxed text-charcoal/65">
            <p>
              Most furniture is designed to fit as many homes as possible. Bespoke furniture is designed to fit yours. The dimensions that work in a 3.2-metre room are different from those that work in a 4.8-metre one. The fabric that suits a family with three children is different from one in a second home used twice a year.
            </p>
            <p>
              Every Modulas bespoke order starts with a conversation. We want to understand how you live, how you use the room, and what you want the piece to feel like — not just how it should look. From there, our design team produces a specification that your piece is made to exactly.
            </p>
            <p>
              Lead times run from 6 to 14 weeks depending on complexity. We don't rush. The piece is ready when it is ready — and when it arrives, it fits perfectly.
            </p>
          </div>
        </div>
      </section>

      {/* ── What we make ──────────────────────────────────────────── */}
      <section className="bg-cream py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">What We Make</p>
          <h2 className="font-serif text-4xl text-charcoal mb-14 max-w-lg">Every category, entirely on your terms</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHAT_WE_MAKE.map((cat) => (
              <div key={cat.category} className="group bg-white rounded-2xl overflow-hidden">
                <div className="overflow-hidden h-44">
                  <img
                    src={cat.image}
                    alt={cat.category}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg text-charcoal mb-3">{cat.category}</h3>
                  <ul className="space-y-1">
                    {cat.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="block h-px w-3 bg-black/20 shrink-0" />
                        <span className="font-sans text-[12px] text-charcoal/55">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ───────────────────────────────────────────────── */}
      <section className="bg-white py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">The Process</p>
          <h2 className="font-serif text-4xl text-charcoal mb-14 max-w-lg">From first conversation to delivery</h2>
          <div className="grid gap-px bg-black/6 lg:grid-cols-3 rounded-2xl overflow-hidden">
            {PROCESS.map((p) => (
              <div key={p.step} className="bg-white p-8">
                <div className="flex items-start justify-between mb-4">
                  <span className="font-serif text-4xl text-black/8 leading-none">{p.step}</span>
                  <span className="font-sans text-[10px] tracking-[0.12em] uppercase text-charcoal/30 bg-black/4 px-2.5 py-1 rounded-full">{p.duration}</span>
                </div>
                <h3 className="font-serif text-xl text-charcoal mb-3">{p.title}</h3>
                <p className="font-sans text-[13px] leading-relaxed text-charcoal/55">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Materials ─────────────────────────────────────────────── */}
      <section className="bg-cream py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">Materials</p>
          <h2 className="font-serif text-4xl text-charcoal mb-14 max-w-lg">Every material, sustainably sourced</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {MATERIALS.map((m) => (
              <div key={m.name} className="bg-white rounded-xl p-5 border border-black/6">
                <p className="font-sans font-semibold text-charcoal text-[13px] mb-1">{m.name}</p>
                <p className="font-sans text-[11px] text-charcoal/45 leading-snug">{m.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 font-sans text-[12px] text-charcoal/40">
            Don't see what you need? We source materials to spec. Email <a href="mailto:bespoke@modulas.com" className="text-charcoal underline underline-offset-2">bespoke@modulas.com</a>.
          </p>
        </div>
      </section>

      {/* ── Pricing context ───────────────────────────────────────── */}
      <section className="bg-white py-20 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">Pricing</p>
            <h2 className="font-serif text-4xl text-charcoal mb-6">Fixed-price quotations. No surprises.</h2>
            <p className="font-sans text-[15px] leading-relaxed text-charcoal/65 mb-6">
              We quote every bespoke commission as a fixed price. Once you've approved the specification, the price doesn't change — regardless of material costs or production time.
            </p>
            <div className="space-y-4">
              {[
                ["Bespoke armchair", "From £1,800"],
                ["Bespoke sofa (2-seat)", "From £3,200"],
                ["Bespoke sofa (3-seat)", "From £4,500"],
                ["Dining table (6–8 seat)", "From £2,800"],
                ["Full shelving system", "From £3,500"],
                ["Bespoke bed frame", "From £2,200"],
              ].map(([item, price]) => (
                <div key={item as string} className="flex items-center justify-between py-3 border-b border-black/6">
                  <span className="font-sans text-[14px] text-charcoal/70">{item}</span>
                  <span className="font-sans text-[14px] font-medium text-charcoal">{price}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 font-sans text-[12px] text-charcoal/40">All prices include VAT. Delivery charged separately based on location.</p>
          </div>
          <div className="overflow-hidden rounded-2xl aspect-[4/5]">
            <img
              src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=900&q=85"
              alt=""
              aria-hidden
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-charcoal-950 py-24 px-6 text-center">
        <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-cream/30">Start Your Commission</p>
        <h2 className="font-serif text-4xl text-cream mb-5 max-w-xl mx-auto">Ready to begin?</h2>
        <p className="font-sans text-[14px] text-cream/50 mb-10 max-w-md mx-auto">
          Tell us what you have in mind. Our design team will respond within one working day to arrange a consultation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact?subject=bespoke-enquiry"
            className="inline-flex items-center justify-center gap-2 bg-white px-8 py-4 font-sans text-[12px] tracking-[0.2em] uppercase text-charcoal hover:bg-cream transition-colors"
          >
            Start a Bespoke Enquiry
          </Link>
          <a
            href="mailto:bespoke@modulas.com"
            className="inline-flex items-center justify-center gap-2 border border-white/15 px-8 py-4 font-sans text-[12px] tracking-[0.2em] uppercase text-cream/70 hover:border-white/40 hover:text-cream transition-colors"
          >
            Email Bespoke Team
          </a>
        </div>
      </section>
    </>
  );
}
