"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Search, Edit2, Trash2, Eye, EyeOff, Star, StarOff,
  Loader2, X, ChevronLeft, ChevronRight, Tag, Package,
  ImageIcon, CheckCircle2, AlertCircle, ToggleLeft, ToggleRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useAccessToken } from "@/lib/stores/auth-store";
import { formatPrice } from "@/lib/utils/format";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

// ── Types ────────────────────────────────────────────────────────
interface Category { id: string; name: string; slug: string; }
interface ProductImage { id: string; url: string; altText: string; isPrimary: boolean; sortOrder: number; }
interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  brand?: string;
  material?: string;
  stockQty: number;
  leadTimeDays: number;
  isActive: boolean;
  isFeatured: boolean;
  isConfigurable: boolean;
  seoTitle?: string;
  seoDescription?: string;
  finishOptions: string[];
  tags: string[];
  category?: Category;
  images?: ProductImage[];
  createdAt: string;
}

interface ProductForm {
  name: string;
  sku: string;
  slug: string;
  description: string;
  categoryId: string;
  price: string;
  compareAtPrice: string;
  currency: string;
  brand: string;
  material: string;
  stockQty: string;
  leadTimeDays: string;
  isActive: boolean;
  isFeatured: boolean;
  isConfigurable: boolean;
  seoTitle: string;
  seoDescription: string;
  finishOptions: string;
  tags: string;
}

const BLANK: ProductForm = {
  name: "", sku: "", slug: "", description: "", categoryId: "",
  price: "", compareAtPrice: "", currency: "INR", brand: "Modulas",
  material: "", stockQty: "10", leadTimeDays: "21",
  isActive: true, isFeatured: false, isConfigurable: true,
  seoTitle: "", seoDescription: "", finishOptions: "", tags: "",
};

// ── Helpers ──────────────────────────────────────────────────────
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

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-sans text-xs font-medium text-charcoal/60 uppercase tracking-wider">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}

const inp = "w-full rounded-lg border border-black/10 bg-white px-3 py-2 font-sans text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/20 placeholder:text-charcoal/30";
const ta  = `${inp} resize-none`;

// ── Main page ────────────────────────────────────────────────────
export default function CatalogProductsPage() {
  const token = useAccessToken();

  const [products,   setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [catFilter,  setCatFilter]  = useState("");
  const [toast,      setToast]      = useState<{ msg: string; ok: boolean } | null>(null);

  const [modal,      setModal]      = useState<"create" | "edit" | "images" | null>(null);
  const [editing,    setEditing]    = useState<Product | null>(null);
  const [form,       setForm]       = useState<ProductForm>(BLANK);
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState<string | null>(null);
  const [toggling,   setToggling]   = useState<string | null>(null);

  const LIMIT = 20;

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const loadCategories = useCallback(async () => {
    try {
      const r = await fetch(`${API}/catalog/categories/flat`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.ok) setCategories(await r.json());
    } catch {}
  }, [token]);

  const loadProducts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
      if (search)    params.set("q",        search);
      if (catFilter) params.set("category", catFilter);
      const r = await fetch(`${API}/products?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.ok) {
        const data = await r.json();
        setProducts(data.products ?? []);
        setTotal(data.total ?? 0);
      }
    } catch {}
    setLoading(false);
  }, [token, page, search, catFilter]);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { loadProducts(); },  [loadProducts]);

  // ── Form helpers ─────────────────────────────────────────────
  const set = (k: keyof ProductForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const val = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
      setForm(f => {
        const updated = { ...f, [k]: val };
        if (k === "name" && !editing) updated.slug = slugify(e.target.value as string);
        return updated;
      });
    };

  function openCreate() {
    setEditing(null);
    setForm(BLANK);
    setModal("create");
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name, sku: p.sku, slug: p.slug,
      description: p.description ?? "",
      categoryId: p.category?.id ?? "",
      price: String(p.price),
      compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : "",
      currency: p.currency ?? "INR",
      brand: p.brand ?? "",
      material: p.material ?? "",
      stockQty: String(p.stockQty),
      leadTimeDays: String(p.leadTimeDays),
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      isConfigurable: p.isConfigurable,
      seoTitle: p.seoTitle ?? "",
      seoDescription: p.seoDescription ?? "",
      finishOptions: (p.finishOptions ?? []).join(", "),
      tags: (p.tags ?? []).join(", "),
    });
    setModal("edit");
  }

  async function handleSave() {
    if (!form.name || !form.sku || !form.price) return;
    setSaving(true);
    try {
      const body = {
        name:           form.name,
        sku:            form.sku,
        slug:           form.slug || slugify(form.name),
        description:    form.description || undefined,
        categoryId:     form.categoryId || undefined,
        price:          Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        currency:       form.currency,
        brand:          form.brand || undefined,
        material:       form.material || undefined,
        stockQty:       Number(form.stockQty),
        leadTimeDays:   Number(form.leadTimeDays),
        isActive:       form.isActive,
        isFeatured:     form.isFeatured,
        isConfigurable: form.isConfigurable,
        seoTitle:       form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
        finishOptions:  form.finishOptions ? form.finishOptions.split(",").map(s => s.trim()).filter(Boolean) : [],
        tags:           form.tags ? form.tags.split(",").map(s => s.trim()).filter(Boolean) : [],
      };

      const url    = editing ? `${API}/products/${editing.id}` : `${API}/products`;
      const method = editing ? "PATCH" : "POST";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error(await r.text());
      showToast(editing ? "Product updated" : "Product created");
      setModal(null);
      loadProducts();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Save failed", false);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const r = await fetch(`${API}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok && r.status !== 204) throw new Error();
      showToast("Product deleted");
      loadProducts();
    } catch { showToast("Delete failed", false); }
    setDeleting(null);
  }

  async function toggleField(p: Product, field: "isActive" | "isFeatured") {
    setToggling(p.id + field);
    try {
      const r = await fetch(`${API}/products/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ [field]: !p[field] }),
      });
      if (!r.ok) throw new Error();
      showToast(field === "isActive"
        ? `Product ${p.isActive ? "deactivated" : "activated"}`
        : `Product ${p.isFeatured ? "unfeatured" : "featured"}`);
      loadProducts();
    } catch { showToast("Update failed", false); }
    setToggling(null);
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Products</h1>
          <p className="mt-0.5 font-sans text-sm text-charcoal/50">{total} products in catalog</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-charcoal px-4 py-2 font-sans text-sm text-cream hover:bg-charcoal/80 transition-colors">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/30" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products…"
            className="w-full rounded-xl border border-black/10 bg-white pl-9 pr-4 py-2 font-sans text-sm text-charcoal focus:border-gold focus:outline-none" />
        </div>
        <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 font-sans text-sm text-charcoal focus:border-gold focus:outline-none">
          <option value="">All categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-black/8">
        <table className="w-full min-w-[720px]">
          <thead className="border-b border-black/8 bg-black/2">
            <tr>
              {["Product", "SKU", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-sans text-[11px] font-semibold uppercase tracking-wider text-charcoal/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {loading ? (
              <tr><td colSpan={7} className="py-16 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-charcoal/30" />
              </td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} className="py-16 text-center font-sans text-sm text-charcoal/40">
                No products found
              </td></tr>
            ) : products.map(p => (
              <tr key={p.id} className="bg-white hover:bg-black/1 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.images?.[0]?.url ? (
                      <img src={p.images[0].url} alt="" className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="h-4 w-4 text-charcoal/20" />
                      </div>
                    )}
                    <div>
                      <p className="font-sans text-sm font-medium text-charcoal line-clamp-1">{p.name}</p>
                      <p className="font-sans text-[11px] text-charcoal/40">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-charcoal/50">{p.sku}</td>
                <td className="px-4 py-3 font-sans text-sm text-charcoal/60">{p.category?.name ?? "—"}</td>
                <td className="px-4 py-3 font-sans text-sm text-charcoal">{formatPrice(p.price)}</td>
                <td className="px-4 py-3 font-sans text-sm text-charcoal">{p.stockQty}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => toggleField(p, "isActive")} disabled={toggling === p.id + "isActive"}
                      title={p.isActive ? "Deactivate" : "Activate"}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-sans text-[10px] font-medium transition-colors ${p.isActive ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-stone-50 text-stone-500 hover:bg-stone-100"}`}>
                      {p.isActive ? <ToggleRight className="h-3 w-3" /> : <ToggleLeft className="h-3 w-3" />}
                      {p.isActive ? "Active" : "Inactive"}
                    </button>
                    <button onClick={() => toggleField(p, "isFeatured")} disabled={toggling === p.id + "isFeatured"}
                      title={p.isFeatured ? "Unfeature" : "Feature"}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-sans text-[10px] font-medium transition-colors ${p.isFeatured ? "bg-gold/10 text-gold hover:bg-gold/20" : "bg-stone-50 text-stone-400 hover:bg-stone-100"}`}>
                      {p.isFeatured ? <Star className="h-3 w-3 fill-gold" /> : <StarOff className="h-3 w-3" />}
                      {p.isFeatured ? "Featured" : "Normal"}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Link href={`/product/${p.slug}`} target="_blank"
                      className="flex h-7 w-7 items-center justify-center rounded text-charcoal/30 hover:bg-black/5 hover:text-charcoal/70 transition-colors" title="View on site">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                    <button onClick={() => openEdit(p)}
                      className="flex h-7 w-7 items-center justify-center rounded text-charcoal/30 hover:bg-black/5 hover:text-charcoal/70 transition-colors" title="Edit">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                      className="flex h-7 w-7 items-center justify-center rounded text-red-300 hover:bg-red-50 hover:text-red-500 transition-colors" title="Delete">
                      {deleting === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between font-sans text-sm text-charcoal/50">
          <span>Page {page} of {totalPages} · {total} products</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 hover:bg-black/5 disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 hover:bg-black/5 disabled:opacity-40">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Create / Edit Modal ──────────────────────────────── */}
      {(modal === "create" || modal === "edit") && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/30 px-4 py-8">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-black/8 px-6 py-4">
              <h2 className="font-serif text-xl text-charcoal">
                {modal === "create" ? "Add Product" : "Edit Product"}
              </h2>
              <button onClick={() => setModal(null)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/5">
                <X className="h-4 w-4 text-charcoal/50" />
              </button>
            </div>

            {/* Form */}
            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-5">

              {/* Row: Name + SKU */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Product name" required>
                  <input value={form.name} onChange={set("name")} placeholder="e.g. Oslo 3-Seater Sofa" className={inp} />
                </Field>
                <Field label="SKU" required>
                  <input value={form.sku} onChange={set("sku")} placeholder="e.g. SOF-001" className={inp} />
                </Field>
              </div>

              {/* Slug */}
              <Field label="URL slug">
                <input value={form.slug} onChange={set("slug")} placeholder="auto-generated from name" className={inp} />
              </Field>

              {/* Category */}
              <Field label="Category">
                <select value={form.categoryId} onChange={set("categoryId")} className={inp}>
                  <option value="">— No category —</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>

              {/* Price row */}
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Price (₹)" required>
                  <input value={form.price} onChange={set("price")} type="number" min="0" placeholder="0" className={inp} />
                </Field>
                <Field label="Compare-at price (₹)">
                  <input value={form.compareAtPrice} onChange={set("compareAtPrice")} type="number" min="0" placeholder="Optional" className={inp} />
                </Field>
                <Field label="Currency">
                  <select value={form.currency} onChange={set("currency")} className={inp}>
                    <option>INR</option><option>USD</option><option>GBP</option><option>AED</option>
                  </select>
                </Field>
              </div>

              {/* Brand + Material */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Brand">
                  <input value={form.brand} onChange={set("brand")} placeholder="Modulas" className={inp} />
                </Field>
                <Field label="Material">
                  <input value={form.material} onChange={set("material")} placeholder="e.g. Solid Teak" className={inp} />
                </Field>
              </div>

              {/* Stock + Lead time */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Stock qty">
                  <input value={form.stockQty} onChange={set("stockQty")} type="number" min="0" className={inp} />
                </Field>
                <Field label="Lead time (days)">
                  <input value={form.leadTimeDays} onChange={set("leadTimeDays")} type="number" min="0" className={inp} />
                </Field>
              </div>

              {/* Description */}
              <Field label="Description">
                <textarea value={form.description} onChange={set("description")} rows={3} placeholder="Short product description…" className={ta} />
              </Field>

              {/* Finish options + Tags */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Finish options (comma-separated)">
                  <input value={form.finishOptions} onChange={set("finishOptions")} placeholder="Teak, Walnut, White Oak" className={inp} />
                </Field>
                <Field label="Tags (comma-separated)">
                  <input value={form.tags} onChange={set("tags")} placeholder="sofa, living-room, modern" className={inp} />
                </Field>
              </div>

              {/* SEO */}
              <Field label="SEO title">
                <input value={form.seoTitle} onChange={set("seoTitle")} placeholder="Leave blank to use product name" className={inp} />
              </Field>
              <Field label="SEO description">
                <textarea value={form.seoDescription} onChange={set("seoDescription")} rows={2} className={ta} />
              </Field>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-1">
                {(["isActive", "isFeatured", "isConfigurable"] as const).map(field => (
                  <label key={field} className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={form[field] as boolean} onChange={set(field)}
                      className="h-4 w-4 accent-charcoal" />
                    <span className="font-sans text-sm text-charcoal/70">
                      {field === "isActive" ? "Active (visible on site)" : field === "isFeatured" ? "Featured (homepage)" : "Configurable (3D/variants)"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-black/8 px-6 py-4">
              <button onClick={() => setModal(null)} className="rounded-xl border border-black/10 px-4 py-2 font-sans text-sm text-charcoal/60 hover:bg-black/5">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.sku || !form.price}
                className="flex items-center gap-2 rounded-xl bg-charcoal px-5 py-2 font-sans text-sm text-cream hover:bg-charcoal/80 disabled:opacity-50">
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {modal === "create" ? "Create Product" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
