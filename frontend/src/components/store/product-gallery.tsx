"use client";

import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils/format";
import type { Product } from "@/lib/types/product";

export function ProductGallery({ product }: { product: Product }) {
  const rawImages = product.images.length
    ? product.images
    : [{ url: "", alt_text: product.name, is_primary: true }];

  // Ensure primary image comes first
  const images = [...rawImages].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));

  const [active,  setActive]  = useState(0);
  const [zoomed,  setZoomed]  = useState(false);
  const count                  = images.length;
  const dragStart              = useRef<number | null>(null);
  const isDragging             = useRef(false);

  const prev = useCallback(() => setActive((i) => (i - 1 + count) % count), [count]);
  const next = useCallback(() => setActive((i) => (i + 1) % count), [count]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     setZoomed(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  // Pointer-drag swipe
  const handlePointerDown = (e: React.PointerEvent) => { dragStart.current = e.clientX; isDragging.current = false; };
  const handlePointerMove = (e: React.PointerEvent) => { if (dragStart.current !== null && Math.abs(e.clientX - dragStart.current) > 6) isDragging.current = true; };
  const handlePointerUp   = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const delta = e.clientX - dragStart.current;
    if (Math.abs(delta) > 50) { if (delta < 0) next(); else prev(); }
    dragStart.current = null;
  };

  return (
    <div className="flex gap-3 lg:flex-row-reverse">

      {/* ── Main image ───────────────────────────────────────────── */}
      <div
        className="group relative flex-1 overflow-hidden bg-cream dark:bg-charcoal-800 aspect-[4/5] select-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => { dragStart.current = null; }}
        role="group"
        aria-roledescription="image carousel"
        aria-label={`${product.name} gallery`}
      >
        {/* Active image */}
        {images[active].url ? (
          <Image
            src={images[active].url}
            alt={images[active].alt_text ?? product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover transition-opacity duration-300 pointer-events-none"
          />
        ) : (
          <PlaceholderImage name={product.name} />
        )}

        {/* Prev / Next arrows — always visible on touch, hover-only on desktop */}
        {count > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 z-10",
                "flex h-9 w-9 items-center justify-center",
                "bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-sm shadow-luxury",
                "text-charcoal dark:text-cream",
                "transition-all duration-200 hover:bg-white dark:hover:bg-charcoal-800",
                "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
              )}
            >
              <ChevronLeftIcon />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 z-10",
                "flex h-9 w-9 items-center justify-center",
                "bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-sm shadow-luxury",
                "text-charcoal dark:text-cream",
                "transition-all duration-200 hover:bg-white dark:hover:bg-charcoal-800",
                "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
              )}
            >
              <ChevronRightIcon />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {count > 1 && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActive(i); }}
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "pointer-events-auto h-1.5 rounded-full transition-all duration-300",
                  i === active ? "w-5 bg-gold" : "w-1.5 bg-white/50 hover:bg-white/80",
                )}
              />
            ))}
          </div>
        )}

        {/* Image counter pill */}
        {count > 1 && (
          <div className="absolute top-3 left-3 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 font-sans text-[10px] text-cream/80">
            {active + 1} / {count}
          </div>
        )}

        {/* Zoom button */}
        {images[active].url && (
          <button
            onClick={() => setZoomed(true)}
            aria-label="Zoom image"
            className={cn(
              "absolute top-3 right-3 flex h-8 w-8 items-center justify-center",
              "bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-sm shadow-luxury",
              "text-charcoal dark:text-cream transition-all hover:scale-110",
              "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
            )}
          >
            <ZoomIcon />
          </button>
        )}

      </div>

      {/* ── Vertical thumbnail strip ─────────────────────────────── */}
      {count > 1 && (
        <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-y-auto lg:overflow-x-visible max-h-[600px] pb-1 lg:pb-0 lg:w-[68px] shrink-0">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative shrink-0 overflow-hidden transition-all duration-200",
                "lg:w-full lg:aspect-square w-16 h-16",
                i === active
                  ? "outline outline-2 outline-gold"
                  : "outline outline-1 outline-black/8 dark:outline-white/8 hover:outline-gold/50 opacity-60 hover:opacity-100",
              )}
            >
              {img.url ? (
                <Image
                  src={img.url}
                  alt={img.alt_text ?? `Image ${i + 1}`}
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-cream dark:bg-charcoal-800" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Zoom lightbox ────────────────────────────────────────── */}
      {zoomed && images[active].url && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-950/96 backdrop-blur-md animate-fade-in"
          onClick={() => setZoomed(false)}
        >
          {/* Close */}
          <button
            onClick={() => setZoomed(false)}
            aria-label="Close zoom"
            className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center bg-white/10 text-cream hover:bg-white/20 transition-colors z-10"
          >
            <CloseIcon />
          </button>

          {/* Arrows */}
          {count > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous" className="absolute left-5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-white/10 text-cream hover:bg-white/20 transition-colors z-10">
                <ChevronLeftIcon />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next" className="absolute right-5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center bg-white/10 text-cream hover:bg-white/20 transition-colors z-10">
                <ChevronRightIcon />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 font-sans text-[11px] text-cream/50">
            {active + 1} / {count}
          </div>

          {/* Zoomed image */}
          <div
            className="relative max-w-4xl max-h-[85vh] w-full mx-12"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[active].url}
              alt={images[active].alt_text ?? product.name}
              width={1400}
              height={1050}
              className="object-contain w-full h-full max-h-[85vh]"
            />
          </div>

          {/* Thumbnail strip at bottom */}
          {count > 1 && (
            <div className="absolute bottom-5 inset-x-0 flex justify-center gap-2 px-6">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActive(i); }}
                  className={cn(
                    "relative h-12 w-12 overflow-hidden rounded-lg transition-all shrink-0",
                    i === active ? "ring-2 ring-gold opacity-100" : "opacity-40 hover:opacity-80",
                  )}
                >
                  {img.url && (
                    <Image src={img.url} alt={img.alt_text ?? `Image ${i + 1}`} fill sizes="48px" className="object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */
function PlaceholderImage({ name }: { name: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-cream dark:bg-charcoal-800">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-charcoal/15 dark:text-cream/15">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
      <span className="font-serif text-sm text-charcoal/25 dark:text-cream/25">{name}</span>
    </div>
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
function ZoomIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /><path d="M11 8v6M8 11h6" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
