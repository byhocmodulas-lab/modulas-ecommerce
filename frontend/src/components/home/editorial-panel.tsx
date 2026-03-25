"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

interface EditorialPanelProps {
  eyebrow?: string;
  headline:  string;
  body?:     string;
  cta?:      { label: string; href: string };
  image:     string;
  imageAlt?: string;
  /** Which side text sits on — default "left" */
  align?:    "left" | "center" | "right";
  /** Dark overlay strength — default "medium" */
  overlay?:  "light" | "medium" | "dark";
  /** Panel height — default "large" */
  size?:     "medium" | "large" | "full";
  /** Invert CTA button style */
  ctaStyle?: "white" | "gold" | "outline";
}

const overlayMap = {
  light:  "bg-gradient-to-t from-charcoal-950/60 via-charcoal-950/20 to-transparent",
  medium: "bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/35 to-transparent",
  dark:   "bg-gradient-to-t from-charcoal-950/95 via-charcoal-950/55 to-charcoal-950/15",
};

const sizeMap = {
  medium: "min-h-[52vh]",
  large:  "min-h-[68vh]",
  full:   "min-h-[88vh]",
};

const alignMap = {
  left:   "items-end text-left px-6 lg:px-16",
  center: "items-end text-center px-6",
  right:  "items-end text-right px-6 lg:px-16",
};

const ctaMap = {
  white:   "bg-white text-charcoal-950 hover:bg-cream",
  gold:    "bg-gold text-charcoal-950 hover:bg-gold-400",
  outline: "border border-white text-white hover:bg-white hover:text-charcoal-950",
};

export function EditorialPanel({
  eyebrow,
  headline,
  body,
  cta,
  image,
  imageAlt = "",
  align   = "left",
  overlay = "medium",
  size    = "large",
  ctaStyle = "outline",
}: EditorialPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduced = useReducedMotion();

  const textVariants = {
    hidden:  { opacity: 0, y: reduced ? 0 : 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.25, 0.1, 0.25, 1] } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.12 } },
  };

  return (
    <section
      ref={ref}
      className={`relative w-full overflow-hidden ${sizeMap[size]} flex flex-col justify-end`}
      aria-label={headline}
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={imageAlt}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[8000ms] ease-out ${inView ? "scale-[1.03]" : "scale-100"}`}
      />

      {/* Gradient overlay */}
      <div className={`absolute inset-0 ${overlayMap[overlay]}`} aria-hidden />

      {/* Content */}
      <motion.div
        className={`relative z-10 flex flex-col gap-4 pb-14 pt-24 max-w-[1440px] mx-auto w-full ${alignMap[align]}`}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={stagger}
      >
        {eyebrow && (
          <motion.p
            variants={textVariants}
            className="font-sans text-[10px] tracking-[0.35em] uppercase text-cream/70"
          >
            {eyebrow}
          </motion.p>
        )}

        <motion.h2
          variants={textVariants}
          className="font-serif text-cream leading-none text-4xl md:text-5xl lg:text-6xl max-w-xl [text-shadow:0_2px_24px_rgba(0,0,0,0.6)]"
        >
          {headline}
        </motion.h2>

        {body && (
          <motion.p
            variants={textVariants}
            className="font-sans text-[14px] text-cream/70 leading-relaxed max-w-sm [text-shadow:0_1px_12px_rgba(0,0,0,0.8)]"
          >
            {body}
          </motion.p>
        )}

        {cta && (
          <motion.div variants={textVariants}>
            <Link
              href={cta.href}
              className={`inline-flex items-center gap-2.5 h-11 px-7 font-sans text-[11px] tracking-[0.18em] uppercase transition-all duration-200 active:scale-[0.98] ${ctaMap[ctaStyle]}`}
            >
              {cta.label}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
