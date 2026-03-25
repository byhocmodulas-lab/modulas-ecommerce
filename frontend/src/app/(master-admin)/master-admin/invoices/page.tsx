"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Download, Search, RefreshCcw, AlertCircle, Loader2,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { formatPrice } from "@/lib/utils/format";

interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  userId: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: string;
  createdAt: string;
  billingDetails: {
    fullName: string;
    email: string;
  };
}

interface Meta { page: number; limit: number; total: number; totalPages: number; }

const STATUS_STYLES: Record<string, string> = {
  issued:   "bg-blue-50   text-blue-700   border-blue-200",
  paid:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  void:     "bg-stone-50  text-stone-500  border-stone-200",
  refunded: "bg-stone-50  text-stone-500  border-stone-200",
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export default function AdminInvoicesPage() {
  const token = useAuthStore((s) => s.accessToken) ?? "";

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [meta, setMeta]         = useState<Meta | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [exporting, setExporting]   = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true); setError(null);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: "50" });
      if (search) qs.set("search", search);
      const res = await fetch(`${API}/invoices/admin?${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setInvoices(data.data ?? []);
      setMeta(data.meta ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }, [token, search, page]);

  useEffect(() => { load(); }, [load]);

  async function exportCsv() {
    if (!token) return;
    setExporting(true);
    try {
      const res = await fetch(`${API}/invoices/admin/export`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `invoices-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }

  async function downloadPdf(inv: Invoice) {
    if (!token) return;
    setDownloading(inv.id);
    try {
      const res = await fetch(`${API}/invoices/admin/${inv.id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("PDF failed");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${inv.invoiceNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Download failed");
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Invoices</h1>
          <p className="mt-0.5 font-sans text-sm text-charcoal/35">
            {loading ? "Loading…" : `${meta?.total ?? invoices.length} total invoices`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={load}
            className="flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-2 font-sans text-xs text-charcoal/50 hover:text-charcoal transition-colors"
          >
            <RefreshCcw className="h-3 w-3" />
            Refresh
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={exporting}
            className="flex items-center gap-1.5 rounded-full bg-charcoal px-4 py-2 font-sans text-xs text-cream hover:bg-charcoal-800 disabled:opacity-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            {exporting ? "Exporting…" : "Export CSV"}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <p className="flex-1 font-sans text-sm text-red-700">{error}</p>
          <button type="button" onClick={load} className="font-sans text-xs text-red-600 underline">Retry</button>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/25 pointer-events-none" />
        <input
          type="text"
          placeholder="Search invoice number…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full rounded-xl border border-black/10 bg-black/4 py-2.5 pl-9 pr-4 font-sans text-sm text-charcoal/80 placeholder:text-charcoal/25 focus:border-black/20 focus:outline-none transition-colors"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-black/6 overflow-hidden">
        <table className="w-full font-sans text-sm">
          <thead>
            <tr className="border-b border-black/6 bg-black/2">
              {["Invoice #", "Customer", "Order Ref", "Subtotal", "Tax", "Total", "Status", "Date", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] tracking-[0.15em] uppercase text-charcoal/25 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading
              ? [0,1,2,3].map((i) => (
                  <tr key={i}>
                    {[0,1,2,3,4,5,6,7,8].map((j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-3 animate-pulse rounded bg-black/6 w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              : invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-black/[0.015] transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-charcoal text-xs">{inv.invoiceNumber}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-charcoal/80 text-xs">{inv.billingDetails?.fullName ?? "—"}</p>
                      <p className="text-charcoal/35 text-[10px]">{inv.billingDetails?.email ?? ""}</p>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-charcoal/40">
                      #{inv.orderId.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3.5 text-charcoal/70 text-xs">
                      {formatPrice(inv.subtotal)}
                    </td>
                    <td className="px-4 py-3.5 text-charcoal/40 text-xs">
                      {formatPrice(inv.tax)}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-charcoal">
                      {formatPrice(inv.total)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] ${STATUS_STYLES[inv.status] ?? STATUS_STYLES.issued}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-charcoal/35 text-xs">
                      {new Date(inv.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => downloadPdf(inv)}
                        disabled={downloading === inv.id}
                        className="flex items-center gap-1 rounded-lg border border-black/10 px-2.5 py-1.5 font-sans text-[10px] text-charcoal/50 hover:border-gold hover:text-gold disabled:opacity-40 transition-colors"
                      >
                        {downloading === inv.id
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : <Download className="h-3 w-3" />}
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {!loading && invoices.length === 0 && (
          <div className="py-16 text-center font-sans text-sm text-charcoal/25">No invoices found</div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between font-sans text-sm">
          <p className="text-charcoal/40 text-xs">
            Page {meta.page} of {meta.totalPages} · {meta.total} total
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous page"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 text-charcoal/50 hover:text-charcoal disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next page"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 text-charcoal/50 hover:text-charcoal disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
