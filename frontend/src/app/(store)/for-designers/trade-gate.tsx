"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth-store";

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
  { label: "Technical Drawings", desc: "AutoCAD and PDF elevations, plans, and sections for every product — ready to drop into your drawings.", icon: "📐" },
  { label: "Material Library", desc: "Digital swatches, physical sample kits, and specification sheets for all 120+ finishes and materials.", icon: "🎨" },
  { label: "Standard Modules", desc: "Full modular dimension guide — kitchen carcass sizes, wardrobe module widths, standard heights and depths.", icon: "📏" },
  { label: "BIM/Revit Files", desc: "Revit families and SketchUp models for our most specified products, updated with every new launch.", icon: "🏗️" },
  { label: "Specification Guide", desc: "Complete specification document with product codes, lead times, packaging sizes, and installation requirements.", icon: "📋" },
  { label: "B2B Enquiry Portal", desc: "Submit project briefs, track orders, access invoices, and manage multiple client projects in one place.", icon: "🔗" },
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

/* ── Gate overlay ────────────────────────────────────────────── */
function NotLoggedIn() {
  return (
    <div className="relative">
      {/* Blurred preview of tier cards */}
      <div className="pointer-events-none select-none blur-sm opacity-40 overflow-hidden max-h-[340px]">
        <div className="bg-cream py-20 px-6 lg:px-12">
          <div className="mx-auto max-w-[1440px] grid lg:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <div key={tier.name} className={`rounded-2xl p-8 ${tier.featured ? "bg-charcoal-950" : "bg-white border border-black/8"}`}>
                <p className={`font-sans text-[11px] tracking-[0.2em] uppercase mb-2 ${tier.featured ? "text-gold" : "text-charcoal/50"}`}>{tier.name}</p>
                <p className="font-serif text-5xl text-gold mb-1">{tier.discount}</p>
                <p className={`font-sans text-[12px] ${tier.featured ? "text-cream/50" : "text-charcoal/45"}`}>Trade Discount · {tier.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay gate */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/60 via-white/90 to-white">
        <div className="text-center max-w-md px-6">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/8">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-charcoal mb-3">Sign in to view trade details</h2>
          <p className="font-sans text-[13px] text-charcoal/55 leading-relaxed mb-7">
            Trade pricing, tier benefits, technical resources, and the application form are available to registered professionals only.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login?redirect=/for-designers"
              className="rounded-full bg-gold px-7 py-3 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup?role=architect&redirect=/for-designers"
              className="rounded-full border border-charcoal/20 px-7 py-3 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal/70 hover:border-charcoal hover:text-charcoal transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function PendingApproval({ email }: { email: string }) {
  return (
    <section className="bg-cream py-20 px-6 lg:px-12">
      <div className="mx-auto max-w-[1440px] flex flex-col items-center text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
          </svg>
        </div>
        <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Application Received</p>
        <h2 className="font-serif text-4xl text-charcoal mb-4">Your application is under review</h2>
        <p className="font-sans text-[14px] text-charcoal/55 leading-relaxed max-w-lg mb-3">
          We've received your trade programme application for <strong className="text-charcoal font-medium">{email}</strong>.
          Our team reviews all applications within 2 working days.
        </p>
        <p className="font-sans text-[13px] text-charcoal/40 mb-10">
          You'll receive an email once your account is approved and trade pricing is activated.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/contact"
            className="rounded-full border border-charcoal/20 px-6 py-3 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal/70 hover:border-charcoal hover:text-charcoal transition-colors"
          >
            Contact Trade Team
          </Link>
          <Link
            href="/modular-solutions"
            className="rounded-full bg-gold px-6 py-3 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
          >
            Browse Solutions
          </Link>
        </div>
      </div>
    </section>
  );
}

function FullContent() {
  return (
    <>
      {/* ── Tier cards ─────────────────────────────────────────── */}
      <section className="bg-cream py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Trade Tiers</p>
          <h2 className="font-serif text-4xl text-charcoal mb-14">Three tiers. One team behind all of them.</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  tier.featured ? "bg-charcoal-950 text-cream ring-2 ring-gold" : "bg-white border border-black/8 text-charcoal"
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-block rounded-full bg-gold px-3 py-1 font-sans text-[9px] tracking-[0.2em] uppercase text-charcoal-950">
                    Most Popular
                  </span>
                )}
                <div className="mb-6">
                  <p className={`font-sans text-[11px] tracking-[0.2em] uppercase mb-2 ${tier.featured ? "text-gold" : "text-charcoal/50"}`}>{tier.name}</p>
                  <p className="font-serif text-5xl text-gold mb-1">{tier.discount}</p>
                  <p className={`font-sans text-[12px] ${tier.featured ? "text-cream/50" : "text-charcoal/45"}`}>Trade Discount · {tier.revenue}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {tier.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <span className="mt-0.5 h-4 w-4 shrink-0 flex items-center justify-center rounded-full bg-gold/20">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="3.5" strokeLinecap="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      <span className={`font-sans text-[13px] leading-snug ${tier.featured ? "text-cream/75" : "text-charcoal/65"}`}>{b}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="#apply"
                  className={`text-center rounded-full py-3 font-sans text-[11px] tracking-[0.15em] uppercase transition-colors ${
                    tier.featured ? "bg-gold text-charcoal-950 hover:bg-gold-400" : "border border-black/15 text-charcoal/60 hover:border-charcoal hover:text-charcoal"
                  }`}
                >
                  Apply as {tier.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Resources ──────────────────────────────────────────── */}
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

      {/* ── Case studies ───────────────────────────────────────── */}
      <section className="bg-cream py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-2 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Trade Partners</p>
          <h2 className="font-serif text-4xl text-charcoal mb-14">What our partners say</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {CASE_STUDIES.map((cs) => (
              <div key={cs.designer} className="rounded-2xl overflow-hidden bg-white border border-black/6">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={cs.imageUrl} alt={cs.project} className="h-full w-full object-cover" />
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

      {/* ── Apply ──────────────────────────────────────────────── */}
      <section id="apply" className="bg-charcoal-950 py-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-2 gap-14">
          <div>
            <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Eligibility</p>
            <h2 className="font-serif text-4xl text-cream mb-5">Who can apply?</h2>
            <p className="font-sans text-[14px] text-cream/55 leading-relaxed mb-8">
              Our trade programme is open to all qualified professionals working in the built environment.
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
                <input id="fd-city" type="text" placeholder="Your city" className="w-full rounded-lg bg-white/8 border border-cream/10 px-4 py-3 font-sans text-sm text-cream/80 placeholder:text-cream/25 focus:outline-none focus:border-gold/40 transition-colors" />
              </div>
              <button type="submit" className="w-full rounded-full bg-gold py-4 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors">
                Submit Application
              </button>
            </div>
            <p className="mt-4 font-sans text-[11px] text-cream/25 text-center">We review applications within 2 working days. No commitment required.</p>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Main gate component ─────────────────────────────────────── */
export function TradeGate() {
  const [mounted, setMounted] = useState(false);
  const user   = useAuthStore((s) => s.user);
  const authed = useAuthStore((s) => s.isAuthenticated());

  useEffect(() => setMounted(true), []);

  // SSR: render nothing gated (hero is in the parent server component)
  if (!mounted) return null;

  // Not logged in
  if (!authed || !user) return <NotLoggedIn />;

  // Logged in but not an approved architect
  const isApproved = (user.role === "architect" || user.role === "master_admin" || user.role === "editor") && user.isVerified;
  if (!isApproved) return <PendingApproval email={user.email} />;

  // Approved architect — show everything
  return <FullContent />;
}
