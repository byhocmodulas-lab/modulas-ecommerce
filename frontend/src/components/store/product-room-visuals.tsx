"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils/format";

export interface RoomVisualImage {
  url: string;
  alt: string;
  roomLabel: string;
}

interface ProductRoomVisualsProps {
  productName: string;
  images: RoomVisualImage[];
}

export function ProductRoomVisuals({ productName, images }: ProductRoomVisualsProps) {
  const [active, setActive] = useState(0);
  const dragStart            = useRef<number | null>(null);
  const isDragging           = useRef(false);

  if (images.length === 0) return null;

  const count = images.length;

  const prev = () => setActive((i) => (i - 1 + count) % count);
  const next = () => setActive((i) => (i + 1) % count);

  const handlePointerDown = (e: React.PointerEvent) => { dragStart.current = e.clientX; isDragging.current = false; };
  const handlePointerMove = (e: React.PointerEvent) => { if (dragStart.current !== null && Math.abs(e.clientX - dragStart.current) > 8) isDragging.current = true; };
  const handlePointerUp   = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const delta = e.clientX - dragStart.current;
    if (Math.abs(delta) > 60) { if (delta < 0) next(); else prev(); }
    dragStart.current = null;
  };

  return (
    <section
      aria-label="Room visualisations"
      className="overflow-hidden bg-cream-50 dark:bg-charcoal-950 border-t border-b border-black/5 dark:border-white/5"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* ── Left: large scene image ─────────────────────────── */}
        <div
          className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[560px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => { dragStart.current = null; }}
        >
          {images[active].url && (
            <Image
              src={images[active].url}
              alt={images[active].alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-opacity duration-500"
            />
          )}

          {/* Room label overlay */}
          <div className="absolute bottom-5 left-5 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 dark:bg-charcoal-950/90 backdrop-blur-sm px-4 py-2 font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal dark:text-cream shadow-luxury">
              <RoomIcon />
              {images[active].roomLabel}
            </span>
          </div>

          {/* Navigation arrows */}
          {count > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous room"
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-sm text-charcoal dark:text-cream shadow-luxury hover:bg-white dark:hover:bg-charcoal-800 transition-all hover:scale-110"
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next room"
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-sm text-charcoal dark:text-cream shadow-luxury hover:bg-white dark:hover:bg-charcoal-800 transition-all hover:scale-110"
              >
                <ChevronRightIcon />
              </button>
            </>
          )}
        </div>

        {/* ── Right: thumbnails + context copy ───────────────── */}
        <div className="flex flex-col justify-between p-8 lg:p-12 bg-white dark:bg-charcoal-900">

          {/* Heading */}
          <div className="space-y-4">
            <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-gold">
              In Your Space
            </p>
            <h2 className="font-serif text-display-sm text-charcoal dark:text-cream leading-tight">
              See how the{" "}
              <em className="not-italic text-gradient-gold">{productName}</em>{" "}
              lives in every room.
            </h2>
            <p className="font-sans text-sm text-charcoal/55 dark:text-cream/55 leading-relaxed max-w-sm">
              Every Modulas piece is photographed in real homes across Britain — see the scale, proportion, and finish quality in context.
            </p>
          </div>

          {/* Thumbnail strip */}
          {count > 1 && (
            <div className="mt-8">
              <p className="mb-3 font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal/35 dark:text-cream/35">
                {active + 1} of {count} room settings
              </p>
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`View ${img.roomLabel}`}
                    aria-current={i === active}
                    className={cn(
                      "relative h-16 w-20 overflow-hidden rounded-xl transition-all duration-200 shrink-0",
                      i === active
                        ? "ring-2 ring-gold ring-offset-1 opacity-100"
                        : "ring-1 ring-black/8 dark:ring-white/8 opacity-50 hover:opacity-100 hover:ring-gold/40",
                    )}
                  >
                    {img.url && (
                      <Image src={img.url} alt={img.alt} fill sizes="80px" className="object-cover" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-1.5 pb-1">
                      <span className="block font-sans text-[8px] tracking-[0.08em] uppercase text-cream/90 leading-tight truncate">
                        {img.roomLabel}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dot indicators */}
          {count > 1 && (
            <div className="mt-6 flex items-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Room ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === active ? "w-6 bg-gold" : "w-1.5 bg-charcoal/20 dark:bg-cream/20",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
function RoomIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
