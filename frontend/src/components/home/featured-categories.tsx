"use client";

import Link from "next/link";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";

export interface CmsCategory {
  label:    string;
  sub:      string;
  imageUrl: string;
  href:     string;
}

const DEFAULT_CATEGORIES: CmsCategory[] = [
  {
    label:    "Sofas & Seating",
    sub:      "Modular · Sectional · Lounge",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85",
    href:     "/products?category=sofas",
  },
  {
    label:    "Tables",
    sub:      "Dining · Coffee · Console",
    imageUrl: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=900&q=85",
    href:     "/products?category=tables",
  },
  {
    label:    "Storage",
    sub:      "Shelving · Cabinets · Credenzas",
    imageUrl: "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=900",
    href:     "/products?category=storage",
  },
  {
    label:    "Lighting",
    sub:      "Pendant · Floor · Table",
    imageUrl: "https://images.pexels.com/photos/6444348/pexels-photo-6444348.jpeg?auto=compress&cs=tinysrgb&w=900",
    href:     "/products?category=lighting",
  },
];

export function FeaturedCategories({
  categories = DEFAULT_CATEGORIES,
}: {
  categories?: CmsCategory[];
}) {
  const ref     = useRef<HTMLDivElement>(null);
  const inView  = useInView(ref, { once: true, margin: "-8%" });
  const reduced = useReducedMotion();

  return (
    <section ref={ref} className="bg-white dark:bg-charcoal-950 py-20 lg:py-28" aria-labelledby="categories-heading">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">

        {/* Header — left-aligned with "Shop All" on the right */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.p
              className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-3"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              Shop by Collection
            </motion.p>
            <motion.h2
              id="categories-heading"
              className="font-serif text-display-lg text-charcoal dark:text-cream leading-none"
              initial={{ opacity: 0, y: reduced ? 0 : 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.06 }}
            >
              What moves you?
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.22em] uppercase text-charcoal/40 dark:text-cream/40 hover:text-gold transition-colors duration-200 border-b border-charcoal/12 dark:border-cream/12 hover:border-gold pb-0.5"
            >
              Shop All Categories
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Portrait tile grid — 2 cols mobile, 4 cols desktop, taller aspect */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.href}
              initial={{ opacity: 0, y: reduced ? 0 : 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.08 + i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                href={cat.href}
                className="group block overflow-hidden"
                aria-label={`Shop ${cat.label}`}
              >
                {/* Taller portrait — 2:3 gives more image presence */}
                <div className="relative aspect-[2/3] overflow-hidden bg-cream dark:bg-charcoal-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.imageUrl}
                    alt={cat.label}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  {/* Deeper gradient for better text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/20 to-transparent" />
                  {/* Subtle darkening overlay on hover */}
                  <div className="absolute inset-0 bg-charcoal-950/0 group-hover:bg-charcoal-950/15 transition-colors duration-500" />

                  {/* Text pinned bottom-left */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                    <p className="font-sans text-[9px] tracking-[0.28em] uppercase text-cream/50 mb-2">
                      {cat.sub}
                    </p>
                    <h3 className="font-serif text-xl text-cream leading-snug group-hover:text-gold transition-colors duration-300 lg:text-2xl">
                      {cat.label}
                    </h3>
                  </div>
                </div>

                {/* Underline CTA row */}
                <div className="flex items-center justify-between px-0.5 pt-3.5 pb-1">
                  <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/40 dark:text-cream/40 group-hover:text-gold transition-colors duration-200">
                    Explore
                  </span>
                  <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                    className="text-charcoal/22 dark:text-cream/22 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Gold fill underline on hover */}
                <div className="h-px bg-black/6 dark:bg-white/6 overflow-hidden">
                  <div className="h-full w-0 bg-gold transition-all duration-500 group-hover:w-full" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
