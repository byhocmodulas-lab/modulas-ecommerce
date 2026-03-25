"use client";

import { useEffect, useState } from "react";
import {
  BarChart3, TrendingDown, TrendingUp, AlertTriangle,
  RefreshCw, ExternalLink, ArrowRight, Search,
  ShoppingBag, Eye, ChevronDown, ChevronUp,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { competitorApi, type CompetitorProfile } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";

// ── Types ────────────────────────────────────────────────────
interface CompetitorPrice {
  competitor: string;
  url: string;
  ourPrice: number;
  theirPrice: number;
  delta: number;        // positive = we're more expensive
  lastChecked: string;
  product: string;
  category: string;
}

interface TrendItem {
  keyword: string;
  volume: number;
  trend: number;  // % change
}

// ── Placeholder data (will be replaced by API from intel service) ──
const PRICE_DATA: CompetitorPrice[] = [
  {
    competitor: "Heal's",           url: "heals.com",
    product: "3-Seat Modular Sofa", category: "Sofas",
    ourPrice: 3200, theirPrice: 2950, delta: 250,
    lastChecked: "2026-03-14T08:00:00Z",
  },
  {
    competitor: "Made.com",         url: "made.com",
    product: "Oak Dining Table",    category: "Tables",
    ourPrice: 1800, theirPrice: 1650, delta: 150,
    lastChecked: "2026-03-14T08:00:00Z",
  },
  {
    competitor: "Ercol",            url: "ercol.com",
    product: "Lounge Chair",        category: "Chairs",
    ourPrice: 1200, theirPrice: 1380, delta: -180,
    lastChecked: "2026-03-14T08:00:00Z",
  },
  {
    competitor: "Vitra",            url: "vitra.com",
    product: "Side Table Set",      category: "Tables",
    ourPrice: 680, theirPrice: 890, delta: -210,
    lastChecked: "2026-03-13T18:00:00Z",
  },
  {
    competitor: "Heal's",           url: "heals.com",
    product: "Bed Frame — King",    category: "Beds",
    ourPrice: 2600, theirPrice: 2400, delta: 200,
    lastChecked: "2026-03-14T08:00:00Z",
  },
  {
    competitor: "SCP",              url: "scp.co.uk",
    product: "Bookcase — Tall",     category: "Storage",
    ourPrice: 1450, theirPrice: 1450, delta: 0,
    lastChecked: "2026-03-14T08:00:00Z",
  },
];

const TRENDS: TrendItem[] = [
  { keyword: "modular sofa UK",           volume: 12400, trend: 34 },
  { keyword: "sustainable furniture",     volume: 28000, trend: 22 },
  { keyword: "luxury dining table oak",   volume: 5600,  trend: 18 },
  { keyword: "bespoke furniture London",  volume: 9800,  trend: 12 },
  { keyword: "configurator furniture",    volume: 3200,  trend: 41 },
  { keyword: "made to order sofa",        volume: 7400,  trend: 9  },
  { keyword: "rattan chair UK",           volume: 18200, trend: -8 },
  { keyword: "minimalist bedroom set",    volume: 11000, trend: 15 },
];

const CATEGORIES = ["All categories", "Sofas", "Tables", "Chairs", "Beds", "Storage"] as const;
type Category = typeof CATEGORIES[number];

// ── Components ───────────────────────────────────────────────
function PriceDelta({ delta }: { delta: number }) {
  if (delta === 0) return <span className="font-sans text-xs text-charcoal/40">Matched</span>;
  const cheaper = delta < 0;
  return (
    <span className={`inline-flex items-center gap-1 font-sans text-xs font-medium ${cheaper ? "text-emerald-600" : "text-red-500"}`}>
      {cheaper ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
      {cheaper ? "We're cheaper by " : "They're cheaper by "}
      {formatPrice(Math.abs(delta))}
    </span>
  );
}

export default function AdminIntelPage() {
  const { accessToken } = useAuthStore();
  const [category, setCategory]   = useState<Category>("All categories");
  const [search, setSearch]       = useState("");
  const [sortByDelta, setSortByDelta] = useState<"asc" | "desc" | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [profiles, setProfiles]   = useState<CompetitorProfile[]>([]);

  useEffect(() => {
    if (!accessToken) return;
    competitorApi.listProfiles(accessToken).then(setProfiles).catch(() => {});
  }, [accessToken]);

  function handleRefresh() {
    setRefreshing(true);
    if (accessToken) {
      competitorApi.listProfiles(accessToken).then(setProfiles).catch(() => {}).finally(() => setRefreshing(false));
    } else {
      setTimeout(() => setRefreshing(false), 1000);
    }
  }

  const filtered = PRICE_DATA
    .filter((p) => {
      const matchesCat    = category === "All categories" || p.category === category;
      const matchesSearch = !search ||
        p.product.toLowerCase().includes(search.toLowerCase()) ||
        p.competitor.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortByDelta === "asc")  return a.delta - b.delta;
      if (sortByDelta === "desc") return b.delta - a.delta;
      return 0;
    });

  const overpriced = PRICE_DATA.filter((p) => p.delta > 0).length;
  const underpriced = PRICE_DATA.filter((p) => p.delta < 0).length;
  const avgDelta = PRICE_DATA.reduce((s, p) => s + p.delta, 0) / PRICE_DATA.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Competitor Intelligence</h1>
          <p className="font-sans text-sm text-charcoal/40 mt-0.5">
            Price monitoring across competitor catalogs · Updated every 6 hours
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-2.5 font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/60 hover:border-gold hover:text-gold transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Scanning…" : "Refresh now"}
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Products tracked",   value: PRICE_DATA.length,          icon: Eye,          colour: "text-charcoal" },
          { label: "We're overpriced",   value: overpriced,                  icon: AlertTriangle, colour: "text-red-500" },
          { label: "We're competitive",  value: underpriced,                  icon: TrendingDown, colour: "text-emerald-600" },
          { label: "Avg. price delta",   value: formatPrice(Math.abs(avgDelta)), icon: BarChart3,    colour: avgDelta > 0 ? "text-red-500" : "text-emerald-600" },
        ].map(({ label, value, icon: Icon, colour }) => (
          <div key={label} className="rounded-2xl border border-black/6 bg-white p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 mb-3">
              <Icon className="h-4 w-4 text-gold" />
            </div>
            <p className={`font-serif text-2xl ${colour}`}>{value}</p>
            <p className="font-sans text-xs text-charcoal/40 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Price comparison table */}
      <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-black/5 flex flex-wrap gap-3 items-center">
          <h2 className="font-serif text-lg text-charcoal mr-auto">Price comparisons</h2>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal/30" />
            <input
              type="text"
              placeholder="Search product…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border border-black/10 bg-transparent py-2 pl-8 pr-3 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold/60 focus:outline-none transition-colors"
            />
          </div>

          {/* Category filter */}
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={[
                  "rounded-full px-3 py-1.5 font-sans text-[10px] tracking-[0.08em] uppercase transition-colors",
                  category === c ? "bg-charcoal text-cream" : "bg-black/5 text-charcoal/50 hover:bg-black/8",
                ].join(" ")}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm min-w-[700px]">
            <thead className="border-b border-black/4">
              <tr>
                {["Product", "Competitor", "Our price", "Their price", "Delta"].map((h) => (
                  <th
                    key={h}
                    className={`px-5 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase text-charcoal/35 font-medium${h === "Delta" ? " cursor-pointer" : ""}`}
                    onClick={h === "Delta" ? () => setSortByDelta(sortByDelta === "desc" ? "asc" : "desc") : undefined}
                  >
                    <span className="flex items-center gap-1">
                      {h}
                      {h === "Delta" && (
                        sortByDelta === "desc" ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const checked = new Date(row.lastChecked).toLocaleDateString("en-GB", {
                  day: "numeric", month: "short",
                });
                return (
                  <tr key={i} className={[
                    "border-b border-black/3 last:border-0 hover:bg-black/1 transition-colors",
                    row.delta > 0 ? "bg-red-50/30" : row.delta < 0 ? "bg-emerald-50/20" : "",
                  ].join(" ")}>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-charcoal">{row.product}</p>
                      <p className="text-[11px] text-charcoal/35">{row.category} · Checked {checked}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <a
                        href={`https://${row.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-charcoal/60 hover:text-gold transition-colors"
                      >
                        {row.competitor}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-charcoal">{formatPrice(row.ourPrice)}</td>
                    <td className="px-5 py-3.5 font-medium text-charcoal">{formatPrice(row.theirPrice)}</td>
                    <td className="px-5 py-3.5"><PriceDelta delta={row.delta} /></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center font-sans text-sm text-charcoal/40">
                    No data matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Search trend panel */}
      <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-black/5">
          <h2 className="font-serif text-lg text-charcoal">Search trend analysis</h2>
          <p className="font-sans text-xs text-charcoal/40 mt-0.5">
            Monthly search volumes for key furniture categories · vs. previous 30 days
          </p>
        </div>
        <div className="p-4 grid gap-2 sm:grid-cols-2">
          {TRENDS.map((t) => (
            <div
              key={t.keyword}
              className="flex items-center justify-between rounded-xl bg-black/2 px-4 py-3 hover:bg-black/4 transition-colors"
            >
              <div>
                <p className="font-sans text-sm text-charcoal">{t.keyword}</p>
                <p className="font-sans text-[11px] text-charcoal/40">
                  {t.volume.toLocaleString()} monthly searches
                </p>
              </div>
              <span className={`flex items-center gap-1 font-sans text-xs font-medium ${t.trend >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {t.trend >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {t.trend > 0 ? "+" : ""}{t.trend}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Competitor profiles from DB */}
      {profiles.length > 0 && (
        <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-black/5">
            <h2 className="font-serif text-lg text-charcoal">Tracked competitors</h2>
            <p className="font-sans text-xs text-charcoal/40 mt-0.5">Competitors tracked in the database</p>
          </div>
          <div className="p-4 grid gap-2 sm:grid-cols-2">
            {profiles.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl bg-black/2 px-4 py-3">
                <div>
                  <p className="font-sans text-sm font-medium text-charcoal">{p.name}</p>
                  {p.website && (
                    <a href={`https://${p.website}`} target="_blank" rel="noopener noreferrer"
                      className="font-sans text-[11px] text-charcoal/40 hover:text-gold transition-colors flex items-center gap-1">
                      {p.website} <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>
                <div className="text-right">
                  {p.followerCount != null && (
                    <p className="font-sans text-xs text-charcoal/60">{p.followerCount.toLocaleString()} followers</p>
                  )}
                  {p.avgEngagement != null && (
                    <p className="font-sans text-[11px] text-charcoal/40">{p.avgEngagement}% engagement</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
