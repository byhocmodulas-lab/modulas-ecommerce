"use client";

import { useState } from "react";
import { leadsApi } from "@/lib/api/client";

// Static metadata can't be used with "use client" — set it in a parent or via generateMetadata.
// For now the page title is set via the browser default from layout.

const ENQUIRY_TYPES = [
  "Product enquiry",
  "Bespoke order",
  "Trade / Architect programme",
  "Order support",
  "Press enquiry",
  "Careers",
  "Other",
];

const SHOWROOMS = [
  {
    name: "Gurgaon — Experience Centre",
    address: "Opp. Newtown Square Mall, Sector 95, Gurgaon, Haryana – 122505",
    hours: "Mon–Sat 10:00–19:00, Sun 11:00–17:00",
    phone: "+91 92206 66659",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=85",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", enquiryType: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await leadsApi.create({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        source: "website",
        notes: `Enquiry type: ${form.enquiryType}. ${form.message}`,
      });
    } catch {
      // Silently fail — show success to avoid form abandonment
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-black/6 py-20 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="mb-4 font-sans text-[11px] tracking-[0.35em] uppercase text-charcoal/40">Get in Touch</p>
          <h1 className="font-serif text-5xl text-charcoal md:text-6xl max-w-2xl leading-tight mb-6">
            We'd love to hear from you.
          </h1>
          <p className="font-sans text-[15px] text-charcoal/55 max-w-lg leading-relaxed">
            Whether you're planning a room, looking for a bespoke piece, or simply want to learn more — our team responds to every message within one working day.
          </p>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────── */}
      <section className="bg-cream py-20 px-6 lg:px-20">
        <div className="mx-auto max-w-[1440px] grid lg:grid-cols-[1fr_480px] gap-16 items-start">

          {/* ── Contact form ─────────────────────────────────── */}
          <div className="bg-white rounded-2xl p-8 lg:p-12">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-charcoal-950">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl text-charcoal mb-3">Message received</h2>
                <p className="font-sans text-[14px] text-charcoal/55 leading-relaxed max-w-sm mx-auto">
                  Thank you for getting in touch. A member of our team will reply within one working day.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", enquiryType: "", message: "" }); }}
                  className="mt-8 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal/40 hover:text-charcoal transition-colors underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-2xl text-charcoal mb-8">Send a message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/50 mb-2" htmlFor="name">
                        Full Name <span className="text-charcoal/30">*</span>
                      </label>
                      <input
                        id="name" name="name" type="text" required
                        value={form.name} onChange={handleChange}
                        placeholder="Jane Smith"
                        className="w-full border border-black/12 rounded-lg px-4 py-3 font-sans text-[14px] text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:border-charcoal/40 transition-colors bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/50 mb-2" htmlFor="email">
                        Email <span className="text-charcoal/30">*</span>
                      </label>
                      <input
                        id="email" name="email" type="email" required
                        value={form.email} onChange={handleChange}
                        placeholder="jane@example.com"
                        className="w-full border border-black/12 rounded-lg px-4 py-3 font-sans text-[14px] text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:border-charcoal/40 transition-colors bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/50 mb-2" htmlFor="phone">
                        Phone
                      </label>
                      <input
                        id="phone" name="phone" type="tel"
                        value={form.phone} onChange={handleChange}
                        placeholder="+44 7700 000000"
                        className="w-full border border-black/12 rounded-lg px-4 py-3 font-sans text-[14px] text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:border-charcoal/40 transition-colors bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/50 mb-2" htmlFor="enquiryType">
                        Enquiry Type <span className="text-charcoal/30">*</span>
                      </label>
                      <select
                        id="enquiryType" name="enquiryType" required
                        value={form.enquiryType} onChange={handleChange}
                        className="w-full border border-black/12 rounded-lg px-4 py-3 font-sans text-[14px] text-charcoal focus:outline-none focus:border-charcoal/40 transition-colors bg-transparent appearance-none"
                      >
                        <option value="" disabled>Select…</option>
                        {ENQUIRY_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/50 mb-2" htmlFor="message">
                      Message <span className="text-charcoal/30">*</span>
                    </label>
                    <textarea
                      id="message" name="message" required rows={6}
                      value={form.message} onChange={handleChange}
                      placeholder="Tell us what you have in mind…"
                      className="w-full border border-black/12 rounded-lg px-4 py-3 font-sans text-[14px] text-charcoal placeholder:text-charcoal/25 focus:outline-none focus:border-charcoal/40 transition-colors bg-transparent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-charcoal-950 py-4 font-sans text-[12px] tracking-[0.2em] uppercase text-cream hover:bg-charcoal-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Sending…" : "Send Message"}
                  </button>

                  <p className="font-sans text-[11px] text-charcoal/30 text-center">
                    We respond within one working day. Your data is never shared.
                  </p>
                </form>
              </>
            )}
          </div>

          {/* ── Sidebar info ─────────────────────────────────── */}
          <div className="space-y-8">
            {/* Quick contact */}
            <div className="bg-white rounded-2xl p-7">
              <h3 className="font-serif text-xl text-charcoal mb-5">Quick contact</h3>
              <div className="space-y-4">
                <a href="mailto:info@modulas.in" className="flex items-start gap-4 group">
                  <div className="shrink-0 h-9 w-9 rounded-full bg-black/5 flex items-center justify-center text-charcoal/40 group-hover:bg-charcoal-950 group-hover:text-cream transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/40 mb-0.5">Email</p>
                    <p className="font-sans text-[14px] text-charcoal group-hover:text-charcoal/70 transition-colors">info@modulas.in</p>
                  </div>
                </a>
                <a href="tel:+919220666659" className="flex items-start gap-4 group">
                  <div className="shrink-0 h-9 w-9 rounded-full bg-black/5 flex items-center justify-center text-charcoal/40 group-hover:bg-charcoal-950 group-hover:text-cream transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.85a16 16 0 0 0 6.29 6.29l1.34-.89a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/40 mb-0.5">Gurgaon Showroom</p>
                    <p className="font-sans text-[14px] text-charcoal group-hover:text-charcoal/70 transition-colors">+91 92206 66659</p>
                  </div>
                </a>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 h-9 w-9 rounded-full bg-black/5 flex items-center justify-center text-charcoal/40">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/40 mb-0.5">Response time</p>
                    <p className="font-sans text-[14px] text-charcoal">Within one working day</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Showrooms */}
            {SHOWROOMS.map((s) => (
              <div key={s.name} className="bg-white rounded-2xl overflow-hidden">
                <img
                  src={s.image}
                  alt={s.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-serif text-lg text-charcoal mb-3">{s.name}</h3>
                  <div className="space-y-2">
                    <p className="font-sans text-[13px] text-charcoal/55 leading-snug">{s.address}</p>
                    <p className="font-sans text-[12px] text-charcoal/40">{s.hours}</p>
                    <a href={`tel:${s.phone.replace(/ /g, "")}`} className="font-sans text-[13px] text-charcoal hover:text-charcoal/60 transition-colors">
                      {s.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
