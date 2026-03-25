import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sustainability — Modulas",
  description:
    "Our commitment to responsible making — from FSC-certified timber and natural dyes to carbon-neutral manufacturing and zero-waste packaging.",
};

const PILLARS = [
  {
    number: "01",
    title: "Responsible Materials",
    body: "Every piece of solid timber we use is FSC or PEFC certified, sourced from sustainably managed European forests. Our natural oil and wax finishes are water-based and solvent-free. Upholstery fabrics are either organic cotton, recycled polyester, or Oeko-Tex certified wool.",
    stat: "100%",
    statLabel: "certified timber",
    image: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&q=85",
  },
  {
    number: "02",
    title: "Carbon-Neutral Workshop",
    body: "Since 2025, our Gurgaon studio runs on renewable energy — on-site solar generation and a certified green energy tariff. We offset logistics emissions through verified reforestation projects across India.",
    stat: "0",
    statLabel: "net carbon since 2025",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=85",
  },
  {
    number: "03",
    title: "Zero-Waste Packaging",
    body: "All Modulas pieces ship in fully compostable packaging — moulded paper pulp for rigid components, wool blankets for upholstered pieces, and water-activated paper tape. We eliminated single-use plastic from our supply chain in 2023.",
    stat: "0",
    statLabel: "single-use plastic",
    image: "https://images.unsplash.com/photo-1542601906897-e0e8da9b7b84?w=800&q=85",
  },
  {
    number: "04",
    title: "Built to Be Repaired",
    body: "We publish repair guides for every product we make. Structural components carry a lifetime warranty. Upholstery is designed to be re-upholstered — we sell replacement fabric kits and offer a national re-upholstery service.",
    stat: "50+",
    statLabel: "year design life",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=85",
  },
];

const TARGETS = [
  { year: "2026", target: "Full supply chain transparency report published annually." },
  { year: "2027", target: "All delivery partners switched to electric or cargo-bike last-mile in UK cities." },
  { year: "2028", target: "10,000 trees planted through the Modulas Forest initiative." },
  { year: "2030", target: "Net-positive carbon manufacturing — sequestering more than we emit." },
];

const CERTIFICATIONS = [
  { name: "FSC Certified", description: "Forest Stewardship Council — all solid timber" },
  { name: "Oeko-Tex 100", description: "Certified for all upholstery fabrics" },
  { name: "B Corp Pending", description: "Assessment in progress since Q1 2026" },
  { name: "ISO 14001", description: "Environmental management system certified" },
];

export default function SustainabilityPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-[65vh] min-h-[480px] overflow-hidden bg-charcoal-950">
        <img
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=90"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-charcoal-950/80" />
        <div className="relative flex h-full flex-col justify-end px-6 pb-16 lg:px-20 lg:pb-24 max-w-[1440px] mx-auto">
          <p className="mb-4 font-sans text-[11px] tracking-[0.35em] uppercase text-cream/40">
            Our Commitment
          </p>
          <h1 className="font-serif text-5xl leading-tight text-cream md:text-6xl max-w-2xl">
            Making beautifully.<br />Leaving lightly.
          </h1>
        </div>
      </section>

      {/* ── Intro statement ───────────────────────────────────────── */}
      <section className="bg-white py-20 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-[1fr_2fr] gap-16">
          <div>
            <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40 mb-4">Why It Matters</p>
            <div className="space-y-1">
              {["Carbon neutral", "Zero-waste packaging", "FSC timber only", "Lifetime repairability"].map((item) => (
                <div key={item} className="flex items-center gap-3 py-3 border-b border-black/6">
                  <span className="block h-1.5 w-1.5 rounded-full bg-charcoal/30 shrink-0" />
                  <span className="font-sans text-[13px] text-charcoal/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6 font-sans text-[15px] leading-relaxed text-charcoal/65">
            <p>
              The furniture industry is one of the most material-intensive manufacturing sectors in the world. Billions of pieces are produced annually, the majority from fast-cycle materials designed to last a few years before ending up in landfill.
            </p>
            <p>
              We believe this is wrong. And we believe the answer is not buying less — it is buying better. Furniture that is made to last, made from materials that can return to the earth, and made by people who earn a fair wage.
            </p>
            <p>
              Sustainability at Modulas is not a marketing position. It is a set of decisions we make every day — in the materials we choose, the finishes we use, the packaging we ship in, and the way we design every joint and every panel so that it can be repaired, not replaced.
            </p>
          </div>
        </div>
      </section>

      {/* ── Four Pillars ──────────────────────────────────────────── */}
      <section className="bg-cream py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">Our Four Pillars</p>
          <h2 className="font-serif text-4xl text-charcoal mb-16 max-w-xl">How we put responsibility into practice</h2>
          <div className="space-y-6">
            {PILLARS.map((p, i) => (
              <div
                key={p.number}
                className={`grid lg:grid-cols-[1fr_1fr] gap-0 overflow-hidden rounded-2xl bg-white ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
              >
                {/* Image */}
                <div className="overflow-hidden h-64 lg:h-auto">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <p className="font-serif text-5xl text-black/8 mb-4 leading-none">{p.number}</p>
                  <h3 className="font-serif text-2xl text-charcoal mb-4">{p.title}</h3>
                  <p className="font-sans text-[14px] leading-relaxed text-charcoal/60 mb-8">{p.body}</p>
                  <div className="border-t border-black/8 pt-6 flex items-end gap-2">
                    <span className="font-serif text-4xl text-charcoal leading-none">{p.stat}</span>
                    <span className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40 mb-1">{p.statLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certifications ────────────────────────────────────────── */}
      <section className="bg-white py-20 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">Certifications & Standards</p>
          <h2 className="font-serif text-4xl text-charcoal mb-12 max-w-lg">Independently verified. Publicly accountable.</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CERTIFICATIONS.map((cert) => (
              <div key={cert.name} className="border border-black/8 rounded-xl p-6 hover:border-charcoal/20 transition-colors">
                <div className="h-10 w-10 rounded-full bg-charcoal/6 flex items-center justify-center mb-4">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal/50">
                    <path d="M9 12l2 2 4-4" />
                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
                  </svg>
                </div>
                <h3 className="font-sans text-[13px] font-semibold text-charcoal mb-1">{cert.name}</h3>
                <p className="font-sans text-[12px] text-charcoal/50 leading-snug">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2030 Roadmap ──────────────────────────────────────────── */}
      <section className="bg-charcoal-950 py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-[1fr_2fr] gap-16 items-start">
          <div>
            <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-cream/30">What's Next</p>
            <h2 className="font-serif text-4xl text-cream leading-snug">Our 2030 sustainability roadmap</h2>
          </div>
          <div className="space-y-0">
            {TARGETS.map((t) => (
              <div key={t.year} className="flex gap-8 items-start py-7 border-b border-white/8 last:border-0">
                <span className="font-serif text-[15px] text-cream/30 shrink-0 w-12">{t.year}</span>
                <p className="font-sans text-[14px] leading-relaxed text-cream/60">{t.target}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Materials pull-quote ──────────────────────────────────── */}
      <section className="bg-cream py-24 px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="font-serif text-3xl md:text-4xl text-charcoal leading-snug mb-10">
            "The most sustainable piece of furniture is the one you never have to replace."
          </p>
          <p className="font-sans text-[12px] tracking-[0.2em] uppercase text-charcoal/40 mb-10">— Rohan Mehta, Founder</p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-charcoal-950 px-8 py-4 font-sans text-[12px] tracking-[0.2em] uppercase text-cream hover:bg-charcoal-800 transition-colors"
          >
            Shop Responsibly Made Pieces
          </Link>
        </div>
      </section>
    </>
  );
}
