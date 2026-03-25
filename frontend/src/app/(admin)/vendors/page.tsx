"use client";

import { useEffect, useState } from "react";
import {
  Store, Search, CheckCircle2, Clock, XCircle,
  ExternalLink, ChevronDown, Building2, Loader2,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { authApi } from "@/lib/api/client";

interface Vendor {
  id: string;
  name: string;
  email: string;
  website?: string;
  status: "pending" | "approved" | "suspended";
  productCount?: number;
  totalRevenue?: number;
  createdAt: string;
  description?: string;
}

const STATUS_CFG = {
  pending:   { label: "Pending review", colour: "text-amber-700 bg-amber-50 border-amber-200",   icon: Clock },
  approved:  { label: "Approved",       colour: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  suspended: { label: "Suspended",      colour: "text-red-600 bg-red-50 border-red-200",          icon: XCircle },
};

const FILTERS = ["all", "pending", "approved", "suspended"] as const;
type Filter = typeof FILTERS[number];


function StatusBadge({ status }: { status: Vendor["status"] }) {
  const cfg = STATUS_CFG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-sans text-[11px] font-medium ${cfg.colour}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

export default function AdminVendorsPage() {
  const { accessToken } = useAuthStore();
  const [vendors, setVendors]     = useState<Vendor[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState<Filter>("all");
  const [search, setSearch]       = useState("");
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [updating, setUpdating]   = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) { setLoading(false); return; }
    authApi.listUsers(accessToken, "vendor")
      .then((users) => {
        setVendors(users.map((u) => ({
          id: u.id,
          name: u.fullName ?? u.email.split("@")[0],
          email: u.email,
          website: (u.metadata?.website as string) ?? undefined,
          status: ((u.metadata?.vendorStatus as string) ?? "pending") as Vendor["status"],
          productCount: (u.metadata?.productCount as number) ?? 0,
          totalRevenue: (u.metadata?.totalRevenue as number) ?? 0,
          createdAt: u.createdAt,
          description: (u.metadata?.description as string) ?? undefined,
        })));
      })
      .catch(() => setVendors([]))
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function handleStatusChange(vendorId: string, status: Vendor["status"]) {
    if (!accessToken) return;
    setUpdating(vendorId);
    try {
      await authApi.updateRole(accessToken, vendorId, "vendor");
      setVendors((prev) => prev.map((v) => v.id === vendorId ? { ...v, status } : v));
    } catch {
      // keep existing state on failure
    } finally {
      setUpdating(null);
    }
  }

  const filtered = vendors.filter((v) => {
    const matchesFilter = filter === "all" || v.status === filter;
    const matchesSearch = !search ||
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = vendors.filter((v) => v.status === "pending").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-charcoal/30" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Vendors</h1>
          <p className="font-sans text-sm text-charcoal/40 mt-0.5">
            {vendors.length} vendors · {pendingCount > 0 && (
              <span className="text-amber-600 font-medium">{pendingCount} pending approval</span>
            )}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total vendors",    value: vendors.length,                                       colour: "text-charcoal" },
          { label: "Pending approval", value: pendingCount,                                          colour: "text-amber-600" },
          { label: "Active vendors",   value: vendors.filter((v) => v.status === "approved").length, colour: "text-emerald-600" },
        ].map(({ label, value, colour }) => (
          <div key={label} className="rounded-2xl border border-black/6 bg-white p-5">
            <p className={`font-serif text-3xl ${colour}`}>{value}</p>
            <p className="font-sans text-xs text-charcoal/40 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/30" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-9 pr-4 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold/60 focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={[
                "rounded-full px-3.5 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors",
                filter === f ? "bg-charcoal text-cream" : "bg-black/5 text-charcoal/50 hover:bg-black/8",
              ].join(" ")}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Vendor cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-black/6 bg-white py-20 text-center">
          <Store className="mx-auto mb-3 h-10 w-10 text-charcoal/12" />
          <p className="font-sans text-sm text-charcoal/40">No vendors found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((vendor) => {
            const isExpanded = expanded === vendor.id;
            const joined = new Date(vendor.createdAt).toLocaleDateString("en-GB", {
              day: "numeric", month: "short", year: "numeric",
            });
            return (
              <div
                key={vendor.id}
                className="rounded-2xl border border-black/6 bg-white overflow-hidden"
              >
                {/* Row */}
                <div className="flex flex-wrap items-center gap-4 px-6 py-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/10">
                    <Building2 className="h-5 w-5 text-gold" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-sans text-sm font-medium text-charcoal truncate">{vendor.name}</p>
                      {vendor.website && (
                        <a
                          href={`https://${vendor.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${vendor.website}`}
                          className="text-charcoal/25 hover:text-gold transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                    <p className="font-sans text-xs text-charcoal/40">{vendor.email} · Joined {joined}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {vendor.productCount !== undefined && (
                      <div className="hidden sm:block text-right">
                        <p className="font-sans text-sm font-medium text-charcoal">{vendor.productCount}</p>
                        <p className="font-sans text-[10px] text-charcoal/35">products</p>
                      </div>
                    )}
                    <StatusBadge status={vendor.status} />
                    <button
                      type="button"
                      onClick={() => setExpanded(isExpanded ? null : vendor.id)}
                      className="rounded-lg p-1.5 text-charcoal/30 hover:text-charcoal transition-colors"
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-black/5 px-6 py-5 bg-black/1 space-y-4">
                    {vendor.description && (
                      <p className="font-sans text-sm text-charcoal/60 leading-relaxed">{vendor.description}</p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {vendor.status === "pending" && (
                        <>
                          <button
                            type="button"
                            disabled={updating === vendor.id}
                            onClick={() => handleStatusChange(vendor.id, "approved")}
                            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 font-sans text-[11px] tracking-[0.1em] uppercase text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {updating === vendor.id ? "Approving…" : "Approve vendor"}
                          </button>
                          <button
                            type="button"
                            disabled={updating === vendor.id}
                            onClick={() => handleStatusChange(vendor.id, "suspended")}
                            className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-2 font-sans text-[11px] tracking-[0.1em] uppercase text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Decline
                          </button>
                        </>
                      )}
                      {vendor.status === "approved" && (
                        <button
                          type="button"
                          disabled={updating === vendor.id}
                          onClick={() => handleStatusChange(vendor.id, "suspended")}
                          className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-2 font-sans text-[11px] tracking-[0.1em] uppercase text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Suspend
                        </button>
                      )}
                      {vendor.status === "suspended" && (
                        <button
                          type="button"
                          disabled={updating === vendor.id}
                          onClick={() => handleStatusChange(vendor.id, "approved")}
                          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 font-sans text-[11px] tracking-[0.1em] uppercase text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Reinstate
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
