"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban, Users, FileText, LayoutDashboard,
  Settings, ArrowLeft, ChevronRight, BookOpen, Layers, Handshake,
} from "lucide-react";

const NAV = [
  { href: "/architect",           label: "Overview",  icon: LayoutDashboard, exact: true },
  { href: "/architect/projects",  label: "Projects",  icon: FolderKanban },
  { href: "/architect/clients",   label: "Clients",   icon: Users },
  { href: "/architect/quotes",    label: "Quotes",    icon: FileText },
  { href: "/architect/library",   label: "Library",   icon: BookOpen },
  { href: "/architect/materials", label: "Materials", icon: Layers },
  { href: "/architect/partner",   label: "Partner",   icon: Handshake },
  { href: "/architect/settings",  label: "Settings",  icon: Settings },
];

function NavLink({ href, label, icon: Icon, exact }: (typeof NAV)[number]) {
  const pathname = usePathname();
  const active   = exact ? pathname === href : pathname.startsWith(href) && href !== "/architect";

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

export default function ArchitectPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f7f5]">
      {/* Top bar */}
      <div className="border-b border-black/6 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 font-sans text-xs text-charcoal/40 hover:text-charcoal transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Store
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-charcoal/20" />
            <span className="font-serif text-sm text-charcoal">Architect Portal</span>
          </div>
          <span className="rounded-full bg-gold/10 border border-gold/20 px-3 py-0.5 font-sans text-[10px] tracking-[0.1em] uppercase text-gold font-medium">
            Trade
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1400px] gap-8 px-6 py-8">
        {/* Sidebar */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <nav className="space-y-0.5">
            {NAV.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="flex gap-2 overflow-x-auto pb-4 lg:hidden w-full">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/8 px-3.5 py-1.5 font-sans text-[11px] text-charcoal/50 hover:border-gold hover:text-gold transition-colors"
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Main */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
