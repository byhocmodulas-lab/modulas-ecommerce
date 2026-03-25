"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, BarChart3,
  Settings, ArrowLeft, ChevronRight, Star,
} from "lucide-react";

const NAV = [
  { href: "/vendor",             label: "Overview",  icon: LayoutDashboard, exact: true },
  { href: "/vendor/products",    label: "Products",  icon: Package },
  { href: "/vendor/orders",      label: "Orders",    icon: ShoppingBag },
  { href: "/vendor/analytics",   label: "Analytics", icon: BarChart3 },
  { href: "/vendor/reviews",     label: "Reviews",   icon: Star },
  { href: "/vendor/settings",    label: "Settings",  icon: Settings },
];

function NavLink({ href, label, icon: Icon, exact }: (typeof NAV)[number]) {
  const pathname = usePathname();
  const active   = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-2.5 rounded-lg px-3 py-2 font-sans text-sm transition-colors",
        active
          ? "bg-gold/10 text-gold font-medium"
          : "text-charcoal/50 hover:bg-black/5 hover:text-charcoal",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}

export default function VendorPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f7f5]">
      <div className="border-b border-black/6 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 font-sans text-xs text-charcoal/40 hover:text-charcoal transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Store
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-charcoal/20" />
            <span className="font-serif text-sm text-charcoal">Vendor Portal</span>
          </div>
          <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-0.5 font-sans text-[10px] tracking-[0.1em] uppercase text-amber-700 font-medium">
            Vendor
          </span>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1400px] gap-8 px-6 py-8">
        <aside className="hidden w-52 shrink-0 lg:block">
          <nav className="space-y-0.5">
            {NAV.map((item) => <NavLink key={item.href} {...item} />)}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
