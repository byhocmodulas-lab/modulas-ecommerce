const BADGES = [
  {
    icon: <HandcraftedIcon />,
    title: "Fully Customised",
    body:  "Every piece is made to your exact specifications — dimensions, materials, finishes, and configuration.",
  },
  {
    icon: <LeafIcon />,
    title: "Premium Materials",
    body:  "We source only the finest solid hardwoods, natural stones, and performance fabrics for lasting quality.",
  },
  {
    icon: <ArIcon />,
    title: "Visualise in AR",
    body:  "Try any product in your space before purchasing via WebXR or iOS AR — no guesswork.",
  },
  {
    icon: <ShieldIcon />,
    title: "850+ Projects Done",
    body:  "Trusted by 500+ discerning clients across India with a 98% satisfaction rate since 2021.",
  },
] as const;

export function TrustBadges() {
  return (
    <section className="border-y border-black/5 dark:border-white/5 bg-white dark:bg-charcoal-950 py-16" aria-label="Why Modulas">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4" role="list">
          {BADGES.map((badge) => (
            <li key={badge.title} className="flex flex-col items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/8 dark:bg-gold/10 text-gold">
                {badge.icon}
              </div>
              <div>
                <h3 className="font-serif text-lg text-charcoal dark:text-cream mb-1.5">
                  {badge.title}
                </h3>
                <p className="font-sans text-sm text-charcoal/55 dark:text-cream/55 leading-relaxed">
                  {badge.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Icons ─────────────────────────────────────────────────────── */
function HandcraftedIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" /><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}
function LeafIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}
function ArIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21 16-4 4-4-4" /><path d="M17 20V4" /><path d="m3 8 4-4 4 4" /><path d="M7 4v16" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
    </svg>
  );
}
