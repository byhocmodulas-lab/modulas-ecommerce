"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Edit2, Trash2, ChevronRight, Loader2, X,
  CheckCircle2, AlertCircle, FolderOpen, Folder,
} from "lucide-react";
import { useAccessToken } from "@/lib/stores/auth-store";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

// ── Types ────────────────────────────────────────────────────────
interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  imageUrl?: string;
  parent?: { id: string; name: string } | null;
  children?: Category[];
}

interface CatForm {
  name: string;
  slug: string;
  sortOrder: string;
  imageUrl: string;
  parentId: string;
}

const BLANK: CatForm = { name: "", slug: "", sortOrder: "0", imageUrl: "", parentId: "" };

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 shadow-lg font-sans text-sm text-white ${ok ? "bg-emerald-600" : "bg-red-500"}`}>
      {ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {msg}
    </div>
  );
}

const inp = "w-full rounded-lg border border-black/10 bg-white px-3 py-2 font-sans text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 placeholder:text-charcoal/30";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-sans text-xs font-medium uppercase tracking-wider text-charcoal/60">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}

// ── Category row ─────────────────────────────────────────────────
function CategoryRow({
  cat,
  allFlat,
  depth,
  token,
  onEdit,
  onDelete,
}: {
  cat: Category;
  allFlat: Category[];
  depth: number;
  token: string;
  onEdit: (c: Category) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(depth === 0);
  const hasChildren = (cat.children?.length ?? 0) > 0;

  return (
    <>
      <tr className="border-b border-black/5 bg-white hover:bg-black/1 transition-colors">
        <td className="px-4 py-3">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 20}px` }}>
            {hasChildren ? (
              <button onClick={() => setExpanded(e => !e)}
                className="flex h-5 w-5 items-center justify-center rounded text-charcoal/30 hover:text-charcoal/60 transition-colors flex-shrink-0">
                <ChevronRight className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
              </button>
            ) : (
              <span className="h-5 w-5 flex-shrink-0" />
            )}
            {hasChildren
              ? <FolderOpen className="h-4 w-4 text-gold flex-shrink-0" />
              : <Folder className="h-4 w-4 text-charcoal/30 flex-shrink-0" />
            }
            <span className="font-sans text-sm font-medium text-charcoal">{cat.name}</span>
          </div>
        </td>
        <td className="px-4 py-3 font-mono text-xs text-charcoal/50">{cat.slug}</td>
        <td className="px-4 py-3 font-sans text-sm text-charcoal/50">{cat.parent?.name ?? "—"}</td>
        <td className="px-4 py-3 font-sans text-sm text-charcoal/50">{cat.sortOrder}</td>
        <td className="px-4 py-3 font-sans text-sm text-charcoal/50">{cat.children?.length ?? 0}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(cat)}
              className="flex h-7 w-7 items-center justify-center rounded text-charcoal/30 hover:bg-black/5 hover:text-charcoal/70 transition-colors" title="Edit">
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => onDelete(cat.id)}
              className="flex h-7 w-7 items-center justify-center rounded text-red-300 hover:bg-red-50 hover:text-red-500 transition-colors" title="Delete">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </td>
      </tr>
      {expanded && hasChildren && cat.children!.map(child => (
        <CategoryRow key={child.id} cat={child} allFlat={allFlat} depth={depth + 1}
          token={token} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </>
  );
}

// ── Main page ────────────────────────────────────────────────────
export default function CatalogCategoriesPage() {
  const token = useAccessToken();

  const [tree,    setTree]    = useState<Category[]>([]);
  const [allFlat, setAllFlat] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState<{ msg: string; ok: boolean } | null>(null);

  const [modal,   setModal]   = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form,    setForm]    = useState<CatForm>(BLANK);
  const [saving,  setSaving]  = useState(false);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [treeRes, flatRes] = await Promise.all([
        fetch(`${API}/catalog/categories/tree`),
        fetch(`${API}/catalog/categories/flat`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (treeRes.ok) setTree(await treeRes.json());
      if (flatRes.ok) setAllFlat(await flatRes.json());
    } catch {}
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  // ── Form helpers ─────────────────────────────────────────────
  const set = (k: keyof CatForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm(f => {
        const updated = { ...f, [k]: e.target.value };
        if (k === "name" && !editing) updated.slug = slugify(e.target.value);
        return updated;
      });
    };

  function openCreate() {
    setEditing(null);
    setForm(BLANK);
    setModal("create");
  }

  function openEdit(c: Category) {
    setEditing(c);
    setForm({
      name:      c.name,
      slug:      c.slug,
      sortOrder: String(c.sortOrder),
      imageUrl:  c.imageUrl ?? "",
      parentId:  c.parent?.id ?? "",
    });
    setModal("edit");
  }

  async function handleSave() {
    if (!form.name || !form.slug) return;
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name:      form.name,
        slug:      form.slug,
        sortOrder: Number(form.sortOrder),
        imageUrl:  form.imageUrl || undefined,
        parentId:  form.parentId || undefined,
      };

      const url    = editing ? `${API}/catalog/categories/${editing.id}` : `${API}/catalog/categories`;
      const method = editing ? "PATCH" : "POST";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err.message ?? "Save failed");
      }
      showToast(editing ? "Category updated" : "Category created");
      setModal(null);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Save failed", false);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? Products in it will lose their category assignment.")) return;
    try {
      const r = await fetch(`${API}/catalog/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok && r.status !== 204) throw new Error();
      showToast("Category deleted");
      load();
    } catch { showToast("Delete failed", false); }
  }

  const topLevelCats = allFlat.filter(c => !c.parent);

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Categories</h1>
          <p className="mt-0.5 font-sans text-sm text-charcoal/50">{allFlat.length} categories total</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-charcoal px-4 py-2 font-sans text-sm text-cream hover:bg-charcoal/80 transition-colors">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {/* Tree table */}
      <div className="overflow-hidden rounded-2xl border border-black/8">
        <table className="w-full">
          <thead className="border-b border-black/8 bg-black/2">
            <tr>
              {["Name", "Slug", "Parent", "Sort", "Subcategories", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-sans text-[11px] font-semibold uppercase tracking-wider text-charcoal/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-16 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-charcoal/30" />
              </td></tr>
            ) : tree.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center font-sans text-sm text-charcoal/40">
                No categories yet
              </td></tr>
            ) : tree.map(cat => (
              <CategoryRow key={cat.id} cat={cat} allFlat={allFlat} depth={0}
                token={token ?? ""} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Modal ────────────────────────────────────────────── */}
      {(modal === "create" || modal === "edit") && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/8 px-6 py-4">
              <h2 className="font-serif text-xl text-charcoal">
                {modal === "create" ? "New Category" : "Edit Category"}
              </h2>
              <button onClick={() => setModal(null)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/5">
                <X className="h-4 w-4 text-charcoal/50" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <Field label="Name" required>
                <input value={form.name} onChange={set("name")} placeholder="e.g. Sofas & Seating" className={inp} autoFocus />
              </Field>
              <Field label="Slug" required>
                <input value={form.slug} onChange={set("slug")} placeholder="e.g. sofas-seating" className={inp} />
              </Field>
              <Field label="Parent category (leave blank for top-level)">
                <select value={form.parentId} onChange={set("parentId")} className={inp}>
                  <option value="">— Top-level category —</option>
                  {topLevelCats
                    .filter(c => !editing || c.id !== editing.id)
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Sort order">
                  <input value={form.sortOrder} onChange={set("sortOrder")} type="number" min="0" className={inp} />
                </Field>
                <Field label="Image URL">
                  <input value={form.imageUrl} onChange={set("imageUrl")} placeholder="https://…" className={inp} />
                </Field>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-black/8 px-6 py-4">
              <button onClick={() => setModal(null)} className="rounded-xl border border-black/10 px-4 py-2 font-sans text-sm text-charcoal/60 hover:bg-black/5">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.slug}
                className="flex items-center gap-2 rounded-xl bg-charcoal px-5 py-2 font-sans text-sm text-cream hover:bg-charcoal/80 disabled:opacity-50">
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {modal === "create" ? "Create" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
