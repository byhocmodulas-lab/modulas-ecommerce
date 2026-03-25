"use client";

import { useEffect, useState } from "react";
import { Search, Building2, Megaphone, Handshake, CheckCircle, XCircle, Info } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { applicationsApi, type Application } from "@/lib/api/client";

type CollabType = "vendor" | "creator" | "corporate";
type CollabStatus = "pending" | "approved" | "rejected" | "info_requested";

interface Collaboration {
  id: string;
  type: CollabType;
  name: string;
  contact: string;
  email: string;
  description: string;
  status: CollabStatus;
  submittedAt: string;
  details?: Record<string, string>;
}

const COLLABORATIONS: Collaboration[] = [
  {
    id: "c1", type: "vendor", name: "Rajhans Laminates Pvt Ltd", contact: "Sunil Rajhans", email: "sunil@rajhanslam.com",
    description: "Premium laminate and acrylic panel manufacturer based in Gujarat. Supplying 200+ SKUs.", status: "pending", submittedAt: "2026-03-14",
    details: { "GST Number": "24ABCDE1234F1Z5", "Annual Turnover": "₹8 Crore", "Certifications": "ISO 9001:2015", "Delivery Coverage": "Pan India" },
  },
  {
    id: "c2", type: "creator", name: "@homewithsneha", contact: "Sneha Kulkarni", email: "sneha@gmail.com",
    description: "Home décor influencer. 340K followers on Instagram, 120K on YouTube. Specialises in Indian interior makeovers.", status: "pending", submittedAt: "2026-03-13",
    details: { "Instagram": "340K followers", "YouTube": "120K subscribers", "Avg. Engagement": "4.8%", "Niche": "Home Décor / Interiors" },
  },
  {
    id: "c3", type: "corporate", name: "Godrej Properties Ltd", contact: "Vivek Sharma", email: "vivek@godrejproperties.com",
    description: "Partnership for furnishing new residential projects. Interested in modular kitchen & wardrobe packages for 800 units.", status: "info_requested", submittedAt: "2026-03-10",
    details: { "Project Scale": "800 units", "Locations": "Mumbai, Pune, Bengaluru", "Timeline": "Q3 2026", "Budget Per Unit": "₹3–5 Lakhs" },
  },
  {
    id: "c4", type: "vendor", name: "Kalpataru Hardware", contact: "Ravi Kalpataru", email: "ravi@kalpataruhdw.com",
    description: "Hettich and Blum distributor for Maharashtra. Supplying soft-close hinges, drawer systems, lift systems.", status: "approved", submittedAt: "2026-03-05",
    details: { "Brand": "Hettich / Blum", "Territory": "Maharashtra", "GST": "27XYZAB5678C1D2", "Lead Time": "3–5 days" },
  },
  {
    id: "c5", type: "creator", name: "@designwithriya", contact: "Riya Desai", email: "riya@gmail.com",
    description: "Interior design creator. 180K Instagram followers. Content focus: wardrobe tours, kitchen reveals, small space hacks.", status: "approved", submittedAt: "2026-03-01",
    details: { "Instagram": "180K followers", "Avg. Engagement": "6.2%", "Niche": "Wardrobe & Kitchen", "Rate Card": "Shared" },
  },
  {
    id: "c6", type: "vendor", name: "Sheetal Glass Works", contact: "Sheetal Mehta", email: "sheetal@sheetalglassworks.in",
    description: "Lacquered and frosted glass panel manufacturer. Applications: shutter fronts, partitions, wardrobe inserts.", status: "rejected", submittedAt: "2026-02-28",
    details: { "Rejection Reason": "MOQ too high for current volume", "MOQ": "500 sq ft per order" },
  },
];

const TYPE_CFG: Record<CollabType, { label: string; icon: React.ElementType; cls: string }> = {
  vendor:    { label: "Vendor",    icon: Building2,  cls: "text-orange-700 bg-orange-50 border-orange-200" },
  creator:   { label: "Creator",   icon: Megaphone,  cls: "text-pink-700 bg-pink-50 border-pink-200" },
  corporate: { label: "Corporate", icon: Handshake,  cls: "text-sky-700 bg-sky-50 border-sky-200" },
};

const STATUS_CFG: Record<CollabStatus, { label: string; cls: string }> = {
  pending:        { label: "Pending",        cls: "text-amber-700 bg-amber-50 border-amber-200" },
  approved:       { label: "Approved",       cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  rejected:       { label: "Rejected",       cls: "text-red-600 bg-red-50 border-red-200" },
  info_requested: { label: "Info Requested", cls: "text-purple-700 bg-purple-50 border-purple-200" },
};

export default function CollaborationsPage() {
  const { accessToken } = useAuthStore();
  const [items, setItems]         = useState(COLLABORATIONS);
  const [typeFilter, setTypeFilter] = useState<CollabType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<CollabStatus | "all">("all");

  useEffect(() => {
    if (!accessToken) return;
    Promise.all([
      applicationsApi.list(accessToken, { type: 'vendor', limit: 100 }),
      applicationsApi.list(accessToken, { type: 'creator', limit: 100 }),
    ]).then(([vendorRes, creatorRes]) => {
      const combined = [...vendorRes.data, ...creatorRes.data];
      if (combined.length === 0) return;
      setItems(combined.map((a: Application) => ({
        id: a.id,
        type: a.type as CollabType,
        name: (a.payload?.companyName as string) ?? a.name,
        contact: a.name,
        email: a.email,
        description: (a.payload?.description as string) ?? "",
        status: (a.status === "reviewing" ? "pending" : a.status) as CollabStatus,
        submittedAt: a.createdAt.slice(0, 10),
        details: a.payload as Record<string, string> | undefined,
      })));
    }).catch(() => {});
  }, [accessToken]);
  const [search, setSearch]       = useState("");
  const [expanded, setExpanded]   = useState<string | null>(null);

  const filtered = items.filter((c) => {
    const matchType   = typeFilter === "all" || c.type === typeFilter;
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !search || c.name.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q);
    return matchType && matchStatus && matchSearch;
  });

  const update = (id: string, status: CollabStatus) => {
    if (accessToken) {
      const apiStatus = status === "approved" ? "approved" : status === "rejected" ? "rejected" : "reviewing";
      applicationsApi.review(accessToken, id, { status: apiStatus as "approved" | "rejected" | "reviewing" }).catch(() => {});
    }
    setItems((p) => p.map((c) => c.id === id ? { ...c, status } : c));
  };

  const pendingCount = items.filter((c) => c.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-charcoal">Collaborations</h1>
        <p className="font-sans text-sm text-charcoal/35 mt-0.5">{items.length} applications · {pendingCount} pending review</p>
      </div>

      {/* Type summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {(["vendor", "creator", "corporate"] as const).map((t) => {
          const cfg = TYPE_CFG[t];
          const Icon = cfg.icon;
          const count = items.filter((c) => c.type === t).length;
          const pending = items.filter((c) => c.type === t && c.status === "pending").length;
          return (
            <button key={t} type="button" onClick={() => setTypeFilter(typeFilter === t ? "all" : t)}
              className={`rounded-2xl border p-5 text-left transition-colors ${typeFilter === t ? "border-black/12 bg-black/5" : "border-black/6 bg-white hover:bg-black/4"}`}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className="h-4 w-4 text-charcoal/40" />
                <span className="font-sans text-xs text-charcoal/40 uppercase tracking-[0.1em]">{cfg.label}s</span>
              </div>
              <p className="font-serif text-2xl text-charcoal">{count}</p>
              {pending > 0 && <p className="font-sans text-[11px] text-amber-600 mt-0.5">{pending} pending</p>}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/25" />
          <input type="text" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-black/10 bg-black/4 py-2.5 pl-9 pr-4 font-sans text-sm text-charcoal/80 placeholder:text-charcoal/25 focus:border-black/20 focus:outline-none transition-colors w-56" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "pending", "info_requested", "approved", "rejected"] as const).map((s) => (
            <button key={s} type="button" onClick={() => setStatusFilter(s)}
              className={["rounded-full px-3.5 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors border",
                statusFilter === s ? "bg-black/6 text-charcoal border-black/15" : "border-black/8 text-charcoal/40 hover:text-charcoal/60",
              ].join(" ")}>{s === "info_requested" ? "Info Requested" : s}</button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map((collab) => {
          const typeCfg   = TYPE_CFG[collab.type];
          const statusCfg = STATUS_CFG[collab.status];
          const TypeIcon  = typeCfg.icon;
          const isOpen    = expanded === collab.id;

          return (
            <div key={collab.id} className="rounded-2xl border border-black/6 bg-white overflow-hidden">
              <div className="flex flex-wrap items-start gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-sans text-[10px] uppercase tracking-[0.08em] ${typeCfg.cls}`}>
                      <TypeIcon className="h-3 w-3" />{typeCfg.label}
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 font-sans text-[10px] uppercase tracking-[0.08em] ${statusCfg.cls}`}>{statusCfg.label}</span>
                  </div>
                  <p className="font-sans text-sm font-medium text-charcoal/80">{collab.name}</p>
                  <p className="font-sans text-xs text-charcoal/35">{collab.contact} · {collab.email}</p>
                  <p className="font-sans text-xs text-charcoal/45 mt-1 leading-relaxed">{collab.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="font-sans text-[11px] text-charcoal/25">{new Date(collab.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  <button type="button" onClick={() => setExpanded(isOpen ? null : collab.id)}
                    className="font-sans text-[11px] text-charcoal/40 hover:text-charcoal transition-colors">
                    {isOpen ? "Less" : "Details"}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-black/6 px-5 py-4 bg-black/2 space-y-4">
                  {collab.details && (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                      {Object.entries(collab.details).map(([k, v]) => (
                        <div key={k}>
                          <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-charcoal/25">{k}</p>
                          <p className="font-sans text-sm text-charcoal/60">{v}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {collab.status === "pending" && (
                    <div className="flex gap-2 pt-2">
                      <button type="button" onClick={() => update(collab.id, "approved")}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.1em] text-emerald-700 hover:bg-emerald-100 transition-colors">
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button type="button" onClick={() => update(collab.id, "info_requested")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.1em] text-purple-700 hover:bg-purple-50 transition-colors">
                        <Info className="h-3.5 w-3.5" /> Request Info
                      </button>
                      <button type="button" onClick={() => update(collab.id, "rejected")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.1em] text-red-600 hover:bg-red-50 transition-colors">
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  )}
                  {collab.status === "info_requested" && (
                    <div className="flex gap-2 pt-2">
                      <button type="button" onClick={() => update(collab.id, "approved")}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.1em] text-emerald-700 hover:bg-emerald-100 transition-colors">
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button type="button" onClick={() => update(collab.id, "rejected")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.1em] text-red-600 hover:bg-red-50 transition-colors">
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-black/6 py-16 text-center font-sans text-sm text-charcoal/25">No collaborations found</div>
        )}
      </div>
    </div>
  );
}
