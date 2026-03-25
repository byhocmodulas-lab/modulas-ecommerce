import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    template: "%s — Modulas",
    default: "Sign in — Modulas",
  },
  robots: { index: false, follow: false },
};

/**
 * Shared layout for all role-specific login pages.
 * Full-screen, no sidebar, no global nav — completely isolated auth context.
 */
export default function PortalAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col items-center justify-center px-6 py-16">
      {/* Back to store */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 font-sans text-[10px] tracking-[0.2em] uppercase text-cream/30 hover:text-cream/70 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Modulas
      </Link>

      {/* Card */}
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
