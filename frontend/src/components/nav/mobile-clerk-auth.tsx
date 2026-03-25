"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth-store";

const ROLE_DASHBOARD: Record<string, string> = {
  master_admin: "/master-admin",
  editor:       "/master-admin",
  architect:    "/architect",
  vendor:       "/vendor",
  creator:      "/creator",
  intern:       "/intern",
  customer:     "/account",
};

/**
 * Mobile auth section — shows account links when signed in, nothing when signed out.
 * Sign-in is triggered contextually (checkout, book consultation, save design).
 */
export default function MobileClerkAuth({ onClose }: { onClose?: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const user      = useAuthStore((s) => s.user);
  const authed    = useAuthStore((s) => s.isAuthenticated());
  const clearAuth = useAuthStore((s) => s.clearAuth);

  if (!mounted || !authed || !user) return null;

  const dashboard = ROLE_DASHBOARD[user.role] ?? "/account";

  function signOut() {
    clearAuth();
    document.cookie = "modulas_token=; path=/; max-age=0";
    onClose?.();
    window.location.href = "/";
  }

  return (
    <div className="space-y-2">
      <Link
        href={dashboard}
        onClick={onClose}
        className="block w-full rounded-full border border-charcoal/20 dark:border-cream/20 py-2.5 text-center font-sans text-[12px] tracking-[0.1em] uppercase transition-all hover:border-gold hover:text-gold"
      >
        My Account
      </Link>
      <button
        type="button"
        onClick={signOut}
        className="block w-full rounded-full border border-charcoal/10 dark:border-cream/10 py-2.5 text-center font-sans text-[12px] tracking-[0.1em] uppercase text-charcoal/50 dark:text-cream/50 transition-all hover:border-charcoal/30 hover:text-charcoal dark:hover:text-cream"
      >
        Sign Out
      </button>
    </div>
  );
}
