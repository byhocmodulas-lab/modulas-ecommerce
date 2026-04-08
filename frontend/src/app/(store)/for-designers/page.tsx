import Link from "next/link";
import type { Metadata } from "next";
import { TradeGate } from "./trade-gate";

export const metadata: Metadata = {
  title: "For Architects & Designers — Trade Programme | Modulas",
  description: "Modulas trade programme for architects, interior designers, and developers. Tiered trade discounts up to 40%, dedicated account management, technical drawings, and material library access.",
  keywords: [
    "architecture trade programme furniture India",
    "interior designer trade discount India",
    "furniture for architects India",
    "trade pricing interior design India",
    "BIM CAD furniture files India",
    "luxury furniture trade India",
  ],
  alternates: { canonical: "https://modulas.in/for-designers" },
  openGraph: {
    title: "For Architects & Designers — Trade Programme | Modulas",
    description: "Tiered trade discounts up to 40%, dedicated account management, technical drawings, and material library for design professionals.",
    url: "https://modulas.in/for-designers",
  },
};


export default function ForDesignersPage() {
  return (
    <>
      {/* ── Hero — always public ───────────────────────────────── */}
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
              href="/signup?role=architect&redirect=/for-designers"
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

      {/* ── Gated content — requires login + approval ─────────── */}
      <TradeGate />
    </>
  );
}
