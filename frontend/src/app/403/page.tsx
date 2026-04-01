import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Denied — Modulas",
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream dark:bg-charcoal px-6 text-center">
      {/* Decorative number */}
      <p className="font-serif text-[9rem] leading-none font-light text-charcoal/6 dark:text-cream/6 select-none">
        403
      </p>

      <div className="-mt-8 space-y-4">
        <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold">
          Access Denied
        </p>
        <h1 className="font-serif text-3xl font-light text-charcoal dark:text-cream">
          You don&apos;t have permission to view this page
        </h1>
        <p className="font-sans text-sm text-charcoal/50 dark:text-cream/50 max-w-sm mx-auto">
          Your account role does not grant access to this section. If you believe
          this is a mistake, please contact support.
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full bg-charcoal dark:bg-cream px-8 font-sans text-[11px] tracking-[0.15em] uppercase text-cream dark:text-charcoal hover:opacity-80 transition-opacity"
        >
          Go home
        </Link>
        <Link
          href="/account"
          className="inline-flex h-11 items-center justify-center rounded-full border border-charcoal/20 dark:border-cream/20 px-8 font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal dark:text-cream hover:border-charcoal/40 dark:hover:border-cream/40 transition-colors"
        >
          My account
        </Link>
      </div>
    </div>
  );
}
