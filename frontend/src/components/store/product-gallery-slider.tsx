"use client";

import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils/format";
import type { ProductImage } from "@/types/product";

interface ProductGallerySliderProps {
  images: ProductImage[];
  productName: string;
  /** Show thumbstrip below (default) or to the side */
  thumbLayout?: "bottom" | "side";
}

export function ProductGallerySlider({
  images,
  productName,
  thumbLayout = "side",
}: ProductGallerySliderProps) {
  const displayImages = images.length
    ? images.sort((a, b) => a.sortOrder - b.sortOrder)
    : [{ id: "placeholder", url: "", altText: productName, sortOrder: 0, isPrimary: true, fileKey: "" }];

  const [active, setActive]   = useState(0);
  const [zoomed, setZoomed]   = useState(false);
  const dragStart             = useRef<number | null>(null);
  const isDragging            = useRef(false);

  const count = displayImages.length;

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

  // Pointer drag for swipe
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
    isDragging.current = false;
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStart.current !== null && Math.abs(e.clientX - dragStart.current) > 5) {
      isDragging.current = true;
    }
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const delta = e.clientX - dragStart.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) next(); else prev();
    }
    dragStart.current = null;
  };

  const isBottom = thumbLayout === "bottom";

  return (
    <div className={cn("flex gap-3", isBottom ? "flex-col" : "flex-row-reverse")}>

      {/* ── Main image ───────────────────────────────────────────── */}
      <div
        className="relative flex-1 overflow-hidden rounded-2xl bg-cream dark:bg-charcoal-800 aspect-[4/5] select-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => { dragStart.current = null; }}
        role="group"
        aria-roledescription="image carousel"
        aria-label={`${productName} gallery`}
      >
        {/* Images (slide transition) */}
        <div
          className="absolute inset-0 transition-opacity duration-400"
          onClick={() => { if (!isDragging.current) setZoomed(true); }}
        >
          {displayImages[active].url ? (
            <Image
              src={displayImages[active].url}
              alt={displayImages[active].altText ?? productName}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover pointer-events-none"
            />
          ) : (
            <PlaceholderImage name={productName} />
          )}
        </div>

        {/* Prev / Next arrows */}
        {count > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 z-10",
                "flex h-9 w-9 items-center justify-center rounded-full",
                "bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-sm",
                "shadow-luxury text-charcoal dark:text-cream",
                "transition-all hover:bg-white dark:hover:bg-charcoal-800 hover:shadow-luxury-lg hover:scale-110",
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
                "flex h-9 w-9 items-center justify-center rounded-full",
                "bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-sm",
                "shadow-luxury text-charcoal dark:text-cream",
                "transition-all hover:bg-white dark:hover:bg-charcoal-800 hover:shadow-luxury-lg hover:scale-110",
              )}
            >
              <ChevronRightIcon />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {count > 1 && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
            {displayImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActive(i); }}
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "pointer-events-auto h-1.5 rounded-full transition-all duration-300",
                  i === active
                    ? "w-5 bg-gold"
                    : "w-1.5 bg-white/50 hover:bg-white/80",
                )}
              />
            ))}
          </div>
        )}

        {/* Counter pill */}
        {count > 1 && (
          <div className="absolute top-3 left-3 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 font-sans text-[10px] text-cream/80">
            {active + 1} / {count}
          </div>
        )}

        {/* Zoom hint */}
        <button
          onClick={() => setZoomed(true)}
          aria-label="Zoom image"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-charcoal-900/80 backdrop-blur-sm shadow-luxury text-charcoal dark:text-cream transition-all hover:scale-110"
        >
          <ZoomIcon />
        </button>

      </div>

      {/* ── Thumbnail strip ──────────────────────────────────────── */}
      {count > 1 && (
        <div
          className={cn(
            "flex gap-2 overflow-auto",
            isBottom
              ? "flex-row pb-1"
              : "flex-col max-h-[520px] overflow-y-auto overflow-x-hidden w-[72px] shrink-0",
          )}
        >
          {displayImages.map((img, i) => (
            <label
              key={img.id}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-xl transition-all duration-200 cursor-pointer",
                isBottom ? "w-16 h-16" : "w-full aspect-square",
                i === active
                  ? "ring-2 ring-gold ring-offset-1"
                  : "ring-1 ring-black/8 dark:ring-white/8 opacity-60 hover:opacity-100 hover:ring-gold/50",
              )}
            >
              <input
                type="radio"
                name="gallery-image"
                className="sr-only"
                checked={i === active}
                onChange={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
              />
              {img.url ? (
                <Image
                  src={img.url}
                  alt={img.altText ?? `Image ${i + 1}`}
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-cream-200 dark:bg-charcoal-700" />
              )}
            </label>
          ))}
        </div>
      )}

      {/* ── Zoom lightbox ────────────────────────────────────────── */}
      {zoomed && displayImages[active].url && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-950/95 backdrop-blur-md animate-fade-in"
          onClick={() => setZoomed(false)}
        >
          <button
            onClick={() => setZoomed(false)}
            aria-label="Close zoom"
            className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-cream hover:bg-white/20 transition-colors"
          >
            <CloseIcon />
          </button>
          {count > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous" className="absolute left-5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-cream hover:bg-white/20 transition-colors">
                <ChevronLeftIcon />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next" className="absolute right-5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-cream hover:bg-white/20 transition-colors">
                <ChevronRightIcon />
              </button>
            </>
          )}
          <div
            className="relative max-w-4xl max-h-[85vh] w-full mx-6"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={displayImages[active].url}
              alt={displayImages[active].altText ?? productName}
              width={1200}
              height={900}
              className="object-contain w-full h-full max-h-[85vh] rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Helpers ────────────────────────────────────────────────── */
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
