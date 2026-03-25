import Link from "next/link";

export interface CmsService {
  label:    string;
  body:     string;
  ctaLabel: string;
  ctaHref:  string;
}

const DEFAULT_SERVICES: CmsService[] = [
  {
    label:    "Free Design Consultation",
    body:     "Our design experts will help you plan, visualise, and spec every piece — at no charge.",
    ctaLabel: "Book Now",
    ctaHref:  "/book-consultation",
  },
  {
    label:    "Trade Programme",
    body:     "Architects and interior designers receive dedicated pricing, sample libraries, and a personal account manager.",
    ctaLabel: "Learn More",
    ctaHref:  "/architects",
  },
  {
    label:    "White-Glove Delivery",
    body:     "Every piece arrives fully assembled and placed exactly where you want it — nationwide, at no extra charge.",
    ctaLabel: "Learn More",
    ctaHref:  "/delivery",
  },
];

export function ServicesStrip({
  services = DEFAULT_SERVICES,
}: {
  services?: CmsService[];
}) {
  return (
    <section className="bg-cream dark:bg-charcoal-900 py-24 lg:py-32" aria-labelledby="services-heading">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">

        {/* Section header — two-column: headline left, subtitle right */}
        <div className="mb-16 lg:mb-20 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-end">
          <div>
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-4">
              The Modulas Experience
            </p>
            <h2
              id="services-heading"
              className="font-serif text-display-md text-charcoal dark:text-cream leading-tight"
            >
              More than furniture —<br className="hidden sm:block" /> a complete service.
            </h2>
          </div>
          <p className="font-sans text-sm text-charcoal/45 dark:text-cream/45 leading-relaxed lg:max-w-sm">
            From first concept to final delivery, we are with you every step — no guesswork, no compromises.
          </p>
        </div>

        {/* Three service columns — numbered, no icons */}
        <div className="grid grid-cols-1 divide-y divide-black/8 dark:divide-white/8 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {services.slice(0, 3).map((s, i) => (
            <div key={s.label} className="group flex flex-col gap-5 py-10 lg:py-0 lg:px-12 first:pl-0 last:pr-0">

              {/* Large serif number — architectural decoration */}
              <span
                className="font-serif text-[5.5rem] leading-none text-charcoal/6 dark:text-cream/6 -mb-2 select-none tabular-nums"
                aria-hidden
              >
                0{i + 1}
              </span>

              <div className="space-y-3 flex-1">
                <h3 className="font-serif text-xl text-charcoal dark:text-cream leading-snug">
                  {s.label}
                </h3>
                <p className="font-sans text-[13px] text-charcoal/50 dark:text-cream/50 leading-relaxed">
                  {s.body}
                </p>
              </div>

              <Link
                href={s.ctaHref}
                className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.22em] uppercase text-charcoal/40 dark:text-cream/40 hover:text-gold transition-colors duration-200 self-start border-b border-transparent hover:border-gold pb-0.5"
              >
                {s.ctaLabel}
                <svg
                  width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
