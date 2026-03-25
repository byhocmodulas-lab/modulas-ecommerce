"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FileText, Download, Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { formatPrice } from "@/lib/utils/format";

interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: string;
  createdAt: string;
  billingDetails: {
    fullName: string;
    email: string;
    address?: { city?: string; country?: string };
  };
}

const STATUS_STYLES: Record<string, string> = {
  issued:   "bg-blue-50   text-blue-700   border-blue-200",
  paid:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  void:     "bg-stone-50  text-stone-500  border-stone-200",
  refunded: "bg-stone-50  text-stone-500  border-stone-200",
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export default function MyInvoicesPage() {
  const { accessToken } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/invoices/mine`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setInvoices(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => { load(); }, [load]);

  async function downloadPdf(invoice: Invoice) {
    if (!accessToken) return;
    setDownloading(invoice.id);
    try {
      const res = await fetch(`${API}/invoices/mine/${invoice.id}/pdf`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${invoice.invoiceNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Download failed");
    } finally {
      setDownloading(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-black/8" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-black/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">My Invoices</h1>
          <p className="mt-0.5 font-sans text-sm text-charcoal/35">
            {invoices.length} {invoices.length === 1 ? "invoice" : "invoices"}
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-2 font-sans text-xs text-charcoal/50 hover:text-charcoal transition-colors"
        >
          <RefreshCcw className="h-3 w-3" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <p className="flex-1 font-sans text-sm text-red-700">{error}</p>
          <button type="button" onClick={load} className="font-sans text-xs text-red-600 underline">Retry</button>
        </div>
      )}

      {!loading && invoices.length === 0 && (
        <div className="py-20 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-charcoal/15" />
          <p className="font-serif text-xl text-charcoal/40">No invoices yet</p>
          <p className="mt-2 font-sans text-sm text-charcoal/30">
            Invoices are generated automatically after each successful payment.
          </p>
          <Link
            href="/account/orders"
            className="mt-6 inline-flex h-10 items-center rounded-full border border-black/15 px-6 font-sans text-[12px] tracking-[0.12em] uppercase text-charcoal/60 hover:border-gold hover:text-gold transition-colors"
          >
            View Orders
          </Link>
        </div>
      )}

      {invoices.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden rounded-2xl border border-black/6 overflow-hidden md:block">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="border-b border-black/6 bg-black/2">
                  {["Invoice", "Order Ref", "Date", "Amount", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] tracking-[0.15em] uppercase text-charcoal/25 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-black/[0.015] transition-colors">
                    <td className="px-4 py-3.5 font-medium text-charcoal">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3.5 font-mono text-xs text-charcoal/40">
                      #{inv.orderId.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3.5 text-charcoal/50 text-xs">
                      {new Date(inv.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-charcoal">{formatPrice(inv.total)}</p>
                      {inv.tax > 0 && <p className="text-xs text-charcoal/35">incl. ₹{inv.tax} tax</p>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] ${STATUS_STYLES[inv.status] ?? STATUS_STYLES.issued}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => downloadPdf(inv)}
                        disabled={downloading === inv.id}
                        className="flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-1.5 font-sans text-[11px] text-charcoal/60 hover:border-gold hover:text-gold disabled:opacity-50 transition-colors"
                      >
                        {downloading === inv.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {invoices.map((inv) => (
              <li key={inv.id} className="rounded-2xl border border-black/6 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-sans text-sm font-medium text-charcoal">{inv.invoiceNumber}</p>
                    <p className="mt-0.5 font-mono text-xs text-charcoal/35">Order #{inv.orderId.slice(0, 8).toUpperCase()}</p>
                    <p className="mt-1 font-sans text-xs text-charcoal/40">
                      {new Date(inv.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-lg text-charcoal">{formatPrice(inv.total)}</p>
                    <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] ${STATUS_STYLES[inv.status] ?? STATUS_STYLES.issued}`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => downloadPdf(inv)}
                  disabled={downloading === inv.id}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-black/10 py-2.5 font-sans text-[12px] text-charcoal/60 hover:border-gold hover:text-gold disabled:opacity-50 transition-colors"
                >
                  {downloading === inv.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                  Download PDF
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
