import Link from "next/link";

export interface CmsConfigurator {
  eyebrow:   string;
  headline:  string;
  subtext:   string;
  cta1Label: string;
  cta1Href:  string;
  cta2Label: string;
  cta2Href:  string;
}

const DEFAULT_CONFIGURATOR: CmsConfigurator = {
  eyebrow:   "3D Configurator",
  headline:  "Design it exactly as you imagined.",
  subtext:   "Our real-time 3D configurator lets you build your perfect piece from scratch — choose every material, dimension, and finish before placing the order.",
  cta1Label: "Open Configurator",
  cta1Href:  "/configurator",
  cta2Label: "Watch Tutorial",
  cta2Href:  "/workshops",
};

const STEPS = [
  { n: "01", title: "Choose your base",   body: "Select from 12 modular bases across three collections." },
  { n: "02", title: "Add modules",        body: "Attach arms, backs, chaises and ottomans in any configuration." },
  { n: "03", title: "Pick your finish",   body: "50+ fabrics, leathers and timber combinations." },
  { n: "04", title: "Get your quote",      body: "Receive a detailed PDF with dimensions, materials, and pricing." },
] as const;

export function ConfiguratorCta({
  config = DEFAULT_CONFIGURATOR,
}: {
  config?: CmsConfigurator;
}) {
  const c = { ...DEFAULT_CONFIGURATOR, ...config };

  return (
    <section
      className="py-section bg-charcoal-950 overflow-hidden"
      aria-labelledby="configurator-cta-heading"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* ── Left: copy + steps ──────────────────────────────── */}
          <div className="space-y-10">
            <div className="space-y-4">
              <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-gold">
                {c.eyebrow}
              </p>
              <h2
                id="configurator-cta-heading"
                className="font-serif text-display-md text-cream leading-tight"
              >
                {c.headline}
              </h2>
              <p className="font-sans text-sm text-cream/50 leading-relaxed max-w-md">
                {c.subtext}
              </p>
            </div>

            {/* Steps — design element, not CMS-managed */}
            <ol className="space-y-5" aria-label="How the configurator works">
              {STEPS.map((step) => (
                <li key={step.n} className="flex gap-5">
                  <span className="font-serif text-2xl text-gold/30 leading-none w-8 shrink-0 pt-0.5">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-sans text-sm font-medium text-cream mb-0.5">
                      {step.title}
                    </h3>
                    <p className="font-sans text-sm text-cream/40 leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href={c.cta1Href}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-gold px-8 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 transition-all hover:bg-gold-400 active:scale-[0.98]"
              >
                {c.cta1Label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href={c.cta2Href}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-cream/20 px-8 font-sans text-[12px] tracking-[0.15em] uppercase text-cream/70 transition-all hover:border-cream/50 hover:text-cream active:scale-[0.98]"
              >
                {c.cta2Label}
              </Link>
            </div>
          </div>

          {/* ── Right: configurator UI mockup (CSS art, no CDN) ─────── */}
          <div className="relative aspect-square max-w-xl mx-auto w-full lg:max-w-none">
            {/* Ambient glow */}
            <div className="absolute inset-0 rounded-3xl bg-gold/5 blur-3xl scale-90" aria-hidden />

            <div className="relative h-full rounded-3xl overflow-hidden border border-cream/6 bg-charcoal-900 flex flex-col">

              {/* ── Toolbar row ───────────────────────────────────── */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-cream/5">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#c9a96e] border-2 border-gold ring-2 ring-gold/40 shadow" />
                  <div className="h-6 w-6 rounded-full bg-[#5a4e3e] border-2 border-white/10 shadow" />
                  <div className="h-6 w-6 rounded-full bg-[#e8e0d4] border-2 border-white/10 shadow" />
                  <div className="h-6 w-6 rounded-full bg-[#2d2926] border-2 border-white/10 shadow" />
                </div>
                <span className="rounded-full bg-black/40 backdrop-blur-sm px-3 py-1 font-sans text-[10px] tracking-[0.15em] uppercase text-cream/70">
                  Cavendish · Oatmeal Boucle
                </span>
              </div>

              {/* ── 3D canvas area ────────────────────────────────── */}
              <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                <svg
                  className="absolute inset-0 w-full h-full opacity-[0.07]"
                  viewBox="0 0 400 280"
                  preserveAspectRatio="xMidYMid slice"
                  aria-hidden
                >
                  {[0,1,2,3,4,5,6].map((i) => (
                    <line key={`v${i}`} x1={50 + i * 50} y1={280} x2={130 + i * 20} y2={180} stroke="white" strokeWidth="0.5" />
                  ))}
                  {[0,1,2,3,4].map((i) => (
                    <line key={`h${i}`} x1={50} y1={280 - i * 25} x2={350} y2={280 - i * 25 - (i * 8)} stroke="white" strokeWidth="0.5" />
                  ))}
                </svg>

                <svg
                  viewBox="0 0 340 220"
                  className="w-[85%] max-w-sm drop-shadow-2xl"
                  fill="none"
                  aria-label="3D sofa preview"
                >
                  <ellipse cx="170" cy="205" rx="130" ry="12" fill="black" fillOpacity="0.35" />
                  <path d="M55 145 L285 145 L310 125 L80 125 Z" fill="#c9a96e" />
                  <path d="M55 145 L285 145 L285 165 L55 165 Z" fill="#9e7d52" />
                  <path d="M285 145 L310 125 L310 145 L285 165 Z" fill="#7a5e38" />
                  <path d="M50 100 L90 100 L95 88 L55 88 Z" fill="#c9a96e" />
                  <path d="M50 100 L90 100 L90 155 L50 155 Z" fill="#a07842" />
                  <path d="M90 100 L95 88 L95 143 L90 155 Z" fill="#7a5e38" />
                  <path d="M250 100 L290 100 L295 88 L255 88 Z" fill="#c9a96e" />
                  <path d="M250 100 L290 100 L290 155 L250 155 Z" fill="#a07842" />
                  <path d="M290 100 L295 88 L295 143 L290 155 Z" fill="#7a5e38" />
                  <path d="M58 92 L282 92 L287 78 L63 78 Z" fill="#d4ad75" />
                  <path d="M58 92 L282 92 L282 118 L58 118 Z" fill="#b08848" />
                  <path d="M282 92 L287 78 L287 104 L282 118 Z" fill="#7a5e38" />
                  <path d="M70 118 L163 118 L163 144 L70 144 Z" fill="#d4b47e" />
                  <path d="M163 118 L167 114 L167 140 L163 144 Z" fill="#b09060" />
                  <path d="M70 118 L163 118 L167 114 L74 114 Z" fill="#e0c090" />
                  <path d="M167 118 L260 118 L260 144 L167 144 Z" fill="#d4b47e" />
                  <path d="M260 118 L264 114 L264 140 L260 144 Z" fill="#b09060" />
                  <path d="M167 118 L260 118 L264 114 L171 114 Z" fill="#e0c090" />
                  <rect x="65" y="160" width="8" height="22" rx="2" fill="#5a3e28" />
                  <rect x="268" y="160" width="8" height="22" rx="2" fill="#5a3e28" />
                  <rect x="112" y="160" width="8" height="20" rx="2" fill="#5a3e28" />
                  <rect x="220" y="160" width="8" height="20" rx="2" fill="#5a3e28" />
                  <line x1="55" y1="178" x2="285" y2="178" stroke="#c9a96e" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="4 3" />
                  <line x1="55" y1="174" x2="55" y2="182" stroke="#c9a96e" strokeWidth="0.8" strokeOpacity="0.4" />
                  <line x1="285" y1="174" x2="285" y2="182" stroke="#c9a96e" strokeWidth="0.8" strokeOpacity="0.4" />
                  <text x="170" y="176" textAnchor="middle" fill="#c9a96e" fillOpacity="0.5" fontSize="8" fontFamily="sans-serif">2,400 mm</text>
                  <circle cx="170" cy="125" r="4" fill="#c9a96e" fillOpacity="0.6" />
                  <circle cx="170" cy="125" r="7" fill="none" stroke="#c9a96e" strokeWidth="0.8" strokeOpacity="0.3" />
                </svg>

                <div className="absolute top-3 right-3 rounded-lg bg-black/40 backdrop-blur-sm px-2.5 py-1.5">
                  <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-cream/40 mb-0.5">Module</p>
                  <p className="font-sans text-[11px] text-gold font-medium">3-seat + Chaise</p>
                </div>

                <div className="absolute bottom-3 left-3 flex gap-1.5">
                  {[1,2,3,4].map((s) => (
                    <div key={s} className={`h-1 rounded-full transition-all ${s === 3 ? "w-6 bg-gold" : "w-2 bg-cream/20"}`} />
                  ))}
                </div>
              </div>

              {/* ── Bottom price bar ──────────────────────────────── */}
              <div className="border-t border-cream/5 bg-charcoal-950/60 backdrop-blur-md px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-cream/40 mb-0.5">Your configuration</p>
                  <p className="font-serif text-2xl text-cream">₹4,85,000</p>
                </div>
                <div className="flex gap-2">
                  <div className="rounded-full bg-gold/15 border border-gold/25 px-3 py-1.5 font-sans text-[10px] uppercase tracking-wider text-gold">Save Design</div>
                  <div className="rounded-full bg-gold px-4 py-1.5 font-sans text-[10px] uppercase tracking-wider text-charcoal-950 font-medium">Add to Cart</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
