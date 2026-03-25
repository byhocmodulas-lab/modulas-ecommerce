"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FolderKanban, Users, FileText, BookOpen, Layers, Handshake } from "lucide-react";
import { projectsApi, quotesApi } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";

const STATS = [
  { label: "Active Projects",  value: "8",   sub: "3 in production" },
  { label: "Open Quotes",      value: "4",   sub: "1 accepted this month" },
  { label: "Total Clients",    value: "23",  sub: "5 new this quarter" },
  { label: "Trade Discount",   value: "25%", sub: "Associate tier" },
];

const QUICK_LINKS = [
  { href: "/architect/projects",  icon: FolderKanban, label: "Projects",          desc: "Track active and past projects" },
  { href: "/architect/clients",   icon: Users,        label: "Clients",           desc: "Manage your client CRM" },
  { href: "/architect/quotes",    icon: FileText,     label: "Quotes",            desc: "Create and send trade quotes" },
  { href: "/architect/library",   icon: BookOpen,     label: "Technical Library", desc: "CAD files, specs, installation guides" },
  { href: "/architect/materials", icon: Layers,       label: "Materials Library", desc: "Laminates, boards, hardware swatches" },
  { href: "/architect/partner",   icon: Handshake,    label: "Partner Program",   desc: "Your commission and tier benefits" },
];

const RECENT_ACTIVITY = [
  { label: "Quote QT-2026-0042 accepted",        at: "2 hours ago",  colour: "text-emerald-600" },
  { label: "New client: Studio Noir added",       at: "Yesterday",    colour: "text-charcoal/60" },
  { label: "Belgravia Penthouse moved to Production", at: "2 days ago", colour: "text-purple-600" },
  { label: "Quote QT-2026-0041 sent to Helena Marsh", at: "5 days ago", colour: "text-sky-600" },
];

export default function ArchitectOverviewPage() {
  const { user, accessToken } = useAuthStore();
  const [stats, setStats] = useState(STATS);

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([
      projectsApi.list(accessToken),
      quotesApi.list(accessToken),
    ]).then(([projectRes, quoteRes]) => {
      const activeProjects = projectRes.data.filter((p) => p.status === "planning" || p.status === "in_production").length;
      const openQuotes = quoteRes.data.filter((q) => q.status === "draft" || q.status === "sent").length;
      setStats((prev) => prev.map((s) => {
        if (s.label === "Active Projects") return { ...s, value: String(activeProjects) };
        if (s.label === "Open Quotes")     return { ...s, value: String(openQuotes) };
        return s;
      }));
    }).catch(() => {});
  }, [accessToken]);

  const firstName = user?.fullName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "Architect";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40 mb-1">Welcome back</p>
        <h1 className="font-serif text-3xl text-charcoal">{user?.fullName ?? firstName}</h1>
        <p className="font-sans text-sm text-charcoal/40 mt-0.5">{user?.email}</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub }) => (
          <div key={label} className="rounded-2xl border border-black/6 bg-white p-5">
            <p className="font-serif text-3xl text-charcoal">{value}</p>
            <p className="font-sans text-xs text-charcoal/40 mt-0.5">{label}</p>
            <p className="font-sans text-[11px] text-gold mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick links */}
        <div className="lg:col-span-2">
          <h2 className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/35 mb-3">Quick Access</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {QUICK_LINKS.map(({ href, icon: Icon, label, desc }) => (
              <Link key={href} href={href}
                className="group flex items-start gap-3 rounded-2xl border border-black/6 bg-white p-4 hover:border-gold/30 hover:shadow-sm transition-all">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/10">
                  <Icon className="h-4 w-4 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-medium text-charcoal group-hover:text-gold transition-colors">{label}</p>
                  <p className="font-sans text-xs text-charcoal/40 leading-snug mt-0.5">{desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-charcoal/20 group-hover:text-gold transition-colors shrink-0 mt-0.5" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/35 mb-3">Recent Activity</h2>
          <div className="rounded-2xl border border-black/6 bg-white p-5 space-y-4">
            {RECENT_ACTIVITY.map(({ label, at, colour }) => (
              <div key={label} className="border-l-2 border-black/8 pl-3">
                <p className={`font-sans text-xs leading-snug ${colour}`}>{label}</p>
                <p className="font-sans text-[11px] text-charcoal/30 mt-0.5">{at}</p>
              </div>
            ))}
          </div>

          {/* Tier upgrade nudge */}
          <div className="mt-4 rounded-2xl border border-gold/20 bg-gold/5 p-4">
            <p className="font-sans text-xs font-medium text-charcoal/70 mb-1">Partner tier progress</p>
            <p className="font-sans text-[11px] text-charcoal/50 mb-3">₹18L of ₹25L to reach <strong>Principal (40%)</strong></p>
            <div className="h-1.5 w-full rounded-full bg-black/8">
              <div className="h-full w-[72%] rounded-full bg-gold" />
            </div>
            <Link href="/architect/partner" className="mt-3 font-sans text-[11px] text-gold hover:text-gold-600 transition-colors flex items-center gap-1">
              View partner benefits <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
