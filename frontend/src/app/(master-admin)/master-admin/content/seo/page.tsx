"use client";

import { useState, useEffect } from "react";
import {
  Search, Globe, Image, CheckCircle2, Circle,
  ChevronDown, ChevronUp, X, Save, Eye,
} from "lucide-react";
import { cmsApi, type CmsPage } from "@/lib/api/client";
import { useAccessToken } from "@/lib/stores/auth-store";

const SCORE_RULES = [
  { key: "hasTitle",      label: "SEO title set",              weight: 25 },
  { key: "titleLen",      label: "Title 30–70 characters",     weight: 15 },
  { key: "hasDesc",       label: "Meta description set",       weight: 25 },
  { key: "descLen",       label: "Description 70–160 chars",   weight: 15 },
  { key: "hasOgImage",    label: "OG image set",               weight: 20 },
];

function scoreFor(page: CmsPage): { total: number; checks: Record<string, boolean> } {
  const t = page.seoTitle ?? "";
  const d = page.seoDescription ?? "";
  const checks = {
    hasTitle:   t.length > 0,
    titleLen:   t.length >= 30 && t.length <= 70,
    hasDesc:    d.length > 0,
    descLen:    d.length >= 70 && d.length <= 160,
    hasOgImage: !!(page.ogImage),
  };
  const total = SCORE_RULES.reduce((acc, r) => acc + (checks[r.key as keyof typeof checks] ? r.weight : 0), 0);
  return { total, checks };
}

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 80 ? "text-emerald-700 bg-emerald-50 border-emerald-200"
    : score >= 50 ? "text-amber-700 bg-amber-50 border-amber-200"
    : "text-red-600 bg-red-50 border-red-200";
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}>
      {score}/100
    </span>
  );
}

export default function SeoPage() {
  const token = useAccessToken() ?? "";
  const [pages, setPages]       = useState<CmsPage[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [search, setSearch]     = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [drafts, setDrafts]     = useState<Record<string, Partial<CmsPage>>>({});
  const [saving, setSaving]     = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    cmsApi.listPages(token)
      .then(setPages)
      .catch(() => setError("Failed to load pages"))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = pages.filter(p =>
    !search ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  function getDraft(slug: string, page: CmsPage) {
    return drafts[slug] ?? { seoTitle: page.seoTitle ?? "", seoDescription: page.seoDescription ?? "", ogImage: page.ogImage ?? "" };
  }

  function setField(slug: string, page: CmsPage, key: keyof CmsPage, value: string) {
    setDrafts(d => ({ ...d, [slug]: { ...getDraft(slug, page), [key]: value } }));
  }

  async function saveSeo(page: CmsPage) {
    const draft = drafts[page.slug];
    if (!draft) return;
    setSaving(page.slug);
    try {
      const updated = await cmsApi.updatePage(token, page.slug, {
        seoTitle: draft.seoTitle as string,
        seoDescription: draft.seoDescription as string,
        ogImage: draft.ogImage as string,
      });
      setPages(p => p.map(x => x.slug === page.slug ? updated : x));
      setDrafts(d => { const n = { ...d }; delete n[page.slug]; return n; });
    } catch {
      setError("Failed to save SEO settings");
    } finally {
      setSaving(null);
    }
  }

  const totalPublished = pages.filter(p => p.status === "published").length;
  const avgScore = pages.length > 0
    ? Math.round(pages.reduce((a, p) => a + scoreFor(p).total, 0) / pages.length)
    : 0;
  const optimal = pages.filter(p => scoreFor(p).total >= 80).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-light text-charcoal">SEO Control Panel</h1>
        <p className="mt-0.5 text-sm text-charcoal/40">Manage meta titles, descriptions, and OG images per page</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Published Pages",  value: totalPublished, sub: `of ${pages.length} total` },
          { label: "Avg SEO Score",    value: `${avgScore}/100`, sub: "across all pages" },
          { label: "Fully Optimised",  value: optimal, sub: "pages scoring 80+" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="rounded-xl border border-black/8 bg-white p-4">
            <p className="text-[11px] uppercase tracking-wider text-charcoal/40">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-charcoal">{value}</p>
            <p className="text-xs text-charcoal/35 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/25" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search pages…"
          className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-9 pr-4 text-sm text-charcoal/80 placeholder:text-charcoal/25 focus:border-black/20 focus:outline-none" />
      </div>

      {/* Pages list */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-xl bg-black/5 animate-pulse" />)}
        </div>
      ) : (
        <div className="rounded-xl border border-black/8 bg-white overflow-hidden divide-y divide-black/5">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-charcoal/30">No pages found</div>
          ) : filtered.map(page => {
            const draft = drafts[page.slug];
            const display = draft
              ? { ...page, ...draft }
              : page;
            const { total, checks } = scoreFor(display as CmsPage);
            const isOpen = expanded === page.slug;
            const isDirty = !!draft;

            return (
              <div key={page.slug}>
                {/* Row header */}
                <button
                  className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-stone-50/60 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : page.slug)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-charcoal truncate">{page.title}</p>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                        page.status === "published" ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : page.status === "draft" ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-black/10 text-charcoal/40"
                      }`}>{page.status}</span>
                      {isDirty && <span className="rounded-full border border-sky-200 bg-sky-50 text-sky-600 px-2 py-0.5 text-[10px]">Unsaved</span>}
                    </div>
                    <p className="text-xs text-charcoal/35 mt-0.5">/{page.slug}</p>
                  </div>
                  <ScoreBadge score={total} />
                  {isOpen ? <ChevronUp className="h-4 w-4 text-charcoal/30 shrink-0" /> : <ChevronDown className="h-4 w-4 text-charcoal/30 shrink-0" />}
                </button>

                {/* Expanded editor */}
                {isOpen && (
                  <div className="border-t border-black/5 bg-stone-50/40 px-5 py-4 space-y-4">
                    {/* Score breakdown */}
                    <div className="flex flex-wrap gap-3 mb-1">
                      {SCORE_RULES.map(rule => (
                        <span key={rule.key} className={`flex items-center gap-1.5 text-xs ${checks[rule.key as keyof typeof checks] ? "text-emerald-600" : "text-charcoal/35"}`}>
                          {checks[rule.key as keyof typeof checks]
                            ? <CheckCircle2 className="h-3.5 w-3.5" />
                            : <Circle className="h-3.5 w-3.5" />
                          }
                          {rule.label}
                        </span>
                      ))}
                    </div>

                    {/* SEO Title */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] uppercase tracking-wider text-charcoal/40">SEO Title</label>
                        <span className={`text-[11px] ${
                          ((display.seoTitle ?? "").length > 70 || (display.seoTitle ?? "").length < 30) && (display.seoTitle ?? "").length > 0
                            ? "text-amber-600" : "text-charcoal/30"
                        }`}>{(display.seoTitle ?? "").length}/70</span>
                      </div>
                      <input
                        value={draft?.seoTitle as string ?? page.seoTitle ?? ""}
                        onChange={e => setField(page.slug, page, "seoTitle", e.target.value)}
                        placeholder={page.title}
                        maxLength={70}
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-black/20" />
                    </div>

                    {/* Meta Description */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] uppercase tracking-wider text-charcoal/40">Meta Description</label>
                        <span className={`text-[11px] ${
                          ((display.seoDescription ?? "").length > 160 || (display.seoDescription ?? "").length < 70) && (display.seoDescription ?? "").length > 0
                            ? "text-amber-600" : "text-charcoal/30"
                        }`}>{(display.seoDescription ?? "").length}/160</span>
                      </div>
                      <textarea
                        value={draft?.seoDescription as string ?? page.seoDescription ?? ""}
                        onChange={e => setField(page.slug, page, "seoDescription", e.target.value)}
                        placeholder="Describe this page for search engines…"
                        maxLength={160}
                        rows={3}
                        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-black/20 resize-none" />
                    </div>

                    {/* OG Image */}
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">OG Image URL</label>
                      <div className="flex gap-2 items-start">
                        <input
                          value={draft?.ogImage as string ?? page.ogImage ?? ""}
                          onChange={e => setField(page.slug, page, "ogImage", e.target.value)}
                          placeholder="https://…"
                          className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-black/20" />
                        {(draft?.ogImage || page.ogImage) && (
                          <div className="h-10 w-16 rounded-lg border border-black/10 overflow-hidden shrink-0 bg-black/5">
                            <img
                              src={draft?.ogImage as string ?? page.ogImage ?? ""}
                              alt="OG preview"
                              className="h-full w-full object-cover"
                              onError={e => (e.currentTarget.style.display = "none")} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SERP preview */}
                    {(display.seoTitle || display.seoDescription) && (
                      <div className="rounded-xl border border-black/8 bg-white p-4">
                        <p className="text-[10px] uppercase tracking-wider text-charcoal/30 mb-2 flex items-center gap-1.5">
                          <Eye className="h-3 w-3" />Search Preview
                        </p>
                        <p className="text-base text-blue-700 font-medium leading-snug truncate">
                          {display.seoTitle || page.title}
                        </p>
                        <p className="text-xs text-emerald-700 mt-0.5">modulas.in/{page.slug}</p>
                        <p className="text-sm text-charcoal/60 mt-1 line-clamp-2">
                          {display.seoDescription || "No description set"}
                        </p>
                      </div>
                    )}

                    {isDirty && (
                      <div className="flex justify-end">
                        <button onClick={() => saveSeo(page)} disabled={saving === page.slug}
                          className="flex items-center gap-1.5 rounded-full bg-charcoal px-4 py-2 text-xs font-medium text-white hover:bg-charcoal/90 disabled:opacity-50 transition-colors">
                          <Save className="h-3.5 w-3.5" />
                          {saving === page.slug ? "Saving…" : "Save SEO"}
                        </button>
                      </div>
                    )}
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
