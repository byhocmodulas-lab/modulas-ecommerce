"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/format";

const NAV = [
  { href: "/account",          label: "Dashboard",    icon: LayoutDashboard, exact: true },
  { href: "/account/orders",   label: "My Orders",    icon: ShoppingBag },
  { href: "/account/wishlist", label: "Wishlist",     icon: Heart },
  { href: "/account/addresses",label: "Addresses",    icon: MapPin },
  { href: "/account/settings", label: "Settings",     icon: Settings },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, clearAuth } = useAuthStore();

  function handleSignOut() {
    clearAuth();
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-10">
      {/* Page heading */}
      <div className="mb-8">
        <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-1">Account</p>
        <h1 className="font-serif text-3xl text-charcoal dark:text-cream">
          {user?.fullName ? `Welcome back, ${user.fullName.split(" ")[0]}` : "My Account"}
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* ── Sidebar ───────────────────────────────────────── */}
        <aside className="h-fit">
          {/* Desktop sidebar */}
          <nav className="hidden lg:block rounded-2xl border border-black/6 dark:border-white/6 bg-white dark:bg-charcoal-900 overflow-hidden">
            <ul>
              {NAV.map(({ href, label, icon: Icon, exact }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-3 px-5 py-3.5 font-sans text-sm transition-colors",
                        "border-b border-black/4 dark:border-white/4 last:border-0",
                        active
                          ? "bg-gold/8 text-gold font-medium"
                          : "text-charcoal/60 dark:text-cream/60 hover:text-charcoal dark:hover:text-cream hover:bg-black/3 dark:hover:bg-white/3",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                      {active && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
                    </Link>
                  </li>
                );
              })}
              <li>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 px-5 py-3.5 font-sans text-sm text-charcoal/40 dark:text-cream/40 hover:text-red-500 transition-colors"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Sign out
                </button>
              </li>
            </ul>
          </nav>

          {/* Mobile tab bar */}
          <nav className="lg:hidden flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {NAV.map(({ href, label, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 font-sans text-[11px] tracking-[0.1em] uppercase whitespace-nowrap transition-colors",
                    active
                      ? "bg-gold text-charcoal-950"
                      : "bg-black/5 dark:bg-white/5 text-charcoal/60 dark:text-cream/60",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* ── Main content ──────────────────────────────────── */}
        <div>{children}</div>
      </div>
    </div>
  );
}
