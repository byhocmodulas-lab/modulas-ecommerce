"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Phone, Calendar, ArrowRight, User, FileText, AlertCircle, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { leadsApi } from "@/lib/api/client";
import type { Lead, LeadStage } from "@/lib/api/client";

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  new:       { label: "New",       cls: "text-sky-700 bg-sky-50 border-sky-200" },
  contacted: { label: "Contacted", cls: "text-purple-700 bg-purple-50 border-purple-200" },
  converted: { label: "Converted", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  closed:    { label: "Closed",    cls: "text-charcoal/30 bg-black/4 border-black/10" },
};

export default function LeadsPage() {
  const { accessToken } = useAuthStore();
  const [leads, setLeads]               = useState<Lead[]>([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [search, setSearch]             = useState("");
  const [stageFilter, setStageFilter]   = useState<LeadStage | "all">("all");
  const [page, setPage]                 = useState(1);
  const [updating, setUpdating]         = useState<string | null>(null);

  const load = useCallback(() => {
    if (!accessToken) { setLoading(false); return; }
    setLoading(true); setError(null);
    leadsApi.list(accessToken, {
      stage: stageFilter === "all" ? undefined : stageFilter,
      page,
      limit: 50,
    })
      .then((res) => {
        setLeads(res.data ?? []);
        setTotal(res.meta?.total ?? 0);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load leads"))
      .finally(() => setLoading(false));
  }, [accessToken, stageFilter, page]);

  useEffect(() => { load(); }, [load]);

  const filtered = leads.filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || (l.company ?? "").toLowerCase().includes(q);
  });

  async function handleAdvance(lead: Lead, next: LeadStage) {
    if (!accessToken) return;
    setUpdating(lead.id);
    try {
      const updated = await leadsApi.update(accessToken, lead.id, { stage: next });
      setLeads((prev) => prev.map((l) => l.id === lead.id ? updated : l));
    } catch { /* ignore */ }
    finally { setUpdating(null); }
  }

  const newCount       = leads.filter((l) => l.stage === "new").length;
  const contactedCount = leads.filter((l) => l.stage === "contacted").length;
  const convertedCount = leads.filter((l) => l.stage === "converted").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Leads & CRM</h1>
          <p className="font-sans text-sm text-charcoal/35 mt-0.5">{total} total leads</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "New Leads",    value: newCount,       colour: "text-sky-600" },
          { label: "In Contact",   value: contactedCount, colour: "text-purple-600" },
          { label: "Converted",    value: convertedCount, colour: "text-emerald-600" },
        ].map(({ label, value, colour }) => (
          <div key={label} className="rounded-2xl border border-black/6 bg-white p-5">
            <p className={`font-serif text-3xl ${colour}`}>{loading ? "—" : value}</p>
            <p className="font-sans text-xs text-charcoal/35 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/25" />
          <input type="text" placeholder="Search leads…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-black/10 bg-black/4 py-2.5 pl-9 pr-4 font-sans text-sm text-charcoal/80 placeholder:text-charcoal/25 focus:border-black/20 focus:outline-none transition-colors w-64" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "new", "contacted", "converted", "closed"] as const).map((s) => (
            <button key={s} type="button" onClick={() => { setStageFilter(s); setPage(1); }}
              className={["rounded-full px-3.5 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors border",
                stageFilter === s ? "bg-black/6 text-charcoal border-black/15" : "border-black/8 text-charcoal/40 hover:text-charcoal/60",
              ].join(" ")}>{s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-black/6 overflow-hidden bg-white">
        {error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />
            <p className="font-sans text-sm text-charcoal/60 mb-4">{error}</p>
            <button type="button" onClick={load}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-2 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/60 hover:border-charcoal/30">
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          </div>
        ) : loading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-charcoal/4" />)}
          </div>
        ) : (
          <table className="w-full font-sans text-sm">
            <thead>
              <tr className="border-b border-black/6 bg-black/2">
                {["Name / Contact", "Company", "Source", "Stage", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] tracking-[0.15em] uppercase text-charcoal/25 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filtered.map((lead) => {
                const st = STATUS_CFG[lead.stage] ?? STATUS_CFG.new;
                const date = new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                const isUpdating = updating === lead.id;
                return (
                  <tr key={lead.id} className="hover:bg-black/2 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="text-charcoal/80 font-medium">{lead.name}</p>
                      <p className="text-charcoal/35 text-xs">{lead.email}</p>
                      {lead.phone && (
                        <p className="text-charcoal/25 text-xs flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" />{lead.phone}
                        </p>
                      )}
                      <p className="text-charcoal/20 text-[10px] mt-0.5">
                        <Calendar className="h-3 w-3 inline mr-0.5" />{date}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-charcoal/45 text-xs">
                      {lead.company ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 text-charcoal/45 text-xs">
                      <span className="capitalize">{lead.source.replace("_", " ")}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.08em] ${st.cls}`}>
                        {st.label}
                      </span>
                      {lead.notes && (
                        <p className="text-charcoal/25 text-[10px] mt-1 max-w-[140px] truncate" title={lead.notes}>
                          <FileText className="h-3 w-3 inline mr-0.5" />{lead.notes}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1.5 opacity-80 group-hover:opacity-100">
                        {lead.stage === "new" && (
                          <button onClick={() => handleAdvance(lead, "contacted")} disabled={isUpdating} type="button"
                            className="rounded-full bg-purple-50 border border-purple-200 px-2.5 py-1 text-[10px] text-purple-700 hover:bg-purple-100 transition-colors disabled:opacity-40">
                            <User className="h-3 w-3 inline mr-0.5" />Contact
                          </button>
                        )}
                        {lead.stage === "contacted" && (
                          <button onClick={() => handleAdvance(lead, "converted")} disabled={isUpdating} type="button"
                            className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-40">
                            <ArrowRight className="h-3 w-3 inline mr-0.5" />Convert
                          </button>
                        )}
                        {(lead.stage === "new" || lead.stage === "contacted") && (
                          <button onClick={() => handleAdvance(lead, "closed")} disabled={isUpdating} type="button"
                            className="rounded-full bg-black/4 border border-black/10 px-2.5 py-1 text-[10px] text-charcoal/40 hover:bg-black/8 transition-colors disabled:opacity-40">
                            Close
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="py-16 text-center font-sans text-sm text-charcoal/25">No leads found</div>
        )}
      </div>

      {/* Pagination */}
      {total > 50 && (
        <div className="flex items-center justify-center gap-2">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="rounded-full border border-black/10 px-5 py-2 font-sans text-[11px] uppercase text-charcoal/60 disabled:opacity-30 hover:border-gold hover:text-gold transition-colors">
            Previous
          </button>
          <span className="font-sans text-sm text-charcoal/40">Page {page}</span>
          <button type="button" onClick={() => setPage((p) => p + 1)} disabled={leads.length < 50}
            className="rounded-full border border-black/10 px-5 py-2 font-sans text-[11px] uppercase text-charcoal/60 disabled:opacity-30 hover:border-gold hover:text-gold transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
