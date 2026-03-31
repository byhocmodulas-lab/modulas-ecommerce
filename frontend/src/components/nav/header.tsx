"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { MobileMenu } from "./mobile-menu";
import { CartIcon } from "./cart-icon";
import { MegaMenu } from "./mega-menu";
import type { MegaSection } from "./mega-menu";
import { AnnouncementBar } from "./announcement-bar";
import { UserNav } from "./user-nav";
import { cn } from "@/lib/utils/format";

const NAV_LINKS = [
  { href: "/modular-solutions", label: "Modular Solutions", megaSection: "modular" as MegaSection },
  { href: "/furniture",         label: "Furniture",         megaSection: "furniture" as MegaSection },
  { href: "/spaces",            label: "Spaces",            megaSection: "spaces" as MegaSection },
  { href: "/collections",       label: "Collections",       megaSection: null },
  { href: "/projects",          label: "Projects",          megaSection: null },
  { href: "/for-designers",     label: "For Designers",     megaSection: null },
] as const;

export function Header() {
  const pathname        = usePathname();
  const [scrolled,      setScrolled]      = useState(false);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [megaSection,   setMegaSection]   = useState<MegaSection | null>(null);
  const megaTimeoutRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const megaOpen = megaSection !== null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => { setMegaSection(null); }, [pathname]);

  const openMega  = (section: MegaSection) => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setMegaSection(section);
  };
  const closeMega = () => {
    megaTimeoutRef.current = setTimeout(() => setMegaSection(null), 120);
  };
  const keepMega  = () => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          "bg-white dark:bg-charcoal-950 border-b border-black/8 dark:border-white/8",
          scrolled && "shadow-luxury",
        )}
      >
        {/* Announcement bar — hidden when scrolled for cleanliness */}
        <div className={cn("transition-all duration-300 overflow-hidden", scrolled ? "h-0" : "h-9")}>
          <AnnouncementBar />
        </div>

        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:px-12">

          {/* ── Logo ─────────────────────────────────────────── */}
          <Link href="/" className="flex items-center shrink-0" aria-label="Modulas — Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-full-dark.png" alt="Modulas" className="h-8 w-auto dark:hidden" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-full-light.png" alt="Modulas" className="h-8 w-auto hidden dark:block" />
          </Link>

          {/* ── Desktop nav ──────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label, megaSection: section }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              const highlighted = active || (megaOpen && section && megaSection === section);

              return section ? (
                <Link
                  key={href}
                  href={href}
                  onMouseEnter={() => openMega(section)}
                  onMouseLeave={closeMega}
                  onFocus={() => openMega(section)}
                  onBlur={closeMega}
                  aria-haspopup="dialog"
                  className={cn(
                    "relative font-sans text-[12px] tracking-[0.12em] uppercase transition-colors duration-200 py-1",
                    "after:absolute after:bottom-0 after:left-0 after:h-px after:bg-charcoal dark:after:bg-cream",
                    "after:transition-all after:duration-300",
                    highlighted
                      ? "text-charcoal dark:text-cream after:w-full"
                      : "text-charcoal/55 dark:text-cream/55 hover:text-charcoal dark:hover:text-cream after:w-0 hover:after:w-full",
                  )}
                >
                  {label}
                </Link>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative font-sans text-[12px] tracking-[0.12em] uppercase transition-colors duration-200 py-1",
                    "after:absolute after:bottom-0 after:left-0 after:h-px after:bg-charcoal dark:after:bg-cream",
                    "after:transition-all after:duration-300",
                    active
                      ? "text-charcoal dark:text-cream after:w-full"
                      : "text-charcoal/55 dark:text-cream/55 hover:text-charcoal dark:hover:text-cream after:w-0 hover:after:w-full",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* ── Right actions ─────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <Link
              href="/book-consultation"
              className="hidden lg:inline-flex items-center h-9 px-5 bg-gold font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
            >
              Book Free Visit
            </Link>

            <button
              type="button"
              aria-label="Search"
              className="hidden sm:flex h-9 w-9 items-center justify-center text-charcoal/60 dark:text-cream/60 hover:text-charcoal dark:hover:text-cream hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <SearchIcon />
            </button>

            <CartIcon />
            <UserNav />

            <button
              type="button"
              className="lg:hidden flex flex-col gap-1.5 p-2 -mr-2"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <span className="block h-px w-5 bg-charcoal dark:bg-cream" />
              <span className="block h-px w-4 bg-charcoal dark:bg-cream" />
              <span className="block h-px w-5 bg-charcoal dark:bg-cream" />
            </button>
          </div>
        </div>
      </header>

      {/* Mega menu — bridge hover gap between nav button and panel */}
      <div onMouseEnter={keepMega} onMouseLeave={closeMega}>
        <MegaMenu
          isOpen={megaOpen}
          section={megaSection}
          onClose={() => setMegaSection(null)}
        />
      </div>

      {/* Mobile drawer */}
      <MobileMenu
        links={NAV_LINKS.map(({ href, label }) => ({ href, label }))}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
      />
    </>
  );
}


function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
