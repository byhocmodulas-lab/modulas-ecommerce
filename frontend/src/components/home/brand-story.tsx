"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export interface CmsBrandStory {
  eyebrow:   string;
  headline:  string;
  body1:     string;
  body2:     string;
  cta1Label: string;
  cta1Href:  string;
  cta2Label: string;
  cta2Href:  string;
  stats:     { number: string; label: string }[];
}

const DEFAULT_STORY: CmsBrandStory = {
  eyebrow:   "What is Modulas?",
  headline:  "Furniture designed around the\u00a0way you live — not the other way around.",
  body1:     "Modulas is a contemporary luxury furniture studio based in Gurgaon, India. We design and craft bespoke modular kitchens, wardrobes, and living furniture that adapt to any space, any lifestyle, and any aesthetic. Every piece is drawn by our in-house designers, built by master craftspeople, and finished with materials chosen for how they age — not just how they photograph.",
  body2:     "We believe the finest furniture isn't imported. It is designed with intent, built with mastery, and made right here in India. 850 completed projects. 98% client satisfaction. A lifetime of use.",
  cta1Label: "Our Story",
  cta1Href:  "/our-story",
  cta2Label: "View Projects",
  cta2Href:  "/projects",
  stats: [
    { number: "850+", label: "Projects Completed" },
    { number: "98%",  label: "Client Satisfaction" },
    { number: "12+",  label: "Years of Craft" },
  ],
};

export function BrandStory({ story = DEFAULT_STORY }: { story?: CmsBrandStory }) {
  const ref     = useRef<HTMLDivElement>(null);
  const inView  = useInView(ref, { once: true, margin: "-8%" });
  const reduced = useReducedMotion();

  const s = { ...DEFAULT_STORY, ...story };

  return (
    <section
      ref={ref}
      className="bg-white dark:bg-charcoal-950 py-24 lg:py-32"
      aria-labelledby="brand-story-heading"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_2fr] lg:gap-24 items-start">

          {/* Left column: eyebrow + stats */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: reduced ? 0 : -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-10">
              {s.eyebrow}
            </p>
            {s.stats.map((stat) => (
              <div key={stat.label} className="py-7 border-t border-black/8 dark:border-white/8 last:border-b">
                <p className="font-serif text-display-xl text-charcoal dark:text-cream leading-none mb-1.5 tabular-nums">
                  {stat.number}
                </p>
                <p className="font-sans text-[10px] tracking-[0.22em] uppercase text-charcoal/35 dark:text-cream/35">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Right column: headline + body + CTAs */}
          <motion.div
            className="flex flex-col gap-8 lg:pt-2"
            initial={{ opacity: 0, y: reduced ? 0 : 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2
              id="brand-story-heading"
              className="font-serif text-display-md text-charcoal dark:text-cream leading-tight"
            >
              {s.headline}
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-[14px] leading-loose text-charcoal/55 dark:text-cream/55">
                {s.body1}
              </p>
              <p className="font-sans text-[14px] leading-loose text-charcoal/55 dark:text-cream/55">
                {s.body2}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href={s.cta1Href}
                className="inline-flex items-center gap-2.5 h-11 px-8 bg-charcoal-950 dark:bg-cream font-sans text-[11px] tracking-[0.18em] uppercase text-cream dark:text-charcoal-950 hover:bg-gold dark:hover:bg-gold dark:hover:text-charcoal-950 transition-colors duration-200"
              >
                {s.cta1Label}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href={s.cta2Href}
                className="inline-flex items-center gap-2.5 h-11 px-8 border border-black/15 dark:border-white/15 font-sans text-[11px] tracking-[0.18em] uppercase text-charcoal/70 dark:text-cream/70 hover:border-charcoal dark:hover:border-cream hover:text-charcoal dark:hover:text-cream transition-colors duration-200"
              >
                {s.cta2Label}
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
