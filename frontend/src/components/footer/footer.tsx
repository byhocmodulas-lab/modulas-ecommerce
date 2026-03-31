import Link from "next/link";

const LINKS = {
  "Modular Solutions": [
    { label: "Modular Kitchens",        href: "/modular-solutions/kitchens" },
    { label: "Modular Wardrobes",       href: "/modular-solutions/wardrobes" },
    { label: "Modular Storage",         href: "/modular-solutions/storage" },
    { label: "Study & Office Storage",  href: "/modular-solutions/storage?type=study" },
    { label: "Utility & Laundry",       href: "/modular-solutions/storage?type=utility" },
    { label: "Custom Furniture",        href: "/custom-furniture" },
  ],
  "Furniture": [
    { label: "Seating & Sofas",  href: "/furniture/seating" },
    { label: "Beds & Bedroom",   href: "/furniture/beds" },
    { label: "Dining",           href: "/furniture/dining" },
    { label: "Study & Office",   href: "/furniture/study" },
    { label: "Living Room",      href: "/furniture/living" },
    { label: "All Collections",  href: "/collections" },
  ],
  "Explore": [
    { label: "Spaces",                href: "/spaces" },
    { label: "Projects",              href: "/projects" },
    { label: "Materials & Finishes",  href: "/materials" },
    { label: "How It Works",          href: "/how-it-works" },
    { label: "Book a Consultation",   href: "/book-consultation" },
    { label: "For Architects & Designers", href: "/for-designers" },
  ],
  "Company": [
    { label: "About Modulas",   href: "/about" },
    { label: "Manufacturing",   href: "/manufacturing" },
    { label: "Sustainability",  href: "/sustainability" },
    { label: "Careers",         href: "/careers" },
    { label: "Press",           href: "/press" },
    { label: "Journal",         href: "/journal" },
    { label: "Contact",         href: "/contact" },
  ],
};

const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/modulas__",                    icon: <InstagramIcon /> },
  { label: "Facebook",  href: "https://www.facebook.com/modulasbyhoc",                  icon: <FacebookIcon /> },
  { label: "LinkedIn",  href: "https://www.linkedin.com/company/modulasindia/",          icon: <LinkedInIcon /> },
];

export function Footer() {
  return (
    <footer className="bg-charcoal-950 text-cream/60" aria-label="Site footer">

      {/* ── Main grid ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 pt-16 pb-10 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">

          {/* Brand column */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="group w-fit">
              <img
                src="/logo-full-light.png"
                alt="Modulas"
                className="h-7 w-auto opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="font-sans text-sm leading-relaxed text-cream/45 max-w-xs">
              Modular kitchens, wardrobes, and furniture — designed and built to last a lifetime. Crafted for Indian homes.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {SOCIAL.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/10 text-cream/40 transition-all hover:border-gold/40 hover:text-gold"
                >
                  {icon}
                </a>
              ))}
            </div>
            {/* Book CTA */}
            <Link
              href="/book-consultation"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 px-4 py-2.5 font-sans text-[11px] tracking-[0.15em] uppercase text-gold/80 hover:border-gold hover:text-gold transition-colors"
            >
              Book Free Home Visit
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            {/* Certifications */}
            <div className="flex flex-wrap gap-2 mt-1">
              <CertBadge label="ISO 9001" />
              <CertBadge label="Made in India" />
              <CertBadge label="10 Yr Warranty" />
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="mb-5 font-sans text-[11px] tracking-[0.25em] uppercase text-cream/35">
                {heading}
              </h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-sans text-sm text-cream/55 transition-colors hover:text-cream"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Support strip ─────────────────────────────────────── */}
        <div className="mt-12 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <PhoneIcon />, label: "Call Us", value: "+91 92206 66659", href: "tel:+919220666659" },
            { icon: <MailIcon />,  label: "Email",   value: "info@modulas.in",  href: "mailto:info@modulas.in" },
            { icon: <MapIcon />,   label: "Showroom", value: "Visit our Experience Centre", href: "/contact" },
          ].map(({ icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              className="group flex items-center gap-3 rounded-xl border border-cream/6 px-4 py-3.5 transition-colors hover:border-gold/20"
            >
              <span className="text-gold/50 group-hover:text-gold transition-colors shrink-0">{icon}</span>
              <span>
                <span className="block font-sans text-[10px] tracking-[0.2em] uppercase text-cream/30 mb-0.5">{label}</span>
                <span className="block font-sans text-sm text-cream/60 group-hover:text-cream transition-colors">{value}</span>
              </span>
            </a>
          ))}
        </div>

        {/* ── Bottom bar ───────────────────────────────────────── */}
        <div className="border-t border-cream/8 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-sans text-[11px] text-cream/25">
            © {new Date().getFullYear()} Modulas Home Solutions Pvt. Ltd. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-5">
            {[
              { label: "Privacy Policy",  href: "/privacy-policy" },
              { label: "Cookie Policy",   href: "/cookie-policy" },
              { label: "Terms of Sale",   href: "/terms-of-sale" },
              { label: "Accessibility",   href: "/accessibility" },
              { label: "Warranty",        href: "/delivery" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-sans text-[11px] text-cream/25 hover:text-cream/60 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

/* ── Sub-components ───────────────────────────────────────────── */
function CertBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/10 px-2.5 py-1 font-sans text-[9px] tracking-[0.15em] uppercase text-cream/30">
      <span className="h-1 w-1 rounded-full bg-gold" />
      {label}
    </span>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
function MapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  );
}
