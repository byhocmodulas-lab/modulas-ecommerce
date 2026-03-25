"use client";

import { useReducedMotion, motion } from "framer-motion";

interface PressQuote { pub: string; quote: string }

const DEFAULT_QUOTES: PressQuote[] = [
  { pub: "Architectural Digest India", quote: "Modulas redefines what it means to invest in bespoke furniture." },
  { pub: "Elle Decor India",           quote: "The most thoughtfully designed interiors we've seen from a homegrown studio." },
  { pub: "Dezeen",                     quote: "A contemporary luxury studio building the future of Indian interiors." },
  { pub: "Design Pataki",              quote: "A future-proof collection crafted for the way India lives today." },
];

export function PressStrip({ quotes = DEFAULT_QUOTES }: { quotes?: PressQuote[] }) {
  const reduced = useReducedMotion();

  return (
    <section
      className="bg-charcoal-950 py-20 lg:py-28"
      aria-label="Press features"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">

        {/* Eyebrow */}
        <motion.p
          className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold/60 text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.7 }}
        >
          As featured in
        </motion.p>

        {/* Editorial quote list — each quote is a full-width row */}
        <div>
          {quotes.map((q, i) => (
            <motion.figure
              key={q.pub}
              className="border-t border-cream/8 py-10 lg:py-12 grid grid-cols-1 lg:grid-cols-[180px_1fr_180px] gap-4 lg:gap-10 items-center"
              initial={{ opacity: 0, y: reduced ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.7, delay: 0.06 + i * 0.1 }}
            >
              {/* Publication name — left */}
              <figcaption className="font-sans text-[10px] tracking-[0.28em] uppercase text-gold lg:text-right order-2 lg:order-1">
                {q.pub}
              </figcaption>

              {/* Quote — center */}
              <blockquote className="font-serif text-2xl lg:text-3xl xl:text-[2rem] italic text-cream/72 leading-snug text-center order-1 lg:order-2">
                &ldquo;{q.quote}&rdquo;
              </blockquote>

              {/* Decorative index — right */}
              <div className="hidden lg:flex justify-start order-3" aria-hidden>
                <span className="font-serif text-5xl leading-none text-cream/5 select-none tabular-nums">
                  0{i + 1}
                </span>
              </div>
            </motion.figure>
          ))}
          <div className="border-t border-cream/8" />
        </div>
      </div>
    </section>
  );
}
