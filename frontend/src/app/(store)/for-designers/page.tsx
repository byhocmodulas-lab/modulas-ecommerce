import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Architects & Designers — Trade Programme | Modulas",
  description: "Modulas trade programme for architects, interior designers, and developers. Tiered trade discounts up to 40%, dedicated account management, technical drawings, and material library access.",
};

const TIERS = [
  {
    name: "Associate",
    discount: "25%",
    revenue: "Up to ₹25L / year",
    benefits: [
      "25% trade discount on all products",
      "Dedicated account manager",
      "Access to material & finish library",
      "Priority delivery scheduling",
      "Co-branded project photography",
    ],
  },
  {
    name: "Partner",
    discount: "33%",
    revenue: "₹25L–₹75L / year",
    benefits: [
      "33% trade discount on all products",
      "Senior dedicated account manager",
      "Full technical drawing library",
      "BIM / CAD file downloads",
      "Quarterly product previews",
      "On-site project support",
    ],
    featured: true,
  },
  {
    name: "Principal",
    discount: "40%",
    revenue: "₹75L+ / year",
    benefits: [
      "40% trade discount on all products",
      "Director-level account management",
      "Custom specification development",
      "White-label options available",
      "Volume pricing on developer projects",
      "Annual business planning sessions",
      "First access to new products",
    ],
  },
];

const RESOURCES = [
  {
    label: "Technical Drawings",
    desc: "AutoCAD and PDF elevations, plans, and sections for every product — ready to drop into your drawings.",
    icon: "📐",
  },
  {
    label: "Material Library",
    desc: "Digital swatches, physical sample kits, and specification sheets for all 120+ finishes and materials.",
    icon: "🎨",
  },
  {
    label: "Standard Modules",
    desc: "Full modular dimension guide — kitchen carcass sizes, wardrobe module widths, standard heights and depths.",
    icon: "📏",
  },
  {
    label: "BIM/Revit Files",
    desc: "Revit families and SketchUp models for our most specified products, updated with every new launch.",
    icon: "🏗️",
  },
  {
    label: "Specification Guide",
    desc: "Complete specification document with product codes, lead times, packaging sizes, and installation requirements.",
    icon: "📋",
  },
  {
    label: "B2B Enquiry Portal",
    desc: "Submit project briefs, track orders, access invoices, and manage multiple client projects in one place.",
    icon: "🔗",
  },
];

const CASE_STUDIES = [
  {
    designer: "Priya Sharma Design Studio",
    city: "Mumbai",
    project: "18-flat developer project",
    result: "₹42L in modular kitchens and wardrobes across 18 units. 3-week installation window met.",
    imageUrl: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    designer: "Space Story Interiors",
    city: "Bengaluru",
    project: "Luxury villa fit-out",
    result: "Complete home — kitchen, 4 wardrobes, study, and living room storage. 5-star client review.",
    imageUrl: "https://images.pexels.com/photos/6890343/pexels-photo-6890343.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    designer: "Axis Architecture",
    city: "Pune",
    project: "Co-living project, 45 rooms",
    result: "45 modular wardrobe units delivered in 6 weeks. Contract-grade, 5-year extended warranty.",
    imageUrl: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

export default function ForDesignersPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-charcoal-950 min-h-[58vh] flex items-end">
        <img
          src="https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-charcoal-950/90" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12 pb-20 pt-40 w-full">
          <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Trade Programme</p>
          <h1 className="font-serif text-5xl text-cream md:text-7xl mb-5 max-w-3xl leading-tight">
            For Architects & Designers
          </h1>
          <p className="font-sans text-[15px] text-cream/55 max-w-xl leading-relaxed mb-10">
            Partner with Modulas to deliver exceptional modular kitchens, wardrobes, and furniture for your clients — with trade discounts up to 40%, dedicated support, and full technical resources.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="#apply"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
            >
              Apply to the Programme
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-7 py-3.5 font-sans text-[12px] tracking-[0.15em] uppercase text-cream/80 hover:border-cream hover:text-cream transition-colors"
            >
              Talk to a Trade Manager
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tier cards ────────────────────────────────────────── */}
      <section className="bg-cream py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Trade Tiers</p>
          <h2 className="font-serif text-4xl text-charcoal mb-14">Three tiers. One team behind all of them.</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  tier.featured
                    ? "bg-charcoal-950 text-cream ring-2 ring-gold"
                    : "bg-white border border-black/8 text-charcoal"
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-block rounded-full bg-gold px-3 py-1 font-sans text-[9px] tracking-[0.2em] uppercase text-charcoal-950">
                    Most Popular
                  </span>
                )}
                <div className="mb-6">
                  <p className={`font-sans text-[11px] tracking-[0.2em] uppercase mb-2 ${tier.featured ? "text-gold" : "text-charcoal/50"}`}>
                    {tier.name}
                  </p>
                  <p className="font-serif text-5xl text-gold mb-1">{tier.discount}</p>
                  <p className={`font-sans text-[12px] ${tier.featured ? "text-cream/50" : "text-charcoal/45"}`}>
                    Trade Discount · {tier.revenue}
                  </p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {tier.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <span className="mt-0.5 h-4 w-4 shrink-0 flex items-center justify-center rounded-full bg-gold/20">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="3.5" strokeLinecap="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      <span className={`font-sans text-[13px] leading-snug ${tier.featured ? "text-cream/75" : "text-charcoal/65"}`}>
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="#apply"
                  className={`text-center rounded-full py-3 font-sans text-[11px] tracking-[0.15em] uppercase transition-colors ${
                    tier.featured
                      ? "bg-gold text-charcoal-950 hover:bg-gold-400"
                      : "border border-black/15 text-charcoal/60 hover:border-charcoal hover:text-charcoal"
                  }`}
                >
                  Apply as {tier.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Resources ─────────────────────────────────────────── */}
      <section className="bg-white py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Resources</p>
          <h2 className="font-serif text-4xl text-charcoal mb-14">Everything you need to specify Modulas</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESOURCES.map((res) => (
              <div key={res.label} className="rounded-2xl border border-black/8 p-6 hover:border-gold/25 transition-colors group">
                <p className="text-2xl mb-3">{res.icon}</p>
                <h3 className="font-serif text-lg text-charcoal mb-2 group-hover:text-gold transition-colors">{res.label}</h3>
                <p className="font-sans text-[13px] text-charcoal/55 leading-relaxed">{res.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Case studies ──────────────────────────────────────── */}
      <section className="bg-cream py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Trade Partners</p>
          <h2 className="font-serif text-4xl text-charcoal mb-14">What our partners say</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {CASE_STUDIES.map((cs) => (
              <div key={cs.designer} className="rounded-2xl overflow-hidden bg-white border border-black/6">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={cs.imageUrl}
                    alt={cs.project}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold mb-2">{cs.city} · {cs.project}</p>
                  <h3 className="font-serif text-base text-charcoal mb-2">{cs.designer}</h3>
                  <p className="font-sans text-[12px] text-charcoal/55 leading-relaxed">{cs.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Eligibility & Apply ───────────────────────────────── */}
      <section id="apply" className="bg-charcoal-950 py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-2 gap-14">
          <div>
            <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Eligibility</p>
            <h2 className="font-serif text-4xl text-cream mb-5">Who can apply?</h2>
            <p className="font-sans text-[14px] text-cream/55 leading-relaxed mb-8">
              Our trade programme is open to all qualified professionals working in the built environment. We're flexible — if you specify furniture for clients, we want to work with you.
            </p>
            <ul className="space-y-3">
              {[
                "Registered architects (COA-registered)",
                "Interior designers and design studios",
                "Property developers and builders",
                "Landscape and hospitality designers",
                "Turnkey contractors and PMC firms",
                "Home staging and styling professionals",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                  <span className="font-sans text-[13px] text-cream/65">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Application form */}
          <div className="rounded-2xl border border-cream/10 bg-white/4 p-8">
            <h3 className="font-serif text-2xl text-cream mb-6">Express interest</h3>
            <div className="space-y-4">
              {["Full Name", "Studio / Company Name", "Email Address", "Phone Number"].map((f) => {
                const id = `fd-${f.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, "")}`;
                return (
                  <div key={f}>
                    <label htmlFor={id} className="block font-sans text-[11px] tracking-[0.12em] uppercase text-cream/40 mb-1.5">{f}</label>
                    <input
                      id={id}
                      type={f === "Email Address" ? "email" : f === "Phone Number" ? "tel" : "text"}
                      placeholder={f}
                      className="w-full rounded-lg bg-white/8 border border-cream/10 px-4 py-3 font-sans text-sm text-cream/80 placeholder:text-cream/25 focus:outline-none focus:border-gold/40 transition-colors"
                    />
                  </div>
                );
              })}
              <div>
                <label htmlFor="fd-city" className="block font-sans text-[11px] tracking-[0.12em] uppercase text-cream/40 mb-1.5">City</label>
                <input
                  id="fd-city"
                  type="text"
                  placeholder="Your city"
                  className="w-full rounded-lg bg-white/8 border border-cream/10 px-4 py-3 font-sans text-sm text-cream/80 placeholder:text-cream/25 focus:outline-none focus:border-gold/40 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-gold py-4 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
              >
                Submit Application
              </button>
            </div>
            <p className="mt-4 font-sans text-[11px] text-cream/25 text-center">
              We review applications within 2 working days. No commitment required.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
