"use client";

import { useState, useEffect } from "react";
import {
  Plus, Grip, Trash2, ChevronRight, ChevronDown,
  Globe, X, Check, ExternalLink, Pencil,
} from "lucide-react";
import { navApi, type CmsNavMenu, type NavLink } from "@/lib/api/client";
import { useAccessToken } from "@/lib/stores/auth-store";

const PRESET_MENUS = [
  { name: "main",   label: "Main Navigation" },
  { name: "footer", label: "Footer Links" },
  { name: "mobile", label: "Mobile Menu" },
];

function LinkRow({
  link,
  depth = 0,
  onEdit,
  onDelete,
}: {
  link: NavLink;
  depth?: number;
  onEdit: (link: NavLink) => void;
  onDelete: (link: NavLink) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className={`flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-black/3 group ${depth > 0 ? "ml-6" : ""}`}>
        <Grip className="h-3.5 w-3.5 text-charcoal/20 shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-charcoal">{link.label}</span>
          <span className="ml-2 text-xs text-charcoal/35">{link.href}</span>
          {link.openInNewTab && <ExternalLink className="inline ml-1.5 h-3 w-3 text-charcoal/30" />}
        </div>
        {link.children && link.children.length > 0 && (
          <button type="button" onClick={() => setOpen(!open)}
            className="text-charcoal/30 hover:text-charcoal transition-colors" title="Toggle children">
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        )}
        <button onClick={() => onEdit(link)} title="Edit link"
          className="opacity-0 group-hover:opacity-100 rounded p-1 text-charcoal/40 hover:text-charcoal transition-all">
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => onDelete(link)} title="Remove link"
          className="opacity-0 group-hover:opacity-100 rounded p-1 text-charcoal/40 hover:text-red-500 transition-all">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {open && link.children?.map((child, i) => (
        <LinkRow key={i} link={child} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

const EMPTY_LINK: NavLink = { label: "", href: "", openInNewTab: false };

export default function NavigationPage() {
  const token = useAccessToken() ?? "";
  const [menus, setMenus]           = useState<CmsNavMenu[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<CmsNavMenu | null>(null);
  const [saving, setSaving]         = useState(false);

  // Link form state
  const [linkForm, setLinkForm]     = useState<NavLink | null>(null);
  const [editTarget, setEditTarget] = useState<NavLink | null>(null);

  // New menu form
  const [newMenuForm, setNewMenuForm] = useState<{ name: string; label: string } | null>(null);

  useEffect(() => {
    if (!token) return;
    navApi.list(token)
      .then(data => {
        setMenus(data);
        if (data.length > 0) setActiveMenu(data[0]);
      })
      .catch(() => setError("Failed to load navigation menus"))
      .finally(() => setLoading(false));
  }, [token]);

  async function saveMenu(menu: CmsNavMenu) {
    setSaving(true);
    try {
      const updated = await navApi.update(token, menu.name, { items: menu.items });
      setMenus(m => m.map(x => x.name === menu.name ? updated : x));
      setActiveMenu(updated);
    } catch {
      setError("Failed to save navigation");
    } finally {
      setSaving(false);
    }
  }

  async function createMenu() {
    if (!newMenuForm?.name || !newMenuForm.label) return;
    setSaving(true);
    try {
      const created = await navApi.upsert(token, { name: newMenuForm.name, label: newMenuForm.label, items: [] });
      setMenus(m => [...m, created]);
      setActiveMenu(created);
      setNewMenuForm(null);
    } catch {
      setError("Failed to create menu");
    } finally {
      setSaving(false);
    }
  }

  async function deleteMenu(name: string) {
    try {
      await navApi.remove(token, name);
      const next = menus.filter(m => m.name !== name);
      setMenus(next);
      setActiveMenu(next[0] ?? null);
    } catch {
      setError("Failed to delete menu");
    }
  }

  function addLink() {
    setEditTarget(null);
    setLinkForm({ ...EMPTY_LINK });
  }

  function openEditLink(link: NavLink) {
    setEditTarget(link);
    setLinkForm({ ...link });
  }

  function confirmLink() {
    if (!linkForm || !activeMenu) return;
    let items = [...activeMenu.items];
    if (editTarget) {
      items = items.map(it => it === editTarget ? linkForm : it);
    } else {
      items = [...items, linkForm];
    }
    const updated = { ...activeMenu, items };
    setActiveMenu(updated);
    setMenus(m => m.map(x => x.name === activeMenu.name ? updated : x));
    setLinkForm(null);
    setEditTarget(null);
  }

  function deleteLink(link: NavLink) {
    if (!activeMenu) return;
    const items = activeMenu.items.filter(it => it !== link);
    const updated = { ...activeMenu, items };
    setActiveMenu(updated);
    setMenus(m => m.map(x => x.name === activeMenu.name ? updated : x));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light text-charcoal">Navigation Control</h1>
          <p className="mt-0.5 text-sm text-charcoal/40">Manage menus, links, and site structure</p>
        </div>
        <button onClick={() => setNewMenuForm({ name: "", label: "" })}
          className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3.5 py-2 text-xs font-medium text-charcoal/60 hover:bg-black/5 transition-colors">
          <Plus className="h-3.5 w-3.5" />New Menu
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar — menu list */}
        <div className="w-48 shrink-0 space-y-1">
          <p className="px-2 text-[10px] uppercase tracking-[0.15em] text-charcoal/30 mb-2">Menus</p>
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-8 rounded-lg bg-black/5 animate-pulse" />)
          ) : menus.length === 0 ? (
            <p className="text-xs text-charcoal/30 px-2">No menus yet</p>
          ) : (
            menus.map(menu => (
              <button key={menu.name} onClick={() => setActiveMenu(menu)}
                className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeMenu?.name === menu.name
                    ? "bg-charcoal text-white"
                    : "text-charcoal/60 hover:bg-black/5"
                }`}>
                {menu.label}
              </button>
            ))
          )}

          {/* Preset helpers */}
          {PRESET_MENUS.filter(p => !menus.find(m => m.name === p.name)).length > 0 && (
            <>
              <p className="px-2 pt-4 text-[10px] uppercase tracking-[0.15em] text-charcoal/20">Quick add</p>
              {PRESET_MENUS
                .filter(p => !menus.find(m => m.name === p.name))
                .map(p => (
                  <button key={p.name}
                    onClick={async () => {
                      const created = await navApi.upsert(token, { name: p.name, label: p.label, items: [] });
                      setMenus(m => [...m, created]);
                      setActiveMenu(created);
                    }}
                    className="w-full text-left rounded-lg px-3 py-2 text-xs text-charcoal/35 hover:bg-black/5 transition-colors border border-dashed border-black/10">
                    + {p.label}
                  </button>
                ))}
            </>
          )}
        </div>

        {/* Main editor */}
        <div className="flex-1 min-w-0">
          {!activeMenu ? (
            <div className="rounded-xl border border-dashed border-black/15 bg-white py-16 text-center">
              <Globe className="mx-auto h-8 w-8 text-charcoal/20 mb-3" />
              <p className="text-sm text-charcoal/40">Select or create a menu to start editing</p>
            </div>
          ) : (
            <div className="rounded-xl border border-black/8 bg-white overflow-hidden">
              <div className="flex items-center justify-between border-b border-black/6 px-5 py-3.5">
                <div>
                  <p className="text-sm font-semibold text-charcoal">{activeMenu.label}</p>
                  <p className="text-[11px] text-charcoal/35">/{activeMenu.name} · {activeMenu.items.length} links</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => deleteMenu(activeMenu.name)}
                    className="rounded-lg p-1.5 text-charcoal/30 hover:bg-red-50 hover:text-red-500 transition-colors" title="Delete menu">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button onClick={addLink}
                    className="flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-charcoal/60 hover:bg-black/5 transition-colors">
                    <Plus className="h-3.5 w-3.5" />Add Link
                  </button>
                  <button onClick={() => saveMenu(activeMenu)} disabled={saving}
                    className="flex items-center gap-1.5 rounded-lg bg-charcoal px-3 py-1.5 text-xs font-medium text-white hover:bg-charcoal/90 disabled:opacity-50 transition-colors">
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>

              <div className="p-3 min-h-[200px]">
                {activeMenu.items.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-charcoal/30">No links yet</p>
                    <button onClick={addLink} className="mt-2 text-xs text-red-600 hover:underline">Add your first link</button>
                  </div>
                ) : (
                  activeMenu.items.map((link, i) => (
                    <LinkRow key={i} link={link} onEdit={openEditLink} onDelete={deleteLink} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New menu modal */}
      {newMenuForm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-2xl border border-black/10 bg-white p-6 w-80 space-y-4">
            <h2 className="font-serif text-xl text-charcoal">New Menu</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Menu Key *</label>
                <input value={newMenuForm.name} onChange={e => setNewMenuForm(f => f && { ...f, name: e.target.value.toLowerCase().replace(/\s/g, "-") })}
                  placeholder="e.g. main"
                  className="w-full rounded-xl border border-black/10 bg-black/3 px-4 py-2.5 text-sm focus:outline-none focus:border-black/20" />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Display Label *</label>
                <input value={newMenuForm.label} onChange={e => setNewMenuForm(f => f && { ...f, label: e.target.value })}
                  placeholder="e.g. Main Navigation"
                  className="w-full rounded-xl border border-black/10 bg-black/3 px-4 py-2.5 text-sm focus:outline-none focus:border-black/20" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={createMenu} disabled={saving || !newMenuForm.name || !newMenuForm.label}
                className="flex-1 rounded-full bg-charcoal text-white py-2 text-[11px] tracking-[0.1em] uppercase disabled:opacity-30 hover:bg-charcoal/90 transition-colors">
                Create
              </button>
              <button onClick={() => setNewMenuForm(null)}
                className="flex-1 rounded-full border border-black/10 text-charcoal/50 py-2 text-[11px] tracking-[0.1em] uppercase hover:border-black/20 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / edit link modal */}
      {linkForm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-2xl border border-black/10 bg-white p-6 w-80 space-y-4">
            <h2 className="font-serif text-xl text-charcoal">{editTarget ? "Edit Link" : "Add Link"}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Label *</label>
                <input value={linkForm.label} onChange={e => setLinkForm(f => f && { ...f, label: e.target.value })}
                  placeholder="e.g. Collections"
                  className="w-full rounded-xl border border-black/10 bg-black/3 px-4 py-2.5 text-sm focus:outline-none focus:border-black/20" />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">URL / Path *</label>
                <input value={linkForm.href} onChange={e => setLinkForm(f => f && { ...f, href: e.target.value })}
                  placeholder="e.g. /collections"
                  className="w-full rounded-xl border border-black/10 bg-black/3 px-4 py-2.5 text-sm focus:outline-none focus:border-black/20" />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <button type="button"
                  onClick={() => setLinkForm(f => f && { ...f, openInNewTab: !f.openInNewTab })}
                  className={`relative h-5 w-9 rounded-full transition-colors ${linkForm.openInNewTab ? "bg-emerald-500" : "bg-black/15"}`}>
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${linkForm.openInNewTab ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
                <span className="text-sm text-charcoal/60">Open in new tab</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button onClick={confirmLink} disabled={!linkForm.label || !linkForm.href}
                className="flex-1 rounded-full bg-charcoal text-white py-2 text-[11px] tracking-[0.1em] uppercase disabled:opacity-30 hover:bg-charcoal/90 transition-colors">
                {editTarget ? "Save" : "Add"}
              </button>
              <button onClick={() => { setLinkForm(null); setEditTarget(null); }}
                className="flex-1 rounded-full border border-black/10 text-charcoal/50 py-2 text-[11px] tracking-[0.1em] uppercase hover:border-black/20 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
