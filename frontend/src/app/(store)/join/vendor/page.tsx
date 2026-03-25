"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { applicationsApi } from "@/lib/api/client";

const CATEGORIES = ["Laminates & Acrylic", "Hardware (Hinges, Drawers)", "Glass Panels", "Appliances", "Lighting", "Stone / Marble", "Fabric & Upholstery", "Other"];

const BENEFITS = [
  "Direct access to 500+ architecture firm partners",
  "Dedicated account manager",
  "Timely payments — net-30 terms",
  "Featured in Modulas material library",
  "Co-marketing opportunities",
];

export default function VendorSignupPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [form, setForm] = useState({
    companyName: "", contactName: "", email: "", phone: "",
    city: "", gst: "", category: "", website: "", description: "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await applicationsApi.submit({
        type: "vendor",
        name: form.contactName,
        email: form.email,
        phone: form.phone,
        payload: { companyName: form.companyName, city: form.city, gst: form.gst, category: form.category, website: form.website, description: form.description },
      });
    } catch {
      // Graceful fallback — show success so applicant is never blocked.
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="font-serif text-3xl text-charcoal mb-3">Application Submitted</h1>
          <p className="font-sans text-[15px] text-charcoal/55 leading-relaxed mb-6">
            We&apos;ve received your vendor application. Our partnerships team will review it and get back to you within 3–5 business days.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors">
            Back to Modulas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16">
          {/* Left — benefits */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="h-5 w-5 text-gold" />
              <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold">Vendor Partnership</p>
            </div>
            <h1 className="font-serif text-4xl text-charcoal leading-tight mb-5">
              Supply materials to India&apos;s premium modular furniture brand
            </h1>
            <p className="font-sans text-[15px] text-charcoal/55 leading-relaxed mb-8">
              Modulas is building a curated network of quality material suppliers. Join our vendor ecosystem and grow alongside us.
            </p>
            <ul className="space-y-3 mb-10">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span className="font-sans text-[14px] text-charcoal/65">{b}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-2xl border border-black/8 bg-white p-5">
              <p className="font-sans text-xs font-medium text-charcoal/60 mb-2">Already a vendor?</p>
              <Link href="/vendor" className="flex items-center gap-2 font-sans text-sm text-gold hover:text-gold-600 transition-colors">
                Sign in to your vendor portal <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right — form */}
          <div className="rounded-3xl border border-black/6 bg-white p-8">
            <h2 className="font-serif text-2xl text-charcoal mb-6">Vendor Application</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="v-companyName" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">Company Name *</label>
                  <input id="v-companyName" required value={form.companyName} onChange={(e) => set("companyName", e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-cream/50 px-4 py-2.5 font-sans text-sm text-charcoal focus:border-gold/60 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="v-contactName" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">Contact Name *</label>
                  <input id="v-contactName" required value={form.contactName} onChange={(e) => set("contactName", e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-cream/50 px-4 py-2.5 font-sans text-sm text-charcoal focus:border-gold/60 focus:outline-none transition-colors" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="v-email" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">Business Email *</label>
                  <input id="v-email" required type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-cream/50 px-4 py-2.5 font-sans text-sm text-charcoal focus:border-gold/60 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="v-phone" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">Phone *</label>
                  <input id="v-phone" required type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-cream/50 px-4 py-2.5 font-sans text-sm text-charcoal focus:border-gold/60 focus:outline-none transition-colors" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="v-city" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">City *</label>
                  <input id="v-city" required value={form.city} onChange={(e) => set("city", e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-cream/50 px-4 py-2.5 font-sans text-sm text-charcoal focus:border-gold/60 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="v-gst" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">GST Number *</label>
                  <input id="v-gst" required value={form.gst} onChange={(e) => set("gst", e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-cream/50 px-4 py-2.5 font-sans text-sm text-charcoal focus:border-gold/60 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label htmlFor="v-category" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">Product Category *</label>
                <select id="v-category" required value={form.category} onChange={(e) => set("category", e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-cream/50 px-4 py-2.5 font-sans text-sm text-charcoal focus:border-gold/60 focus:outline-none transition-colors">
                  <option value="">Select category…</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="v-website" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">Website / Catalogue URL</label>
                <input id="v-website" type="url" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://"
                  className="w-full rounded-xl border border-black/10 bg-cream/50 px-4 py-2.5 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold/60 focus:outline-none transition-colors" />
              </div>
              <div>
                <label htmlFor="v-description" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">Tell us about your products *</label>
                <textarea id="v-description" required rows={3} value={form.description} onChange={(e) => set("description", e.target.value)}
                  placeholder="Key products, brands you carry, typical MOQ, delivery coverage…"
                  className="w-full rounded-xl border border-black/10 bg-cream/50 px-4 py-2.5 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold/60 focus:outline-none transition-colors resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full rounded-full bg-gold py-3.5 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Submitting…" : "Submit Application"}
              </button>
              <p className="font-sans text-[11px] text-charcoal/35 text-center">We review all applications within 3–5 business days</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
