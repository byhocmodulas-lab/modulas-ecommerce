"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Download, Search, RefreshCcw, AlertCircle, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { formatPrice } from "@/lib/utils/format";

interface Order {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  currency: string;
  items: unknown[];
  shippingAddress: Record<string, string>;
  affiliateCode?: string;
  createdAt: string;
}

interface Meta { page: number; limit: number; total: number; totalPages: number; }

const STATUS_STYLES: Record<string, string> = {
  pending:       "bg-amber-50   text-amber-700   border-amber-200",
  confirmed:     "bg-blue-50    text-blue-700    border-blue-200",
  in_production: "bg-purple-50  text-purple-700  border-purple-200",
  shipped:       "bg-indigo-50  text-indigo-700  border-indigo-200",
  delivered:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled:     "bg-stone-50   text-stone-500   border-stone-200",
  refunded:      "bg-stone-50   text-stone-500   border-stone-200",
};

const STATUSES = ["all","pending","confirmed","in_production","shipped","delivered","cancelled","refunded"];

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export default function AdminOrdersPage() {
  const token = useAuthStore((s) => s.accessToken) ?? "";

  const [orders,      setOrders]      = useState<Order[]>([]);
  const [meta,        setMeta]        = useState<Meta | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [status,      setStatus]      = useState("all");
  const [search,      setSearch]      = useState("");
  const [page,        setPage]        = useState(1);
  const [exporting,   setExporting]   = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true); setError(null);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: "50" });
      if (status !== "all") qs.set("status", status);
      const res = await fetch(`${API}/orders/admin?${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOrders(data.data ?? []);
      setMeta(data.meta ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [token, status, page]);

  useEffect(() => { load(); }, [load]);

  async function exportCsv() {
    if (!token) return;
    setExporting(true);
    try {
      const qs = status !== "all" ? `?status=${status}` : "";
      const res = await fetch(`${API}/orders/admin/export${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setExportError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }

  // Client-side search on loaded orders (by order ID prefix)
  const displayed = search.trim()
    ? orders.filter(o => o.id.toLowerCase().startsWith(search.trim().toLowerCase()))
    : orders;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Orders</h1>
          <p className="mt-0.5 font-sans text-sm text-charcoal/35">
            {loading ? "Loading…" : `${meta?.total ?? orders.length} total orders`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Refresh orders"
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

      {exportError && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
          <p className="flex-1 font-sans text-sm text-amber-700">{exportError}</p>
          <button type="button" onClick={() => setExportError(null)} className="font-sans text-xs text-amber-600 underline">Dismiss</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/25 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by order ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-black/10 bg-black/4 py-2 pl-9 pr-4 font-sans text-sm text-charcoal/80 placeholder:text-charcoal/25 focus:border-black/20 focus:outline-none transition-colors w-52"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setStatus(s); setPage(1); }}
              className={[
                "rounded-full border px-3.5 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors",
                status === s
                  ? "bg-black/6 text-charcoal border-black/15 font-medium"
                  : "border-black/8 text-charcoal/40 hover:text-charcoal/60",
              ].join(" ")}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-black/6 overflow-hidden">
        <table className="w-full font-sans text-sm">
          <thead>
            <tr className="border-b border-black/6 bg-black/2">
              {["Order ID", "User ID", "Status", "Items", "Total", "Date", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] tracking-[0.15em] uppercase text-charcoal/25 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading
              ? [0,1,2,3,4].map((i) => (
                  <tr key={i}>
                    {[0,1,2,3,4,5,6].map((j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-3 animate-pulse rounded bg-black/6 w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              : displayed.map((order) => (
                  <tr key={order.id} className="hover:bg-black/[0.015] transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs text-charcoal/60">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-charcoal/40">
                      {order.userId.slice(0, 8)}…
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] ${STATUS_STYLES[order.status] ?? STATUS_STYLES.pending}`}>
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-charcoal/60">
                      {(order.items ?? []).length}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-charcoal">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3.5 text-charcoal/40 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        aria-label="Update order status"
                        defaultValue={order.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          await fetch(`${API}/orders/${order.id}/status`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                            credentials: "include",
                            body: JSON.stringify({ status: newStatus }),
                          });
                          setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: newStatus } : o));
                        }}
                        className="rounded-lg border border-black/10 bg-white px-2 py-1 font-sans text-[10px] text-charcoal/60 focus:outline-none focus:border-black/25 cursor-pointer"
                      >
                        {STATUSES.filter((s) => s !== "all").map((s) => (
                          <option key={s} value={s}>{s.replace("_", " ")}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {!loading && displayed.length === 0 && (
          <div className="py-16 text-center font-sans text-sm text-charcoal/25">
            {search ? "No orders match that ID" : "No orders found"}
          </div>
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
              title="Previous page"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 text-charcoal/50 hover:text-charcoal disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Next page"
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
