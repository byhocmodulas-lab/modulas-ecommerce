"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";

interface Hotspot {
  top:     string;
  left:    string;
  product: string;
  price:   string;
  href:    string;
}

export function HotspotPin({ hotspot }: { hotspot: Hotspot }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.top  = hotspot.top;
      ref.current.style.left = hotspot.left;
    }
  }, [hotspot.top, hotspot.left]);

  return (
    <div
      ref={ref}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group/pin"
    >
      {/* Pulsing ring */}
      <span className="absolute inset-0 rounded-full bg-gold/40 animate-ping pointer-events-none" aria-hidden />

      {/* Pin button */}
      <button
        type="button"
        aria-label={`View ${hotspot.product}`}
        className="relative flex h-6 w-6 items-center justify-center bg-gold text-charcoal-950 hover:bg-cream transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {/* Tooltip card — appears on hover, above the pin */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-white dark:bg-charcoal-900 shadow-luxury pointer-events-none
        opacity-0 translate-y-1 group-hover/pin:opacity-100 group-hover/pin:translate-y-0 group-hover/pin:pointer-events-auto
        transition-all duration-200">
        <Link href={hotspot.href} className="block p-3 hover:bg-cream dark:hover:bg-charcoal-800 transition-colors">
          <p className="font-serif text-sm text-charcoal dark:text-cream leading-snug">{hotspot.product}</p>
          <p className="font-sans text-[11px] text-gold mt-1">{hotspot.price}</p>
          <p className="inline-flex items-center gap-1 font-sans text-[9px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-cream/40 mt-1.5">
            View product
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </p>
        </Link>
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white dark:border-t-charcoal-900" aria-hidden />
      </div>
    </div>
  );
}
