"use client";

import { useState } from "react";
import { BarFill } from "@/components/ui/bar-fill";
import {
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  DollarSign, Package, BarChart2, Target, ChevronDown, ChevronUp,
  Download, AlertTriangle, CheckCircle2, Circle,
} from "lucide-react";

type Tab = "pl" | "products" | "ebitda" | "competitors";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

const PL_MONTHLY = [
  { month: "Oct 2025", revenue: 3820000, cogs: 1910000, grossProfit: 1910000, opex: 980000, ebitda: 930000, netProfit: 720000 },
  { month: "Nov 2025", revenue: 4140000, cogs: 2040000, grossProfit: 2100000, opex: 1020000, ebitda: 1080000, netProfit: 840000 },
  { month: "Dec 2025", revenue: 5260000, cogs: 2580000, grossProfit: 2680000, opex: 1100000, ebitda: 1580000, netProfit: 1240000 },
  { month: "Jan 2026", revenue: 4480000, cogs: 2200000, grossProfit: 2280000, opex: 1060000, ebitda: 1220000, netProfit: 960000 },
  { month: "Feb 2026", revenue: 4820000, cogs: 2360000, grossProfit: 2460000, opex: 1080000, ebitda: 1380000, netProfit: 1080000 },
  { month: "Mar 2026", revenue: 4800000, cogs: 2350000, grossProfit: 2450000, opex: 1100000, ebitda: 1350000, netProfit: 1060000 },
];

const PL_CURRENT = PL_MONTHLY[5];
const PL_PREV    = PL_MONTHLY[4];

const EXPENSE_BREAKDOWN = [
  { category: "Raw Materials & Vendors", amount: 1820000, pct: 38, type: "cogs"  },
  { category: "Manufacturing & Labour",  amount: 530000,  pct: 11, type: "cogs"  },
  { category: "Salaries (Staff)",        amount: 480000,  pct: 10, type: "opex"  },
  { category: "Marketing & Social",      amount: 240000,  pct: 5,  type: "opex"  },
  { category: "Showroom Rent",           amount: 180000,  pct: 4,  type: "opex"  },
  { category: "Logistics & Delivery",    amount: 120000,  pct: 3,  type: "opex"  },
  { category: "Technology & Software",   amount: 48000,   pct: 1,  type: "opex"  },
  { category: "Misc & Admin",            amount: 32000,   pct: 0.7,type: "opex"  },
];

const PRODUCTS = [
  { name: "Wardrobe — Hinged",     category: "Storage",    unitsSold: 48,  revenue: 1440000, margin: 42, trend: "up",   rating: 4.8, returns: 1 },
  { name: "Modular Kitchen",       category: "Kitchen",    unitsSold: 31,  revenue: 1860000, margin: 38, trend: "up",   rating: 4.9, returns: 0 },
  { name: "Wardrobe — Sliding",    category: "Storage",    unitsSold: 36,  revenue: 1080000, margin: 39, trend: "up",   rating: 4.7, returns: 2 },
  { name: "TV Unit + Wall Panel",  category: "Living",     unitsSold: 42,  revenue: 756000,  margin: 44, trend: "stable",rating: 4.6, returns: 3 },
  { name: "Study Table + Shelving",category: "Office",     unitsSold: 28,  revenue: 448000,  margin: 46, trend: "up",   rating: 4.5, returns: 1 },
  { name: "Walk-in Wardrobe",      category: "Premium",    unitsSold: 12,  revenue: 960000,  margin: 35, trend: "up",   rating: 4.9, returns: 0 },
  { name: "Shoe Rack / Foyer Unit",category: "Accessories",unitsSold: 67,  revenue: 402000,  margin: 51, trend: "stable",rating: 4.4, returns: 4 },
  { name: "Bed + Storage",         category: "Bedroom",    unitsSold: 22,  revenue: 660000,  margin: 37, trend: "down", rating: 4.3, returns: 5 },
  { name: "Pooja Unit",            category: "Speciality", unitsSold: 19,  revenue: 285000,  margin: 48, trend: "up",   rating: 4.7, returns: 0 },
  { name: "Crockery Unit",         category: "Kitchen",    unitsSold: 34,  revenue: 340000,  margin: 49, trend: "stable",rating: 4.5, returns: 2 },
];

const COMPETITORS_INTEL = [
  {
    name: "Godrej Interio",
    est_revenue_cr: "₹2,200 Cr",
    market_share: 18.4,
    avg_order: "₹1.8L",
    delivery_days: 45,
    products: 340,
    online_rating: 4.1,
    strength: "Brand trust, nationwide service",
    weakness: "Premium pricing, slow customisation",
    ebitda_est: "14.2%",
    growth: 8.4,
  },
  {
    name: "Livspace",
    est_revenue_cr: "₹1,100 Cr",
    market_share: 9.2,
    avg_order: "₹4.2L",
    delivery_days: 60,
    products: 0,
    online_rating: 4.0,
    strength: "Design + execution bundle, digital UX",
    weakness: "High price, contractor-dependent quality",
    ebitda_est: "−2.1%",
    growth: 28.2,
  },
  {
    name: "Spacewood",
    est_revenue_cr: "₹480 Cr",
    market_share: 4.0,
    avg_order: "₹1.4L",
    delivery_days: 35,
    products: 180,
    online_rating: 4.3,
    strength: "German technology, fast delivery",
    weakness: "Limited design range, weak digital presence",
    ebitda_est: "16.8%",
    growth: 12.1,
  },
  {
    name: "Hafele (Kitchen)",
    est_revenue_cr: "₹320 Cr",
    market_share: 2.7,
    avg_order: "₹2.1L",
    delivery_days: 50,
    products: 90,
    online_rating: 4.4,
    strength: "Premium hardware quality",
    weakness: "Hardware-only, no full-room solution",
    ebitda_est: "18.4%",
    growth: 6.8,
  },
  {
    name: "Modulas (us)",
    est_revenue_cr: "₹58 Cr",
    market_share: 0.5,
    avg_order: "₹1.55L",
    delivery_days: 30,
    products: 120,
    online_rating: 4.7,
    strength: "Luxury finish, architect partnerships, fast delivery",
    weakness: "Limited city presence, brand awareness",
    ebitda_est: "28.1%",
    growth: 41.2,
    isUs: true,
  },
];

const EBITDA_ITEMS = [
  { label: "Revenue",                          amount: 4800000, type: "revenue" },
  { label: "Cost of Goods Sold (COGS)",        amount: -2350000,type: "deduction" },
  { label: "Gross Profit",                     amount: 2450000, type: "subtotal", margin: 51.0 },
  { label: "Salaries & HR",                    amount: -480000, type: "deduction" },
  { label: "Marketing & Advertising",          amount: -240000, type: "deduction" },
  { label: "Rent & Utilities",                 amount: -200000, type: "deduction" },
  { label: "Tech, Software & Infra",           amount: -48000,  type: "deduction" },
  { label: "Misc Operating Expenses",          amount: -132000, type: "deduction" },
  { label: "EBITDA",                           amount: 1350000, type: "highlight", margin: 28.1 },
  { label: "Depreciation & Amortisation",      amount: -120000, type: "deduction" },
  { label: "EBIT",                             amount: 1230000, type: "subtotal", margin: 25.6 },
  { label: "Interest on Working Capital Loan", amount: -96000,  type: "deduction" },
  { label: "Tax (25%)",                        amount: -284000, type: "deduction" },
  { label: "Net Profit (PAT)",                 amount: 850000,  type: "highlight", margin: 17.7 },
];

function fmt(n: number) {
  if (Math.abs(n) >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (Math.abs(n) >= 100000)  return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${(n / 1000).toFixed(0)}K`;
}

function delta(curr: number, prev: number) {
  const d = ((curr - prev) / prev) * 100;
  const up = d >= 0;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-medium ${up ? "text-emerald-600" : "text-red-500"}`}>
      {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {up ? "+" : ""}{d.toFixed(1)}%
    </span>
  );
}

// ─── Tab: P&L ─────────────────────────────────────────────────────────────────
function PLTab() {
  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Revenue",      curr: PL_CURRENT.revenue,    prev: PL_PREV.revenue },
          { label: "Gross Profit", curr: PL_CURRENT.grossProfit,prev: PL_PREV.grossProfit },
          { label: "EBITDA",       curr: PL_CURRENT.ebitda,     prev: PL_PREV.ebitda },
          { label: "Net Profit",   curr: PL_CURRENT.netProfit,  prev: PL_PREV.netProfit },
          { label: "COGS",         curr: PL_CURRENT.cogs,       prev: PL_PREV.cogs },
          { label: "OpEx",         curr: PL_CURRENT.opex,       prev: PL_PREV.opex },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-black/8 bg-white p-4">
            <p className="text-[10px] uppercase tracking-wider text-charcoal/40">{k.label}</p>
            <p className="mt-2 text-lg font-semibold text-charcoal">{fmt(k.curr)}</p>
            <div className="mt-0.5">{delta(k.curr, k.prev)}</div>
          </div>
        ))}
      </div>

      {/* 6-month bar chart (visual) */}
      <div className="rounded-xl border border-black/8 bg-white p-5">
        <h3 className="text-sm font-semibold text-charcoal mb-4">6-Month Revenue vs Net Profit</h3>
        <div className="flex items-end gap-4 h-40">
          {PL_MONTHLY.map((m) => {
            const maxRev = Math.max(...PL_MONTHLY.map((x) => x.revenue));
            const revH  = Math.round((m.revenue / maxRev) * 100);
            const profH = Math.round((m.netProfit / maxRev) * 100);
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center gap-1 flex-1">
                  <BarFill vertical pct={revH} className="flex-1 bg-amber-400 rounded-t-sm" title={fmt(m.revenue)} />
                  <BarFill vertical pct={profH} className="flex-1 bg-emerald-400 rounded-t-sm" title={fmt(m.netProfit)} />
                </div>
                <p className="text-[10px] text-charcoal/40">{m.month.slice(0, 3)}</p>
              </div>
            );
          })}
        </div>
        <div className="flex gap-6 mt-3">
          <div className="flex items-center gap-2 text-xs text-charcoal/50"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />Revenue</div>
          <div className="flex items-center gap-2 text-xs text-charcoal/50"><span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block" />Net Profit</div>
        </div>
      </div>

      {/* Expense breakdown */}
      <div className="rounded-xl border border-black/8 bg-white p-5">
        <h3 className="text-sm font-semibold text-charcoal mb-4">Expense Breakdown — Mar 2026</h3>
        <div className="space-y-3">
          {EXPENSE_BREAKDOWN.map((e) => (
            <div key={e.category} className="flex items-center gap-4">
              <span className={`w-2 h-2 rounded-full shrink-0 ${e.type === "cogs" ? "bg-red-400" : "bg-amber-400"}`} />
              <p className="flex-1 text-sm text-charcoal">{e.category}</p>
              <div className="w-32 h-1.5 bg-black/5 rounded-full">
                <BarFill pct={(e.pct / 38) * 100} className={`h-full rounded-full ${e.type === "cogs" ? "bg-red-400" : "bg-amber-400"}`} />
              </div>
              <p className="w-8 text-right text-xs text-charcoal/50">{e.pct}%</p>
              <p className="w-20 text-right text-sm font-medium text-charcoal">{fmt(e.amount)}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-6 text-xs text-charcoal/40">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />COGS</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />OpEx</span>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Products ────────────────────────────────────────────────────────────
function ProductsTab() {
  const totalRev = PRODUCTS.reduce((a, p) => a + p.revenue, 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6 mb-2">
        {["All","Kitchen","Storage","Living","Bedroom","Premium"].map((c) => (
          <button key={c} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${c === "All" ? "border-red-300 bg-red-50 text-red-600" : "border-black/8 text-charcoal/50 hover:border-black/20"}`}>{c}</button>
        ))}
      </div>
      <div className="rounded-xl border border-black/8 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50 text-left">
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-charcoal/40">Product</th>
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-charcoal/40 text-right">Units Sold</th>
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-charcoal/40 text-right">Revenue</th>
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-charcoal/40 text-right">Margin</th>
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-charcoal/40 text-right">Share</th>
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-charcoal/40 text-right">Rating</th>
                <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-charcoal/40 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/4">
              {PRODUCTS.map((p) => (
                <tr key={p.name} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-charcoal">{p.name}</p>
                    <p className="text-[11px] text-charcoal/40">{p.category}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal text-right">{p.unitsSold}</td>
                  <td className="px-4 py-3 text-sm font-medium text-charcoal text-right">{fmt(p.revenue)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-semibold ${p.margin >= 45 ? "text-emerald-600" : p.margin >= 38 ? "text-amber-600" : "text-red-500"}`}>
                      {p.margin}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-black/5 rounded-full">
                        <BarFill pct={(p.revenue / totalRev) * 100} className="h-full bg-amber-400 rounded-full" />
                      </div>
                      <span className="text-xs text-charcoal/50 w-8">{((p.revenue / totalRev) * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal text-right">⭐ {p.rating}</td>
                  <td className="px-4 py-3 text-right">
                    {p.trend === "up"     && <TrendingUp   className="h-4 w-4 text-emerald-500 inline" />}
                    {p.trend === "down"   && <TrendingDown  className="h-4 w-4 text-red-400 inline" />}
                    {p.trend === "stable" && <span className="text-charcoal/30 text-xs">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: EBITDA ──────────────────────────────────────────────────────────────
function EBITDATab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Revenue",    value: "₹48L",  margin: "100%",  color: "text-charcoal" },
          { label: "EBITDA",     value: "₹13.5L",margin: "28.1%", color: "text-emerald-600" },
          { label: "EBIT",       value: "₹12.3L",margin: "25.6%", color: "text-emerald-600" },
          { label: "Net Profit", value: "₹8.5L", margin: "17.7%", color: "text-emerald-700" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-black/8 bg-white p-4">
            <p className="text-[11px] uppercase tracking-wider text-charcoal/40">{k.label}</p>
            <p className={`mt-2 text-2xl font-semibold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-charcoal/40 mt-0.5">Margin: {k.margin}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-black/8 bg-white overflow-hidden">
        <div className="p-4 border-b border-black/6">
          <h3 className="text-sm font-semibold text-charcoal">EBITDA Statement — March 2026</h3>
        </div>
        <div className="divide-y divide-black/4">
          {EBITDA_ITEMS.map((item) => (
            <div key={item.label}
              className={`flex items-center justify-between px-5 py-3 ${
                item.type === "highlight" ? "bg-emerald-50/50"
                : item.type === "subtotal" ? "bg-stone-50"
                : ""
              }`}>
              <div className="flex items-center gap-3">
                {item.type === "deduction" && <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />}
                {item.type === "revenue"   && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                {(item.type === "subtotal" || item.type === "highlight") && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                <p className={`text-sm ${item.type === "highlight" ? "font-bold text-charcoal" : item.type === "subtotal" ? "font-semibold text-charcoal" : "text-charcoal/70"}`}>
                  {item.label}
                </p>
              </div>
              <div className="flex items-center gap-6">
                {"margin" in item && item.margin !== undefined && (
                  <span className="text-xs text-charcoal/40">{item.margin}% margin</span>
                )}
                <p className={`text-sm font-semibold w-24 text-right ${
                  item.amount < 0 ? "text-red-500"
                  : item.type === "highlight" ? "text-emerald-700"
                  : "text-charcoal"
                }`}>
                  {item.amount < 0 ? `(${fmt(Math.abs(item.amount))})` : fmt(item.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-semibold text-amber-700 mb-1">📌 EBITDA Benchmark</p>
        <p className="text-xs text-amber-700/80">
          Industry average EBITDA for premium modular furniture is 12–18%. Modulas is at <strong>28.1%</strong> — well above peers, driven by high-margin SKUs and direct architect channel.
          Target: maintain above 25% as we scale to ₹100Cr ARR.
        </p>
      </div>
    </div>
  );
}

// ─── Tab: Competitors ─────────────────────────────────────────────────────────
function CompetitorsTab() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <p className="text-xs text-charcoal/40">Estimated figures based on public disclosures, media reports, and industry analysis. Updated Mar 2026.</p>
      {COMPETITORS_INTEL.map((c) => (
        <div key={c.name} className={`rounded-xl border overflow-hidden ${c.isUs ? "border-amber-300 bg-amber-50/30" : "border-black/8 bg-white"}`}>
          <button className="w-full flex items-center justify-between p-4 hover:bg-black/2 transition-colors text-left"
            onClick={() => setExpanded(expanded === c.name ? null : c.name)}>
            <div className="flex items-center gap-3">
              {c.isUs && <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">Us</span>}
              <div>
                <p className="text-sm font-semibold text-charcoal">{c.name}</p>
                <p className="text-xs text-charcoal/40">{c.est_revenue_cr} est. revenue · {c.market_share}% market share</p>
              </div>
            </div>
            <div className="flex items-center gap-8 shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-charcoal/40 uppercase tracking-wider">Avg Order</p>
                <p className="text-sm font-semibold text-charcoal">{c.avg_order}</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-charcoal/40 uppercase tracking-wider">EBITDA</p>
                <p className={`text-sm font-semibold ${parseFloat(c.ebitda_est) > 0 ? "text-emerald-600" : "text-red-500"}`}>{c.ebitda_est}</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-charcoal/40 uppercase tracking-wider">Growth</p>
                <p className={`text-sm font-semibold ${c.growth > 15 ? "text-emerald-600" : "text-amber-600"}`}>+{c.growth}%</p>
              </div>
              {expanded === c.name ? <ChevronUp className="h-4 w-4 text-charcoal/30" /> : <ChevronDown className="h-4 w-4 text-charcoal/30" />}
            </div>
          </button>
          {expanded === c.name && (
            <div className="border-t border-black/6 p-4 bg-stone-50/60">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
                <div><p className="text-[10px] text-charcoal/40 uppercase tracking-wider">Delivery</p><p className="text-sm font-medium text-charcoal">{c.delivery_days} days</p></div>
                <div><p className="text-[10px] text-charcoal/40 uppercase tracking-wider">Products</p><p className="text-sm font-medium text-charcoal">{c.products || "Full-service"}</p></div>
                <div><p className="text-[10px] text-charcoal/40 uppercase tracking-wider">Online Rating</p><p className="text-sm font-medium text-charcoal">⭐ {c.online_rating}</p></div>
                <div><p className="text-[10px] text-charcoal/40 uppercase tracking-wider">Market Share</p><p className="text-sm font-medium text-charcoal">{c.market_share}%</p></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
                  <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider mb-1">Strength</p>
                  <p className="text-xs text-emerald-700">{c.strength}</p>
                </div>
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
                  <p className="text-[10px] font-semibold text-red-600 uppercase tracking-wider mb-1">Weakness</p>
                  <p className="text-xs text-red-600">{c.weakness}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FinancialsPage() {
  const [tab, setTab] = useState<Tab>("pl");

  const TABS = [
    { id: "pl" as Tab,          label: "P & L Statement",     icon: <DollarSign className="h-3.5 w-3.5" /> },
    { id: "products" as Tab,    label: "Product Performance", icon: <Package className="h-3.5 w-3.5" /> },
    { id: "ebitda" as Tab,      label: "EBITDA",              icon: <BarChart2 className="h-3.5 w-3.5" /> },
    { id: "competitors" as Tab, label: "Competitor Intel",    icon: <Target className="h-3.5 w-3.5" /> },
  ];

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light text-charcoal">Financials & Intelligence</h1>
          <p className="mt-1 font-sans text-sm text-charcoal/50">P&L · EBITDA · Products · Competitor analysis</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3.5 py-2 text-xs font-medium text-charcoal/60 hover:bg-black/5 transition-colors">
          <Download className="h-3.5 w-3.5" />Export
        </button>
      </div>

      <div className="flex gap-1 border-b border-black/8 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-sans text-sm whitespace-nowrap border-b-2 transition-colors -mb-px ${
              tab === t.id
                ? "border-red-500 text-red-600 font-medium"
                : "border-transparent text-charcoal/50 hover:text-charcoal"
            }`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {tab === "pl"          && <PLTab />}
      {tab === "products"    && <ProductsTab />}
      {tab === "ebitda"      && <EBITDATab />}
      {tab === "competitors" && <CompetitorsTab />}
    </div>
  );
}
