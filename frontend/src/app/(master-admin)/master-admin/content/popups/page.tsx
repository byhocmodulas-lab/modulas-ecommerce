"use client";

import { useState, useEffect } from "react";
import { Plus, Zap, MousePointer, TrendingUp, Eye, EyeOff, Trash2, Pencil, X, Check } from "lucide-react";
import { popupsApi, type CmsPopup } from "@/lib/api/client";
import { useAccessToken } from "@/lib/stores/auth-store";

const TRIGGER_CFG = {
  onload:      { label: "On Load",      icon: Zap,          desc: "Show after a delay (ms)" },
  exit_intent: { label: "Exit Intent",  icon: MousePointer, desc: "Show when cursor leaves window" },
  scroll:      { label: "On Scroll",    icon: TrendingUp,   desc: "Show at scroll % reached" },
} as const;

const EMPTY: Partial<CmsPopup> & { name: string; trigger: "onload"|"exit_intent"|"scroll"; title: string } = {
  name: "", trigger: "onload", triggerValue: 3000, title: "", body: "",
  ctaLabel: "", ctaHref: "", ctaNewTab: false, couponCode: "",
  bgColor: "#ffffff", showOnce: true, isActive: false,
};

export default function PopupsPage() {
  const token = useAccessToken() ?? "";
  const [popups, setPopups]       = useState<CmsPopup[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState<CmsPopup | null>(null);
  const [form, setForm]           = useState({ ...EMPTY });
  const [saving, setSaving]       = useState(false);
  const [deleteId, setDeleteId]   = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    popupsApi.list(token)
      .then(setPopups)
      .catch(() => setError("Failed to load popups"))
      .finally(() => setLoading(false));
  }, [token]);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY });
    setShowForm(true);
  }

  function openEdit(p: CmsPopup) {
    setEditing(p);
    setForm({
      name: p.name, trigger: p.trigger, triggerValue: p.triggerValue,
      title: p.title, body: p.body ?? "", ctaLabel: p.ctaLabel ?? "",
      ctaHref: p.ctaHref ?? "", ctaNewTab: p.ctaNewTab, couponCode: p.couponCode ?? "",
      bgColor: p.bgColor ?? "#ffffff", showOnce: p.showOnce, isActive: p.isActive,
    });
    setShowForm(true);
  }

  async function saveForm() {
    if (!form.name || !form.title) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = await popupsApi.update(token, editing.id, form);
        setPopups(p => p.map(x => x.id === editing.id ? updated : x));
      } else {
        const created = await popupsApi.create(token, form as any);
        setPopups(p => [created, ...p]);
      }
      setShowForm(false);
    } catch {
      setError("Failed to save popup");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(popup: CmsPopup) {
    try {
      const updated = await popupsApi.update(token, popup.id, { isActive: !popup.isActive });
      setPopups(p => p.map(x => x.id === popup.id ? updated : x));
    } catch {
      setError("Failed to update popup");
    }
  }

  async function confirmDelete(id: string) {
    try {
      await popupsApi.remove(token, id);
      setPopups(p => p.filter(x => x.id !== id));
      setDeleteId(null);
    } catch {
      setError("Failed to delete popup");
    }
  }

  const f = (k: keyof typeof form, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light text-charcoal">Popup Manager</h1>
          <p className="mt-0.5 text-sm text-charcoal/40">{popups.length} popup{popups.length !== 1 ? "s" : ""} · {popups.filter(p => p.isActive).length} active</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-1.5 rounded-lg bg-charcoal px-4 py-2 text-xs font-medium text-white hover:bg-charcoal/90 transition-colors">
          <Plus className="h-3.5 w-3.5" />New Popup
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-black/5 animate-pulse" />)}
        </div>
      ) : popups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/15 bg-white py-16 text-center">
          <Zap className="mx-auto h-8 w-8 text-charcoal/20 mb-3" />
          <p className="text-sm text-charcoal/40">No popups yet</p>
          <button onClick={openCreate} className="mt-4 text-xs text-red-600 hover:underline">Create your first popup</button>
        </div>
      ) : (
        <div className="space-y-3">
          {popups.map((popup) => {
            const TriggerIcon = TRIGGER_CFG[popup.trigger].icon;
            return (
              <div key={popup.id} className="rounded-xl border border-black/8 bg-white p-4 flex items-center gap-4">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${popup.isActive ? "bg-emerald-50" : "bg-black/5"}`}>
                  <TriggerIcon className={`h-4 w-4 ${popup.isActive ? "text-emerald-600" : "text-charcoal/30"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-charcoal truncate">{popup.name}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${popup.isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-black/10 text-charcoal/40"}`}>
                      {popup.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/40 mt-0.5">
                    {TRIGGER_CFG[popup.trigger].label}
                    {popup.trigger === "onload" && popup.triggerValue > 0 && ` · ${popup.triggerValue / 1000}s delay`}
                    {popup.trigger === "scroll" && popup.triggerValue > 0 && ` · at ${popup.triggerValue}% scroll`}
                    {popup.couponCode && ` · coupon: ${popup.couponCode}`}
                    {popup.showOnce && " · once per session"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => toggleActive(popup)} title={popup.isActive ? "Deactivate" : "Activate"}
                    className="rounded-lg p-1.5 text-charcoal/40 hover:bg-black/5 hover:text-charcoal transition-colors">
                    {popup.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button onClick={() => openEdit(popup)} title="Edit popup"
                    className="rounded-lg p-1.5 text-charcoal/40 hover:bg-black/5 hover:text-charcoal transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteId(popup.id)} title="Delete popup"
                    className="rounded-lg p-1.5 text-charcoal/40 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-2xl border border-black/10 bg-white p-6 w-80 space-y-4">
            <h2 className="font-serif text-xl text-charcoal">Delete Popup?</h2>
            <p className="text-sm text-charcoal/50">This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => confirmDelete(deleteId)}
                className="flex-1 rounded-full bg-red-600 text-white py-2 text-[11px] tracking-[0.1em] uppercase hover:bg-red-700 transition-colors">
                Delete
              </button>
              <button onClick={() => setDeleteId(null)}
                className="flex-1 rounded-full border border-black/10 text-charcoal/50 py-2 text-[11px] tracking-[0.1em] uppercase hover:border-black/20 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-black/10 bg-white overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-black/6 px-6 py-4">
              <h2 className="font-serif text-xl text-charcoal">{editing ? "Edit Popup" : "New Popup"}</h2>
              <button onClick={() => setShowForm(false)} title="Close">
                <X className="h-5 w-5 text-charcoal/40" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Internal Name *</label>
                <input value={form.name} onChange={e => f("name", e.target.value)}
                  placeholder="e.g. Summer Sale Popup"
                  className="w-full rounded-xl border border-black/10 bg-black/3 px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-black/20" />
              </div>

              {/* Trigger */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Trigger</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["onload", "exit_intent", "scroll"] as const).map((t) => {
                    const cfg = TRIGGER_CFG[t];
                    const Icon = cfg.icon;
                    return (
                      <button key={t} type="button" onClick={() => f("trigger", t)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors ${form.trigger === t ? "border-charcoal bg-charcoal/5" : "border-black/10 hover:border-black/20"}`}>
                        <Icon className="h-4 w-4" />
                        <span className="text-[11px] font-medium">{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
                {form.trigger !== "exit_intent" && (
                  <div className="mt-2">
                    <label className="block text-[11px] text-charcoal/40 mb-1">
                      {form.trigger === "onload" ? "Delay (ms)" : "Scroll % threshold"}
                    </label>
                    <input type="number" value={form.triggerValue ?? 0}
                      onChange={e => f("triggerValue", Number(e.target.value))}
                      className="w-full rounded-xl border border-black/10 bg-black/3 px-4 py-2 text-sm focus:outline-none focus:border-black/20" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Title *</label>
                <input value={form.title} onChange={e => f("title", e.target.value)}
                  placeholder="e.g. Get 10% Off Your First Order"
                  className="w-full rounded-xl border border-black/10 bg-black/3 px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-black/20" />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Body Text</label>
                <textarea value={form.body ?? ""} onChange={e => f("body", e.target.value)} rows={3}
                  placeholder="Optional supporting message"
                  className="w-full rounded-xl border border-black/10 bg-black/3 px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-black/20 resize-none" />
              </div>

              {/* CTA */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Button Label</label>
                  <input value={form.ctaLabel ?? ""} onChange={e => f("ctaLabel", e.target.value)}
                    placeholder="e.g. Claim Offer"
                    className="w-full rounded-xl border border-black/10 bg-black/3 px-4 py-2.5 text-sm focus:outline-none focus:border-black/20" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Button Link</label>
                  <input value={form.ctaHref ?? ""} onChange={e => f("ctaHref", e.target.value)}
                    placeholder="/products"
                    className="w-full rounded-xl border border-black/10 bg-black/3 px-4 py-2.5 text-sm focus:outline-none focus:border-black/20" />
                </div>
              </div>

              {/* Coupon + options */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Coupon Code</label>
                  <input value={form.couponCode ?? ""} onChange={e => f("couponCode", e.target.value)}
                    placeholder="e.g. WELCOME10"
                    className="w-full rounded-xl border border-black/10 bg-black/3 px-4 py-2.5 text-sm uppercase focus:outline-none focus:border-black/20" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Background</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.bgColor ?? "#ffffff"}
                      onChange={e => f("bgColor", e.target.value)}
                      className="h-9 w-12 rounded-lg border border-black/10 cursor-pointer" />
                    <input value={form.bgColor ?? "#ffffff"} onChange={e => f("bgColor", e.target.value)}
                      className="flex-1 rounded-xl border border-black/10 bg-black/3 px-3 py-2 text-sm focus:outline-none focus:border-black/20" />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                {([
                  { key: "showOnce",  label: "Show once per session" },
                  { key: "ctaNewTab", label: "Open link in new tab" },
                  { key: "isActive",  label: "Active" },
                ] as const).map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                    <button type="button" onClick={() => f(key, !(form as any)[key])}
                      className={`relative h-5 w-9 rounded-full transition-colors ${(form as any)[key] ? "bg-emerald-500" : "bg-black/15"}`}>
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${(form as any)[key] ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                    <span className="text-xs text-charcoal/60">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-black/6 flex gap-3 px-6 py-4">
              <button onClick={saveForm} disabled={saving || !form.name || !form.title}
                className="flex-1 rounded-full bg-charcoal text-white py-2.5 text-[11px] tracking-[0.1em] uppercase disabled:opacity-30 hover:bg-charcoal/90 transition-colors">
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Popup"}
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex-1 rounded-full border border-black/10 text-charcoal/50 py-2.5 text-[11px] tracking-[0.1em] uppercase hover:border-black/20 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
