"use client";

import { useRef } from "react";
import Link from "next/link";

const TILES = [
  {
    label: "Sofas & Seating",
    slug: "sofas",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
  },
  {
    label: "Beds & Bedroom",
    slug: "bedroom",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
  },
  {
    label: "Dining",
    slug: "dining",
    image: "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    label: "Study & Office",
    slug: "study",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80",
  },
  {
    label: "Living Room",
    slug: "living",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&q=80",
  },
  {
    label: "Best Sellers",
    slug: null,
    href: "/products?sort=popular",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
  },
  {
    label: "New Arrivals",
    slug: null,
    href: "/products?sort=newest",
    image: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=400&q=80",
  },
];

interface CategoryTilesProps {
  active?: string;
}

export function CategoryTiles({ active }: CategoryTilesProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    rowRef.current?.scrollBy({ left: dir === "left" ? -360 : 360, behavior: "smooth" });
  }

  return (
    <div className="relative group/tiles bg-white border-b border-black/6">
      {/* Prev arrow */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll categories left"
        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-black/8 text-charcoal opacity-0 group-hover/tiles:opacity-100 transition-opacity"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Scrollable row */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto px-6 lg:px-12 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* All tile */}
        <Link
          href="/products"
          className="flex-none flex flex-col items-center gap-2.5 group/tile"
        >
          <div className={`relative w-[120px] h-[152px] rounded-none overflow-hidden bg-cream flex items-center justify-center transition-all ${!active ? "ring-2 ring-charcoal" : "ring-0"}`}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-charcoal/30">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <span className={`font-sans text-[10px] tracking-[0.12em] uppercase transition-colors text-center leading-tight max-w-[120px] ${!active ? "text-charcoal font-medium" : "text-charcoal/50 group-hover/tile:text-charcoal"}`}>
            All
          </span>
        </Link>

        {TILES.map((tile) => {
          const isActive = tile.slug ? active === tile.slug : false;
          const href = tile.href ?? (tile.slug ? `/products?category=${tile.slug}` : "/products");

          return (
            <Link
              key={tile.label}
              href={href}
              className="flex-none flex flex-col items-center gap-2.5 group/tile"
            >
              <div className={`relative w-[120px] h-[152px] rounded-none overflow-hidden bg-cream transition-all ${isActive ? "ring-2 ring-charcoal" : "ring-0 group-hover/tile:ring-1 group-hover/tile:ring-black/20"}`}>
                <img
                  src={tile.image}
                  alt={tile.label}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/tile:scale-105"
                />
                {/* Darken overlay for active */}
                {isActive && (
                  <div className="absolute inset-0 bg-charcoal/10" />
                )}
              </div>
              <span className={`font-sans text-[10px] tracking-[0.12em] uppercase transition-colors text-center leading-tight max-w-[120px] ${isActive ? "text-charcoal font-medium" : "text-charcoal/50 group-hover/tile:text-charcoal"}`}>
                {tile.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Next arrow */}
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll categories right"
        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-black/8 text-charcoal opacity-0 group-hover/tiles:opacity-100 transition-opacity"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
