"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cmsApi } from "@/lib/api/client";

const FALLBACK_MESSAGES = [
  { text: "Free Design Consultation — Book Your Home Visit Today", href: "/book-consultation" },
  { text: "Trade Programme Now Open — Exclusive Benefits for Architects & Designers", href: "/for-designers" },
  { text: "Complimentary 3D Design Preview on Every Modular Order", href: "/modular-solutions" },
  { text: "New Arrivals Spring 2026 — Discover the Collection", href: "/products?sort=newest" },
];

interface Message { text: string; href: string }

export function AnnouncementBar() {
  const [messages,  setMessages]  = useState<Message[]>(FALLBACK_MESSAGES);
  const [index,     setIndex]     = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    cmsApi.getActiveBanners("announcement")
      .then(banners => {
        if (banners.length === 0) return;
        setMessages(
          banners.map(b => ({
            text: b.message ?? b.name,
            href: b.ctaHref ?? "#",
          }))
        );
        setIndex(0);
      })
      .catch(() => {
        // Keep fallback on error — no action needed
      });
  }, []);

  useEffect(() => {
    if (dismissed || messages.length <= 1) return;
    const id = setInterval(() => setIndex(i => (i + 1) % messages.length), 4500);
    return () => clearInterval(id);
  }, [dismissed, messages.length]);

  if (dismissed) return null;

  const msg = messages[index];

  return (
    <div className="relative flex h-9 items-center justify-center bg-charcoal-950 dark:bg-charcoal-900 px-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex items-center gap-2"
        >
          <Link
            href={msg.href}
            className="font-sans text-[10px] tracking-[0.2em] uppercase text-cream/80 hover:text-cream transition-colors"
          >
            {msg.text}
          </Link>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center text-cream/40 hover:text-cream/80 transition-colors"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
