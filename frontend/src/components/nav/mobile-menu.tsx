"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
const MobileClerkAuth = dynamic(() => import("./mobile-clerk-auth"), { ssr: false });
import { cn } from "@/lib/utils/format";

interface NavLink { href: string; label: string; }

interface MobileMenuProps {
  links:    readonly NavLink[];
  isOpen:   boolean;
  onClose:  () => void;
  pathname: string;
}

export function MobileMenu({ links, isOpen, onClose, pathname }: MobileMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[min(340px,90vw)] flex-col bg-white dark:bg-charcoal-950 shadow-luxury-lg transition-transform duration-350 ease-out lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 px-6 py-5">
          <span className="font-serif text-xl tracking-widest uppercase text-charcoal dark:text-cream">
            Modulas
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-1 p-4 flex-1" aria-label="Mobile navigation">
          {links.map(({ href, label }, i) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            const delayClass = ["[animation-delay:0ms]","[animation-delay:50ms]","[animation-delay:100ms]","[animation-delay:150ms]","[animation-delay:200ms]"][i] ?? "[animation-delay:200ms]";
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3.5 font-sans text-[13px] tracking-[0.12em] uppercase transition-colors animate-fade-in",
                  delayClass,
                  active
                    ? "bg-gold/10 text-gold"
                    : "text-charcoal/70 dark:text-cream/70 hover:bg-black/3 dark:hover:bg-white/5 hover:text-charcoal dark:hover:text-cream",
                )}
              >
                {label}
                <ChevronRightIcon />
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-black/5 dark:border-white/5 p-6 space-y-3">
          <Link
            href="/book-consultation"
            onClick={onClose}
            className="flex items-center justify-center w-full rounded-full bg-gold py-3.5 font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
          >
            Book Free Home Visit
          </Link>
          <MobileClerkAuth onClose={onClose} />
        </div>
      </div>
    </>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
