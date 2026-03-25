"use client";

import { useState } from "react";

export interface CmsNewsletter {
  eyebrow:  string;
  headline: string;
  subtext:  string;
}

const DEFAULT_NEWSLETTER: CmsNewsletter = {
  eyebrow:  "The Edit",
  headline: "Live beautifully, curated for you.",
  subtext:  "New collections, design inspiration, trade events and early access — delivered to your inbox monthly.",
};

export function Newsletter({ newsletter = DEFAULT_NEWSLETTER }: { newsletter?: CmsNewsletter }) {
  const [email,   setEmail]   = useState("");
  const [status,  setStatus]  = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const n = { ...DEFAULT_NEWSLETTER, ...newsletter };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      // TODO: wire to /api/newsletter
      await new Promise((r) => setTimeout(r, 800));
      setStatus("success");
      setMessage("You're on the list. Expect something beautiful soon.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="bg-charcoal-950 py-section" aria-labelledby="newsletter-heading">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          {/* Eyebrow */}
          <p className="mb-5 font-sans text-[11px] tracking-[0.35em] uppercase text-gold">
            {n.eyebrow}
          </p>
          <h2
            id="newsletter-heading"
            className="font-serif text-display-md text-cream mb-4"
          >
            {n.headline}
          </h2>
          <p className="font-sans text-sm text-cream/50 mb-10 leading-relaxed">
            {n.subtext}
          </p>

          {status === "success" ? (
            <p className="border border-gold/30 bg-gold/10 px-8 py-4 font-sans text-sm text-gold">
              {message}
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 border border-white/10 bg-white/5 px-5 font-sans text-sm text-cream placeholder:text-cream/30 outline-none focus:border-gold/60 transition-colors"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="h-12 bg-gold px-7 font-sans text-[11px] tracking-[0.18em] uppercase text-charcoal-950 transition-all hover:bg-gold-400 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 font-sans text-xs text-red-400">{message}</p>
          )}

          <p className="mt-5 font-sans text-[11px] text-cream/25">
            No spam. Unsubscribe anytime. Read our{" "}
            <a href="/privacy" className="underline hover:text-cream/50 transition-colors">
              privacy policy
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
}
