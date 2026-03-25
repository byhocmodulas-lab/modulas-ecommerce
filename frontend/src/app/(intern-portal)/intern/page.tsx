"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, Calendar, MapPin, BookOpen, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth-store";
import { applicationsApi } from "@/lib/api/client";

const TIMELINE = [
  { label: "Application Submitted",  done: true  },
  { label: "Initial Screening",      done: false, activeIfStatus: ["reviewing", "approved", "rejected"] },
  { label: "Assessment / Interview", done: false, activeIfStatus: ["reviewing"] },
  { label: "Offer / Decision",       done: false, activeIfStatus: ["approved", "rejected"] },
];

const INTERNSHIP_DETAILS = {
  duration: "10 weeks (May 19 – Jul 25, 2026)",
  location: "Mumbai (Bandra West studio)",
  stipend: "₹15,000 / month",
};

const RESOURCES = [
  { label: "Intern Handbook 2026",     href: "#", type: "PDF" },
  { label: "Modulas Brand Guidelines", href: "#", type: "PDF" },
];

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  pending:   { label: "Under Review",  cls: "bg-amber-100 border-amber-200 text-amber-700" },
  reviewing: { label: "Shortlisted",   cls: "bg-purple-100 border-purple-200 text-purple-700" },
  approved:  { label: "Approved",      cls: "bg-emerald-100 border-emerald-200 text-emerald-700" },
  rejected:  { label: "Not Selected",  cls: "bg-red-100 border-red-200 text-red-500" },
};

export default function InternDashboardPage() {
  const { user } = useAuthStore();
  const [appStatus, setAppStatus] = useState<string | null>(null);
  const [appDate, setAppDate]     = useState<string | null>(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!user?.email) { setLoading(false); return; }
    applicationsApi.checkStatus(user.email, "intern")
      .then((res) => {
        if (res.found && res.status) {
          setAppStatus(res.status);
          setAppDate(res.createdAt ?? null);
        }
      })
      .catch(() => {/* ignore — show default UI */})
      .finally(() => setLoading(false));
  }, [user?.email]);

  const firstName = user?.fullName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";
  const statusCfg = STATUS_CFG[appStatus ?? "pending"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40 mb-0.5">Intern Portal</p>
        <h1 className="font-serif text-3xl text-charcoal">Hi, {firstName}</h1>
        {user?.email && <p className="font-sans text-sm text-charcoal/40 mt-0.5">{user.email}</p>}
      </div>

      {/* Application status */}
      <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-sky-700/60 mb-1">Application Status</p>
            <p className="font-sans text-sm font-medium text-sky-800">Design Intern — Summer 2026</p>
            {appDate && (
              <p className="font-sans text-xs text-sky-700/60 mt-0.5">
                Applied {new Date(appDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
          </div>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-sky-400" />
          ) : appStatus ? (
            <span className={`rounded-full border px-3 py-1 font-sans text-[11px] tracking-[0.08em] uppercase font-medium ${statusCfg.cls}`}>
              {statusCfg.label}
            </span>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <p className="font-sans text-xs text-amber-700">No application found for this email</p>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          {TIMELINE.map(({ label, done, activeIfStatus }, i) => {
            const isActive = activeIfStatus?.includes(appStatus ?? "pending");
            const isDone = done || (appStatus === "approved" && i < 3);
            return (
              <div key={label} className="flex items-center gap-3">
                <div className={["flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                  isDone ? "bg-emerald-500" : isActive ? "bg-sky-400 ring-2 ring-sky-200" : "bg-black/8",
                ].join(" ")}>
                  {isDone ? (
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  ) : isActive ? (
                    <Clock className="h-3 w-3 text-white" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-charcoal/20" />
                  )}
                </div>
                <p className={`font-sans text-sm ${isDone ? "text-charcoal/70" : isActive ? "text-sky-800 font-medium" : "text-charcoal/30"}`}>
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Internship details */}
      <div className="rounded-2xl border border-black/6 bg-white p-6">
        <h2 className="font-serif text-lg text-charcoal mb-4">Internship Details</h2>
        <dl className="space-y-2">
          {[
            { icon: Calendar, label: "Duration", value: INTERNSHIP_DETAILS.duration },
            { icon: MapPin,   label: "Location", value: INTERNSHIP_DETAILS.location },
            { icon: BookOpen, label: "Stipend",  value: INTERNSHIP_DETAILS.stipend },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="h-4 w-4 text-charcoal/30 shrink-0" />
              <dt className="font-sans text-xs text-charcoal/40 w-20 shrink-0">{label}</dt>
              <dd className="font-sans text-sm text-charcoal/70">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Resources */}
      <div className="rounded-2xl border border-black/6 bg-white p-6">
        <h2 className="font-serif text-lg text-charcoal mb-4">Resources</h2>
        <ul className="space-y-2">
          {RESOURCES.map(({ label, href, type }) => (
            <li key={label}>
              <Link href={href}
                className="flex items-center justify-between rounded-xl border border-black/6 px-4 py-3 hover:border-gold/30 transition-colors group">
                <span className="font-sans text-sm text-charcoal group-hover:text-gold transition-colors">{label}</span>
                <span className="rounded bg-black/5 px-1.5 py-0.5 font-sans text-[10px] text-charcoal/40">{type}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
