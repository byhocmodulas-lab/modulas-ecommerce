"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Globe, FileText, Megaphone, BookOpen, Image,
  Plus, Search, Eye, Edit2, Trash2,
  CheckCircle2, Clock, Archive, Upload, ExternalLink,
  X, ArrowUpRight, LayoutGrid, List, AlertCircle, Loader2, Home,
} from "lucide-react";
import Link from "next/link";
import { useAccessToken } from "@/lib/stores/auth-store";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  cmsApi, articlesApi,
  type CmsPage, type CmsBanner, type CmsMediaItem, type CmsArticle, type CmsSummary,
} from "@/lib/api/client";

/* ─────────────────────────────────────────────────────────────
 *  Types
 * ───────────────────────────────────────────────────────────── */
type Tab = "overview" | "pages" | "banners" | "blog" | "media" | "homepage";

/* ─────────────────────────────────────────────────────────────
 *  Shared UI helpers
 * ───────────────────────────────────────────────────────────── */
const PAGE_BADGE: Record<string, { label: string; cls: string; Icon: React.ElementType }> = {
  published: { label: "Published", cls: "text-emerald-700 bg-emerald-50 border-emerald-200", Icon: CheckCircle2 },
  draft:     { label: "Draft",     cls: "text-amber-700 bg-amber-50 border-amber-200",       Icon: Clock },
  archived:  { label: "Archived",  cls: "text-stone-500 bg-stone-50 border-stone-200",       Icon: Archive },
};
const BANNER_BADGE: Record<string, { label: string; cls: string; dot: string }> = {
  active:    { label: "Active",    cls: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  scheduled: { label: "Scheduled", cls: "text-sky-700 bg-sky-50 border-sky-200",             dot: "bg-sky-500" },
  inactive:  { label: "Inactive",  cls: "text-stone-500 bg-stone-50 border-stone-200",       dot: "bg-stone-400" },
};
const ARTICLE_BADGE: Record<string, { label: string; cls: string }> = {
  published: { label: "Published", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  review:    { label: "In Review", cls: "text-sky-700 bg-sky-50 border-sky-200" },
  draft:     { label: "Draft",     cls: "text-amber-700 bg-amber-50 border-amber-200" },
  archived:  { label: "Archived",  cls: "text-stone-500 bg-stone-50 border-stone-200" },
};

function Badge({ cls, children }: { cls: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 border rounded-full px-2 py-0.5 font-sans text-[10px] tracking-[0.06em] uppercase ${cls}`}>
      {children}
    </span>
  );
}

function IconBtn({ icon: Icon, label, danger, onClick }: { icon: React.ElementType; label: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button type="button" title={label} aria-label={label} onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${danger ? "text-red-400 hover:bg-red-50 hover:text-red-600" : "text-charcoal/30 hover:bg-black/5 hover:text-charcoal/70"}`}>
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function Spinner() {
  return <Loader2 className="h-4 w-4 animate-spin text-charcoal/40" />;
}

const SKELETON_WIDTHS = ["w-3/5", "w-4/5", "w-2/5", "w-3/4", "w-1/2"];

function LoadingRows({ cols = 4 }: { cols?: number }) {
  return (
    <>
      {[0, 1, 2, 3].map(i => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-5 py-4">
              <div className={`h-3 rounded bg-black/6 animate-pulse ${SKELETON_WIDTHS[(i + j) % SKELETON_WIDTHS.length]}`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function ErrorMsg({ msg, onRetry }: { msg: string; onRetry?: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
      <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
      <p className="font-sans text-xs text-red-700 flex-1">{msg}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="font-sans text-[11px] text-red-600 hover:text-red-800 underline">Retry</button>
      )}
    </div>
  );
}

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* ─────────────────────────────────────────────────────────────
 *  Inline form components
 * ───────────────────────────────────────────────────────────── */
function FormWrap({ title, onClose, children, onSubmit, submitting, submitLabel = "Create" }: {
  title: string; onClose: () => void; children: React.ReactNode;
  onSubmit: () => void; submitting?: boolean; submitLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/12 bg-amber-50/40 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sans text-sm font-medium text-charcoal">{title}</h3>
        <button type="button" aria-label="Close" onClick={onClose} className="text-charcoal/30 hover:text-charcoal/60 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3 mb-4">{children}</div>
      <div className="flex gap-2">
        <button type="button" onClick={onSubmit} disabled={submitting}
          className="flex items-center gap-2 h-9 px-6 rounded-full bg-charcoal text-cream font-sans text-[11px] uppercase tracking-[0.1em] hover:bg-charcoal/90 transition-colors disabled:opacity-50">
          {submitting && <Spinner />}{submitLabel}
        </button>
        <button type="button" onClick={onClose} disabled={submitting}
          className="h-9 px-4 rounded-full border border-black/10 text-charcoal/50 font-sans text-[11px] uppercase tracking-[0.1em] hover:border-black/20 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

function Field({ id, label, children }: { id?: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="font-sans text-[10px] uppercase tracking-[0.1em] text-charcoal/40 mb-1 block">{label}</label>
      {children}
    </div>
  );
}

const inputCls  = "w-full h-9 rounded-lg border border-black/10 px-3 font-sans text-xs text-charcoal placeholder:text-charcoal/30 outline-none focus:border-black/30 bg-white";
const selectCls = `${inputCls} cursor-pointer`;

/* ─────────────────────────────────────────────────────────────
 *  OVERVIEW TAB
 * ───────────────────────────────────────────────────────────── */
function OverviewTab({ token, onAction }: { token: string; onAction: (tab: Tab, form?: boolean) => void }) {
  const [summary, setSummary] = useState<CmsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setSummary(await cmsApi.summary(token));
    } catch {
      // Backend CMS module may not be available yet — show zero values
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const stats = [
    { tab: "pages"   as Tab, Icon: Globe,     label: "Pages",   count: summary?.pages   ?? 0, sub: `${summary?.published ?? 0} published · ${summary?.drafts ?? 0} drafts` },
    { tab: "banners" as Tab, Icon: Megaphone, label: "Banners", count: summary?.banners  ?? 0, sub: `${summary?.activeBanners ?? 0} active` },
    { tab: "blog"    as Tab, Icon: BookOpen,  label: "Blog",    count: 0,                       sub: "articles" },
    { tab: "media"   as Tab, Icon: Image,     label: "Media",   count: summary?.media    ?? 0, sub: "files uploaded" },
  ];

  const quickActions = [
    { label: "Edit Homepage", onClick: () => onAction("homepage", false) },
    { label: "New Blog Post",  onClick: () => onAction("blog",    true)  },
    { label: "Add Banner",     onClick: () => onAction("banners", true)  },
    { label: "Upload Media",   onClick: () => onAction("media",   false) },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ tab, Icon, label, count, sub }) => (
          <button key={tab} type="button" onClick={() => onAction(tab, false)}
            className="group rounded-2xl border border-black/6 bg-white p-5 text-left hover:border-black/15 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="rounded-xl border border-black/8 bg-black/4 p-2.5"><Icon className="h-4 w-4 text-charcoal/50" /></div>
              <ArrowUpRight className="h-4 w-4 text-charcoal/20 group-hover:text-charcoal/50 transition-colors" />
            </div>
            {loading
              ? <div className="h-7 w-12 rounded bg-black/6 animate-pulse mb-1" />
              : <p className="font-serif text-2xl text-charcoal mb-0.5">{count}</p>
            }
            <p className="font-sans text-xs font-medium text-charcoal/70">{label}</p>
            <p className="font-sans text-[11px] text-charcoal/35 mt-0.5">{sub}</p>
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl border border-black/6 bg-white p-5">
        <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-charcoal/35 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {quickActions.map(({ label, onClick }) => (
            <button key={label} type="button" onClick={onClick}
              className="flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 font-sans text-[11px] text-charcoal/60 hover:border-black/25 hover:text-charcoal hover:bg-black/3 transition-colors">
              <Plus className="h-3 w-3" />{label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  PAGES TAB
 * ───────────────────────────────────────────────────────────── */
function PagesTab({ token, openForm, onFormOpen, onFormClose }: {
  token: string; openForm: boolean; onFormOpen: () => void; onFormClose: () => void;
}) {
  const [pages,   setPages]   = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState<"all" | CmsPage["status"]>("all");
  const [saving,  setSaving]  = useState(false);

  // New page form state
  const [newTitle,   setNewTitle]   = useState("");
  const [newSlug,    setNewSlug]    = useState("");
  const [newType,    setNewType]    = useState("static");
  const [newSeoT,    setNewSeoT]    = useState("");
  const [newSeoD,    setNewSeoD]    = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      setPages(await cmsApi.listPages(token));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load pages");
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const toggleStatus = async (page: CmsPage) => {
    const next = page.status === "published" ? "draft" : "published";
    // Optimistic update
    setPages(prev => prev.map(p => p.id === page.id ? { ...p, status: next } : p));
    try {
      await cmsApi.updatePage(token, page.slug, { status: next });
    } catch {
      setPages(prev => prev.map(p => p.id === page.id ? { ...p, status: page.status } : p));
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this page? This cannot be undone.")) return;
    try {
      await cmsApi.deletePage(token, slug);
      setPages(prev => prev.filter(p => p.slug !== slug));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim() || !newSlug.trim()) return;
    setSaving(true);
    try {
      const page = await cmsApi.createPage(token, {
        title: newTitle, slug: newSlug, pageType: newType as CmsPage["pageType"],
        seoTitle: newSeoT || undefined, seoDescription: newSeoD || undefined,
      });
      setPages(prev => [page, ...prev]);
      setNewTitle(""); setNewSlug(""); setNewSeoT(""); setNewSeoD(""); setNewType("static");
      onFormClose();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Create failed");
    } finally { setSaving(false); }
  };

  const filtered = pages.filter(p =>
    (filter === "all" || p.status === filter) &&
    (!search || p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-sans text-sm font-medium text-charcoal">Pages</h2>
          <span className="rounded-full bg-black/6 px-2 py-0.5 font-sans text-[11px] text-charcoal/40">{filtered.length}</span>
        </div>
        <button type="button" onClick={onFormOpen}
          className="flex items-center gap-1.5 rounded-full bg-charcoal text-cream px-4 py-1.5 font-sans text-[11px] uppercase tracking-[0.1em] hover:bg-charcoal/90 transition-colors">
          <Plus className="h-3.5 w-3.5" /> New Page
        </button>
      </div>

      {error && <ErrorMsg msg={error} onRetry={load} />}

      {openForm && (
        <FormWrap title="New Page" onClose={onFormClose} onSubmit={handleCreate} submitting={saving} submitLabel="Create as Draft">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field id="pg-title" label="Page Title">
              <input id="pg-title" type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Sustainability" className={inputCls} />
            </Field>
            <Field id="pg-slug" label="Slug">
              <input id="pg-slug" type="text" value={newSlug} onChange={e => setNewSlug(e.target.value)} placeholder="e.g. sustainability" className={inputCls} />
            </Field>
            <Field id="pg-type" label="Page Type">
              <select id="pg-type" title="Page type" value={newType} onChange={e => setNewType(e.target.value)} className={selectCls}>
                {["homepage", "about", "contact", "static", "landing"].map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field id="pg-seo-t" label="SEO Title">
              <input id="pg-seo-t" type="text" value={newSeoT} onChange={e => setNewSeoT(e.target.value)} placeholder="Meta title (≤70 chars)" className={inputCls} />
            </Field>
            <div className="md:col-span-2">
              <Field id="pg-seo-d" label="SEO Description">
                <input id="pg-seo-d" type="text" value={newSeoD} onChange={e => setNewSeoD(e.target.value)} placeholder="Meta description (≤160 chars)" className={inputCls} />
              </Field>
            </div>
          </div>
        </FormWrap>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-charcoal/30" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search pages…"
            className="h-8 w-52 rounded-lg border border-black/10 bg-white pl-8 pr-8 font-sans text-xs text-charcoal placeholder:text-charcoal/30 outline-none focus:border-black/25" />
          {search && (
            <button type="button" aria-label="Clear search" onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal/60">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex gap-1.5">
          {(["all", "published", "draft", "archived"] as const).map(s => (
            <button key={s} type="button" onClick={() => setFilter(s)}
              className={`h-8 px-3 rounded-full font-sans text-[11px] capitalize transition-colors ${filter === s ? "bg-charcoal text-cream" : "border border-black/10 text-charcoal/50 hover:border-black/20 hover:text-charcoal"}`}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/6">
              <th className="px-5 py-3 text-left font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal/35">Title</th>
              <th className="px-4 py-3 text-left font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal/35 hidden md:table-cell">Slug</th>
              <th className="px-4 py-3 text-left font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal/35">Status</th>
              <th className="px-4 py-3 text-left font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal/35 hidden lg:table-cell">Updated</th>
              <th className="px-4 py-3 sr-only">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading
              ? <LoadingRows cols={5} />
              : filtered.map(page => {
                  const b = PAGE_BADGE[page.status] ?? PAGE_BADGE.draft;
                  return (
                    <tr key={page.id} className="group hover:bg-black/[0.015]">
                      <td className="px-5 py-3.5">
                        <p className="font-sans text-sm text-charcoal/80">{page.title}</p>
                        <p className="font-sans text-[11px] text-charcoal/30 mt-0.5 capitalize">{page.pageType}</p>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <code className="font-sans text-[11px] text-charcoal/45 bg-black/4 px-1.5 py-0.5 rounded">/{page.slug}</code>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge cls={b.cls}><b.Icon className="h-2.5 w-2.5" />{b.label}</Badge>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className="font-sans text-xs text-charcoal/40">
                          {fmtDate(page.updatedAt)}
                          {page.updatedBy?.fullName ? ` · ${page.updatedBy.fullName}` : ""}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconBtn icon={Edit2} label="Edit" />
                          <IconBtn icon={Eye}   label="Preview" onClick={() => window.open(`/${page.slug}`, "_blank")} />
                          <button type="button" onClick={() => toggleStatus(page)}
                            className="h-7 px-2 rounded font-sans text-[9px] uppercase tracking-[0.08em] text-charcoal/40 hover:bg-black/5 hover:text-charcoal/70 transition-colors">
                            {page.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                          <IconBtn icon={Trash2} label="Delete" danger onClick={() => handleDelete(page.slug)} />
                        </div>
                      </td>
                    </tr>
                  );
                })
            }
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center"><p className="font-sans text-sm text-charcoal/30">No pages match your filters.</p></div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  BANNERS TAB
 * ───────────────────────────────────────────────────────────── */
function BannersTab({ token, openForm, onFormOpen, onFormClose }: {
  token: string; openForm: boolean; onFormOpen: () => void; onFormClose: () => void;
}) {
  const [banners,   setBanners]   = useState<CmsBanner[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [placement, setPlacement] = useState("all");
  const [saving,    setSaving]    = useState(false);

  // New banner form state
  const [bnName,   setBnName]   = useState("");
  const [bnPlace,  setBnPlace]  = useState("announcement");
  const [bnMsg,    setBnMsg]    = useState("");
  const [bnCtaL,   setBnCtaL]   = useState("");
  const [bnCtaH,   setBnCtaH]   = useState("");
  const [bnStart,  setBnStart]  = useState("");
  const [bnEnd,    setBnEnd]    = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      setBanners(await cmsApi.listBanners(token));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load banners");
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const toggleBanner = async (banner: CmsBanner) => {
    const next = banner.status === "active" ? "inactive" : "active";
    setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, status: next } : b));
    try {
      await cmsApi.updateBanner(token, banner.id, { status: next });
    } catch {
      setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, status: banner.status } : b));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      await cmsApi.deleteBanner(token, id);
      setBanners(prev => prev.filter(b => b.id !== id));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const handleCreate = async () => {
    if (!bnName.trim()) return;
    setSaving(true);
    try {
      const banner = await cmsApi.createBanner(token, {
        name: bnName, placement: bnPlace as CmsBanner["placement"],
        message:  bnMsg  || undefined,
        ctaLabel: bnCtaL || undefined,
        ctaHref:  bnCtaH || undefined,
        startsAt: bnStart || undefined,
        endsAt:   bnEnd   || undefined,
      });
      setBanners(prev => [banner, ...prev]);
      setBnName(""); setBnPlace("announcement"); setBnMsg(""); setBnCtaL(""); setBnCtaH(""); setBnStart(""); setBnEnd("");
      onFormClose();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Create failed");
    } finally { setSaving(false); }
  };

  const filtered = banners.filter(b => placement === "all" || b.placement === placement);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-sans text-sm font-medium text-charcoal">Banners</h2>
          <span className="rounded-full bg-black/6 px-2 py-0.5 font-sans text-[11px] text-charcoal/40">{filtered.length}</span>
        </div>
        <button type="button" onClick={onFormOpen}
          className="flex items-center gap-1.5 rounded-full bg-charcoal text-cream px-4 py-1.5 font-sans text-[11px] uppercase tracking-[0.1em] hover:bg-charcoal/90 transition-colors">
          <Plus className="h-3.5 w-3.5" /> New Banner
        </button>
      </div>

      {error && <ErrorMsg msg={error} onRetry={load} />}

      {openForm && (
        <FormWrap title="New Banner" onClose={onFormClose} onSubmit={handleCreate} submitting={saving} submitLabel="Create Banner">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field id="bn-name"  label="Banner Name"><input id="bn-name"  type="text" value={bnName}  onChange={e => setBnName(e.target.value)}  placeholder="e.g. Summer Sale Strip" className={inputCls} /></Field>
            <Field id="bn-place" label="Placement">
              <select id="bn-place" title="Placement" value={bnPlace} onChange={e => setBnPlace(e.target.value)} className={selectCls}>
                {["announcement", "hero", "category", "product", "checkout"].map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field id="bn-msg" label="Message"><input id="bn-msg" type="text" value={bnMsg} onChange={e => setBnMsg(e.target.value)} placeholder="Banner copy text…" className={inputCls} /></Field>
            </div>
            <Field id="bn-cta-l" label="CTA Label"><input id="bn-cta-l" type="text" value={bnCtaL} onChange={e => setBnCtaL(e.target.value)} placeholder="Shop Now"   className={inputCls} /></Field>
            <Field id="bn-cta-h" label="CTA URL">  <input id="bn-cta-h" type="text" value={bnCtaH} onChange={e => setBnCtaH(e.target.value)} placeholder="/products" className={inputCls} /></Field>
            <Field id="bn-start" label="Start Date"><input id="bn-start" type="date" title="Start date" value={bnStart} onChange={e => setBnStart(e.target.value)} className={inputCls} /></Field>
            <Field id="bn-end"   label="End Date">  <input id="bn-end"   type="date" title="End date"   value={bnEnd}   onChange={e => setBnEnd(e.target.value)}   className={inputCls} /></Field>
          </div>
        </FormWrap>
      )}

      <div className="flex gap-1.5 flex-wrap">
        {["all", "announcement", "hero", "category", "product", "checkout"].map(p => (
          <button key={p} type="button" onClick={() => setPlacement(p)}
            className={`h-8 px-3 rounded-full font-sans text-[11px] capitalize transition-colors ${placement === p ? "bg-charcoal text-cream" : "border border-black/10 text-charcoal/50 hover:border-black/20 hover:text-charcoal"}`}>
            {p === "all" ? "All Placements" : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {loading
        ? <div className="flex items-center justify-center py-12"><Spinner /></div>
        : (
          <div className="space-y-2">
            {filtered.map(banner => {
              const b = BANNER_BADGE[banner.status] ?? BANNER_BADGE.inactive;
              return (
                <div key={banner.id} className="group rounded-xl border border-black/6 bg-white p-4 hover:border-black/12 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-sans text-sm font-medium text-charcoal/80">{banner.name}</p>
                        <span className="rounded-full bg-black/5 px-2 py-0.5 font-sans text-[10px] text-charcoal/40 capitalize">{banner.placement}</span>
                        <Badge cls={b.cls}><span className={`h-1.5 w-1.5 rounded-full ${b.dot}`} />{b.label}</Badge>
                      </div>
                      {banner.message && <p className="font-sans text-xs text-charcoal/50 leading-relaxed">{banner.message}</p>}
                      <div className="flex gap-4 mt-2 flex-wrap">
                        {banner.ctaLabel && <span className="font-sans text-[11px] text-charcoal/40">CTA: <span className="text-charcoal/60">{banner.ctaLabel}</span></span>}
                        {banner.startsAt && <span className="font-sans text-[11px] text-charcoal/40">{new Date(banner.startsAt).toLocaleDateString("en-IN")}{banner.endsAt ? ` → ${new Date(banner.endsAt).toLocaleDateString("en-IN")}` : ""}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => toggleBanner(banner)}
                        className={`h-7 px-3 rounded-full font-sans text-[10px] uppercase tracking-[0.08em] border transition-colors ${banner.status === "active" ? "border-red-200 text-red-500 hover:bg-red-50" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"}`}>
                        {banner.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                      <IconBtn icon={Edit2}  label="Edit" />
                      <IconBtn icon={Trash2} label="Delete" danger onClick={() => handleDelete(banner.id)} />
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-16 text-center"><p className="font-sans text-sm text-charcoal/30">No banners found.</p></div>
            )}
          </div>
        )
      }
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  BLOG TAB
 * ───────────────────────────────────────────────────────────── */
function BlogTab({ token, openForm, onFormOpen, onFormClose }: {
  token: string; openForm: boolean; onFormOpen: () => void; onFormClose: () => void;
}) {
  const [articles,  setArticles]  = useState<CmsArticle[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState<"all" | CmsArticle["status"]>("all");
  const [saving,    setSaving]    = useState(false);

  // New article form state
  const [arTitle,    setArTitle]    = useState("");
  const [arSlug,     setArSlug]     = useState("");
  const [arCat,      setArCat]      = useState("Design Guides");
  const [arExcerpt,  setArExcerpt]  = useState("");
  const [arCoverUrl, setArCoverUrl] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const res = await articlesApi.adminList(token, { search: search || undefined, status: filter === "all" ? undefined : filter });
      setArticles(res.articles);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load articles");
    } finally { setLoading(false); }
  }, [token, search, filter]);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (article: CmsArticle, status: CmsArticle["status"]) => {
    setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status } : a));
    try {
      await articlesApi.updateStatus(token, article.id, status);
    } catch {
      setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status: article.status } : a));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    try {
      await articlesApi.remove(token, id);
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const handleCreate = async () => {
    if (!arTitle.trim() || !arSlug.trim()) return;
    setSaving(true);
    try {
      const article = await articlesApi.create(token, {
        title: arTitle, slug: arSlug, content: "",
        excerpt: arExcerpt || undefined, category: arCat,
        ...(arCoverUrl ? { coverImage: arCoverUrl } : {}),
      });
      setArticles(prev => [article, ...prev]);
      setArTitle(""); setArSlug(""); setArExcerpt(""); setArCat("Design Guides"); setArCoverUrl("");
      onFormClose();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Create failed");
    } finally { setSaving(false); }
  };

  // Auto-generate slug from title
  const handleTitleChange = (v: string) => {
    setArTitle(v);
    if (!arSlug || arSlug === arTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")) {
      setArSlug(v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  const filtered = articles.filter(a =>
    (filter === "all" || a.status === filter) &&
    (!search || a.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-sans text-sm font-medium text-charcoal">Blog &amp; Editorial</h2>
          <span className="rounded-full bg-black/6 px-2 py-0.5 font-sans text-[11px] text-charcoal/40">{filtered.length}</span>
        </div>
        <button type="button" onClick={onFormOpen}
          className="flex items-center gap-1.5 rounded-full bg-charcoal text-cream px-4 py-1.5 font-sans text-[11px] uppercase tracking-[0.1em] hover:bg-charcoal/90 transition-colors">
          <Plus className="h-3.5 w-3.5" /> New Article
        </button>
      </div>

      {error && <ErrorMsg msg={error} onRetry={load} />}

      {openForm && (
        <FormWrap title="New Article" onClose={onFormClose} onSubmit={handleCreate} submitting={saving} submitLabel="Create Draft">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <Field id="ar-title" label="Article Title">
                <input id="ar-title" type="text" value={arTitle} onChange={e => handleTitleChange(e.target.value)} placeholder="e.g. 5 Kitchen Layouts That Transform Everyday Cooking" className={inputCls} />
              </Field>
            </div>
            <Field id="ar-slug" label="Slug">
              <input id="ar-slug" type="text" value={arSlug} onChange={e => setArSlug(e.target.value)} placeholder="auto-generated from title" className={inputCls} />
            </Field>
            <Field id="ar-cat" label="Category">
              <select id="ar-cat" title="Category" value={arCat} onChange={e => setArCat(e.target.value)} className={selectCls}>
                {["Design Guides", "Buying Guides", "Materials", "Project Stories", "How-To", "Trends"].map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field id="ar-excerpt" label="Excerpt">
                <textarea id="ar-excerpt" value={arExcerpt} onChange={e => setArExcerpt(e.target.value)} placeholder="Short summary shown in blog listings…" rows={2}
                  className="w-full rounded-lg border border-black/10 px-3 py-2 font-sans text-xs text-charcoal placeholder:text-charcoal/30 outline-none focus:border-black/30 resize-none bg-white" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <ImageUpload
                label="Cover image"
                value={arCoverUrl}
                onChange={setArCoverUrl}
                accessToken={token}
                aspectClass="aspect-video"
              />
            </div>
          </div>
        </FormWrap>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-charcoal/30" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles…"
            className="h-8 w-52 rounded-lg border border-black/10 bg-white pl-8 pr-8 font-sans text-xs text-charcoal placeholder:text-charcoal/30 outline-none focus:border-black/25" />
          {search && (
            <button type="button" aria-label="Clear search" onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal/60">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex gap-1.5">
          {(["all", "published", "review", "draft"] as const).map(s => (
            <button key={s} type="button" onClick={() => setFilter(s)}
              className={`h-8 px-3 rounded-full font-sans text-[11px] capitalize transition-colors ${filter === s ? "bg-charcoal text-cream" : "border border-black/10 text-charcoal/50 hover:border-black/20 hover:text-charcoal"}`}>
              {s === "all" ? "All" : s === "review" ? "In Review" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black/6">
              <th className="px-5 py-3 text-left font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal/35">Title</th>
              <th className="px-4 py-3 text-left font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal/35 hidden md:table-cell">Category</th>
              <th className="px-4 py-3 text-left font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal/35">Status</th>
              <th className="px-4 py-3 text-right font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal/35 hidden lg:table-cell">Views</th>
              <th className="px-4 py-3 sr-only">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading
              ? <LoadingRows cols={5} />
              : filtered.map(article => {
                  const b = ARTICLE_BADGE[article.status] ?? ARTICLE_BADGE.draft;
                  return (
                    <tr key={article.id} className="group hover:bg-black/[0.015]">
                      <td className="px-5 py-3.5">
                        <p className="font-sans text-sm text-charcoal/80 leading-snug">{article.title}</p>
                        <p className="font-sans text-[11px] text-charcoal/30 mt-0.5">
                          {article.author?.fullName ?? "—"} · {fmtDate(article.updatedAt)}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="rounded-full bg-black/5 px-2 py-0.5 font-sans text-[10px] text-charcoal/45">{article.category ?? "—"}</span>
                      </td>
                      <td className="px-4 py-3.5"><Badge cls={b.cls}>{b.label}</Badge></td>
                      <td className="px-4 py-3.5 hidden lg:table-cell text-right">
                        <span className="font-sans text-xs text-charcoal/40">{article.viewCount > 0 ? article.viewCount.toLocaleString() : "—"}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconBtn icon={Edit2} label="Edit" />
                          <IconBtn icon={Eye}   label="Preview" onClick={() => window.open(`/blog/${article.slug}`, "_blank")} />
                          {article.status === "draft"     && <button type="button" onClick={() => setStatus(article, "review")}    className="h-7 px-2 rounded font-sans text-[9px] uppercase tracking-[0.08em] text-sky-600     hover:bg-sky-50     transition-colors">Review</button>}
                          {article.status === "review"    && <button type="button" onClick={() => setStatus(article, "published")} className="h-7 px-2 rounded font-sans text-[9px] uppercase tracking-[0.08em] text-emerald-600 hover:bg-emerald-50 transition-colors">Publish</button>}
                          {article.status === "published" && <button type="button" onClick={() => setStatus(article, "draft")}     className="h-7 px-2 rounded font-sans text-[9px] uppercase tracking-[0.08em] text-amber-600   hover:bg-amber-50   transition-colors">Unpublish</button>}
                          <IconBtn icon={Trash2} label="Delete" danger onClick={() => handleDelete(article.id)} />
                        </div>
                      </td>
                    </tr>
                  );
                })
            }
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center"><p className="font-sans text-sm text-charcoal/30">No articles match your filters.</p></div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  MEDIA TAB
 * ───────────────────────────────────────────────────────────── */
function MediaTab({ token }: { token: string }) {
  const [items,    setItems]    = useState<CmsMediaItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [search,   setSearch]   = useState("");
  const [folder,   setFolder]   = useState("all");
  const [view,     setView]     = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const res = await cmsApi.listMedia(token, {
        folder: folder === "all" ? undefined : folder,
        search: search || undefined,
      });
      setItems(res.items);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load media");
    } finally { setLoading(false); }
  }, [token, folder, search]);

  useEffect(() => { load(); }, [load]);

  const toggleSelect = (id: string) => setSelected(s => {
    const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file?")) return;
    try {
      await cmsApi.deleteMedia(token, id);
      setItems(prev => prev.filter(m => m.id !== id));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} file${selected.size > 1 ? "s" : ""}?`)) return;
    try {
      await Promise.all(Array.from(selected).map(id => cmsApi.deleteMedia(token, id)));
      setItems(prev => prev.filter(m => !selected.has(m.id)));
      setSelected(new Set());
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Bulk delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-sans text-sm font-medium text-charcoal">Media Library</h2>
          <span className="rounded-full bg-black/6 px-2 py-0.5 font-sans text-[11px] text-charcoal/40">{items.length}</span>
        </div>
        <button type="button" className="flex items-center gap-1.5 rounded-full bg-charcoal text-cream px-4 py-1.5 font-sans text-[11px] uppercase tracking-[0.1em] hover:bg-charcoal/90 transition-colors">
          <Upload className="h-3.5 w-3.5" /> Upload Files
        </button>
      </div>

      {error && <ErrorMsg msg={error} onRetry={load} />}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-charcoal/30" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files…"
              className="h-8 w-48 rounded-lg border border-black/10 bg-white pl-8 pr-3 font-sans text-xs text-charcoal placeholder:text-charcoal/30 outline-none focus:border-black/25" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["all", "products", "projects", "blog", "homepage", "banners", "misc"].map(f => (
              <button key={f} type="button" onClick={() => setFolder(f)}
                className={`h-8 px-3 rounded-full font-sans text-[11px] capitalize transition-colors ${folder === f ? "bg-charcoal text-cream" : "border border-black/10 text-charcoal/50 hover:border-black/20 hover:text-charcoal"}`}>
                {f === "all" ? "All Files" : f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 border border-black/10 rounded-lg p-0.5">
          <button type="button" aria-label="Grid view" onClick={() => setView("grid")} className={`h-7 w-7 flex items-center justify-center rounded transition-colors ${view === "grid" ? "bg-charcoal text-cream" : "text-charcoal/40 hover:text-charcoal"}`}><LayoutGrid className="h-3.5 w-3.5" /></button>
          <button type="button" aria-label="List view"  onClick={() => setView("list")} className={`h-7 w-7 flex items-center justify-center rounded transition-colors ${view === "list" ? "bg-charcoal text-cream" : "text-charcoal/40 hover:text-charcoal"}`}><List className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5">
          <span className="font-sans text-xs text-amber-800">{selected.size} file{selected.size > 1 ? "s" : ""} selected</span>
          <button type="button" onClick={() => setSelected(new Set())} className="ml-auto font-sans text-[11px] text-amber-700 hover:text-amber-900">Clear</button>
          <button type="button" onClick={handleBulkDelete} className="font-sans text-[11px] text-red-600 hover:text-red-800">Delete selected</button>
        </div>
      )}

      {loading
        ? <div className="flex items-center justify-center py-16"><Spinner /></div>
        : view === "grid"
          ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              <button type="button" className="group aspect-square flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/12 hover:border-black/25 hover:bg-black/2 transition-colors">
                <Upload className="h-5 w-5 text-charcoal/25 group-hover:text-charcoal/50" />
                <span className="font-sans text-[10px] text-charcoal/25 group-hover:text-charcoal/50">Upload</span>
              </button>
              {items.map(m => {
                const sel   = selected.has(m.id);
                const isImg = m.mimeType.startsWith("image");
                return (
                  <div key={m.id} onClick={() => toggleSelect(m.id)}
                    className={`group relative aspect-square rounded-xl border cursor-pointer overflow-hidden transition-all ${sel ? "border-charcoal ring-2 ring-charcoal/20" : "border-black/8 hover:border-black/20"}`}>
                    {isImg && m.url
                      ? <img src={m.url} alt={m.altText ?? m.filename} className="absolute inset-0 h-full w-full object-cover" />
                      : (
                        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 ${isImg ? "bg-stone-100" : "bg-stone-50"}`}>
                          {isImg ? <Image className="h-8 w-8 text-stone-300" /> : <FileText className="h-7 w-7 text-stone-300" />}
                          <span className="font-sans text-[9px] text-stone-400 text-center leading-tight truncate w-full">{m.filename}</span>
                        </div>
                      )
                    }
                    {sel && (
                      <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-charcoal flex items-center justify-center">
                        <CheckCircle2 className="h-3.5 w-3.5 text-cream" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
          : (
            <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/6">
                    <th className="w-8 px-4 py-3 sr-only">Select</th>
                    <th className="px-4 py-3 text-left font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal/35">Filename</th>
                    <th className="px-4 py-3 text-left font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal/35 hidden md:table-cell">Folder</th>
                    <th className="px-4 py-3 text-right font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal/35 hidden lg:table-cell">Size</th>
                    <th className="px-4 py-3 text-left font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal/35 hidden lg:table-cell">Uploaded</th>
                    <th className="px-4 py-3 sr-only">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {items.map(m => {
                    const isImg = m.mimeType.startsWith("image");
                    return (
                      <tr key={m.id} className="group hover:bg-black/[0.015]">
                        <td className="px-4 py-3">
                          <input type="checkbox" aria-label={`Select ${m.filename}`} checked={selected.has(m.id)} onChange={() => toggleSelect(m.id)}
                            className="rounded border-black/15 text-charcoal focus:ring-0" />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded bg-stone-100 flex items-center justify-center shrink-0 overflow-hidden">
                              {isImg && m.url
                                ? <img src={m.url} alt={m.altText ?? m.filename} className="h-full w-full object-cover" />
                                : isImg ? <Image className="h-4 w-4 text-stone-400" /> : <FileText className="h-4 w-4 text-stone-400" />
                              }
                            </div>
                            <span className="font-sans text-xs text-charcoal/70 truncate max-w-[180px]">{m.filename}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="rounded-full bg-black/5 px-2 py-0.5 font-sans text-[10px] text-charcoal/40 capitalize">{m.folder}</span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-right">
                          <span className="font-sans text-xs text-charcoal/40">{fmtBytes(m.fileSize)}</span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="font-sans text-xs text-charcoal/35">{fmtDate(m.createdAt)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {m.url && <IconBtn icon={ExternalLink} label="Open" onClick={() => window.open(m.url, "_blank")} />}
                            <IconBtn icon={Edit2}  label="Edit alt text" />
                            <IconBtn icon={Trash2} label="Delete" danger onClick={() => handleDelete(m.id)} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {items.length === 0 && (
                <div className="py-16 text-center"><p className="font-sans text-sm text-charcoal/30">No media found.</p></div>
              )}
            </div>
          )
      }
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  HOMEPAGE TAB — manage all 9 homepage sections
 * ───────────────────────────────────────────────────────────── */

interface HeroSettings {
  imageUrl: string; eyebrow: string; headline: string; subheading: string;
  primaryCtaLabel: string; primaryCtaHref: string;
  secondaryCtaLabel: string; secondaryCtaHref: string;
}
interface PanelSettings {
  eyebrow: string; headline: string; body: string;
  ctaLabel: string; ctaHref: string; imageUrl: string;
  overlay: string; size: string; align: string; ctaStyle: string;
}
interface CategorySettings { label: string; sub: string; imageUrl: string; href: string }
interface ServiceSettings   { label: string; body: string; ctaLabel: string; ctaHref: string }
interface StorySettings {
  eyebrow: string; headline: string; body1: string; body2: string;
  cta1Label: string; cta1Href: string; cta2Label: string; cta2Href: string;
  stats: { number: string; label: string }[];
}
interface ConfigSettings { eyebrow: string; headline: string; subtext: string; cta1Label: string; cta1Href: string; cta2Label: string; cta2Href: string }
interface NewsletterSettings { eyebrow: string; headline: string; subtext: string }

const DEFAULT_HERO: HeroSettings = {
  imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80",
  eyebrow: "Bespoke Furniture. Elevated Interiors.",
  headline: "Where luxury feels personal.",
  subheading: "A contemporary luxury furniture studio redefining the way interiors are experienced — designed with architectural precision, crafted for Indian homes.",
  primaryCtaLabel: "Explore Collection", primaryCtaHref: "/products",
  secondaryCtaLabel: "Book Free Visit",  secondaryCtaHref: "/book-consultation",
};

const DEFAULT_PANELS: PanelSettings[] = [
  { eyebrow: "New Arrivals · Spring 2026", headline: "Designed for the way you live.", body: "Thoughtfully proportioned pieces that adapt to every room, every layout, every life stage.", ctaLabel: "Shop New Arrivals", ctaHref: "/products?sort=newest", imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1600&q=85", overlay: "medium", size: "large", align: "left", ctaStyle: "outline" },
  { eyebrow: "Material Stories", headline: "Step into texture.", body: "From hand-loomed boucle to cold-rolled brass — every material we use is chosen for how it ages, not just how it looks.", ctaLabel: "Explore Materials", ctaHref: "/journal/return-of-boucle", imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=85", overlay: "dark", size: "medium", align: "right", ctaStyle: "gold" },
  { eyebrow: "Our Story", headline: "Rediscovery.", body: "We believe the finest furniture isn't imported. It's designed with intent, built with mastery, and made right here in India.", ctaLabel: "Our Story", ctaHref: "/our-story", imageUrl: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1600&q=85", overlay: "dark", size: "large", align: "center", ctaStyle: "white" },
];

const DEFAULT_MARQUEE = [
  "Bespoke Furniture. Elevated Interiors.", "Modular by Design", "Fully Customised Solutions",
  "Premium Materials & Finishes", "White-Glove Delivery", "Made to Order",
  "850+ Projects Completed", "98% Client Satisfaction",
];

const DEFAULT_QUOTES = [
  { pub: "Architectural Digest India", quote: "Modulas redefines what it means to invest in bespoke furniture." },
  { pub: "Elle Decor India",           quote: "The most thoughtfully designed interiors we've seen from a homegrown studio." },
  { pub: "Dezeen",                     quote: "A contemporary luxury studio building the future of Indian interiors." },
  { pub: "Design Pataki",              quote: "A future-proof collection crafted for the way India lives today." },
];

const DEFAULT_CATEGORIES: CategorySettings[] = [
  { label: "Sofas & Seating",  sub: "Modular · Sectional · Lounge",   imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85", href: "/products?category=sofas"    },
  { label: "Tables",           sub: "Dining · Coffee · Console",       imageUrl: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=900&q=85", href: "/products?category=tables"   },
  { label: "Storage",          sub: "Shelving · Cabinets · Credenzas", imageUrl: "https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=900", href: "/products?category=storage"  },
  { label: "Lighting",         sub: "Pendant · Floor · Table",         imageUrl: "https://images.pexels.com/photos/6444348/pexels-photo-6444348.jpeg?auto=compress&cs=tinysrgb&w=900", href: "/products?category=lighting" },
];

const DEFAULT_SERVICES: ServiceSettings[] = [
  { label: "Free Design Consultation", body: "Our design experts will help you plan, visualise, and spec every piece — at no charge.",                                                  ctaLabel: "Book Now",   ctaHref: "/book-consultation" },
  { label: "Trade Programme",          body: "Architects and interior designers receive dedicated pricing, sample libraries, and a personal account manager.",                        ctaLabel: "Learn More", ctaHref: "/architects"        },
  { label: "White-Glove Delivery",     body: "Every piece arrives fully assembled and placed exactly where you want it — nationwide, at no extra charge.",                          ctaLabel: "Learn More", ctaHref: "/delivery"          },
];

const DEFAULT_STORY: StorySettings = {
  eyebrow:   "What is Modulas?",
  headline:  "Furniture designed around the way you live — not the other way around.",
  body1:     "Modulas is a contemporary luxury furniture studio based in Gurgaon, India. We design and craft bespoke modular kitchens, wardrobes, and living furniture that adapt to any space, any lifestyle, and any aesthetic. Every piece is drawn by our in-house designers, built by master craftspeople, and finished with materials chosen for how they age — not just how they photograph.",
  body2:     "We believe the finest furniture isn't imported. It is designed with intent, built with mastery, and made right here in India. 850 completed projects. 98% client satisfaction. A lifetime of use.",
  cta1Label: "Our Story",    cta1Href: "/our-story",
  cta2Label: "View Projects", cta2Href: "/projects",
  stats: [
    { number: "850+", label: "Projects Completed" },
    { number: "98%",  label: "Client Satisfaction" },
    { number: "12+",  label: "Years of Craft" },
  ],
};

const DEFAULT_CONFIG: ConfigSettings = {
  eyebrow:   "3D Configurator",
  headline:  "Design it exactly as you imagined.",
  subtext:   "Our real-time 3D configurator lets you build your perfect piece from scratch — choose every material, dimension, and finish before placing the order.",
  cta1Label: "Open Configurator", cta1Href: "/configurator",
  cta2Label: "Watch Tutorial",    cta2Href: "/workshops",
};

const DEFAULT_NEWSLETTER: NewsletterSettings = {
  eyebrow:  "The Edit",
  headline: "Live beautifully, curated for you.",
  subtext:  "New collections, design inspiration, trade events and early access — delivered to your inbox monthly.",
};

function HomepageTab({ token }: { token: string }) {
  type Section = "hero" | "categories" | "panels" | "services" | "marquee" | "press" | "story" | "configurator" | "newsletter";
  const [section,    setSection]    = useState<Section>("hero");
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [pageSlug,   setPageSlug]   = useState<string | null>(null);

  const [hero,       setHero]       = useState<HeroSettings>(DEFAULT_HERO);
  const [categories, setCategories] = useState<CategorySettings[]>(DEFAULT_CATEGORIES);
  const [panels,     setPanels]     = useState<PanelSettings[]>(DEFAULT_PANELS);
  const [services,   setServices]   = useState<ServiceSettings[]>(DEFAULT_SERVICES);
  const [marquee,    setMarquee]    = useState<string[]>(DEFAULT_MARQUEE);
  const [quotes,     setQuotes]     = useState<{ pub: string; quote: string }[]>(DEFAULT_QUOTES);
  const [story,      setStory]      = useState<StorySettings>(DEFAULT_STORY);
  const [config,     setConfig]     = useState<ConfigSettings>(DEFAULT_CONFIG);
  const [newsletter, setNewsletter] = useState<NewsletterSettings>(DEFAULT_NEWSLETTER);
  const [panelIdx,   setPanelIdx]   = useState(0);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const page = await cmsApi.getPublishedPage("homepage")
        .catch(() => cmsApi.getPage(token, "homepage").catch(() => null));
      if (page) {
        setPageSlug(page.slug);
        const c = page.content as Record<string, unknown>;
        if (c?.hero)       setHero({ ...DEFAULT_HERO, ...(c.hero as HeroSettings) });
        if (Array.isArray(c?.categories)      && (c.categories      as unknown[]).length) setCategories(c.categories as CategorySettings[]);
        if (Array.isArray(c?.editorialPanels) && (c.editorialPanels as unknown[]).length) setPanels(c.editorialPanels as PanelSettings[]);
        if (Array.isArray(c?.services)        && (c.services        as unknown[]).length) setServices(c.services as ServiceSettings[]);
        if (Array.isArray(c?.marqueeItems)    && (c.marqueeItems    as unknown[]).length) setMarquee(c.marqueeItems as string[]);
        if (Array.isArray(c?.pressQuotes)     && (c.pressQuotes     as unknown[]).length) setQuotes(c.pressQuotes as { pub: string; quote: string }[]);
        if (c?.brandStory)   setStory({      ...DEFAULT_STORY,      ...(c.brandStory   as StorySettings)      });
        if (c?.configurator) setConfig({     ...DEFAULT_CONFIG,     ...(c.configurator as ConfigSettings)     });
        if (c?.newsletter)   setNewsletter({ ...DEFAULT_NEWSLETTER, ...(c.newsletter   as NewsletterSettings) });
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load homepage settings");
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true); setError(null); setSaved(false);
    try {
      const content = {
        hero, categories, editorialPanels: panels, services,
        marqueeItems: marquee, pressQuotes: quotes,
        brandStory: story, configurator: config, newsletter,
      };
      if (!pageSlug) {
        await cmsApi.createPage(token, { slug: "homepage", title: "Homepage", pageType: "homepage", status: "published", content });
        setPageSlug("homepage");
      } else {
        await cmsApi.updatePage(token, "homepage", { content });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  };

  const updatePanel    = (idx: number, patch: Partial<PanelSettings>)    => setPanels(prev => prev.map((p, i) => i === idx ? { ...p, ...patch } : p));
  const updateCategory = (idx: number, patch: Partial<CategorySettings>) => setCategories(prev => prev.map((c, i) => i === idx ? { ...c, ...patch } : c));
  const updateService  = (idx: number, patch: Partial<ServiceSettings>)  => setServices(prev => prev.map((s, i) => i === idx ? { ...s, ...patch } : s));
  const updateStat     = (idx: number, patch: Partial<{ number: string; label: string }>) =>
    setStory(prev => ({ ...prev, stats: prev.stats.map((s, i) => i === idx ? { ...s, ...patch } : s) }));
  const updateMarqueeItem = (idx: number, val: string) => setMarquee(prev => prev.map((item, i) => i === idx ? val : item));
  const updateQuote       = (idx: number, patch: Partial<{ pub: string; quote: string }>) => setQuotes(prev => prev.map((q, i) => i === idx ? { ...q, ...patch } : q));

  const textareaCls = "w-full rounded-lg border border-black/10 px-3 py-2 font-sans text-xs text-charcoal placeholder:text-charcoal/30 outline-none focus:border-black/30 resize-none bg-white";

  const SECTIONS: { id: Section; label: string }[] = [
    { id: "hero",         label: "① Hero" },
    { id: "categories",   label: "③ Categories" },
    { id: "panels",       label: "④⑥⑧ Panels" },
    { id: "services",     label: "⑨ Services" },
    { id: "marquee",      label: "② Marquee" },
    { id: "press",        label: "⑩ Press" },
    { id: "story",        label: "⑫ Brand Story" },
    { id: "configurator", label: "⑦ Configurator" },
    { id: "newsletter",   label: "⑬ Newsletter" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans text-sm font-medium text-charcoal">Homepage Settings</h2>
          <p className="font-sans text-[11px] text-charcoal/35 mt-0.5">
            All 9 sections · Changes publish immediately · Revalidates in ~60s
          </p>
        </div>
        <button type="button" onClick={handleSave} disabled={saving || loading}
          className="flex items-center gap-2 h-9 px-6 rounded-full bg-charcoal text-cream font-sans text-[11px] uppercase tracking-[0.1em] hover:bg-charcoal/90 transition-colors disabled:opacity-50">
          {saving && <Spinner />}
          {saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>

      {error && <ErrorMsg msg={error} onRetry={load} />}

      {loading ? (
        <div className="flex items-center justify-center py-16"><Spinner /></div>
      ) : (
        <div className="flex gap-4">
          {/* Section nav */}
          <div className="flex flex-col gap-1 w-44 shrink-0">
            {SECTIONS.map(s => (
              <button key={s.id} type="button" onClick={() => setSection(s.id)}
                className={`text-left px-3 py-2 rounded-lg font-sans text-xs transition-colors ${section === s.id ? "bg-charcoal text-cream" : "text-charcoal/50 hover:bg-black/5 hover:text-charcoal"}`}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Section content */}
          <div className="flex-1 rounded-2xl border border-black/6 bg-white p-5 space-y-4 min-w-0">

            {/* ── HERO ── */}
            {section === "hero" && (
              <>
                <p className="font-sans text-xs font-medium text-charcoal/60 pb-1 border-b border-black/6">Hero Section</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <Field id="h-img" label="Background Image URL">
                      <input id="h-img" aria-label="Background Image URL" type="url" value={hero.imageUrl} onChange={e => setHero(p => ({ ...p, imageUrl: e.target.value }))} className={inputCls} />
                    </Field>
                  </div>
                  <Field id="h-eye" label="Eyebrow Text">
                    <input id="h-eye" aria-label="Eyebrow Text" type="text" value={hero.eyebrow} onChange={e => setHero(p => ({ ...p, eyebrow: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field id="h-hl" label="Headline">
                    <input id="h-hl" aria-label="Headline" type="text" value={hero.headline} onChange={e => setHero(p => ({ ...p, headline: e.target.value }))} className={inputCls} />
                  </Field>
                  <div className="md:col-span-2">
                    <Field id="h-sub" label="Subheading">
                      <textarea id="h-sub" aria-label="Subheading" value={hero.subheading} onChange={e => setHero(p => ({ ...p, subheading: e.target.value }))} rows={2} className={textareaCls} />
                    </Field>
                  </div>
                  <Field id="h-p-label" label="Primary CTA Label">
                    <input id="h-p-label" aria-label="Primary CTA Label" type="text" value={hero.primaryCtaLabel} onChange={e => setHero(p => ({ ...p, primaryCtaLabel: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field id="h-p-href" label="Primary CTA Link">
                    <input id="h-p-href" aria-label="Primary CTA Link" type="text" value={hero.primaryCtaHref} onChange={e => setHero(p => ({ ...p, primaryCtaHref: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field id="h-s-label" label="Secondary CTA Label">
                    <input id="h-s-label" aria-label="Secondary CTA Label" type="text" value={hero.secondaryCtaLabel} onChange={e => setHero(p => ({ ...p, secondaryCtaLabel: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field id="h-s-href" label="Secondary CTA Link">
                    <input id="h-s-href" aria-label="Secondary CTA Link" type="text" value={hero.secondaryCtaHref} onChange={e => setHero(p => ({ ...p, secondaryCtaHref: e.target.value }))} className={inputCls} />
                  </Field>
                </div>
              </>
            )}

            {/* ── CATEGORIES ── */}
            {section === "categories" && (
              <>
                <p className="font-sans text-xs font-medium text-charcoal/60 pb-1 border-b border-black/6">Featured Categories (4 tiles)</p>
                <div className="space-y-4">
                  {categories.map((cat, i) => (
                    <div key={i} className="rounded-xl border border-black/8 p-4 space-y-3">
                      <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-charcoal/35">Category {i + 1}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Field id={`cat-label-${i}`} label="Label">
                          <input id={`cat-label-${i}`} type="text" value={cat.label} onChange={e => updateCategory(i, { label: e.target.value })} className={inputCls} />
                        </Field>
                        <Field id={`cat-sub-${i}`} label="Sub Text">
                          <input id={`cat-sub-${i}`} type="text" value={cat.sub} onChange={e => updateCategory(i, { sub: e.target.value })} className={inputCls} />
                        </Field>
                        <Field id={`cat-href-${i}`} label="Link">
                          <input id={`cat-href-${i}`} type="text" value={cat.href} onChange={e => updateCategory(i, { href: e.target.value })} className={inputCls} />
                        </Field>
                        <Field id={`cat-img-${i}`} label="Image URL">
                          <input id={`cat-img-${i}`} type="url" value={cat.imageUrl} onChange={e => updateCategory(i, { imageUrl: e.target.value })} className={inputCls} />
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── EDITORIAL PANELS ── */}
            {section === "panels" && (
              <>
                <div className="flex items-center gap-2 pb-1 border-b border-black/6">
                  {panels.map((_, i) => (
                    <button key={i} type="button" onClick={() => setPanelIdx(i)}
                      className={`h-7 px-3 rounded-full font-sans text-[11px] transition-colors ${panelIdx === i ? "bg-charcoal text-cream" : "border border-black/10 text-charcoal/50 hover:border-black/20"}`}>
                      Panel {i + 1}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field id={`ep-eye-${panelIdx}`} label="Eyebrow">
                    <input id={`ep-eye-${panelIdx}`} type="text" value={panels[panelIdx].eyebrow} onChange={e => updatePanel(panelIdx, { eyebrow: e.target.value })} className={inputCls} />
                  </Field>
                  <Field id={`ep-hl-${panelIdx}`} label="Headline">
                    <input id={`ep-hl-${panelIdx}`} type="text" value={panels[panelIdx].headline} onChange={e => updatePanel(panelIdx, { headline: e.target.value })} className={inputCls} />
                  </Field>
                  <div className="md:col-span-2">
                    <Field id={`ep-body-${panelIdx}`} label="Body Copy">
                      <textarea id={`ep-body-${panelIdx}`} value={panels[panelIdx].body} onChange={e => updatePanel(panelIdx, { body: e.target.value })} rows={2} className={textareaCls} />
                    </Field>
                  </div>
                  <Field id={`ep-cl-${panelIdx}`} label="CTA Label">
                    <input id={`ep-cl-${panelIdx}`} type="text" value={panels[panelIdx].ctaLabel} onChange={e => updatePanel(panelIdx, { ctaLabel: e.target.value })} className={inputCls} />
                  </Field>
                  <Field id={`ep-ch-${panelIdx}`} label="CTA Link">
                    <input id={`ep-ch-${panelIdx}`} type="text" value={panels[panelIdx].ctaHref} onChange={e => updatePanel(panelIdx, { ctaHref: e.target.value })} className={inputCls} />
                  </Field>
                  <div className="md:col-span-2">
                    <Field id={`ep-img-${panelIdx}`} label="Image URL">
                      <input id={`ep-img-${panelIdx}`} type="url" value={panels[panelIdx].imageUrl} onChange={e => updatePanel(panelIdx, { imageUrl: e.target.value })} className={inputCls} />
                    </Field>
                  </div>
                  <Field id={`ep-ov-${panelIdx}`} label="Overlay">
                    <select id={`ep-ov-${panelIdx}`} title="Overlay" value={panels[panelIdx].overlay} onChange={e => updatePanel(panelIdx, { overlay: e.target.value })} className={selectCls}>
                      {["light", "medium", "dark"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field id={`ep-sz-${panelIdx}`} label="Size">
                    <select id={`ep-sz-${panelIdx}`} title="Size" value={panels[panelIdx].size} onChange={e => updatePanel(panelIdx, { size: e.target.value })} className={selectCls}>
                      {["medium", "large", "full"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field id={`ep-al-${panelIdx}`} label="Text Alignment">
                    <select id={`ep-al-${panelIdx}`} title="Alignment" value={panels[panelIdx].align} onChange={e => updatePanel(panelIdx, { align: e.target.value })} className={selectCls}>
                      {["left", "center", "right"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </Field>
                  <Field id={`ep-cs-${panelIdx}`} label="CTA Style">
                    <select id={`ep-cs-${panelIdx}`} title="CTA style" value={panels[panelIdx].ctaStyle} onChange={e => updatePanel(panelIdx, { ctaStyle: e.target.value })} className={selectCls}>
                      {["white", "gold", "outline"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </Field>
                </div>
              </>
            )}

            {/* ── SERVICES ── */}
            {section === "services" && (
              <>
                <p className="font-sans text-xs font-medium text-charcoal/60 pb-1 border-b border-black/6">Services Strip (3 cards)</p>
                <div className="space-y-4">
                  {services.map((svc, i) => (
                    <div key={i} className="rounded-xl border border-black/8 p-4 space-y-3">
                      <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-charcoal/35">Service {i + 1}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Field id={`svc-label-${i}`} label="Title">
                          <input id={`svc-label-${i}`} type="text" value={svc.label} onChange={e => updateService(i, { label: e.target.value })} className={inputCls} />
                        </Field>
                        <div className="flex gap-2">
                          <Field id={`svc-ctl-${i}`} label="CTA Label">
                            <input id={`svc-ctl-${i}`} type="text" value={svc.ctaLabel} onChange={e => updateService(i, { ctaLabel: e.target.value })} className={inputCls} />
                          </Field>
                          <Field id={`svc-cth-${i}`} label="CTA Link">
                            <input id={`svc-cth-${i}`} type="text" value={svc.ctaHref} onChange={e => updateService(i, { ctaHref: e.target.value })} className={inputCls} />
                          </Field>
                        </div>
                        <div className="md:col-span-2">
                          <Field id={`svc-body-${i}`} label="Description">
                            <textarea id={`svc-body-${i}`} value={svc.body} onChange={e => updateService(i, { body: e.target.value })} rows={2} className={textareaCls} />
                          </Field>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── MARQUEE ── */}
            {section === "marquee" && (
              <>
                <p className="font-sans text-xs font-medium text-charcoal/60 pb-1 border-b border-black/6">Marquee Strip Items</p>
                <div className="space-y-2">
                  {marquee.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="font-sans text-[10px] text-charcoal/30 w-5 text-right shrink-0">{i + 1}</span>
                      <input type="text" aria-label="Marquee item" value={item} onChange={e => updateMarqueeItem(i, e.target.value)} className={`${inputCls} flex-1`} />
                      <button type="button" aria-label="Remove" onClick={() => setMarquee(prev => prev.filter((_, j) => j !== i))}
                        className="text-charcoal/25 hover:text-red-500 transition-colors"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setMarquee(prev => [...prev, ""])}
                    className="flex items-center gap-1 font-sans text-[11px] text-charcoal/40 hover:text-charcoal transition-colors mt-1">
                    <Plus className="h-3 w-3" /> Add item
                  </button>
                </div>
              </>
            )}

            {/* ── PRESS QUOTES ── */}
            {section === "press" && (
              <>
                <p className="font-sans text-xs font-medium text-charcoal/60 pb-1 border-b border-black/6">Press Quotes</p>
                <div className="space-y-4">
                  {quotes.map((q, i) => (
                    <div key={i} className="rounded-xl border border-black/8 p-4 space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-sans text-[10px] uppercase tracking-[0.1em] text-charcoal/35">Quote {i + 1}</span>
                        <button type="button" aria-label="Remove" onClick={() => setQuotes(prev => prev.filter((_, j) => j !== i))}
                          className="text-charcoal/25 hover:text-red-500 transition-colors"><X className="h-3.5 w-3.5" /></button>
                      </div>
                      <Field id={`pq-pub-${i}`} label="Publication">
                        <input id={`pq-pub-${i}`} type="text" value={q.pub} onChange={e => updateQuote(i, { pub: e.target.value })} className={inputCls} />
                      </Field>
                      <Field id={`pq-qt-${i}`} label="Quote Text">
                        <textarea id={`pq-qt-${i}`} value={q.quote} onChange={e => updateQuote(i, { quote: e.target.value })} rows={2} className={textareaCls} />
                      </Field>
                    </div>
                  ))}
                  <button type="button" onClick={() => setQuotes(prev => [...prev, { pub: "", quote: "" }])}
                    className="flex items-center gap-1 font-sans text-[11px] text-charcoal/40 hover:text-charcoal transition-colors">
                    <Plus className="h-3 w-3" /> Add quote
                  </button>
                </div>
              </>
            )}

            {/* ── BRAND STORY ── */}
            {section === "story" && (
              <>
                <p className="font-sans text-xs font-medium text-charcoal/60 pb-1 border-b border-black/6">Brand Story</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field id="bs-eye" label="Eyebrow">
                    <input id="bs-eye" aria-label="Eyebrow" type="text" value={story.eyebrow} onChange={e => setStory(p => ({ ...p, eyebrow: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field id="bs-hl" label="Headline">
                    <input id="bs-hl" aria-label="Headline" type="text" value={story.headline} onChange={e => setStory(p => ({ ...p, headline: e.target.value }))} className={inputCls} />
                  </Field>
                  <div className="md:col-span-2">
                    <Field id="bs-body1" label="Body Paragraph 1">
                      <textarea id="bs-body1" aria-label="Body Paragraph 1" value={story.body1} onChange={e => setStory(p => ({ ...p, body1: e.target.value }))} rows={3} className={textareaCls} />
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <Field id="bs-body2" label="Body Paragraph 2">
                      <textarea id="bs-body2" aria-label="Body Paragraph 2" value={story.body2} onChange={e => setStory(p => ({ ...p, body2: e.target.value }))} rows={2} className={textareaCls} />
                    </Field>
                  </div>
                  <Field id="bs-cta1l" label="CTA 1 Label">
                    <input id="bs-cta1l" aria-label="CTA 1 Label" type="text" value={story.cta1Label} onChange={e => setStory(p => ({ ...p, cta1Label: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field id="bs-cta1h" label="CTA 1 Link">
                    <input id="bs-cta1h" aria-label="CTA 1 Link" type="text" value={story.cta1Href} onChange={e => setStory(p => ({ ...p, cta1Href: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field id="bs-cta2l" label="CTA 2 Label">
                    <input id="bs-cta2l" aria-label="CTA 2 Label" type="text" value={story.cta2Label} onChange={e => setStory(p => ({ ...p, cta2Label: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field id="bs-cta2h" label="CTA 2 Link">
                    <input id="bs-cta2h" aria-label="CTA 2 Link" type="text" value={story.cta2Href} onChange={e => setStory(p => ({ ...p, cta2Href: e.target.value }))} className={inputCls} />
                  </Field>
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-charcoal/40 mb-2 mt-1">Stats (3 numbers)</p>
                  <div className="space-y-2">
                    {story.stats.map((stat, i) => (
                      <div key={i} className="flex gap-2">
                        <Field id={`bs-sn-${i}`} label={`Stat ${i + 1} Number`}>
                          <input id={`bs-sn-${i}`} type="text" value={stat.number} onChange={e => updateStat(i, { number: e.target.value })} className={inputCls} placeholder="e.g. 850+" />
                        </Field>
                        <Field id={`bs-sl-${i}`} label="Label">
                          <input id={`bs-sl-${i}`} type="text" value={stat.label} onChange={e => updateStat(i, { label: e.target.value })} className={inputCls} placeholder="e.g. Projects Completed" />
                        </Field>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── CONFIGURATOR ── */}
            {section === "configurator" && (
              <>
                <p className="font-sans text-xs font-medium text-charcoal/60 pb-1 border-b border-black/6">3D Configurator CTA</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field id="cfg-eye" label="Eyebrow">
                    <input id="cfg-eye" aria-label="Eyebrow" type="text" value={config.eyebrow} onChange={e => setConfig(p => ({ ...p, eyebrow: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field id="cfg-hl" label="Headline">
                    <input id="cfg-hl" aria-label="Headline" type="text" value={config.headline} onChange={e => setConfig(p => ({ ...p, headline: e.target.value }))} className={inputCls} />
                  </Field>
                  <div className="md:col-span-2">
                    <Field id="cfg-sub" label="Subtext">
                      <textarea id="cfg-sub" aria-label="Subtext" value={config.subtext} onChange={e => setConfig(p => ({ ...p, subtext: e.target.value }))} rows={2} className={textareaCls} />
                    </Field>
                  </div>
                  <Field id="cfg-c1l" label="CTA 1 Label">
                    <input id="cfg-c1l" aria-label="CTA 1 Label" type="text" value={config.cta1Label} onChange={e => setConfig(p => ({ ...p, cta1Label: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field id="cfg-c1h" label="CTA 1 Link">
                    <input id="cfg-c1h" aria-label="CTA 1 Link" type="text" value={config.cta1Href} onChange={e => setConfig(p => ({ ...p, cta1Href: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field id="cfg-c2l" label="CTA 2 Label">
                    <input id="cfg-c2l" aria-label="CTA 2 Label" type="text" value={config.cta2Label} onChange={e => setConfig(p => ({ ...p, cta2Label: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field id="cfg-c2h" label="CTA 2 Link">
                    <input id="cfg-c2h" aria-label="CTA 2 Link" type="text" value={config.cta2Href} onChange={e => setConfig(p => ({ ...p, cta2Href: e.target.value }))} className={inputCls} />
                  </Field>
                </div>
              </>
            )}

            {/* ── NEWSLETTER ── */}
            {section === "newsletter" && (
              <>
                <p className="font-sans text-xs font-medium text-charcoal/60 pb-1 border-b border-black/6">Newsletter Section</p>
                <div className="space-y-3">
                  <Field id="nl-eye" label="Eyebrow">
                    <input id="nl-eye" aria-label="Eyebrow" type="text" value={newsletter.eyebrow} onChange={e => setNewsletter(p => ({ ...p, eyebrow: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field id="nl-hl" label="Headline">
                    <input id="nl-hl" aria-label="Headline" type="text" value={newsletter.headline} onChange={e => setNewsletter(p => ({ ...p, headline: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field id="nl-sub" label="Subtext">
                    <textarea id="nl-sub" aria-label="Subtext" value={newsletter.subtext} onChange={e => setNewsletter(p => ({ ...p, subtext: e.target.value }))} rows={2} className={textareaCls} />
                  </Field>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 *  ROOT: ContentPage
 * ───────────────────────────────────────────────────────────── */
const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", Icon: LayoutGrid },
  { id: "homepage", label: "Homepage", Icon: Home       },
  { id: "pages",    label: "Pages",    Icon: Globe      },
  { id: "banners",  label: "Banners",  Icon: Megaphone  },
  { id: "blog",     label: "Blog",     Icon: BookOpen   },
  { id: "media",    label: "Media",    Icon: Image      },
];

export default function ContentPage() {
  const token = useAccessToken() ?? "";

  const [tab,            setTab]            = useState<Tab>("overview");
  const [pageFormOpen,   setPageFormOpen]   = useState(false);
  const [bannerFormOpen, setBannerFormOpen] = useState(false);
  const [blogFormOpen,   setBlogFormOpen]   = useState(false);

  function navigate(nextTab: Tab, openForm = false) {
    setTab(nextTab);
    setPageFormOpen(  nextTab === "pages"   && openForm);
    setBannerFormOpen(nextTab === "banners" && openForm);
    setBlogFormOpen(  nextTab === "blog"    && openForm);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Website Content</h1>
          <p className="font-sans text-sm text-charcoal/35 mt-0.5">Manage all public-facing content</p>
        </div>
        <Link href="/" target="_blank"
          className="hidden sm:flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 font-sans text-[11px] text-charcoal/50 hover:border-black/20 hover:text-charcoal transition-colors">
          <ExternalLink className="h-3.5 w-3.5" /> View Website
        </Link>
      </div>

      {/* Tab nav */}
      <div className="flex gap-0.5 border-b border-black/8">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} type="button" onClick={() => navigate(id, false)}
            className={["flex items-center gap-2 px-4 py-3 font-sans text-[12px] tracking-[0.05em] transition-colors border-b-2 -mb-px",
              tab === id ? "border-charcoal text-charcoal font-medium" : "border-transparent text-charcoal/40 hover:text-charcoal/70"
            ].join(" ")}>
            <Icon className="h-3.5 w-3.5" />{label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && (
        <OverviewTab token={token} onAction={(t, form) => navigate(t, form ?? false)} />
      )}
      {tab === "homepage" && (
        <HomepageTab token={token} />
      )}
      {tab === "pages" && (
        <PagesTab token={token} openForm={pageFormOpen} onFormOpen={() => setPageFormOpen(true)} onFormClose={() => setPageFormOpen(false)} />
      )}
      {tab === "banners" && (
        <BannersTab token={token} openForm={bannerFormOpen} onFormOpen={() => setBannerFormOpen(true)} onFormClose={() => setBannerFormOpen(false)} />
      )}
      {tab === "blog" && (
        <BlogTab token={token} openForm={blogFormOpen} onFormOpen={() => setBlogFormOpen(true)} onFormClose={() => setBlogFormOpen(false)} />
      )}
      {tab === "media" && (
        <MediaTab token={token} />
      )}
    </div>
  );
}
