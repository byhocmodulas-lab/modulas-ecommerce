"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin, Plus, Pencil, Trash2, Home, Building2, Check, AlertCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { addressesApi } from "@/lib/api/client";
import type { Address } from "@/lib/api/client";

type AddrType = "home" | "work" | "other";

function guessType(label: string): AddrType {
  const l = label.toLowerCase();
  if (l.includes("work") || l.includes("office") || l.includes("studio")) return "work";
  if (l.includes("home")) return "home";
  return "other";
}

const TYPE_ICON = { home: Home, work: Building2, other: MapPin };

interface FormData {
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  isDefault: boolean;
}

const EMPTY_FORM: FormData = {
  label: "", fullName: "", phone: "",
  line1: "", line2: "", city: "", state: "",
  postcode: "", country: "GB", isDefault: false,
};

function AddressCard({
  address, onEdit, onDelete, onSetDefault,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  const type = guessType(address.label);
  const Icon = TYPE_ICON[type];
  return (
    <div className={["relative rounded-2xl border bg-white p-5 transition-colors",
      address.isDefault ? "border-gold/50 ring-1 ring-gold/20" : "border-black/6 hover:border-black/12",
    ].join(" ")}>
      {address.isDefault && (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 font-sans text-[10px] tracking-[0.1em] uppercase text-gold font-medium">
          <Check className="h-3 w-3" /> Default
        </span>
      )}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-charcoal/5">
          <Icon className="h-4 w-4 text-charcoal/50" />
        </div>
        <div>
          <p className="font-sans text-sm font-medium text-charcoal">{address.label}</p>
          <p className="font-sans text-xs text-charcoal/40 capitalize">{type}</p>
        </div>
      </div>
      <div className="font-sans text-sm text-charcoal/70 space-y-0.5 leading-relaxed mb-5">
        <p className="font-medium text-charcoal">{address.fullName}</p>
        <p>{address.line1}</p>
        {address.line2 && <p>{address.line2}</p>}
        <p>{address.city}{address.state ? `, ${address.state}` : ""}</p>
        <p>{address.postcode}</p>
        <p>{address.country}</p>
        {address.phone && <p className="pt-1 text-charcoal/40">{address.phone}</p>}
      </div>
      <div className="flex items-center gap-2 pt-4 border-t border-black/5">
        {!address.isDefault && (
          <button type="button" onClick={onSetDefault}
            className="font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/40 hover:text-gold transition-colors">
            Set as default
          </button>
        )}
        <div className="ml-auto flex items-center gap-1">
          <button type="button" onClick={onEdit} aria-label="Edit address"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-charcoal/30 hover:text-charcoal hover:bg-black/5 transition-colors">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={onDelete} aria-label="Delete address"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-charcoal/30 hover:text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AddressForm({ initial, onSave, onCancel, saving }: {
  initial: FormData;
  onSave: (data: FormData) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(initial);
  const set = (key: keyof FormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const inputCls = "w-full rounded-xl border border-black/10 bg-transparent px-3.5 py-2.5 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold/60 focus:outline-none transition-colors";
  const labelCls = "block font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/40 mb-1.5";

  return (
    <div className="rounded-2xl border border-black/8 bg-white p-6 space-y-4">
      <h3 className="font-serif text-lg text-charcoal">{initial.label ? "Edit address" : "New address"}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="addr-label">Label (e.g. Home, Office)</label>
          <input id="addr-label" value={form.label} onChange={(e) => set("label", e.target.value)} placeholder="Home" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="addr-fullName">Full name</label>
          <input id="addr-fullName" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Jane Smith" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="addr-line1">Address line 1</label>
          <input id="addr-line1" value={form.line1} onChange={(e) => set("line1", e.target.value)} placeholder="14 Example Street" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="addr-line2">Address line 2 (optional)</label>
          <input id="addr-line2" value={form.line2} onChange={(e) => set("line2", e.target.value)} placeholder="Apartment, suite, etc." className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="addr-city">City</label>
          <input id="addr-city" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="London" className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="addr-state">County / State (optional)</label>
          <input id="addr-state" value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="Greater London" className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="addr-postcode">Postcode</label>
          <input id="addr-postcode" value={form.postcode} onChange={(e) => set("postcode", e.target.value)} placeholder="SW1A 1AA" className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="addr-country">Country</label>
          <select id="addr-country" value={form.country} onChange={(e) => set("country", e.target.value)} className={inputCls}>
            <option value="GB">United Kingdom</option>
            <option value="IE">Ireland</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
            <option value="NL">Netherlands</option>
            <option value="BE">Belgium</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="addr-phone">Phone (optional)</label>
          <input id="addr-phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+44 7700 900000" className={inputCls} />
        </div>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button type="button" onClick={() => onSave(form)} disabled={saving || !form.fullName || !form.line1 || !form.city || !form.postcode}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors disabled:opacity-50">
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {saving ? "Saving…" : "Save address"}
        </button>
        <button type="button" onClick={onCancel} className="font-sans text-sm text-charcoal/40 hover:text-charcoal transition-colors">Cancel</button>
      </div>
    </div>
  );
}

export default function AddressesPage() {
  const { accessToken, user } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [editing, setEditing]     = useState<Address | null>(null);
  const [adding, setAdding]       = useState(false);
  const [saving, setSaving]       = useState(false);

  const load = useCallback(() => {
    if (!accessToken) { setLoading(false); return; }
    setLoading(true); setError(null);
    addressesApi.list(accessToken)
      .then(setAddresses)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Could not load addresses"))
      .finally(() => setLoading(false));
  }, [accessToken]);

  useEffect(() => { load(); }, [load]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-black/6 bg-white py-24 text-center">
        <MapPin className="mx-auto mb-4 h-10 w-10 text-charcoal/12" />
        <p className="font-sans text-sm text-charcoal/40">Sign in to manage your addresses.</p>
      </div>
    );
  }

  async function handleSaveNew(data: FormData) {
    if (!accessToken) return;
    setSaving(true);
    try {
      const created = await addressesApi.create(accessToken, {
        label: data.label, fullName: data.fullName, phone: data.phone,
        line1: data.line1, line2: data.line2 || undefined,
        city: data.city, state: data.state || undefined,
        postcode: data.postcode, country: data.country,
        isDefault: data.isDefault || addresses.length === 0,
      });
      setAddresses((prev) => [...prev, created]);
      setAdding(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save address");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveEdit(data: FormData) {
    if (!accessToken || !editing) return;
    setSaving(true);
    try {
      const updated = await addressesApi.update(accessToken, editing.id, {
        label: data.label, fullName: data.fullName, phone: data.phone,
        line1: data.line1, line2: data.line2 || undefined,
        city: data.city, state: data.state || undefined,
        postcode: data.postcode, country: data.country,
        isDefault: data.isDefault,
      });
      setAddresses((prev) => prev.map((a) => a.id === editing.id ? (updated ?? a) : a));
      setEditing(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update address");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!accessToken || !window.confirm("Remove this address?")) return;
    try {
      await addressesApi.remove(accessToken, id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete address");
    }
  }

  async function handleSetDefault(id: string) {
    if (!accessToken) return;
    try {
      await addressesApi.update(accessToken, id, { isDefault: true });
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update default");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-sans text-sm text-charcoal/40">
          {loading ? "Loading…" : `${addresses.length} ${addresses.length === 1 ? "address" : "addresses"} saved`}
        </p>
        {!adding && !editing && (
          <button type="button" onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 font-sans text-[10px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Add address
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 font-sans text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {adding && (
        <AddressForm initial={EMPTY_FORM} onSave={handleSaveNew} onCancel={() => setAdding(false)} saving={saving} />
      )}
      {editing && (
        <AddressForm
          initial={{ label: editing.label, fullName: editing.fullName, phone: editing.phone, line1: editing.line1, line2: editing.line2 ?? "", city: editing.city, state: editing.state ?? "", postcode: editing.postcode, country: editing.country, isDefault: editing.isDefault }}
          onSave={handleSaveEdit}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => <div key={i} className="h-48 animate-pulse rounded-2xl bg-charcoal/4" />)}
        </div>
      ) : addresses.length === 0 && !adding ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-black/6 bg-white py-20 text-center">
          <MapPin className="mx-auto mb-4 h-10 w-10 text-charcoal/12" />
          <p className="font-serif text-lg text-charcoal mb-1">No addresses yet</p>
          <p className="font-sans text-sm text-charcoal/40 mb-5 max-w-xs">Save a delivery address to speed up checkout.</p>
          <button type="button" onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Add your first address
          </button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <li key={addr.id}>
              <AddressCard
                address={addr}
                onEdit={() => { setAdding(false); setEditing(addr); }}
                onDelete={() => handleDelete(addr.id)}
                onSetDefault={() => handleSetDefault(addr.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
