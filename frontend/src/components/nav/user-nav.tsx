"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth-store";

/** Portal dashboard link per role */
const ROLE_DASHBOARD: Record<string, string> = {
  master_admin: "/master-admin",
  editor:       "/master-admin",
  architect:    "/architect",
  vendor:       "/vendor",
  creator:      "/creator",
  intern:       "/intern",
  customer:     "/account",
};

const ROLE_LABEL: Record<string, string> = {
  master_admin: "Admin",
  editor:       "Editor",
  architect:    "Architect Portal",
  vendor:       "Vendor Portal",
  creator:      "Creator Hub",
  intern:       "Workshop",
  customer:     "My Account",
};

/**
 * Shows a user avatar + dropdown when authenticated.
 * Renders nothing when signed out — do NOT add a sign-in fallback here.
 * Sign-in is triggered contextually (checkout, save design, book consultation).
 */
export function UserNav() {
  const [mounted,  setMounted]  = useState(false);
  const [open,     setOpen]     = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const user        = useAuthStore((s) => s.user);
  const authed      = useAuthStore((s) => s.isAuthenticated());
  const clearAuth   = useAuthStore((s) => s.clearAuth);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Don't render on SSR pass — auth state is client-only (Zustand persist)
  if (!mounted || !authed || !user) return null;

  const dashboard = ROLE_DASHBOARD[user.role] ?? "/account";
  const label     = ROLE_LABEL[user.role]     ?? "My Account";
  const initials  = user.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user.email.slice(0, 2).toUpperCase();

  function signOut() {
    clearAuth();
    document.cookie = "modulas_token=; path=/; max-age=0";
    setOpen(false);
    window.location.href = "/";
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-gold/8 font-sans text-[11px] font-medium text-gold hover:bg-gold/15 transition-colors overflow-hidden"
      >
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatarUrl} alt={user.fullName ?? "User"} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-charcoal-900 border border-black/8 dark:border-white/8 shadow-luxury py-1.5 z-50 animate-fade-in"
        >
          {/* User identity */}
          <div className="px-4 py-3 border-b border-black/6 dark:border-white/6">
            <p className="font-sans text-[12px] font-medium text-charcoal dark:text-cream truncate">
              {user.fullName ?? user.email}
            </p>
            {user.fullName && (
              <p className="font-sans text-[10px] text-charcoal/40 dark:text-cream/40 truncate mt-0.5">
                {user.email}
              </p>
            )}
          </div>

          {/* Dashboard link */}
          <Link
            role="menuitem"
            href={dashboard}
            onClick={() => setOpen(false)}
            className="flex items-center px-4 py-2.5 font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/70 dark:text-cream/70 hover:bg-cream dark:hover:bg-charcoal-800 hover:text-charcoal dark:hover:text-cream transition-colors"
          >
            {label}
          </Link>

          {/* Sign out */}
          <button
            role="menuitem"
            type="button"
            onClick={signOut}
            className="w-full text-left px-4 py-2.5 font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/40 dark:text-cream/40 hover:bg-cream dark:hover:bg-charcoal-800 hover:text-charcoal dark:hover:text-cream transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
