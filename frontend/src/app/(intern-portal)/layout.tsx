"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, BookOpen, User, ArrowLeft, ChevronRight, Bell } from "lucide-react";

const NAV = [
  { href: "/intern",          label: "My Application", icon: LayoutDashboard, exact: true },
  { href: "/intern/programs", label: "Programs",       icon: Briefcase },
  { href: "/intern/resources",label: "Resources",      icon: BookOpen },
  { href: "/intern/profile",  label: "Profile",        icon: User },
];

function NavLink({ href, label, icon: Icon, exact }: (typeof NAV)[number]) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link href={href}
      className={["flex items-center gap-2.5 rounded-lg px-3 py-2 font-sans text-sm transition-colors",
        active ? "bg-sky-50 text-sky-700 font-medium" : "text-charcoal/50 hover:bg-black/5 hover:text-charcoal",
      ].join(" ")}>
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}

export default function InternPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f9fc]">
      {/* Top bar */}
      <div className="border-b border-black/6 bg-white sticky top-0 z-30">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 font-sans text-xs text-charcoal/40 hover:text-charcoal transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Store
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-charcoal/20" />
            <span className="font-serif text-sm text-charcoal">Intern Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="relative rounded-full p-1.5 text-charcoal/40 hover:text-charcoal transition-colors">
              <Bell className="h-4 w-4" />
            </button>
            <span className="rounded-full bg-sky-50 border border-sky-200 px-3 py-0.5 font-sans text-[10px] tracking-[0.1em] uppercase text-sky-700 font-medium">
              Intern
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1400px] gap-8 px-6 py-8">
        {/* Sidebar */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <nav className="space-y-0.5">
            {NAV.map((item) => <NavLink key={item.href} {...item} />)}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="flex gap-2 overflow-x-auto pb-4 lg:hidden w-full">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/8 px-3.5 py-1.5 font-sans text-[11px] text-charcoal/50 hover:border-sky-400 hover:text-sky-600 transition-colors">
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
