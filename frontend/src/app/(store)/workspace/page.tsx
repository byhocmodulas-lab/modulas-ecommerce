"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FolderKanban,
  Store,
  Clapperboard,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  User,
  Settings,
  LogOut,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAuthStore, useUser } from "@/lib/stores/auth-store";
import type { Role } from "@/lib/stores/auth-store";

/* ── Portal definitions ─────────────────────────────────────────────── */

interface Portal {
  role:        Role | "all";
  label:       string;
  description: string;
  href:        string;
  icon:        React.ElementType;
  badge?:      string;
  accent:      string;
}

const PORTALS: Portal[] = [
  {
    role:        "architect",
    label:       "Architect Portal",
    description: "Manage projects, generate trade quotes, access material libraries, and collaborate with clients.",
    href:        "/architect",
    icon:        FolderKanban,
    badge:       "Trade",
    accent:      "from-amber-50 to-orange-50 border-amber-100",
  },
  {
    role:        "vendor",
    label:       "Vendor Portal",
    description: "List products, manage orders, track fulfilment, and grow your brand on the Modulas platform.",
    href:        "/vendor",
    icon:        Store,
    badge:       "Seller",
    accent:      "from-sky-50 to-blue-50 border-sky-100",
  },
  {
    role:        "creator",
    label:       "Creator Hub",
    description: "Access affiliate links, view campaign performance, and track your earnings and commissions.",
    href:        "/creator",
    icon:        Clapperboard,
    badge:       "Affiliate",
    accent:      "from-violet-50 to-purple-50 border-violet-100",
  },
  {
    role:        "intern",
    label:       "Intern Portal",
    description: "Complete courses, track your internship progress, download certificates, and manage applications.",
    href:        "/intern",
    icon:        GraduationCap,
    badge:       "Learning",
    accent:      "from-emerald-50 to-teal-50 border-emerald-100",
  },
  {
    role:        "master_admin",
    label:       "Master Admin",
    description: "Full platform control — users, orders, analytics, content, vendors, and system configuration.",
    href:        "/master-admin",
    icon:        ShieldCheck,
    badge:       "Admin",
    accent:      "from-red-50 to-rose-50 border-red-100",
  },
];

/* Quick actions available to all authenticated users */
const QUICK_ACTIONS = [
  { label: "Browse products",   href: "/products",          icon: Sparkles },
  { label: "My account",        href: "/account",           icon: User },
  { label: "Account settings",  href: "/account/settings",  icon: Settings },
];

/* ── Page ────────────────────────────────────────────────────────────── */

export default function WorkspacePage() {
  const router      = useRouter();
  const user        = useUser();
  const { clearAuth, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Redirect unauthenticated visitors to login */
  useEffect(() => {
    if (mounted && !isAuthenticated()) {
      router.replace("/login?next=/workspace");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !user) {
    return <WorkspaceSkeleton />;
  }

  const userRole = user.role;

  /* Portals this user can access */
  const accessiblePortals = PORTALS.filter(
    (p) => p.role === "all" || p.role === userRole || userRole === "master_admin",
  );

  /* If regular customer, show upgrade paths instead */
  const isCustomer = userRole === "customer" || userRole === "editor";

  const firstName = user.fullName?.split(" ")[0] ?? user.email.split("@")[0];

  const handleSignOut = () => {
    clearAuth();
    router.push("/");
  };

  return (
    <div className="min-h-[calc(100vh-var(--nav-height))] bg-[#f8f7f5]">
      <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-10 lg:py-16">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold mb-2">
              Workspace
            </p>
            <h1 className="font-serif text-3xl text-charcoal lg:text-4xl">
              Welcome back, {firstName}.
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-black/8 bg-white px-3 py-1 font-sans text-[10px] tracking-[0.1em] uppercase text-charcoal/50">
                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    user.isVerified ? "bg-emerald-400" : "bg-amber-400",
                  ].join(" ")}
                />
                {user.isVerified ? "Verified" : "Pending verification"} · {ROLE_LABELS[userRole] ?? userRole}
              </span>
              <span className="font-sans text-[11px] text-charcoal/35">{user.email}</span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 self-start rounded-full border border-black/8 bg-white px-4 py-2 font-sans text-[11px] text-charcoal/50 hover:border-red-200 hover:text-red-500 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>

        {/* ── Pending approval notice ───────────────────────────── */}
        {!user.isVerified && ["architect", "vendor", "intern"].includes(userRole) && (
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <Clock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-sans text-sm font-medium text-amber-800">
                Your account is pending approval
              </p>
              <p className="font-sans text-[12px] text-amber-700/70 mt-0.5 leading-relaxed">
                Our team is reviewing your application. You&apos;ll receive an email once your
                {" "}{ROLE_LABELS[userRole]} account is activated — usually within 24–48 hours.
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_280px] gap-8">

          {/* ── Portals ────────────────────────────────────────── */}
          <div className="space-y-4">

            {accessiblePortals.length > 0 ? (
              <>
                <h2 className="font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal/35 mb-4">
                  Your Portals
                </h2>

                {accessiblePortals.map((portal) => {
                  const Icon = portal.icon;
                  return (
                    <Link
                      key={portal.href}
                      href={portal.href}
                      className={`group flex items-start gap-5 rounded-2xl border bg-gradient-to-br ${portal.accent} p-6 hover:shadow-sm transition-all duration-200`}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                        <Icon className="h-5 w-5 text-charcoal/60" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-sans text-sm font-medium text-charcoal group-hover:text-gold transition-colors">
                            {portal.label}
                          </p>
                          {portal.badge && (
                            <span className="rounded-full bg-white border border-black/8 px-2 py-0.5 font-sans text-[9px] tracking-[0.1em] uppercase text-charcoal/40">
                              {portal.badge}
                            </span>
                          )}
                        </div>
                        <p className="font-sans text-[12px] text-charcoal/50 leading-relaxed">
                          {portal.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-charcoal/20 group-hover:text-gold group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    </Link>
                  );
                })}
              </>
            ) : isCustomer ? (
              /* Customer upgrade paths */
              <>
                <h2 className="font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal/35 mb-4">
                  Expand your access
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {JOIN_PATHS.map(({ label, desc, href, icon: Icon, colour }) => (
                    <Link
                      key={href}
                      href={href}
                      className="group flex flex-col gap-3 rounded-2xl border border-black/6 bg-white p-5 hover:border-gold/30 hover:shadow-sm transition-all"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colour}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-sans text-sm font-medium text-charcoal group-hover:text-gold transition-colors">
                          {label}
                        </p>
                        <p className="font-sans text-[11px] text-charcoal/45 leading-snug mt-0.5">{desc}</p>
                      </div>
                      <span className="mt-auto inline-flex items-center gap-1.5 font-sans text-[10px] tracking-[0.1em] uppercase text-gold">
                        Apply now <ArrowRight className="h-3 w-3" />
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          {/* ── Sidebar ────────────────────────────────────────── */}
          <aside className="space-y-5">

            {/* Quick actions */}
            <div className="rounded-2xl border border-black/6 bg-white p-5">
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/35 mb-3">
                Quick Actions
              </p>
              <div className="space-y-1">
                {QUICK_ACTIONS.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm text-charcoal/60 hover:bg-gold/5 hover:text-gold transition-colors"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Account info */}
            <div className="rounded-2xl border border-black/6 bg-white p-5 space-y-4">
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/35">
                Account
              </p>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 shrink-0">
                  <span className="font-serif text-sm text-gold">
                    {(user.fullName ?? user.email).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-sans text-sm text-charcoal truncate">
                    {user.fullName ?? "—"}
                  </p>
                  <p className="font-sans text-[11px] text-charcoal/40 truncate">{user.email}</p>
                </div>
              </div>

              <div className="border-t border-black/6 pt-4 space-y-2">
                <InfoRow label="Role"    value={ROLE_LABELS[userRole] ?? userRole} />
                <InfoRow label="Status"  value={user.isVerified ? "Verified" : "Pending"} />
                <InfoRow label="User ID" value={user.id.slice(0, 8) + "…"} mono />
              </div>

              <Link
                href="/account/settings"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-black/8 py-2 font-sans text-[11px] text-charcoal/50 hover:border-gold hover:text-gold transition-colors mt-2"
              >
                <Settings className="h-3.5 w-3.5" />
                Manage account
              </Link>
            </div>

            {/* Modulas brand note */}
            <div className="rounded-2xl border border-gold/15 bg-gold/5 p-5">
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold mb-2">
                Modulas Platform
              </p>
              <p className="font-sans text-[12px] text-charcoal/55 leading-relaxed">
                One account across all Modulas portals — store, trade, vendor, creator, and beyond.
              </p>
              <Link
                href="/for-designers"
                className="mt-3 inline-flex items-center gap-1.5 font-sans text-[11px] text-gold hover:underline"
              >
                Explore trade programme <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

const ROLE_LABELS: Partial<Record<Role, string>> = {
  master_admin: "Master Admin",
  customer:     "Customer",
  architect:    "Architect",
  creator:      "Creator",
  vendor:       "Vendor",
  intern:       "Intern",
  editor:       "Editor",
};

const JOIN_PATHS = [
  {
    label:  "Become an Architect Partner",
    desc:   "Trade pricing, project tools, and a dedicated account manager.",
    href:   "/join/architect",
    icon:   FolderKanban,
    colour: "bg-amber-50 text-amber-600",
  },
  {
    label:  "Sell on Modulas",
    desc:   "List your products to 500+ architect partners and direct consumers.",
    href:   "/join/vendor",
    icon:   Store,
    colour: "bg-sky-50 text-sky-600",
  },
  {
    label:  "Join the Creator Programme",
    desc:   "Earn commissions by sharing Modulas products with your audience.",
    href:   "/join/creator",
    icon:   Clapperboard,
    colour: "bg-violet-50 text-violet-600",
  },
];

function InfoRow({
  label, value, mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="font-sans text-[11px] text-charcoal/35">{label}</p>
      <p className={["font-sans text-[11px] text-charcoal/65", mono ? "font-mono" : ""].join(" ")}>
        {value}
      </p>
    </div>
  );
}

function WorkspaceSkeleton() {
  return (
    <div className="min-h-[calc(100vh-var(--nav-height))] bg-[#f8f7f5]">
      <div className="mx-auto max-w-[1200px] px-6 py-12 lg:px-10 lg:py-16 space-y-6">
        <div className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-charcoal-100" />
          <div className="h-9 w-64 animate-pulse rounded bg-charcoal-100" />
          <div className="h-5 w-48 animate-pulse rounded bg-charcoal-100" />
        </div>
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-charcoal-100" />
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-48 animate-pulse rounded-2xl bg-charcoal-100" />
            <div className="h-48 animate-pulse rounded-2xl bg-charcoal-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
