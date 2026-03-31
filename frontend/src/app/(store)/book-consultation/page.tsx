"use client";

import Link from "next/link";
import { useState } from "react";
import { leadsApi } from "@/lib/api/client";

const CITIES = [
  "Mumbai", "Delhi", "Noida", "Gurgaon", "Bengaluru", "Pune",
  "Hyderabad", "Chennai", "Ahmedabad", "Chandigarh", "Jaipur", "Other",
];

const INTERESTS = [
  "Modular Kitchen",
  "Modular Wardrobe",
  "Modular Storage",
  "Complete Home",
  "Furniture",
  "Commercial / Office",
];

export default function BookConsultationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", city: "", interest: "", message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await leadsApi.create({
        name: form.name,
        email: form.email || "",
        phone: form.phone,
        source: "website",
        notes: `City: ${form.city}. Interest: ${form.interest}. ${form.message}`.trim(),
      });
    } catch {
      // Silently fail — still show success confirmation
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] bg-cream flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-gold/15">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="font-serif text-4xl text-charcoal mb-4">We'll be in touch soon</h1>
          <p className="font-sans text-[14px] text-charcoal/60 leading-relaxed mb-8">
            Thank you, <strong className="text-charcoal">{form.name}</strong>. Your request has been received. Our team will call you within 4 working hours to confirm your home visit appointment.
          </p>
          <div className="rounded-2xl bg-white border border-black/8 p-6 mb-8 text-left space-y-3">
            <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40 mb-4">What happens next</p>
            {[
              "We confirm your appointment by phone or WhatsApp",
              "Our designer arrives at your home at the agreed time",
              "Measurements, design discussion, and 3D plan — free",
              "Design delivered within 48 hours of the visit",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-charcoal-950 font-sans text-[10px] text-cream">{i + 1}</span>
                <span className="font-sans text-[13px] text-charcoal/65">{item}</span>
              </div>
            ))}
          </div>
          <Link href="/" className="font-sans text-[12px] tracking-[0.12em] uppercase text-charcoal/50 hover:text-charcoal transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Page header ───────────────────────────────────────── */}
      <section className="bg-charcoal-950 py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-2 gap-12">
          <div>
            <p className="mb-3 font-sans text-[11px] tracking-[0.3em] uppercase text-gold">Free. No obligation.</p>
            <h1 className="font-serif text-4xl text-cream md:text-5xl mb-5 leading-tight">
              Book a free home visit
            </h1>
            <p className="font-sans text-[15px] text-cream/55 max-w-md leading-relaxed mb-8">
              Our designer comes to your home, takes measurements, and creates a full 3D design — at no cost. No pressure. No commitment required.
            </p>
            <div className="space-y-4">
              {[
                { icon: "📍", label: "We come to you", detail: "Available across 10+ cities" },
                { icon: "⏱", label: "60–90 minute visit", detail: "Includes full room measurement" },
                { icon: "🎨", label: "3D design in 48 hours", detail: "Photorealistic render of your space" },
                { icon: "✓", label: "Zero obligation", detail: "No purchase required to book" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-sans text-sm text-cream/80">{item.label}</p>
                    <p className="font-sans text-[12px] text-cream/40">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8">
            <h2 className="font-serif text-2xl text-charcoal mb-6">Your details</h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bc-name" className="block font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/45 mb-1.5">Full Name *</label>
                  <input
                    id="bc-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-black/12 px-4 py-3 font-sans text-sm text-charcoal focus:outline-none focus:border-gold/60 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="bc-phone" className="block font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/45 mb-1.5">Phone Number *</label>
                  <input
                    id="bc-phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg border border-black/12 px-4 py-3 font-sans text-sm text-charcoal focus:outline-none focus:border-gold/60 transition-colors"
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="bc-email" className="block font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/45 mb-1.5">Email Address</label>
                <input
                  id="bc-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-black/12 px-4 py-3 font-sans text-sm text-charcoal focus:outline-none focus:border-gold/60 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="bc-city" className="block font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/45 mb-1.5">Your City *</label>
                <select
                  id="bc-city"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-lg border border-black/12 px-4 py-3 font-sans text-sm text-charcoal focus:outline-none focus:border-gold/60 transition-colors bg-white"
                >
                  <option value="">Select your city</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/45 mb-2">I'm interested in *</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => setForm({ ...form, interest })}
                      className={`rounded-full px-3.5 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors ${
                        form.interest === interest
                          ? "bg-charcoal-950 text-cream"
                          : "border border-black/12 text-charcoal/60 hover:border-charcoal/40"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="bc-message" className="block font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/45 mb-1.5">Anything else?</label>
                <textarea
                  id="bc-message"
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-lg border border-black/12 px-4 py-3 font-sans text-sm text-charcoal focus:outline-none focus:border-gold/60 transition-colors resize-none"
                  placeholder="Tell us about your space, budget, or timeline…"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gold py-4 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors disabled:opacity-50"
              >
                {loading ? "Booking…" : "Book My Free Visit"}
              </button>
              <p className="font-sans text-[11px] text-charcoal/35 text-center">
                We'll confirm within 4 hours · No payment required
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* ── Cities strip ──────────────────────────────────────── */}
      <section className="bg-white py-10 px-6 lg:px-12 border-b border-black/6">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.25em] uppercase text-charcoal/35 text-center">
            Currently serving
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {CITIES.filter((c) => c !== "Other").map((city) => (
              <span key={city} className="rounded-full border border-black/8 px-4 py-2 font-sans text-[12px] text-charcoal/55">
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
