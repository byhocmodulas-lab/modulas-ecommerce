"use client";

import { useEffect, useState, useCallback, type ChangeEvent, type FormEvent } from "react";
import {
  Plus, Search, Package, Edit2, Eye, ToggleLeft, ToggleRight, X,
  Image as ImageIcon, Layers, AlertCircle, RefreshCw,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { useAuthStore } from "@/lib/stores/auth-store";
import { productsApi } from "@/lib/api/client";
import Link from "next/link";

interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category?: { name: string };
  price: number;
  currency: string;
  is_active?: boolean;
  is_configurable: boolean;
  lead_time_days: number;
  images: Array<{ url: string; is_primary: boolean }>;
  material?: string;
}

interface SearchResult { products: Product[]; total: number }

// ── New Product Modal ─────────────────────────────────────────
const INPUT = "w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold/60 focus:outline-none transition-colors";
const LABEL = "block mb-1.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/50";

function NewProductModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { accessToken } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const [form, setForm]     = useState({
    name: "", sku: "", price: "", material: "", description: "",
    lead_time_days: "21", currency: "GBP",
  });

  function field(key: keyof typeof form) {
    return {
      id: key,
      value: form[key],
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f: typeof form) => ({ ...f, [key]: e.target.value })),
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setSaving(true); setError("");
    try {
      await productsApi.create(accessToken, {
        ...form,
        price: parseFloat(form.price),
        lead_time_days: parseInt(form.lead_time_days),
        finish_options: [],
        is_configurable: false,
        tags: [],
      });
      onCreated();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/5 sticky top-0 bg-white">
          <h2 className="font-serif text-xl text-charcoal">Add product</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-charcoal/30 hover:text-charcoal hover:bg-black/5 transition-colors">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL} htmlFor="name">Product name *</label>
              <input required placeholder="e.g. Haru Modular Sofa" className={INPUT} {...field("name")} />
            </div>
            <div>
              <label className={LABEL} htmlFor="sku">SKU *</label>
              <input required placeholder="e.g. MOD-SOFA-001" className={INPUT} {...field("sku")} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL} htmlFor="price">Price (GBP) *</label>
              <input required type="number" min="0" step="0.01" placeholder="2500" className={INPUT} {...field("price")} />
            </div>
            <div>
              <label className={LABEL} htmlFor="lead_time_days">Lead time (days)</label>
              <input type="number" min="1" className={INPUT} {...field("lead_time_days")} />
            </div>
          </div>
          <div>
            <label className={LABEL} htmlFor="material">Material</label>
            <input placeholder="e.g. Solid oak, Merino wool" className={INPUT} {...field("material")} />
          </div>
          <div>
            <label className={LABEL} htmlFor="description">Description</label>
            <textarea rows={3} placeholder="Product description…" className={INPUT + " resize-none"} {...field("description")} />
          </div>
          {error && <p className="font-sans text-sm text-red-500">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 h-11 rounded-full bg-gold font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors disabled:opacity-50"
            >
              {saving ? "Creating…" : "Create product"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-6 rounded-full border border-black/10 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/60 hover:border-charcoal/30 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function AdminCatalogPage() {
  const { accessToken } = useAuthStore();
  const [products, setProducts]   = useState<Product[]>([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toggling, setToggling]   = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    const params: Record<string, string> = { page: String(page), limit: "20" };
    if (search) params.q = search;
    productsApi.search(params)
      .then((res) => {
        const r = res as SearchResult;
        setProducts(r.products ?? []);
        setTotal(r.total ?? 0);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load products"))
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetch(); }, [fetch]);

  async function handleToggleActive(product: Product) {
    if (!accessToken) return;
    setToggling(product.id);
    try {
      await productsApi.update(accessToken, product.id, { is_active: !product.is_active });
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, is_active: !p.is_active } : p));
    } catch { /* ignore */ }
    finally { setToggling(null); }
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      {showModal && (
        <NewProductModal onClose={() => setShowModal(false)} onCreated={fetch} />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Catalog</h1>
          <p className="font-sans text-sm text-charcoal/40 mt-0.5">{total} products</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/30" />
        <input
          type="search"
          placeholder="Search by name, SKU, material…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-9 pr-4 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold/60 focus:outline-none transition-colors"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />
            <p className="font-sans text-sm text-charcoal/60 mb-4">{error}</p>
            <button type="button" onClick={fetch}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-2 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/60 hover:border-charcoal/30 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          </div>
        ) : loading ? (
          <div className="p-4 space-y-2">
            {[1,2,3,4,5,6,7].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-charcoal/4" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="mx-auto mb-3 h-10 w-10 text-charcoal/12" />
            <p className="font-sans text-sm text-charcoal/40 mb-4">
              {search ? `No products match "${search}"` : "No products yet"}
            </p>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add first product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-sans text-sm min-w-[900px]">
              <thead className="border-b border-black/5">
                <tr>
                  {["Product", "SKU", "Category", "Price", "Lead time", "Status", ""].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase text-charcoal/35 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const thumb = product.images.find((i) => i.is_primary)?.url ?? product.images[0]?.url;
                  return (
                    <tr key={product.id} className="border-b border-black/3 last:border-0 hover:bg-black/1 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {/* Thumbnail */}
                          <div className="h-11 w-11 shrink-0 rounded-lg overflow-hidden bg-cream">
                            {thumb ? (
                              <img src={thumb} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ImageIcon className="h-4 w-4 text-charcoal/20" />
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/products/${product.slug}`}
                              target="_blank"
                              className="font-medium text-charcoal hover:text-gold transition-colors"
                            >
                              {product.name}
                            </Link>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {product.is_configurable && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] text-gold/70">
                                  <Layers className="h-2.5 w-2.5" /> Configurable
                                </span>
                              )}
                              {product.material && (
                                <span className="text-[10px] text-charcoal/30">{product.material}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-charcoal/40">{product.sku}</td>
                      <td className="px-5 py-3.5 text-charcoal/60">{product.category?.name ?? "—"}</td>
                      <td className="px-5 py-3.5 font-medium text-charcoal whitespace-nowrap">
                        {formatPrice(product.price, product.currency)}
                      </td>
                      <td className="px-5 py-3.5 text-charcoal/50 whitespace-nowrap">
                        {product.lead_time_days}–{product.lead_time_days + 7}d
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          disabled={toggling === product.id}
                          onClick={() => handleToggleActive(product)}
                          className="flex items-center gap-1.5 font-sans text-[11px] transition-colors disabled:opacity-40"
                        >
                          {product.is_active !== false ? (
                            <><ToggleRight className="h-5 w-5 text-emerald-500" /><span className="text-emerald-600">Live</span></>
                          ) : (
                            <><ToggleLeft className="h-5 w-5 text-charcoal/30" /><span className="text-charcoal/40">Draft</span></>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="rounded-lg p-1.5 text-charcoal/30 hover:text-charcoal transition-colors"
                            title="View on store"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            className="rounded-lg p-1.5 text-charcoal/30 hover:text-gold transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="rounded-full border border-black/10 px-5 py-2 font-sans text-[11px] uppercase text-charcoal/60 disabled:opacity-30 hover:border-gold hover:text-gold transition-colors">
            Previous
          </button>
          <span className="font-sans text-sm text-charcoal/40">{page} / {totalPages}</span>
          <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="rounded-full border border-black/10 px-5 py-2 font-sans text-[11px] uppercase text-charcoal/60 disabled:opacity-30 hover:border-gold hover:text-gold transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
