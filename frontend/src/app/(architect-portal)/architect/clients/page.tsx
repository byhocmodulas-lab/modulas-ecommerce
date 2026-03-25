"use client";

import { useState } from "react";
import { Users, Plus, Search, Mail, Phone, Building2, ChevronDown, FolderKanban } from "lucide-react";

interface Client {
  id: string;
  fullName: string;
  company?: string;
  email: string;
  phone?: string;
  projectCount: number;
  totalSpend: number;
  since: string;
  notes?: string;
}

const MOCK_CLIENTS: Client[] = [
  { id: "c1", fullName: "Helena Marsh", company: "Marsh & Partners Interior Design", email: "helena@marshpartners.co.uk", phone: "+44 20 7946 0923", projectCount: 3, totalSpend: 48600, since: "2024-04-01", notes: "Prefers phone calls. Specialises in high-end residential in Chelsea and Kensington." },
  { id: "c2", fullName: "Oliver Vance", company: "Vance Architecture", email: "o.vance@vance-arch.com", phone: "+44 20 7946 0181", projectCount: 5, totalSpend: 92300, since: "2023-09-15", notes: "Requires detailed CAD drawings for every piece. Very detail-oriented." },
  { id: "c3", fullName: "Priya Anand", email: "priya.anand@gmail.com", phone: "+44 7700 900456", projectCount: 1, totalSpend: 8200, since: "2025-01-10" },
  { id: "c4", fullName: "Studio Noir", company: "Studio Noir Ltd", email: "studio@studionoir.co.uk", projectCount: 2, totalSpend: 24100, since: "2024-10-20", notes: "Always requests samples before committing. Fast decision-maker once confirmed." },
  { id: "c5", fullName: "Tom Llewellyn", company: "Llewellyn Build", email: "tom@llewellynbuild.com", phone: "+44 7700 900789", projectCount: 4, totalSpend: 67800, since: "2024-02-28" },
];

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
}

export default function ArchitectClientsPage() {
  const [clients, setClients]   = useState(MOCK_CLIENTS);
  const [search, setSearch]     = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [adding, setAdding]     = useState(false);
  const [form, setForm]         = useState({ fullName: "", company: "", email: "", phone: "", notes: "" });
  const [saving, setSaving]     = useState(false);

  const filtered = clients.filter((c) =>
    !search ||
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    (c.company ?? "").toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd() {
    if (!form.fullName || !form.email) return;
    setSaving(true);
    setTimeout(() => {
      setClients((prev) => [
        ...prev,
        { id: Date.now().toString(), ...form, projectCount: 0, totalSpend: 0, since: new Date().toISOString().split("T")[0] },
      ]);
      setForm({ fullName: "", company: "", email: "", phone: "", notes: "" });
      setAdding(false);
      setSaving(false);
    }, 600);
  }

  const inputCls = "w-full rounded-xl border border-black/10 bg-transparent px-3.5 py-2.5 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold/60 focus:outline-none transition-colors";
  const labelCls = "block font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/40 mb-1.5";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Clients</h1>
          <p className="font-sans text-sm text-charcoal/40 mt-0.5">
            {clients.length} contacts · {clients.reduce((s, c) => s + c.projectCount, 0)} projects
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add client
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="rounded-2xl border border-black/8 bg-white p-6 space-y-4">
          <h2 className="font-serif text-lg text-charcoal">New client</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cl-fullName" className={labelCls}>Full name *</label>
              <input id="cl-fullName" type="text" className={inputCls} placeholder="Helena Marsh" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="cl-company" className={labelCls}>Company (optional)</label>
              <input id="cl-company" type="text" className={inputCls} placeholder="Marsh & Partners" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="cl-email" className={labelCls}>Email *</label>
              <input id="cl-email" type="email" className={inputCls} placeholder="helena@example.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="cl-phone" className={labelCls}>Phone (optional)</label>
              <input id="cl-phone" type="tel" className={inputCls} placeholder="+44 7700 900000" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="cl-notes" className={labelCls}>Notes (optional)</label>
              <textarea id="cl-notes" rows={2} className={inputCls} placeholder="Any context about this client…" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={handleAdd} disabled={saving || !form.fullName || !form.email} className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors disabled:opacity-50">
              {saving ? "Saving…" : "Save client"}
            </button>
            <button type="button" onClick={() => setAdding(false)} className="font-sans text-sm text-charcoal/40 hover:text-charcoal transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/30" />
        <input
          type="text"
          placeholder="Search clients…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-9 pr-4 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold/60 focus:outline-none transition-colors"
        />
      </div>

      {/* Client list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-black/6 bg-white py-20 text-center">
          <Users className="mx-auto mb-3 h-10 w-10 text-charcoal/12" />
          <p className="font-sans text-sm text-charcoal/40">No clients found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((client) => {
            const isExpanded = expanded === client.id;
            return (
              <div key={client.id} className="rounded-2xl border border-black/6 bg-white overflow-hidden">
                <div className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 font-serif text-sm text-gold">
                    {initials(client.fullName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-medium text-charcoal">{client.fullName}</p>
                    {client.company && (
                      <p className="font-sans text-xs text-charcoal/40 flex items-center gap-1">
                        <Building2 className="h-3 w-3" /> {client.company}
                      </p>
                    )}
                    <p className="font-sans text-xs text-charcoal/40">{client.email}</p>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="hidden sm:block text-right">
                      <p className="font-sans text-sm font-medium text-charcoal">{client.projectCount}</p>
                      <p className="font-sans text-[10px] text-charcoal/35">projects</p>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="font-sans text-sm font-medium text-charcoal">{formatPrice(client.totalSpend)}</p>
                      <p className="font-sans text-[10px] text-charcoal/35">total spend</p>
                    </div>
                    <button type="button" aria-label={isExpanded ? "Collapse client" : "Expand client"} onClick={() => setExpanded(isExpanded ? null : client.id)} className="rounded-lg p-1.5 text-charcoal/30 hover:text-charcoal transition-colors">
                      <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-black/5 px-5 py-4 bg-black/1 space-y-3">
                    <div className="flex flex-wrap gap-4 text-sm">
                      {client.phone && (
                        <a href={`tel:${client.phone}`} className="flex items-center gap-1.5 text-charcoal/50 hover:text-gold transition-colors font-sans text-xs">
                          <Phone className="h-3.5 w-3.5" /> {client.phone}
                        </a>
                      )}
                      <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 text-charcoal/50 hover:text-gold transition-colors font-sans text-xs">
                        <Mail className="h-3.5 w-3.5" /> {client.email}
                      </a>
                    </div>
                    {client.notes && <p className="font-sans text-sm text-charcoal/60 leading-relaxed">{client.notes}</p>}
                    <div className="flex gap-2 pt-1">
                      <a href={`/architect/projects?client=${client.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-1.5 font-sans text-[11px] uppercase tracking-[0.08em] text-charcoal/50 hover:border-gold hover:text-gold transition-colors">
                        <FolderKanban className="h-3.5 w-3.5" /> View projects
                      </a>
                      <a href={`/architect/quotes?client=${client.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-1.5 font-sans text-[11px] uppercase tracking-[0.08em] text-charcoal/50 hover:border-gold hover:text-gold transition-colors">
                        View quotes
                      </a>
                    </div>
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
