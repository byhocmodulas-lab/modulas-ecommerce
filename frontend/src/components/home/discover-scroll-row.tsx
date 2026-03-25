"use client";

import Link from "next/link";
import { useRef } from "react";
import type { DiscoverItem } from "./discover-scroll";

export function DiscoverScrollRow({ items }: { items: DiscoverItem[] }) {
  const rowRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    rowRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* Scroll arrows — desktop only */}
      <div className="hidden sm:flex absolute -top-14 right-6 lg:right-12 items-center gap-2 z-10">
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="flex h-9 w-9 items-center justify-center border border-black/12 dark:border-white/12 text-charcoal/50 dark:text-cream/50 hover:border-charcoal dark:hover:border-cream hover:text-charcoal dark:hover:text-cream transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="flex h-9 w-9 items-center justify-center border border-black/12 dark:border-white/12 text-charcoal/50 dark:text-cream/50 hover:border-charcoal dark:hover:border-cream hover:text-charcoal dark:hover:text-cream transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Scrollable row */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto px-6 lg:px-12 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex-none w-[260px] lg:w-[300px] flex flex-col overflow-hidden"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-cream dark:bg-charcoal-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.headline}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/50 via-transparent to-transparent" />
            </div>
            <div className="pt-4 pb-2 flex flex-col gap-1.5">
              <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-gold">
                {item.tag}
              </span>
              <h3 className="font-serif text-base text-charcoal dark:text-cream leading-snug group-hover:text-gold transition-colors duration-200 lg:text-lg">
                {item.headline}
              </h3>
              <span className="inline-flex items-center gap-1 font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal/35 dark:text-cream/35 group-hover:text-gold transition-colors mt-1">
                Read
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
