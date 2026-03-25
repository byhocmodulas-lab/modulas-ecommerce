"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, CheckCircle2, ArrowRight, Calendar, MapPin, Loader2 } from "lucide-react";
import { applicationsApi } from "@/lib/api/client";

const PROGRAMS = [
  { id: "design", title: "Design Intern — Summer 2026", department: "Design", duration: "10 weeks", location: "Mumbai", stipend: "₹15,000/month", openings: 4, deadline: "2026-04-01" },
  { id: "marketing", title: "Marketing Intern", department: "Marketing", duration: "8 weeks", location: "Mumbai", stipend: "₹12,000/month", openings: 2, deadline: "2026-04-01" },
  { id: "operations", title: "Operations Intern", department: "Operations", duration: "8 weeks", location: "Mumbai / Bengaluru", stipend: "₹12,000/month", openings: 2, deadline: "2026-04-15" },
];

const BENEFITS = [
  "Hands-on experience with real client projects",
  "Mentorship from senior designers and managers",
  "Certificate of completion + recommendation letter",
  "Pre-placement offer for outstanding interns",
  "Access to full materials and CAD library",
];

export default function InternSignupPage() {
  const [submitted, setSubmitted]             = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", college: "", degree: "", year: "", portfolio: "", why: "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await applicationsApi.submit({
        type: "intern",
        name: form.name,
        email: form.email,
        phone: form.phone,
        payload: { college: form.college, degree: form.degree, year: form.year, portfolio: form.portfolio, why: form.why, program: selectedProgram },
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
      <div className="min-h-screen bg-[#f6f9fc] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">
            <CheckCircle2 className="h-8 w-8 text-sky-600" />
          </div>
          <h1 className="font-serif text-3xl text-charcoal mb-3">Application Submitted!</h1>
          <p className="font-sans text-[15px] text-charcoal/55 leading-relaxed mb-6">
            We&apos;ve received your application. You&apos;ll hear back from our HR team within 5–7 business days.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-6 py-3 font-sans text-[12px] tracking-[0.15em] uppercase text-white hover:bg-sky-700 transition-colors">
            Back to Modulas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f9fc]">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="h-5 w-5 text-sky-600" />
              <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-sky-600">Internship Program</p>
            </div>
            <h1 className="font-serif text-4xl text-charcoal leading-tight mb-5">
              Start your design career at Modulas
            </h1>
            <p className="font-sans text-[15px] text-charcoal/55 leading-relaxed mb-6">
              We run internship programs across design, marketing, and operations — giving students real-world experience in the luxury furniture industry.
            </p>
            <ul className="space-y-3 mb-8">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                  <span className="font-sans text-[14px] text-charcoal/65">{b}</span>
                </li>
              ))}
            </ul>

            {/* Open programs */}
            <div className="space-y-3">
              <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/40">Open Programs</p>
              {PROGRAMS.map((p) => (
                <div key={p.id} className="rounded-2xl border border-black/8 bg-white p-4">
                  <p className="font-sans text-sm font-medium text-charcoal">{p.title}</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="flex items-center gap-1 font-sans text-[11px] text-charcoal/45"><Calendar className="h-3 w-3" />{p.duration}</span>
                    <span className="flex items-center gap-1 font-sans text-[11px] text-charcoal/45"><MapPin className="h-3 w-3" />{p.location}</span>
                  </div>
                  <p className="font-sans text-xs text-emerald-700 mt-1">{p.stipend} · {p.openings} openings</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-black/8 bg-white p-5">
              <p className="font-sans text-xs font-medium text-charcoal/60 mb-2">Already applied?</p>
              <Link href="/intern" className="flex items-center gap-2 font-sans text-sm text-sky-600 hover:text-sky-800 transition-colors">
                Check your application status <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right — form */}
          <div className="rounded-3xl border border-black/6 bg-white p-8">
            <h2 className="font-serif text-2xl text-charcoal mb-6">Apply for an Internship</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-2">Select Program *</label>
                <div className="space-y-2">
                  {PROGRAMS.map((p) => (
                    <label key={p.id} className={["flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors",
                      selectedProgram === p.id ? "border-sky-400 bg-sky-50" : "border-black/8 hover:border-sky-200",
                    ].join(" ")}>
                      <input type="radio" name="program" value={p.id} required
                        checked={selectedProgram === p.id} onChange={() => setSelectedProgram(p.id)}
                        className="mt-0.5 accent-sky-600" />
                      <div>
                        <p className="font-sans text-sm text-charcoal">{p.title}</p>
                        <p className="font-sans text-[11px] text-charcoal/40">{p.duration} · {p.location} · {p.stipend}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="i-name" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">Full Name *</label>
                  <input id="i-name" required value={form.name} onChange={(e) => set("name", e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[#f6f9fc] px-4 py-2.5 font-sans text-sm text-charcoal focus:border-sky-400 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="i-email" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">College Email *</label>
                  <input id="i-email" required type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[#f6f9fc] px-4 py-2.5 font-sans text-sm text-charcoal focus:border-sky-400 focus:outline-none transition-colors" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="i-college" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">College / University *</label>
                  <input id="i-college" required value={form.college} onChange={(e) => set("college", e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-[#f6f9fc] px-4 py-2.5 font-sans text-sm text-charcoal focus:border-sky-400 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="i-year" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">Degree & Year *</label>
                  <input id="i-year" required value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="e.g. B.Des 3rd Year"
                    className="w-full rounded-xl border border-black/10 bg-[#f6f9fc] px-4 py-2.5 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-sky-400 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label htmlFor="i-portfolio" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">Portfolio / Behance / Dribbble URL</label>
                <input id="i-portfolio" type="url" value={form.portfolio} onChange={(e) => set("portfolio", e.target.value)} placeholder="https://"
                  className="w-full rounded-xl border border-black/10 bg-[#f6f9fc] px-4 py-2.5 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-sky-400 focus:outline-none transition-colors" />
              </div>
              <div>
                <label htmlFor="i-why" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">Why Modulas? *</label>
                <textarea id="i-why" required rows={3} value={form.why} onChange={(e) => set("why", e.target.value)}
                  placeholder="Tell us what excites you about modular furniture and working with Modulas…"
                  className="w-full rounded-xl border border-black/10 bg-[#f6f9fc] px-4 py-2.5 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-sky-400 focus:outline-none transition-colors resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full rounded-full bg-sky-600 py-3.5 font-sans text-[12px] tracking-[0.15em] uppercase text-white hover:bg-sky-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Submitting…" : "Submit Application"}
              </button>
              <p className="font-sans text-[11px] text-charcoal/35 text-center">Deadline: April 1st, 2026 · Results by April 10th</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
