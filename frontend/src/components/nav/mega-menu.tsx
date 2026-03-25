"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/format";

export type MegaSection = "modular" | "furniture" | "spaces";

interface MegaMenuProps {
  isOpen: boolean;
  section: MegaSection | null;
  onClose: () => void;
}

/* ── Section data ──────────────────────────────────────────────── */

const MODULAR_COLUMNS = [
  {
    heading: "Modular Kitchens",
    href: "/modular-solutions/kitchens",
    icon: <KitchenIcon />,
    links: [
      { label: "Straight Kitchen",    href: "/modular-solutions/kitchens?layout=straight" },
      { label: "L-Shape Kitchen",     href: "/modular-solutions/kitchens?layout=l-shape" },
      { label: "U-Shape Kitchen",     href: "/modular-solutions/kitchens?layout=u-shape" },
      { label: "Parallel Kitchen",    href: "/modular-solutions/kitchens?layout=parallel" },
      { label: "Island Kitchen",      href: "/modular-solutions/kitchens?layout=island" },
      { label: "Handle / Handleless", href: "/modular-solutions/kitchens?style=handleless" },
    ],
  },
  {
    heading: "Modular Wardrobes",
    href: "/modular-solutions/wardrobes",
    icon: <WardrobeIcon />,
    links: [
      { label: "Sliding Door",      href: "/modular-solutions/wardrobes?type=sliding" },
      { label: "Hinged Door",       href: "/modular-solutions/wardrobes?type=hinged" },
      { label: "Walk-in Wardrobe",  href: "/modular-solutions/wardrobes?type=walk-in" },
      { label: "Kids Wardrobe",     href: "/modular-solutions/wardrobes?type=kids" },
      { label: "Loft Wardrobe",     href: "/modular-solutions/wardrobes?type=loft" },
    ],
  },
  {
    heading: "Modular Storage",
    href: "/modular-solutions/storage",
    icon: <StorageIcon />,
    links: [
      { label: "TV & Media Units",    href: "/modular-solutions/storage?type=tv" },
      { label: "Crockery & Bar Units",href: "/modular-solutions/storage?type=crockery" },
      { label: "Shoe Storage",        href: "/modular-solutions/storage?type=shoe" },
      { label: "Entry & Foyer Units", href: "/modular-solutions/storage?type=foyer" },
      { label: "Study & Office",      href: "/modular-solutions/storage?type=study" },
      { label: "Utility & Laundry",   href: "/modular-solutions/storage?type=utility" },
    ],
  },
];

const FURNITURE_COLUMNS = [
  {
    heading: "Seating",
    href: "/furniture/seating",
    icon: <SofaIcon />,
    links: [
      { label: "Sofas & Sectionals", href: "/furniture/seating?type=sofas" },
      { label: "Armchairs",          href: "/furniture/seating?type=armchairs" },
      { label: "Ottomans",           href: "/furniture/seating?type=ottomans" },
      { label: "Recliners",          href: "/furniture/seating?type=recliners" },
    ],
  },
  {
    heading: "Beds & Bedroom",
    href: "/furniture/beds",
    icon: <BedIcon />,
    links: [
      { label: "Beds & Bed Frames",   href: "/furniture/beds?type=beds" },
      { label: "Bedside Tables",      href: "/furniture/beds?type=bedside" },
      { label: "Dressing Tables",     href: "/furniture/beds?type=dressing" },
      { label: "Bedroom Storage",     href: "/furniture/beds?type=storage" },
    ],
  },
  {
    heading: "Dining",
    href: "/furniture/dining",
    icon: <DiningIcon />,
    links: [
      { label: "Dining Tables", href: "/furniture/dining?type=tables" },
      { label: "Dining Chairs", href: "/furniture/dining?type=chairs" },
      { label: "Buffets",       href: "/furniture/dining?type=buffets" },
      { label: "Bar Units",     href: "/furniture/dining?type=bar" },
    ],
  },
  {
    heading: "Living & Study",
    href: "/furniture/living",
    icon: <LivingIcon />,
    links: [
      { label: "Coffee Tables",  href: "/furniture/living?type=coffee-tables" },
      { label: "TV Consoles",    href: "/furniture/living?type=tv-consoles" },
      { label: "Shelving Units", href: "/furniture/living?type=shelving" },
      { label: "Study Desks",    href: "/furniture/study" },
    ],
  },
];

const SPACES_ROOMS = [
  { label: "Living Room",      href: "/spaces/living-room",    icon: <LivingIcon /> },
  { label: "Kitchen",          href: "/spaces/kitchen",         icon: <KitchenIcon /> },
  { label: "Bedroom",          href: "/spaces/bedroom",         icon: <BedIcon /> },
  { label: "Dining Room",      href: "/spaces/dining-room",     icon: <DiningIcon /> },
  { label: "Study & Home Office", href: "/spaces/study",        icon: <StudyIcon /> },
  { label: "Walk-in Closet",   href: "/spaces/walk-in-closet",  icon: <WardrobeIcon /> },
  { label: "Kids Room",        href: "/spaces/kids-room",       icon: <KidsIcon /> },
  { label: "Foyer & Entry",    href: "/spaces/foyer",           icon: <FoyerIcon /> },
];

const SECTION_FEATURED: Record<MegaSection, { label: string; title: string; sub: string; href: string; cta: string }> = {
  modular: {
    label: "Book a Free Visit",
    title: "Design Your Dream Kitchen or Wardrobe",
    sub: "Our designers come to your home, measure up, and create a 3D plan — at no cost.",
    href: "/book-consultation",
    cta: "Book Consultation",
  },
  furniture: {
    label: "New Collection",
    title: "The Modern Living Edit",
    sub: "Handcrafted pieces made to order — solid hardwoods, premium fabrics, lifetime warranty.",
    href: "/collections/modern-living",
    cta: "Explore Collection",
  },
  spaces: {
    label: "Get Inspired",
    title: "Real Homes, Real Spaces",
    sub: "Browse our project gallery and see how Modulas transforms everyday rooms into extraordinary spaces.",
    href: "/projects",
    cta: "View Projects",
  },
};

/* ── Component ─────────────────────────────────────────────────── */

export function MegaMenu({ isOpen, section, onClose }: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    if (!isOpen) el.setAttribute("inert", ""); else el.removeAttribute("inert");
  }, [isOpen]);

  const featured = section ? SECTION_FEATURED[section] : null;

  return (
    <div
      ref={menuRef}
      role="dialog"
      aria-label="Site navigation"
      className={cn(
        "absolute top-full inset-x-0 z-40",
        "bg-white/98 dark:bg-charcoal-950/98 backdrop-blur-xl",
        "border-t border-black/6 dark:border-white/6",
        "shadow-luxury-lg",
        "transition-all duration-300 ease-out origin-top",
        isOpen
          ? "opacity-100 scale-y-100 pointer-events-auto"
          : "opacity-0 scale-y-95 pointer-events-none",
      )}
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-10">
        {section === "modular" && (
          <ModularSection onClose={onClose} featured={featured!} />
        )}
        {section === "furniture" && (
          <FurnitureSection onClose={onClose} featured={featured!} />
        )}
        {section === "spaces" && (
          <SpacesSection onClose={onClose} featured={featured!} />
        )}
      </div>
    </div>
  );
}

/* ── Section renderers ─────────────────────────────────────────── */

function ModularSection({ onClose, featured }: { onClose: () => void; featured: typeof SECTION_FEATURED["modular"] }) {
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-8">
        <p className="mb-5 font-sans text-[10px] tracking-[0.3em] uppercase text-charcoal/35 dark:text-cream/35">
          Modular Solutions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {MODULAR_COLUMNS.map((col) => (
            <div key={col.heading}>
              <Link
                href={col.href}
                onClick={onClose}
                className="group flex items-center gap-2 mb-3"
              >
                <span className="text-gold/60 group-hover:text-gold transition-colors">{col.icon}</span>
                <span className="font-serif text-base text-charcoal dark:text-cream group-hover:text-gold transition-colors">
                  {col.heading}
                </span>
              </Link>
              <ul className="space-y-1.5 border-l border-black/6 dark:border-white/6 pl-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="font-sans text-[12px] text-charcoal/50 dark:text-cream/50 hover:text-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-7 pt-6 border-t border-black/6 dark:border-white/6 flex flex-wrap gap-x-6 gap-y-2">
          <QuickLink href="/how-it-works" label="How It Works" onClose={onClose} />
          <QuickLink href="/materials" label="Materials & Finishes" onClose={onClose} />
          <QuickLink href="/manufacturing" label="Manufacturing" onClose={onClose} />
          <QuickLink href="/for-designers" label="For Architects & Designers" onClose={onClose} />
        </div>
      </div>
      <FeaturedPanel featured={featured} onClose={onClose} />
    </div>
  );
}

function FurnitureSection({ onClose, featured }: { onClose: () => void; featured: typeof SECTION_FEATURED["furniture"] }) {
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-8">
        <p className="mb-5 font-sans text-[10px] tracking-[0.3em] uppercase text-charcoal/35 dark:text-cream/35">
          Furniture
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {FURNITURE_COLUMNS.map((col) => (
            <div key={col.heading}>
              <Link
                href={col.href}
                onClick={onClose}
                className="group flex items-center gap-2 mb-3"
              >
                <span className="text-gold/60 group-hover:text-gold transition-colors">{col.icon}</span>
                <span className="font-serif text-sm text-charcoal dark:text-cream group-hover:text-gold transition-colors">
                  {col.heading}
                </span>
              </Link>
              <ul className="space-y-1.5 border-l border-black/6 dark:border-white/6 pl-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="font-sans text-[11px] text-charcoal/50 dark:text-cream/50 hover:text-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-7 pt-6 border-t border-black/6 dark:border-white/6 flex flex-wrap gap-x-6 gap-y-2">
          <QuickLink href="/collections" label="All Collections" onClose={onClose} />
          <QuickLink href="/products?sort=newest" label="New Arrivals" onClose={onClose} />
          <QuickLink href="/custom-furniture" label="Custom Furniture" onClose={onClose} />
          <QuickLink href="/products?sort=popular" label="Best Sellers" onClose={onClose} />
        </div>
      </div>
      <FeaturedPanel featured={featured} onClose={onClose} />
    </div>
  );
}

function SpacesSection({ onClose, featured }: { onClose: () => void; featured: typeof SECTION_FEATURED["spaces"] }) {
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-8">
        <p className="mb-5 font-sans text-[10px] tracking-[0.3em] uppercase text-charcoal/35 dark:text-cream/35">
          Shop by Room
        </p>
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SPACES_ROOMS.map((room) => (
            <li key={room.label}>
              <Link
                href={room.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-xl p-3.5",
                  "border border-transparent hover:border-gold/20 hover:bg-gold/4 dark:hover:bg-gold/6",
                  "transition-all duration-200",
                )}
              >
                <span className="text-gold/50 group-hover:text-gold transition-colors shrink-0">
                  {room.icon}
                </span>
                <span className="font-serif text-sm text-charcoal dark:text-cream group-hover:text-gold transition-colors leading-tight">
                  {room.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-7 pt-6 border-t border-black/6 dark:border-white/6 flex flex-wrap gap-x-6 gap-y-2">
          <QuickLink href="/projects" label="Project Gallery" onClose={onClose} />
          <QuickLink href="/collections" label="Collections" onClose={onClose} />
          <QuickLink href="/book-consultation" label="Get a Free Design Consultation" onClose={onClose} />
        </div>
      </div>
      <FeaturedPanel featured={featured} onClose={onClose} />
    </div>
  );
}

/* ── Shared: featured panel ────────────────────────────────────── */

function FeaturedPanel({
  featured,
  onClose,
}: {
  featured: { label: string; title: string; sub: string; href: string; cta: string };
  onClose: () => void;
}) {
  return (
    <div className="hidden lg:flex col-span-4 flex-col">
      <p className="mb-5 font-sans text-[10px] tracking-[0.3em] uppercase text-charcoal/35 dark:text-cream/35">
        {featured.label}
      </p>
      <Link
        href={featured.href}
        onClick={onClose}
        className="group relative flex-1 flex flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-charcoal-800 via-charcoal-900 to-charcoal-950 p-6 min-h-[240px]"
      >
        {/* Decorative accent */}
        <div className="absolute top-4 right-4 h-20 w-20 rounded-full bg-gold/10 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 to-transparent" />
        <div className="relative">
          <h3 className="font-serif text-xl text-cream leading-snug group-hover:text-gold transition-colors mb-2">
            {featured.title}
          </h3>
          <p className="font-sans text-[12px] text-cream/55 leading-relaxed mb-4">
            {featured.sub}
          </p>
          <span className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.15em] uppercase text-gold/80 group-hover:text-gold transition-colors">
            {featured.cta}
            <ArrowRightIcon />
          </span>
        </div>
      </Link>
    </div>
  );
}

function QuickLink({ href, label, onClose }: { href: string; label: string; onClose: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/45 dark:text-cream/45 hover:text-gold transition-colors"
    >
      {label}
    </Link>
  );
}

/* ── Icons ────────────────────────────────────────────────────── */
function KitchenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 8v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8" />
      <path d="M3 8h18" />
      <circle cx="10" cy="14" r="2" />
      <path d="M14 14h3M14 17h3" />
    </svg>
  );
}
function WardrobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <path d="M12 3v18M2 7h20" />
      <circle cx="8" cy="14" r="1" /><circle cx="16" cy="14" r="1" />
    </svg>
  );
}
function StorageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="5" rx="1" />
      <rect x="2" y="12" width="20" height="5" rx="1" />
      <path d="M10 7h.01M10 15h.01" />
    </svg>
  );
}
function SofaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
      <path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5H6V11a2 2 0 0 0-4 0z" />
      <path d="M6 18v2M18 18v2" />
    </svg>
  );
}
function BedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 14h20" />
      <path d="M6 14v-3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" />
    </svg>
  );
}
function DiningIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="3" rx="1" />
      <path d="M7 10v7M17 10v7M4 21h16" />
    </svg>
  );
}
function LivingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}
function StudyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
function KidsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
    </svg>
  );
}
function FoyerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
