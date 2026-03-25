"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./hero.module.css";

/* ─────────────────────────────────────────────────────────────────────────────
   REAL-TIME NATURAL LIGHTING ENGINE
   Reads the actual clock. Updates CSS custom properties on the hero element
   every 10 s. The 15 s CSS transition in hero.module.css smooths each step.
   No inline style={} used — linter-clean.
───────────────────────────────────────────────────────────────────────────── */

function clamp(v: number, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, v)); }

/** Smooth cubic S-curve between edge0 and edge1 */
function smoothStep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/** Bell-curve: rises from riseStart→peak, holds, falls from fall→fadeEnd */
function bell(h: number, riseStart: number, peak: number, fall: number, fadeEnd: number) {
  return clamp(Math.min(smoothStep(riseStart, peak, h), smoothStep(fadeEnd, fall, h)));
}

function applyLight(el: HTMLElement, date: Date) {
  const h = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;

  // ── Daylight phases ─────────────────────────────────────────────
  const dawn      = bell(h,  4.5,  6.5,  9.0, 10.5); // 05:00 – 09:00
  const midday    = bell(h,  9.0, 11.0, 15.0, 17.0); // 11:00 – 15:00
  const afternoon = bell(h, 13.0, 15.0, 17.5, 19.0); // 15:00 – 17:30
  const dusk      = bell(h, 15.5, 17.5, 19.5, 21.0); // 17:30 – 20:00

  // ── Night — wraps midnight ───────────────────────────────────────
  const nightRise = h >= 12 ? smoothStep(20.0, 22.0, h) : 0;
  const nightFall = h <  12 ? smoothStep( 6.5,  5.0, h) : 0;
  const night     = clamp(Math.max(nightRise, nightFall));

  // ── Interior ambient: dusk→night→pre-dawn ────────────────────────
  // Lamps brighten as natural light fades; fully on through the night.
  const ambient = clamp(Math.max(dusk * 0.55, night * 0.95, nightFall * 0.80));

  // ── Photo brightness ─────────────────────────────────────────────
  // Floor raised so the room is always legible; ambient lamps light it at night
  const photoOp = clamp(
    0.30
    + 0.32 * midday
    + 0.18 * dawn
    + 0.12 * afternoon
    + 0.06 * dusk
    - 0.05 * night,
    0.30, 0.60,
  );

  // Write all values as CSS custom properties — no JSX style={}
  el.style.setProperty("--photo-op",   photoOp.toFixed(3));
  el.style.setProperty("--dawn",       dawn.toFixed(3));
  el.style.setProperty("--midday",     midday.toFixed(3));
  el.style.setProperty("--afternoon",  afternoon.toFixed(3));
  el.style.setProperty("--dusk",       dusk.toFixed(3));
  el.style.setProperty("--night",      night.toFixed(3));
  el.style.setProperty("--ambient",    ambient.toFixed(3));
}

/* ─────────────────────────────────────────────────────────────────────────────
   HERO COMPONENT
───────────────────────────────────────────────────────────────────────────── */
interface HeroProps {
  imageUrl?:     string;
  eyebrow?:      string;
  headline?:     React.ReactNode;
  subheading?:   string;
  primaryCta?:   { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  fullHeight?:   boolean;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80";

export function Hero({
  imageUrl     = DEFAULT_IMAGE,
  eyebrow      = "Bespoke Furniture. Elevated Interiors.",
  headline     = (
    <>
      Where luxury{" "}
      <em className="text-gradient-gold not-italic [filter:drop-shadow(0_2px_24px_rgba(201,169,110,0.9))_drop-shadow(0_0_8px_rgba(201,169,110,0.6))]">
        feels
      </em>
      <br />
      personal.
    </>
  ),
  subheading   = "A contemporary luxury furniture studio redefining the way interiors are experienced — designed with architectural precision, crafted for Indian homes.",
  primaryCta   = { label: "Explore Collection", href: "/products" },
  secondaryCta = { label: "Book Free Visit",     href: "/book-consultation" },
  fullHeight   = true,
}: HeroProps = {}) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    // Immediate first paint
    applyLight(el, new Date());

    // Re-apply every 10 s; CSS transition (15 s) smooths between steps
    const id = setInterval(() => applyLight(el, new Date()), 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={heroRef}
      className={`${styles.hero} relative flex overflow-hidden bg-charcoal-950 ${
        fullHeight ? "min-h-[calc(100dvh-var(--nav-height,64px))]" : "min-h-[60vh]"
      } items-end`}
      aria-label="Hero"
    >
      {/* ── Background photograph ───────────────────────────────── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt=""
        aria-hidden
        className={`absolute inset-0 h-full w-full object-cover object-center pointer-events-none ${styles.photo}`}
      />

      {/* ── Dynamic lighting layers (all pointer-events-none) ────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>

        {/* 1 · DAWN — golden sunrise, top-right */}
        <div className={`absolute inset-0 ${styles.dawn}`} />
        <div className={`absolute inset-0 ${styles.dawnRays}`} />
        <div className={`absolute inset-0 ${styles.dawnBloom}`} />

        {/* 2 · MIDDAY — cool overhead light */}
        <div className={`absolute inset-0 ${styles.midday}`} />
        <div className={`absolute inset-0 ${styles.middayRays}`} />

        {/* 3 · AFTERNOON — warm light from right side */}
        <div className={`absolute inset-0 ${styles.afternoon}`} />

        {/* 4 · DUSK — amber sunset, lower-left */}
        <div className={`absolute inset-0 ${styles.dusk}`} />
        <div className={`absolute inset-0 ${styles.duskRays}`} />
        <div className={`absolute inset-0 ${styles.duskBloom}`} />

        {/* 5 · NIGHT — indigo wash + stars */}
        <div className={`absolute inset-0 ${styles.nightWash}`} />
        <div className={`absolute inset-0 ${styles.stars}`} />

        {/* 6 · AMBIENT INTERIOR LIGHTS — evening, night, pre-dawn */}
        {/* Warm base wash so the room is never pitch-black */}
        <div className={`absolute inset-0 ${styles.ambientNightBase}`} />
        {/* Arc floor lamp (right) */}
        <div className={`absolute inset-0 ${styles.ambientFloor}`} />
        {/* Table lamp (left) */}
        <div className={`absolute inset-0 ${styles.ambientTable}`} />
        {/* Pendant / ceiling (centre-top) */}
        <div className={`absolute inset-0 ${styles.ambientPendant}`} />
        {/* Warm candlelight fill */}
        <div className={`absolute inset-0 ${styles.ambientFill}`} />
        {/* Back-wall window glow */}
        <div className={`absolute inset-0 ${styles.ambientWindow}`} />
      </div>

      {/* ── Static text-legibility gradients (always on) ─────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {/* Strong bottom-up fade so headline is always readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/95 via-charcoal-950/55 to-charcoal-950/10" />
        {/* Left vignette — text lives on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/80 via-charcoal-950/35 to-transparent" />
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-20 pt-16 lg:px-12 lg:pb-28">
        <div className="max-w-2xl">

          <p className="mb-6 font-sans text-[11px] tracking-[0.35em] uppercase text-cream/75 animate-fade-in [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
            {eyebrow}
          </p>

          <h1 className="font-serif text-display-xl text-cream leading-none mb-8 animate-fade-in [animation-delay:80ms] [text-shadow:0_3px_28px_rgba(0,0,0,0.95),0_1px_6px_rgba(0,0,0,0.8)]">
            {headline}
          </h1>

          <p className="font-sans text-base text-cream/82 leading-relaxed max-w-md mb-10 animate-fade-in [animation-delay:160ms] [text-shadow:0_1px_14px_rgba(0,0,0,0.9)]">
            {subheading}
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-in [animation-delay:240ms]">
            {/* Primary — gold, dominant */}
            <Link
              href={primaryCta.href}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-gold px-8 font-sans text-[12px] tracking-[0.15em] uppercase text-charcoal-950 font-medium transition-all hover:bg-gold-400 active:scale-[0.98] shadow-[0_4px_32px_rgba(201,169,110,0.7),0_2px_8px_rgba(201,169,110,0.5)]"
            >
              {primaryCta.label}
              <ArrowRightIcon />
            </Link>

            {/* Secondary — white, recessive */}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white/12 border border-white/30 px-8 font-sans text-[12px] tracking-[0.15em] uppercase text-cream backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/50 active:scale-[0.98]"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-12 hidden lg:flex flex-col items-center gap-3 animate-fade-in [animation-delay:500ms]">
          <div className="h-12 w-px bg-gradient-to-b from-cream/40 to-transparent" />
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/40 rotate-90 origin-center translate-y-6">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
