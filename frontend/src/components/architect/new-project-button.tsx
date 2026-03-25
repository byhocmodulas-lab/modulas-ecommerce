"use client";

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { projectsApi } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter } from "next/navigation";

export function NewProjectButton() {
  const { accessToken } = useAuthStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", clientName: "", clientEmail: "", notes: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken || !form.name) return;
    setSaving(true);
    try {
      await projectsApi.create(accessToken, {
        name: form.name,
        clientName: form.clientName || undefined,
        clientEmail: form.clientEmail || undefined,
        notes: form.notes || undefined,
      });
      setOpen(false);
      setForm({ name: "", clientName: "", clientEmail: "", notes: "" });
      router.refresh();
    } catch {
      // keep modal open on error
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-2.5 font-sans text-[12px] tracking-[0.1em] uppercase text-cream hover:bg-charcoal/80 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        New Project
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl text-charcoal">New Project</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-charcoal/30 hover:text-charcoal transition-colors">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/45 mb-1.5">Project Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Bandra Residence Fit-out"
                  className="w-full rounded-xl border border-black/12 px-4 py-3 font-sans text-sm text-charcoal focus:outline-none focus:border-gold/60 transition-colors"
                />
              </div>
              <div>
                <label className="block font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/45 mb-1.5">Client Name</label>
                <input
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  placeholder="e.g. Meera Iyer"
                  className="w-full rounded-xl border border-black/12 px-4 py-3 font-sans text-sm text-charcoal focus:outline-none focus:border-gold/60 transition-colors"
                />
              </div>
              <div>
                <label className="block font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/45 mb-1.5">Client Email</label>
                <input
                  type="email"
                  value={form.clientEmail}
                  onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                  placeholder="client@example.com"
                  className="w-full rounded-xl border border-black/12 px-4 py-3 font-sans text-sm text-charcoal focus:outline-none focus:border-gold/60 transition-colors"
                />
              </div>
              <div>
                <label className="block font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal/45 mb-1.5">Notes</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Brief description of scope…"
                  className="w-full rounded-xl border border-black/12 px-4 py-3 font-sans text-sm text-charcoal focus:outline-none focus:border-gold/60 transition-colors resize-none"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl border border-black/10 py-3 font-sans text-sm text-charcoal/60 hover:text-charcoal transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !form.name}
                  className="flex-1 rounded-xl bg-charcoal py-3 font-sans text-sm text-cream hover:bg-charcoal/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {saving ? "Creating…" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default NewProjectButton;
