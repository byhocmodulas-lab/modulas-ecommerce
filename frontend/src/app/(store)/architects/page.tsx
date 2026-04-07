import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trade Programme for Architects & Designers — Modulas",
  description:
    "Modulas Trade: exclusive pricing up to 40%, dedicated account management, and a sample library for architects, interior designers, and specifiers across India.",
  keywords: [
    "furniture trade programme India",
    "architect trade discount furniture",
    "interior designer furniture discount India",
    "trade pricing luxury furniture",
    "furniture specifier programme India",
    "Modulas trade architect",
  ],
  alternates: { canonical: "https://modulas.in/architects" },
  openGraph: {
    title: "Trade Programme for Architects & Designers — Modulas",
    description: "Exclusive trade pricing up to 40%, dedicated account management, and sample library for architects and designers.",
    url: "https://modulas.in/architects",
  },
};

const BENEFITS = [
  {
    title: "Trade Pricing",
    body: "Verified trade members receive 25–40% off our standard retail prices, with tiered discounts that increase with annual spend.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    title: "Dedicated Account Manager",
    body: "One person who knows your practice, your clients, and your projects. Direct line, fast responses, and proactive material alerts.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    title: "Sample Library",
    body: "Request up to 10 fabric, leather, and timber samples per project — shipped same day. Samples can be retained for the duration of a project.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    title: "Priority Lead Times",
    body: "Trade orders are prioritised in our production schedule. Standard lead times are reduced by 2–3 weeks for verified trade members.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    title: "Bespoke Specification",
    body: "Every dimension, finish, and fabric combination is available. Our team works with your spec sheets and CAD drawings to ensure perfect fit.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
  {
    title: "Project Invoicing",
    body: "Consolidated invoicing per project with 30-day payment terms. Ideal for multi-piece residential and commercial commissions.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Apply online", body: "Complete the short application form below. We verify all applicants against a professional register (RIBA, BIID, BCFA, or equivalent)." },
  { step: "02", title: "Verification (1–2 days)", body: "Our trade team reviews your application. Most practices are verified within one working day. You'll receive your trade account credentials by email." },
  { step: "03", title: "Get your sample kit", body: "Once verified, we send a curated sample kit of our most specified fabrics and timbers — free of charge, yours to keep." },
  { step: "04", title: "Place your first order", body: "Log in at modulas.in/trade to access trade pricing, your sample library, and your account manager's direct contact details." },
];

const PROJECTS = [
  {
    name: "DLF Camellias Penthouse",
    practice: "Studio Sablo, Gurgaon",
    description: "Bespoke modular living system in warm-grey boucle across the main reception and lounge. Fully configured to the client's floor plan.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=85",
  },
  {
    name: "Lodha Altamount Villa",
    practice: "Morphogenesis Design, Mumbai",
    description: "Full modular shelving system in solid walnut with integrated concealed lighting — 12 units spanning library, study, and corridor.",
    image: "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=700",
  },
  {
    name: "Oberoi Realty Residence",
    practice: "Kumar Interior Design, Delhi",
    description: "Bespoke dining table in smoked oak with 8 custom chairs in natural linen. Delivered and installed within 5 weeks.",
    image: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=700",
  },
];

const TIERS = [
  { name: "Associate", spend: "Up to £25,000/yr", discount: "25% off RRP", extras: ["Sample library access", "Trade pricing", "Priority support"] },
  { name: "Partner", spend: "£25,000–£100,000/yr", discount: "33% off RRP", extras: ["Everything in Associate", "Dedicated account manager", "Priority lead times", "30-day payment terms"] },
  { name: "Principal", spend: "Over £100,000/yr", discount: "40% off RRP", extras: ["Everything in Partner", "Early access to new products", "Custom fabric development", "Exclusive showroom events"] },
];

export default function ArchitectsPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-[65vh] min-h-[480px] overflow-hidden bg-charcoal-950">
        <img
          src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1600&q=90"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-charcoal-950/80" />
        <div className="relative flex h-full flex-col justify-end px-6 pb-16 lg:px-20 lg:pb-24 max-w-[1440px] mx-auto">
          <p className="mb-4 font-sans text-[11px] tracking-[0.35em] uppercase text-cream/40">Trade Programme</p>
          <h1 className="font-serif text-5xl leading-tight text-cream md:text-6xl max-w-2xl">
            Built for the people who specify.
          </h1>
          <p className="mt-5 font-sans text-[15px] text-cream/55 max-w-lg leading-relaxed">
            Exclusive pricing, priority lead times, a sample library, and one person who picks up the phone. Everything your practice needs from a furniture partner.
          </p>
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────────────────────── */}
      <section className="bg-white py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">What You Get</p>
          <h2 className="font-serif text-4xl text-charcoal mb-14 max-w-lg">Six reasons practices choose Modulas Trade</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex gap-5 p-6 rounded-2xl border border-black/6 hover:border-black/15 transition-colors">
                <div className="shrink-0 h-10 w-10 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal/50">
                  {b.icon}
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-charcoal text-[14px] mb-1.5">{b.title}</h3>
                  <p className="font-sans text-[13px] leading-relaxed text-charcoal/55">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing tiers ─────────────────────────────────────────── */}
      <section className="bg-cream py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">Trade Pricing</p>
          <h2 className="font-serif text-4xl text-charcoal mb-14 max-w-lg">Tiers that grow with your practice</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {TIERS.map((tier, i) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-8 flex flex-col ${i === 1 ? "bg-charcoal-950 text-cream" : "bg-white border border-black/8"}`}
              >
                <p className={`font-sans text-[11px] tracking-[0.2em] uppercase mb-3 ${i === 1 ? "text-cream/40" : "text-charcoal/40"}`}>{tier.spend}</p>
                <h3 className={`font-serif text-2xl mb-1 ${i === 1 ? "text-cream" : "text-charcoal"}`}>{tier.name}</h3>
                <p className={`font-serif text-4xl mb-6 ${i === 1 ? "text-cream" : "text-charcoal"}`}>{tier.discount}</p>
                <div className="space-y-2.5 mt-auto">
                  {tier.extras.map((e) => (
                    <div key={e} className="flex items-center gap-2.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={i === 1 ? "text-cream/50" : "text-charcoal/30"}>
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      <span className={`font-sans text-[13px] ${i === 1 ? "text-cream/65" : "text-charcoal/60"}`}>{e}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 font-sans text-[12px] text-charcoal/40 text-center">Tier status is reviewed annually. Spend is calculated on a rolling 12-month basis.</p>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section className="bg-white py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">Getting Started</p>
            <h2 className="font-serif text-4xl text-charcoal mb-12 max-w-md">Trade account in four steps</h2>
            <div className="space-y-8">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.step} className="flex gap-6">
                  <span className="font-serif text-3xl text-black/10 shrink-0 w-10 leading-none">{step.step}</span>
                  <div>
                    <h3 className="font-serif text-lg text-charcoal mb-1">{step.title}</h3>
                    <p className="font-sans text-[13px] leading-relaxed text-charcoal/55">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl aspect-[4/5]">
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=85"
              alt=""
              aria-hidden
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Project showcase ──────────────────────────────────────── */}
      <section className="bg-cream py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-charcoal/40">Project Portfolio</p>
          <h2 className="font-serif text-4xl text-charcoal mb-14 max-w-lg">Work we've done with specifiers</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {PROJECTS.map((p) => (
              <div key={p.name} className="group rounded-2xl bg-white overflow-hidden">
                <div className="overflow-hidden h-56">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40 mb-1">{p.practice}</p>
                  <h3 className="font-serif text-lg text-charcoal mb-2">{p.name}</h3>
                  <p className="font-sans text-[13px] leading-relaxed text-charcoal/55">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Apply CTA ─────────────────────────────────────────────── */}
      <section className="bg-charcoal-950 py-24 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="mb-4 font-sans text-[11px] tracking-[0.3em] uppercase text-cream/30">Apply Now</p>
            <h2 className="font-serif text-4xl text-cream mb-5">Start your trade account</h2>
            <p className="font-sans text-[14px] text-cream/55 leading-relaxed mb-8 max-w-md">
              Verification takes 1–2 working days. Once approved, your trade pricing is active immediately and your sample kit is dispatched the same week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact?subject=trade-application"
                className="inline-flex items-center justify-center gap-2 bg-white px-8 py-4 font-sans text-[12px] tracking-[0.2em] uppercase text-charcoal hover:bg-cream transition-colors"
              >
                Apply for Trade Account
              </Link>
              <a
                href="mailto:trade@modulas.in"
                className="inline-flex items-center justify-center gap-2 border border-white/15 px-8 py-4 font-sans text-[12px] tracking-[0.2em] uppercase text-cream/70 hover:border-white/40 hover:text-cream transition-colors"
              >
                Email Trade Team
              </a>
            </div>
          </div>
          <div className="space-y-3">
            {["RIBA registered architects", "BIID & BIDA interior designers", "BCFA specifiers", "Hospitality & commercial designers", "Property developers", "Set designers & stylists"].map((type) => (
              <div key={type} className="flex items-center gap-3 py-3 border-b border-white/6">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cream/30 shrink-0">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span className="font-sans text-[13px] text-cream/60">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
