"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { quotesApi, type Quote as ApiQuote } from "@/lib/api/client";
import {
  FileText, Plus, Search, CheckCircle2, Clock, XCircle,
  Send, Download, ChevronDown, AlertCircle,
} from "lucide-react";

type QuoteStatus = "draft" | "sent" | "accepted" | "declined" | "expired";

interface QuoteItem {
  name: string;
  qty: number;
  unitPrice: number;
  configuration?: string;
}

interface Quote {
  id: string;
  reference: string;
  clientName: string;
  clientEmail: string;
  projectName: string;
  status: QuoteStatus;
  items: QuoteItem[];
  discount?: number;
  validUntil: string;
  createdAt: string;
  notes?: string;
}

const STATUS_CFG: Record<QuoteStatus, { label: string; colour: string; icon: typeof Clock }> = {
  draft:    { label: "Draft",    colour: "text-charcoal/60 bg-black/4 border-black/10",        icon: Clock },
  sent:     { label: "Sent",     colour: "text-sky-700 bg-sky-50 border-sky-200",             icon: Send },
  accepted: { label: "Accepted", colour: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  declined: { label: "Declined", colour: "text-red-600 bg-red-50 border-red-200",             icon: XCircle },
  expired:  { label: "Expired",  colour: "text-charcoal/30 bg-black/2 border-black/6",        icon: AlertCircle },
};

const MOCK_QUOTES: Quote[] = [
  {
    id: "q1", reference: "QT-2026-0042", clientName: "Oliver Vance", clientEmail: "o.vance@vance-arch.com",
    projectName: "Belgravia Penthouse", status: "accepted", validUntil: "2026-04-01", createdAt: "2026-03-01",
    items: [
      { name: "Oslo 3-Seat Modular Sofa", qty: 2, unitPrice: 3200, configuration: "Forest Green Boucle · Oak Smoked" },
      { name: "Kira Dining Table — 2.4m", qty: 1, unitPrice: 4100, configuration: "Black Marble · Walnut" },
      { name: "Arc Lounge Chair", qty: 4, unitPrice: 1800 },
    ],
    discount: 15,
    notes: "Trade discount applied at 15%. Delivery coordinated with site manager.",
  },
  {
    id: "q2", reference: "QT-2026-0041", clientName: "Helena Marsh", clientEmail: "helena@marshpartners.co.uk",
    projectName: "Chelsea Townhouse", status: "sent", validUntil: "2026-04-10", createdAt: "2026-03-10",
    items: [
      { name: "Holt Bookcase — Tall", qty: 3, unitPrice: 1450, configuration: "Smoked Oak" },
      { name: "Lune Bedside Tables", qty: 4, unitPrice: 680 },
    ],
    discount: 15,
  },
  {
    id: "q3", reference: "QT-2026-0039", clientName: "Studio Noir", clientEmail: "studio@studionoir.co.uk",
    projectName: "Shoreditch Office Fit-out", status: "draft", validUntil: "2026-04-15", createdAt: "2026-03-14",
    items: [
      { name: "Fjord Meeting Chair", qty: 12, unitPrice: 920, configuration: "Charcoal Wool · Black Steel" },
      { name: "Custom Meeting Table 3.6m", qty: 1, unitPrice: 6800 },
    ],
    discount: 20,
    notes: "Awaiting final chair fabric confirmation from client.",
  },
  {
    id: "q4", reference: "QT-2026-0035", clientName: "Tom Llewellyn", clientEmail: "tom@llewellynbuild.com",
    projectName: "Notting Hill Family Home", status: "expired", validUntil: "2026-02-28", createdAt: "2026-01-28",
    items: [{ name: "Peel Dining Chairs", qty: 8, unitPrice: 1100 }],
    discount: 10,
    notes: "Client requested an extension — resend with updated pricing.",
  },
];

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
}

function quoteTotal(q: Quote): number {
  const sub = q.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  return q.discount ? sub * (1 - q.discount / 100) : sub;
}

function StatusBadge({ status }: { status: QuoteStatus }) {
  const cfg  = STATUS_CFG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-sans text-[10px] tracking-[0.08em] uppercase font-medium ${cfg.colour}`}>
      <Icon className="h-3 w-3" /> {cfg.label}
    </span>
  );
}

export default function ArchitectQuotesPage() {
  const { accessToken } = useAuthStore();
  const [quotes, setQuotes]     = useState(MOCK_QUOTES);
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    quotesApi.list(accessToken)
      .then((res) => {
        if (res.data.length === 0) return;
        setQuotes(res.data.map((q: ApiQuote) => ({
          id: q.id,
          reference: q.reference,
          clientName: q.clientName,
          clientEmail: q.clientEmail ?? "",
          projectName: q.projectName ?? "",
          status: q.status as QuoteStatus,
          items: q.items,
          discount: q.discount ?? undefined,
          validUntil: q.validUntil ?? "",
          createdAt: q.createdAt,
          notes: q.notes ?? undefined,
        })));
      })
      .catch(() => {});
  }, [accessToken]);

  const filtered = quotes.filter((q) => {
    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    const matchesSearch = !search ||
      q.clientName.toLowerCase().includes(search.toLowerCase()) ||
      q.projectName.toLowerCase().includes(search.toLowerCase()) ||
      q.reference.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const total    = quotes.reduce((s, q) => s + quoteTotal(q), 0);
  const accepted = quotes.filter((q) => q.status === "accepted").length;
  const pending  = quotes.filter((q) => q.status === "sent").length;

  function handleStatusChange(id: string, status: QuoteStatus) {
    setQuotes((prev) => prev.map((q) => q.id === id ? { ...q, status } : q));
  }

  const STATUSES: (QuoteStatus | "all")[] = ["all", "draft", "sent", "accepted", "declined", "expired"];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Quotes</h1>
          <p className="font-sans text-sm text-charcoal/40 mt-0.5">{quotes.length} quotes · {accepted} accepted</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors">
          <Plus className="h-3.5 w-3.5" /> New quote
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total pipeline",    value: formatPrice(total), colour: "text-charcoal" },
          { label: "Quotes accepted",   value: accepted,           colour: "text-emerald-600" },
          { label: "Awaiting response", value: pending,            colour: "text-amber-600" },
        ].map(({ label, value, colour }) => (
          <div key={label} className="rounded-2xl border border-black/6 bg-white p-5">
            <p className={`font-serif text-2xl ${colour}`}>{value}</p>
            <p className="font-sans text-xs text-charcoal/40 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/30" />
          <input type="text" placeholder="Search quotes…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-9 pr-4 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold/60 focus:outline-none transition-colors" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map((s) => (
            <button key={s} type="button" onClick={() => setStatusFilter(s)}
              className={["rounded-full px-3.5 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors",
                statusFilter === s ? "bg-charcoal text-cream" : "bg-black/5 text-charcoal/50 hover:bg-black/8",
              ].join(" ")}>{s}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-black/6 bg-white py-20 text-center">
          <FileText className="mx-auto mb-3 h-10 w-10 text-charcoal/12" />
          <p className="font-sans text-sm text-charcoal/40">No quotes found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((quote) => {
            const isExpanded  = expanded === quote.id;
            const subtotal    = quote.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
            const total       = quoteTotal(quote);
            const validDate   = new Date(quote.validUntil).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
            const createdDate = new Date(quote.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

            return (
              <div key={quote.id} className="rounded-2xl border border-black/6 bg-white overflow-hidden">
                <div className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-mono text-xs text-charcoal/40">{quote.reference}</p>
                      <StatusBadge status={quote.status} />
                    </div>
                    <p className="font-sans text-sm font-medium text-charcoal mt-0.5">{quote.projectName}</p>
                    <p className="font-sans text-xs text-charcoal/40">{quote.clientName} · Created {createdDate}</p>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="hidden sm:block text-right">
                      <p className="font-serif text-lg text-charcoal">{formatPrice(total)}</p>
                      {quote.discount && <p className="font-sans text-[10px] text-gold">{quote.discount}% trade discount</p>}
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="font-sans text-xs text-charcoal/40">Valid until</p>
                      <p className="font-sans text-xs text-charcoal">{validDate}</p>
                    </div>
                    <button type="button" onClick={() => setExpanded(isExpanded ? null : quote.id)} aria-label={isExpanded ? "Collapse" : "Expand"} className="rounded-lg p-1.5 text-charcoal/30 hover:text-charcoal transition-colors">
                      <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-black/5 px-5 py-4 bg-black/1 space-y-4">
                    <table className="w-full font-sans text-sm">
                      <thead>
                        <tr>
                          {["Product", "Config", "Qty", "Unit", "Line total"].map((h) => (
                            <th key={h} className="py-2 text-left text-[10px] tracking-[0.12em] uppercase text-charcoal/35 font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/4">
                        {quote.items.map((item, i) => (
                          <tr key={i}>
                            <td className="py-2.5 font-medium text-charcoal">{item.name}</td>
                            <td className="py-2.5 text-charcoal/40 text-xs">{item.configuration ?? "—"}</td>
                            <td className="py-2.5 text-charcoal/60">{item.qty}</td>
                            <td className="py-2.5 text-charcoal/60">{formatPrice(item.unitPrice)}</td>
                            <td className="py-2.5 font-medium text-charcoal">{formatPrice(item.qty * item.unitPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        {quote.discount && (
                          <tr>
                            <td colSpan={4} className="pt-3 text-right text-xs text-charcoal/40">Subtotal</td>
                            <td className="pt-3 font-medium text-charcoal">{formatPrice(subtotal)}</td>
                          </tr>
                        )}
                        {quote.discount && (
                          <tr>
                            <td colSpan={4} className="text-right text-xs text-gold">Trade discount ({quote.discount}%)</td>
                            <td className="font-medium text-gold">−{formatPrice(subtotal * quote.discount / 100)}</td>
                          </tr>
                        )}
                        <tr className="border-t border-black/6">
                          <td colSpan={4} className="pt-2 text-right font-sans text-sm font-medium text-charcoal">Total</td>
                          <td className="pt-2 font-serif text-lg text-charcoal">{formatPrice(total)}</td>
                        </tr>
                      </tfoot>
                    </table>
                    {quote.notes && <p className="font-sans text-sm text-charcoal/50 leading-relaxed border-t border-black/5 pt-3">{quote.notes}</p>}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button type="button" className="inline-flex items-center gap-1.5 rounded-full bg-charcoal px-4 py-2 font-sans text-[11px] uppercase tracking-[0.1em] text-cream hover:bg-charcoal/80 transition-colors">
                        <Send className="h-3 w-3" /> Send to client
                      </button>
                      <button type="button" className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.1em] text-charcoal/50 hover:border-gold hover:text-gold transition-colors">
                        <Download className="h-3 w-3" /> Download PDF
                      </button>
                      {quote.status === "expired" && (
                        <button type="button" onClick={() => handleStatusChange(quote.id, "sent")}
                          className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.1em] text-gold hover:bg-gold/5 transition-colors">
                          Resend
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
