"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  Search, TrendingUp, TrendingDown, ExternalLink,
  AlertCircle, CheckCircle2, Clock, RefreshCw,
  ChevronDown, ChevronUp, FileText, Globe, Link2,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────
interface PageSeo {
  path: string;
  title: string;
  metaDesc: string;
  h1: string;
  score: number;          // 0–100
  indexable: boolean;
  issues: string[];
  lastCrawled: string;
}

interface KeywordRank {
  keyword: string;
  position: number;
  prevPosition: number;
  url: string;
  volume: number;
}

interface Backlink {
  source: string;
  target: string;
  da: number;  // domain authority 0–100
  type: "dofollow" | "nofollow";
  found: string;
}

// ── Placeholder data ──────────────────────────────────────────
const PAGES: PageSeo[] = [
  {
    path: "/",
    title: "Modulas — Bespoke Luxury Furniture, Made to Order",
    metaDesc: "Discover handcrafted luxury furniture designed around you. Configure, visualise in AR, and order bespoke pieces delivered to your door.",
    h1: "Furniture Designed Around You",
    score: 91,
    indexable: true,
    issues: [],
    lastCrawled: "2026-03-14T06:00:00Z",
  },
  {
    path: "/products",
    title: "All Products — Modulas Luxury Furniture",
    metaDesc: "Browse our full collection of bespoke sofas, dining tables, chairs and storage. Filter by material, finish and room.",
    h1: "The Collection",
    score: 78,
    indexable: true,
    issues: ["Meta description slightly short (130 chars, recommend 150–160)"],
    lastCrawled: "2026-03-14T06:00:00Z",
  },
  {
    path: "/products/modular-sofa-oslo",
    title: "Modular Sofa Oslo | Configure & Order — Modulas",
    metaDesc: "The Oslo modular sofa. Choose your configuration, fabric and finish. Lead time 8–10 weeks. Free delivery on orders over £500.",
    h1: "Oslo Modular Sofa",
    score: 85,
    indexable: true,
    issues: ["Missing structured data (Product schema)"],
    lastCrawled: "2026-03-14T06:00:00Z",
  },
  {
    path: "/blog",
    title: "Blog — Design Stories & Inspiration | Modulas",
    metaDesc: "Read our latest design stories, material guides and home inspiration from the Modulas studio.",
    h1: "Blog",
    score: 62,
    indexable: true,
    issues: ["H1 too short", "No internal links from blog to product pages", "Missing Open Graph image"],
    lastCrawled: "2026-03-13T06:00:00Z",
  },
  {
    path: "/architect-portal",
    title: "Architect & Interior Designer Portal — Modulas Trade",
    metaDesc: "Trade pricing, project management tools and dedicated support for architects and interior designers.",
    h1: "Architect Portal",
    score: 55,
    indexable: false,
    issues: ["Page is noindexed — consider whether this is intentional", "Thin content (< 300 words)"],
    lastCrawled: "2026-03-14T06:00:00Z",
  },
  {
    path: "/configurator",
    title: "Configure Your Furniture — Modulas 3D Builder",
    metaDesc: "Use our interactive 3D configurator to design your perfect piece. Choose dimensions, materials and finishes in real time.",
    h1: "Build Your Piece",
    score: 44,
    indexable: true,
    issues: [
      "Title tag missing primary keyword 'bespoke furniture'",
      "No canonical tag set",
      "Very low word count (mostly JavaScript-rendered)",
      "Missing structured data",
    ],
    lastCrawled: "2026-03-14T06:00:00Z",
  },
];

const KEYWORDS: KeywordRank[] = [
  { keyword: "modular sofa UK",           position: 4,  prevPosition: 7,  url: "/products/modular-sofa-oslo",  volume: 12400 },
  { keyword: "bespoke furniture London",   position: 9,  prevPosition: 8,  url: "/",                            volume: 9800  },
  { keyword: "luxury dining table oak",    position: 14, prevPosition: 18, url: "/products",                    volume: 5600  },
  { keyword: "furniture configurator UK",  position: 6,  prevPosition: 5,  url: "/configurator",                volume: 3200  },
  { keyword: "sustainable furniture UK",   position: 22, prevPosition: 28, url: "/blog",                     volume: 28000 },
  { keyword: "made to order sofa",         position: 11, prevPosition: 11, url: "/products/modular-sofa-oslo",  volume: 7400  },
  { keyword: "architect trade furniture",  position: 3,  prevPosition: 4,  url: "/architect-portal",            volume: 1800  },
  { keyword: "bespoke lounge chair",       position: 31, prevPosition: 25, url: "/products",                    volume: 4200  },
];

const BACKLINKS: Backlink[] = [
  { source: "designmilk.com",     target: "/",             da: 72, type: "dofollow", found: "2026-02-10" },
  { source: "dezeen.com",         target: "/blog",      da: 88, type: "dofollow", found: "2026-01-22" },
  { source: "architectsjournal.co.uk", target: "/architect-portal", da: 65, type: "dofollow", found: "2026-03-01" },
  { source: "houzz.co.uk",        target: "/products",     da: 77, type: "nofollow", found: "2026-02-28" },
  { source: "livingetc.com",      target: "/",             da: 60, type: "dofollow", found: "2026-03-10" },
  { source: "reddit.com/r/interiordesign", target: "/configurator", da: 91, type: "nofollow", found: "2026-03-12" },
];

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
const TABS = ["Pages", "Keywords", "Backlinks"] as const;
type Tab = typeof TABS[number];

// ── Score pill ────────────────────────────────────────────────
function ScorePill({ score }: { score: number }) {
  const colour =
    score >= 80 ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
    score >= 60 ? "text-amber-700 bg-amber-50 border-amber-200" :
                  "text-red-600 bg-red-50 border-red-200";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-[11px] font-medium ${colour}`}>
      {score}
    </span>
  );
}

// ── Rank delta ────────────────────────────────────────────────
function RankDelta({ pos, prev }: { pos: number; prev: number }) {
  const delta = prev - pos;  // positive = improved (moved up)
  if (delta === 0) return <span className="font-sans text-xs text-charcoal/30">—</span>;
  return (
    <span className={`inline-flex items-center gap-0.5 font-sans text-xs font-medium ${delta > 0 ? "text-emerald-600" : "text-red-500"}`}>
      {delta > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {Math.abs(delta)}
    </span>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function AdminSeoPage() {
  const [tab, setTab]           = useState<Tab>("Pages");
  const [search, setSearch]     = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [crawling, setCrawling] = useState(false);
  const [crawlMsg, setCrawlMsg] = useState("");
  const accessToken = useAuthStore((s) => s.accessToken);

  async function handleCrawl() {
    setCrawling(true);
    setCrawlMsg("");
    try {
      const res = await fetch(`${API}/seo/crawl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      const data = await res.json().catch(() => ({})) as { message?: string };
      setCrawlMsg(res.ok ? (data.message ?? "Crawl job queued.") : (data.message ?? "Crawl failed."));
    } catch {
      setCrawlMsg("Could not reach server.");
    } finally {
      setCrawling(false);
    }
  }

  const avgScore = Math.round(PAGES.reduce((s, p) => s + p.score, 0) / PAGES.length);
  const issues   = PAGES.reduce((s, p) => s + p.issues.length, 0);
  const top10    = KEYWORDS.filter((k) => k.position <= 10).length;
  const totalLinks = BACKLINKS.length;

  // Filtered lists
  const filteredPages = PAGES.filter((p) =>
    !search || p.path.toLowerCase().includes(search.toLowerCase()) ||
    p.title.toLowerCase().includes(search.toLowerCase())
  );
  const filteredKw = KEYWORDS.filter((k) =>
    !search || k.keyword.toLowerCase().includes(search.toLowerCase())
  );
  const filteredLinks = BACKLINKS.filter((b) =>
    !search || b.source.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">SEO</h1>
          <p className="font-sans text-sm text-charcoal/40 mt-0.5">
            On-page health, keyword rankings and backlink profile
          </p>
        </div>
        <button
          type="button"
          onClick={handleCrawl}
          disabled={crawling}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-2.5 font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/60 hover:border-gold hover:text-gold transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${crawling ? "animate-spin" : ""}`} />
          {crawling ? "Crawling…" : "Run crawl"}
        </button>
      </div>
      {crawlMsg && (
        <p className="font-sans text-xs text-charcoal/50 dark:text-cream/50">{crawlMsg}</p>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Avg SEO score",     value: `${avgScore}/100`,     icon: Search,       colour: avgScore >= 70 ? "text-emerald-600" : "text-amber-600" },
          { label: "Open issues",       value: issues,                 icon: AlertCircle,  colour: issues > 0 ? "text-red-500" : "text-emerald-600" },
          { label: "Top-10 keywords",   value: top10,                  icon: TrendingUp,   colour: "text-charcoal" },
          { label: "Backlinks",         value: totalLinks,             icon: Link2,        colour: "text-charcoal" },
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

      {/* Tabs + search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setTab(t); setSearch(""); setExpanded(null); }}
              className={[
                "rounded-full px-4 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors",
                tab === t ? "bg-charcoal text-cream" : "bg-black/5 text-charcoal/50 hover:bg-black/8",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal/30" />
          <input
            type="text"
            placeholder={tab === "Pages" ? "Search pages…" : tab === "Keywords" ? "Search keywords…" : "Search domains…"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-black/10 bg-white py-2 pl-8 pr-3 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold/60 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* ── PAGES tab ── */}
      {tab === "Pages" && (
        <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full font-sans text-sm min-w-[640px]">
              <thead className="border-b border-black/5">
                <tr>
                  {["Page", "Title", "Score", "Status", "Issues", ""].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase text-charcoal/35 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPages.map((page) => {
                  const isExpanded = expanded === page.path;
                  return (
                    <>
                      <tr
                        key={page.path}
                        className="border-b border-black/3 last:border-0 hover:bg-black/1 transition-colors cursor-pointer"
                        onClick={() => setExpanded(isExpanded ? null : page.path)}
                      >
                        <td className="px-5 py-3.5 font-mono text-xs text-charcoal/60 whitespace-nowrap">{page.path}</td>
                        <td className="px-5 py-3.5 max-w-[240px]">
                          <p className="font-medium text-charcoal truncate text-xs">{page.title}</p>
                        </td>
                        <td className="px-5 py-3.5"><ScorePill score={page.score} /></td>
                        <td className="px-5 py-3.5">
                          {page.indexable ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Indexed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                              <Clock className="h-3.5 w-3.5" /> Noindex
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {page.issues.length > 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs text-red-500 font-medium">
                              <AlertCircle className="h-3.5 w-3.5" /> {page.issues.length}
                            </span>
                          ) : (
                            <span className="text-xs text-charcoal/25">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {isExpanded
                            ? <ChevronUp className="h-4 w-4 text-charcoal/30" />
                            : <ChevronDown className="h-4 w-4 text-charcoal/30" />}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${page.path}-detail`} className="bg-black/1 border-b border-black/3">
                          <td colSpan={6} className="px-5 py-4 space-y-3">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="rounded-xl bg-white border border-black/6 p-3.5">
                                <p className="font-sans text-[10px] tracking-[0.1em] uppercase text-charcoal/35 mb-1">Title tag</p>
                                <p className="font-sans text-sm text-charcoal">{page.title}</p>
                              </div>
                              <div className="rounded-xl bg-white border border-black/6 p-3.5">
                                <p className="font-sans text-[10px] tracking-[0.1em] uppercase text-charcoal/35 mb-1">Meta description</p>
                                <p className="font-sans text-sm text-charcoal">{page.metaDesc}</p>
                                <p className="font-sans text-[10px] text-charcoal/30 mt-1">{page.metaDesc.length} chars</p>
                              </div>
                            </div>
                            {page.issues.length > 0 && (
                              <ul className="space-y-1.5">
                                {page.issues.map((issue, i) => (
                                  <li key={i} className="flex items-start gap-2 font-sans text-xs text-red-600">
                                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                    {issue}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── KEYWORDS tab ── */}
      {tab === "Keywords" && (
        <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full font-sans text-sm min-w-[560px]">
              <thead className="border-b border-black/5">
                <tr>
                  {["Keyword", "Position", "Change", "Volume", "Landing page"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase text-charcoal/35 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredKw
                  .sort((a, b) => a.position - b.position)
                  .map((kw) => (
                    <tr key={kw.keyword} className="border-b border-black/3 last:border-0 hover:bg-black/1 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-charcoal">{kw.keyword}</td>
                      <td className="px-5 py-3.5">
                        <span className={`font-serif text-lg ${kw.position <= 10 ? "text-emerald-600" : kw.position <= 20 ? "text-amber-600" : "text-charcoal/40"}`}>
                          #{kw.position}
                        </span>
                      </td>
                      <td className="px-5 py-3.5"><RankDelta pos={kw.position} prev={kw.prevPosition} /></td>
                      <td className="px-5 py-3.5 text-charcoal/50">{kw.volume.toLocaleString()}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-charcoal/50">{kw.url}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── BACKLINKS tab ── */}
      {tab === "Backlinks" && (
        <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full font-sans text-sm min-w-[560px]">
              <thead className="border-b border-black/5">
                <tr>
                  {["Source domain", "DA", "Type", "Points to", "Found"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase text-charcoal/35 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLinks
                  .sort((a, b) => b.da - a.da)
                  .map((link, i) => (
                    <tr key={i} className="border-b border-black/3 last:border-0 hover:bg-black/1 transition-colors">
                      <td className="px-5 py-3.5">
                        <a
                          href={`https://${link.source}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-charcoal/70 hover:text-gold transition-colors"
                        >
                          {link.source}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`font-serif text-base ${link.da >= 70 ? "text-emerald-600" : link.da >= 40 ? "text-amber-600" : "text-charcoal/40"}`}>
                          {link.da}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`font-sans text-[10px] tracking-[0.08em] uppercase px-2 py-0.5 rounded-full ${link.type === "dofollow" ? "bg-emerald-50 text-emerald-700" : "bg-black/5 text-charcoal/40"}`}>
                          {link.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-charcoal/50">{link.target}</td>
                      <td className="px-5 py-3.5 text-charcoal/40 whitespace-nowrap">
                        {new Date(link.found).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
