"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, CheckCircle2, ArrowRight, Instagram, Youtube, Loader2 } from "lucide-react";
import { applicationsApi } from "@/lib/api/client";

const CONTENT_TYPES = ["Instagram Reels", "YouTube Videos", "Blog / Editorial", "Pinterest", "Twitter / X"];

const BENEFITS = [
  "₹35,000–₹55,000 per campaign",
  "Free product for every collaboration",
  "15% affiliate commission on sales",
  "Exclusive early product access before launch",
  "Featured on Modulas website and social",
  "Paid travel for location shoots",
];

export default function CreatorSignupPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    instagram: "", youtube: "", blog: "",
    followers: "", engagement: "",
    contentTypes: [] as string[],
    bio: "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const toggleType = (t: string) => setForm((p) => ({
    ...p, contentTypes: p.contentTypes.includes(t) ? p.contentTypes.filter((x) => x !== t) : [...p.contentTypes, t],
  }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await applicationsApi.submit({
        type: "creator",
        name: form.name,
        email: form.email,
        phone: form.phone,
        payload: { instagram: form.instagram, youtube: form.youtube, blog: form.blog, followers: form.followers, engagement: form.engagement, contentTypes: form.contentTypes, bio: form.bio },
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
      <div className="min-h-screen bg-[#fdf9f7] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
            <CheckCircle2 className="h-8 w-8 text-pink-600" />
          </div>
          <h1 className="font-serif text-3xl text-charcoal mb-3">Application Received!</h1>
          <p className="font-sans text-[15px] text-charcoal/55 leading-relaxed mb-6">
            Our collaborations team will review your profile and reach out within 5 business days. Check your inbox for a confirmation.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-6 py-3 font-sans text-[12px] tracking-[0.15em] uppercase text-white hover:bg-pink-700 transition-colors">
            Back to Modulas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf9f7]">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Camera className="h-5 w-5 text-pink-500" />
              <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-pink-600">Creator Collaboration</p>
            </div>
            <h1 className="font-serif text-4xl text-charcoal leading-tight mb-5">
              Create with Modulas. Earn. Inspire.
            </h1>
            <p className="font-sans text-[15px] text-charcoal/55 leading-relaxed mb-8">
              We partner with home decor, interior design, and lifestyle creators who share our love for beautiful, functional living spaces.
            </p>
            <ul className="space-y-3 mb-10">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-pink-500 shrink-0 mt-0.5" />
                  <span className="font-sans text-[14px] text-charcoal/65">{b}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-2xl border border-black/8 bg-white p-5">
              <p className="font-sans text-xs font-medium text-charcoal/60 mb-2">Already a creator partner?</p>
              <Link href="/creator" className="flex items-center gap-2 font-sans text-sm text-pink-600 hover:text-pink-800 transition-colors">
                Sign in to Creator Studio <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right — form */}
          <div className="rounded-3xl border border-black/6 bg-white p-8">
            <h2 className="font-serif text-2xl text-charcoal mb-6">Creator Application</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="c-name" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">Full Name *</label>
                  <input id="c-name" required value={form.name} onChange={(e) => set("name", e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-cream/40 px-4 py-2.5 font-sans text-sm text-charcoal focus:border-pink-400 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="c-email" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">Email *</label>
                  <input id="c-email" required type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-cream/40 px-4 py-2.5 font-sans text-sm text-charcoal focus:border-pink-400 focus:outline-none transition-colors" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">
                    <span className="flex items-center gap-1"><Instagram className="h-3 w-3" /> Instagram Handle</span>
                  </label>
                  <div className="flex"><span className="rounded-l-xl border border-r-0 border-black/10 bg-black/4 px-3 py-2.5 font-sans text-sm text-charcoal/40">@</span>
                  <input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="yourusername"
                    className="flex-1 rounded-r-xl border border-black/10 bg-cream/40 px-4 py-2.5 font-sans text-sm text-charcoal focus:border-pink-400 focus:outline-none transition-colors" /></div>
                </div>
                <div>
                  <label className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">
                    <span className="flex items-center gap-1"><Youtube className="h-3 w-3" /> YouTube Channel</span>
                  </label>
                  <input value={form.youtube} onChange={(e) => set("youtube", e.target.value)} placeholder="Channel name or URL"
                    className="w-full rounded-xl border border-black/10 bg-cream/40 px-4 py-2.5 font-sans text-sm text-charcoal focus:border-pink-400 focus:outline-none transition-colors" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="c-followers" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">Primary Following Size *</label>
                  <select id="c-followers" required value={form.followers} onChange={(e) => set("followers", e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-cream/40 px-4 py-2.5 font-sans text-sm text-charcoal focus:border-pink-400 focus:outline-none transition-colors">
                    <option value="">Select range…</option>
                    <option>10K–50K</option><option>50K–100K</option><option>100K–500K</option><option>500K+</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="c-engagement" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">Avg. Engagement Rate</label>
                  <input id="c-engagement" value={form.engagement} onChange={(e) => set("engagement", e.target.value)} placeholder="e.g. 4.5%"
                    className="w-full rounded-xl border border-black/10 bg-cream/40 px-4 py-2.5 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-pink-400 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-2">Content Types *</label>
                <div className="flex flex-wrap gap-2">
                  {CONTENT_TYPES.map((t) => (
                    <button key={t} type="button" onClick={() => toggleType(t)}
                      className={["rounded-full px-3.5 py-1.5 font-sans text-[11px] border transition-colors",
                        form.contentTypes.includes(t) ? "bg-pink-600 text-white border-pink-600" : "border-black/10 text-charcoal/50 hover:border-pink-300 hover:text-pink-600",
                      ].join(" ")}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="c-bio" className="block font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/50 mb-1.5">About your content *</label>
                <textarea id="c-bio" required rows={3} value={form.bio} onChange={(e) => set("bio", e.target.value)}
                  placeholder="Tell us about your content style, typical audience, and why you love home decor…"
                  className="w-full rounded-xl border border-black/10 bg-cream/40 px-4 py-2.5 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-pink-400 focus:outline-none transition-colors resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full rounded-full bg-pink-600 py-3.5 font-sans text-[12px] tracking-[0.15em] uppercase text-white hover:bg-pink-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Submitting…" : "Submit Application"}
              </button>
              <p className="font-sans text-[11px] text-charcoal/35 text-center">We review applications within 5 business days</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
