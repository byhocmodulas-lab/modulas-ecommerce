"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  LayoutDashboard, Users, FileText, Briefcase, BarChart3,
  Megaphone, ShoppingBag, ChevronRight, ArrowLeft, Shield,
  PhoneCall, Share2, FileBarChart2, TrendingUp, Target,
  DollarSign, Receipt, PackageCheck,
  Zap, Globe, Search, Sparkles, Palette, Eye,
  Package, FolderTree, ImageIcon,
} from "lucide-react";
import { useAccessToken, useAuthStore } from "@/lib/stores/auth-store";
import { authApi } from "@/lib/api/client";
import { refresh } from "@/lib/api/auth";
import { PublishButton } from "@/components/admin/publish-button";

/** Silently refreshes the access token every 14 minutes so the session never expires */
function TokenRefresher() {
  const setAuth   = useAuthStore((s) => s.setAuth);
  const tokenRef  = useRef<string | null>(null);
  tokenRef.current = useAccessToken();

  useEffect(() => {
    async function doRefresh() {
      try {
        const result = await refresh();
        if (!result?.accessToken) return;
        setAuth(
          {
            id: result.user.id,
            email: result.user.email,
            fullName: result.user.fullName,
            avatarUrl: result.user.avatarUrl,
            role: result.user.role as Parameters<typeof setAuth>[0]["role"],
            isVerified: result.user.isVerified,
          },
          result.accessToken,
          result.expiresIn,
        );
        // Re-set the cookie so the middleware doesn't redirect
        document.cookie = `modulas_token=${result.accessToken}; path=/; max-age=${result.expiresIn}; SameSite=Lax`;
      } catch {
        // Refresh failed (e.g. refresh token also expired) — let middleware handle it
      }
    }

    // Refresh immediately on mount, then every 14 minutes
    doRefresh();
    const id = setInterval(doRefresh, 14 * 60 * 1000);
    return () => clearInterval(id);
  }, [setAuth]);

  return null;
}

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { href: "/master-admin",           label: "Dashboard",        icon: LayoutDashboard, exact: true },
      { href: "/master-admin/analytics", label: "Analytics",        icon: BarChart3 },
    ],
  },
  {
    label: "Social & Marketing",
    items: [
      { href: "/master-admin/social",           label: "Social Media Hub",  icon: Share2 },
      { href: "/master-admin/content-studio",   label: "Content Studio",    icon: Sparkles },
      { href: "/master-admin/reports",          label: "Reports & Targets", icon: FileBarChart2 },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/master-admin/catalog",             label: "Products",          icon: Package },
      { href: "/master-admin/catalog/categories",  label: "Categories",        icon: FolderTree },
    ],
  },
  {
    label: "Website CMS",
    items: [
      { href: "/master-admin/content",            label: "Pages & Banners",   icon: FileText },
      { href: "/master-admin/content/navigation", label: "Navigation",        icon: Globe },
      { href: "/master-admin/content/popups",     label: "Popups",            icon: Zap },
      { href: "/master-admin/content/seo",        label: "SEO Control",       icon: Search },
      { href: "/master-admin/content/theme",      label: "Theme Editor",      icon: Palette },
      { href: "/master-admin/content/visibility", label: "Visibility Manager", icon: Eye },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/master-admin/financials",label: "Financials & P&L", icon: DollarSign },
      { href: "/master-admin/crm",       label: "Lead Hub & CRM",   icon: Target },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/master-admin/users",  label: "User Management",      icon: Users,    badge: "pending" as const },
      { href: "/master-admin/leads",  label: "Leads & Consultations",icon: PhoneCall },
      { href: "/master-admin/careers",label: "Careers & Interns",    icon: Briefcase },
    ],
  },
  {
    label: "Commerce",
    items: [
      { href: "/master-admin/orders",   label: "Orders",   icon: PackageCheck },
      { href: "/master-admin/invoices", label: "Invoices", icon: Receipt },
    ],
  },
  {
    label: "Partners",
    items: [
      { href: "/master-admin/collaborations", label: "Collaborations",      icon: Megaphone  },
      { href: "/master-admin/vendors",        label: "Vendor Applications", icon: ShoppingBag },
    ],
  },
];

function NavItem({
  href,
  label,
  icon: Icon,
  exact = false,
  pendingCount,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  pendingCount?: number;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href) && href !== "/master-admin";

  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-2.5 rounded-lg px-3 py-2 font-sans text-sm transition-colors",
        active
          ? "bg-red-50 text-red-600 font-medium"
          : "text-charcoal/50 hover:bg-black/5 hover:text-charcoal",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{label}</span>
      {pendingCount != null && pendingCount > 0 && (
        <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-amber-500 px-1 font-sans text-[10px] font-semibold text-white leading-none">
          {pendingCount > 99 ? "99+" : pendingCount}
        </span>
      )}
    </Link>
  );
}

export default function MasterAdminLayout({ children }: { children: React.ReactNode }) {
  const token = useAccessToken() ?? "";
  const [pendingCount, setPendingCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!token) return;
    authApi.listUsers(token)
      .then(result => {
        const users = Array.isArray(result) ? result : [];
        const count = users.filter(u => !u.isVerified && u.role !== "customer").length;
        setPendingCount(count);
      })
      .catch(() => { /* badge is optional — silently ignore */ });
  }, [token]);

  return (
    <div className="min-h-screen bg-[#f8f7f5]">
      <TokenRefresher />
      {/* Top bar */}
      <div className="border-b border-black/6 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 font-sans text-xs text-charcoal/40 hover:text-charcoal transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              Store
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-charcoal/20" />
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-red-500" />
              <span className="font-sans text-sm text-charcoal">Master Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PublishButton variant="compact" label="Publish" />
            <span className="rounded-full bg-red-50 border border-red-200 px-3 py-0.5 font-sans text-[10px] tracking-[0.1em] uppercase text-red-600 font-medium">
              Restricted Access
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1600px] gap-8 px-6 py-8">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="space-y-6">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label}>
                <p className="mb-1.5 px-3 font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/30">
                  {section.label}
                </p>
                <nav className="space-y-0.5">
                  {section.items.map((item) => (
                    <NavItem
                      key={item.href}
                      {...item}
                      pendingCount={'badge' in item && item.badge === "pending" ? pendingCount : undefined}
                    />
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </aside>

        {/* Mobile top nav */}
        <div className="flex gap-2 overflow-x-auto pb-4 lg:hidden w-full">
          {NAV_SECTIONS.flatMap((s) => s.items).map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/8 px-3.5 py-1.5 font-sans text-[11px] text-charcoal/50 hover:border-red-300 hover:text-red-600 transition-colors">
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
