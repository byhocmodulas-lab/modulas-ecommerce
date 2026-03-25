"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils/format";

interface RecentItem {
  id:       string;
  slug:     string;
  name:     string;
  price:    number;
  currency: string;
  imageUrl?: string;
  category?: string;
}

const STORAGE_KEY = "modulas_recently_viewed";
const MAX_ITEMS   = 8;

/** Call this from a product page to track the current product. */
export function trackRecentlyViewed(item: RecentItem) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: RecentItem[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((i) => i.id !== item.id);
    const updated  = [item, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch { /* storage unavailable */ }
}

export function RecentlyViewed({ excludeId }: { excludeId: string }) {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const list: RecentItem[] = JSON.parse(raw);
      setItems(list.filter((i) => i.id !== excludeId).slice(0, 6));
    } catch { /* ignore */ }
  }, [excludeId]);

  if (items.length === 0) return null;

  return (
    <section className="bg-cream dark:bg-charcoal-900 py-14" aria-labelledby="recently-viewed-heading">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-end justify-between px-6 lg:px-12 mb-8">
          <div>
            <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold mb-2">Your History</p>
            <h2 id="recently-viewed-heading" className="font-serif text-2xl lg:text-3xl text-charcoal dark:text-cream">
              Recently Viewed
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-cream/40 hover:text-charcoal dark:hover:text-cream transition-colors border-b border-charcoal/15 hover:border-charcoal/50 pb-0.5"
          >
            Browse All
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div
          className="flex gap-3 overflow-x-auto px-6 lg:px-12 pb-2"
          style={{ scrollbarWidth: "none" } as React.CSSProperties}
        >
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              className="group flex-none w-[200px] lg:w-[240px] flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-white dark:bg-charcoal-800">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="240px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-charcoal/12 dark:text-cream/12">
                      <rect x="2" y="7" width="20" height="14" rx="1" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="pt-3 pb-1">
                {item.category && (
                  <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-gold mb-0.5">{item.category}</p>
                )}
                <h3 className="font-serif text-[0.9rem] text-charcoal dark:text-cream leading-snug group-hover:text-gold transition-colors duration-200 line-clamp-2">
                  {item.name}
                </h3>
                <p className="font-sans text-[0.82rem] text-charcoal/60 dark:text-cream/60 mt-1">
                  {formatPrice(item.price, item.currency)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Drop this in a product page to record the view on mount. */
export function TrackView({ item }: { item: RecentItem }) {
  useEffect(() => {
    trackRecentlyViewed(item);
  }, [item]);
  return null;
}
