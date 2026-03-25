"use client";

import { useEffect, useState } from "react";
import { Search, CheckCircle, XCircle, Info, Package, MapPin, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { applicationsApi, type Application } from "@/lib/api/client";

type VendorStatus = "pending" | "approved" | "info_requested" | "rejected";
type VendorCategory = "laminates" | "hardware" | "glass" | "appliances" | "lighting" | "fabric" | "stone";

interface Vendor {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  category: VendorCategory;
  status: VendorStatus;
  submittedAt: string;
  gst: string;
  turnover: string;
  description: string;
  catalogueUrl?: string;
}

const VENDORS: Vendor[] = [
  { id: "v1", companyName: "Rajhans Laminates Pvt Ltd", contactName: "Sunil Rajhans", email: "sunil@rajhanslam.com", phone: "+91 98700 11223", city: "Ahmedabad", category: "laminates", status: "pending", submittedAt: "2026-03-14", gst: "24ABCDE1234F1Z5", turnover: "₹8 Crore", description: "Premium laminate and acrylic panel manufacturer. 200+ SKUs across textures and finishes.", catalogueUrl: "#" },
  { id: "v2", companyName: "Kalpataru Hardware", contactName: "Ravi Kalpataru", email: "ravi@kalpataruhdw.com", phone: "+91 87600 22334", city: "Pune", category: "hardware", status: "approved", submittedAt: "2026-03-05", gst: "27XYZAB5678C1D2", turnover: "₹5 Crore", description: "Hettich and Blum authorised distributor for Maharashtra. Soft-close hinges, drawer systems, lift systems." },
  { id: "v3", companyName: "Sheetal Glass Works", contactName: "Sheetal Mehta", email: "sheetal@sheetalglassworks.in", phone: "+91 76500 33445", city: "Surat", category: "glass", status: "rejected", submittedAt: "2026-02-28", gst: "24PQRST9012G2H6", turnover: "₹3 Crore", description: "Lacquered and frosted glass panel manufacturer. MOQ per order 500 sq ft." },
  { id: "v4", companyName: "Bright Appliances India", contactName: "Manish Kumar", email: "manish@brightappliances.in", phone: "+91 65400 44556", city: "Delhi", category: "appliances", status: "info_requested", submittedAt: "2026-03-10", gst: "07UVWXY3456J3K7", turnover: "₹25 Crore", description: "Wholesale distributor for Bosch, Siemens, and Faber kitchen appliances." },
  { id: "v5", companyName: "Lumina Lighting Co", contactName: "Priya Nair", email: "priya@luminalighting.in", phone: "+91 54300 55667", city: "Chennai", category: "lighting", status: "pending", submittedAt: "2026-03-13", gst: "33BCDEF6789L4M8", turnover: "₹2 Crore", description: "LED under-cabinet and interior accent lighting. Custom colour temperature solutions." },
  { id: "v6", companyName: "Marbles of India", contactName: "Ajay Sharma", email: "ajay@marblesofindia.com", phone: "+91 43200 66778", city: "Jaipur", category: "stone", status: "approved", submittedAt: "2026-02-15", gst: "08GHIJK0123M5N9", turnover: "₹15 Crore", description: "Natural stone — marble, granite, and quartzite — for countertops, backsplash, and flooring." },
];

const CATEGORY_LABELS: Record<VendorCategory, string> = {
  laminates:  "Laminates",
  hardware:   "Hardware",
  glass:      "Glass",
  appliances: "Appliances",
  lighting:   "Lighting",
  fabric:     "Fabric",
  stone:      "Stone / Marble",
};

const STATUS_CFG: Record<VendorStatus, { label: string; cls: string }> = {
  pending:        { label: "Pending",        cls: "text-amber-700 bg-amber-50 border-amber-200" },
  approved:       { label: "Approved",       cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  info_requested: { label: "Info Requested", cls: "text-purple-700 bg-purple-50 border-purple-200" },
  rejected:       { label: "Rejected",       cls: "text-red-600 bg-red-50 border-red-200" },
};

export default function VendorsPage() {
  const { accessToken } = useAuthStore();
  const [vendors, setVendors]           = useState(VENDORS);
  const [loadingData, setLoadingData]   = useState(true);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState<VendorStatus | "all">("all");
  const [expanded, setExpanded]         = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) { setLoadingData(false); return; }
    applicationsApi.list(accessToken, { type: 'vendor', limit: 100 })
      .then((res) => {
        if (res.data.length === 0) return;
        setVendors(res.data.map((a: Application) => ({
          id: a.id,
          companyName: (a.payload?.companyName as string) ?? a.name,
          contactName: a.name,
          email: a.email,
          phone: a.phone ?? "",
          city: (a.payload?.city as string) ?? "",
          category: ((a.payload?.category as VendorCategory) ?? "laminates"),
          status: (a.status === "reviewing" ? "pending" : a.status === "approved" ? "approved" : a.status === "rejected" ? "rejected" : "pending") as VendorStatus,
          submittedAt: a.createdAt.slice(0, 10),
          gst: (a.payload?.gst as string) ?? "",
          turnover: (a.payload?.turnover as string) ?? "",
          description: (a.payload?.description as string) ?? "",
          catalogueUrl: (a.payload?.catalogueUrl as string) ?? undefined,
        })));
      })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, [accessToken]);

  const filtered = vendors.filter((v) => {
    const matchStatus = statusFilter === "all" || v.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !search || v.companyName.toLowerCase().includes(q) || v.contactName.toLowerCase().includes(q) || v.city.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const update = (id: string, status: VendorStatus) => {
    const apiStatus = status === "approved" ? "approved" : status === "rejected" ? "rejected" : "pending";
    if (accessToken) {
      applicationsApi.review(accessToken, id, { status: apiStatus as "approved" | "rejected" | "pending" }).catch(() => {});
    }
    setVendors((p) => p.map((v) => v.id === id ? { ...v, status } : v));
  };

  const pendingCount  = vendors.filter((v) => v.status === "pending").length;
  const approvedCount = vendors.filter((v) => v.status === "approved").length;

  if (loadingData) {
    return <div className="flex items-center justify-center py-32"><Loader2 className="h-6 w-6 animate-spin text-charcoal/30" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-charcoal">Vendor Applications</h1>
        <p className="font-sans text-sm text-charcoal/35 mt-0.5">{vendors.length} total · {pendingCount} pending · {approvedCount} approved</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Vendors",    value: vendors.length,  colour: "text-charcoal" },
          { label: "Pending Review",   value: pendingCount,    colour: "text-amber-600" },
          { label: "Active Partners",  value: approvedCount,   colour: "text-emerald-600" },
        ].map(({ label, value, colour }) => (
          <div key={label} className="rounded-2xl border border-black/6 bg-white p-5">
            <p className={`font-serif text-3xl ${colour}`}>{value}</p>
            <p className="font-sans text-xs text-charcoal/35 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/25" />
          <input type="text" placeholder="Search vendors…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-black/10 bg-black/4 py-2.5 pl-9 pr-4 font-sans text-sm text-charcoal/80 placeholder:text-charcoal/25 focus:border-black/20 focus:outline-none transition-colors w-64" />
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

      <div className="space-y-3">
        {filtered.map((vendor) => {
          const st     = STATUS_CFG[vendor.status];
          const isOpen = expanded === vendor.id;
          return (
            <div key={vendor.id} className="rounded-2xl border border-black/6 bg-white overflow-hidden">
              <div className="flex flex-wrap items-start gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="rounded-full border border-black/10 px-2.5 py-0.5 font-sans text-[10px] uppercase tracking-[0.08em] text-charcoal/40">
                      <Package className="h-3 w-3 inline mr-1" />{CATEGORY_LABELS[vendor.category]}
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 font-sans text-[10px] uppercase tracking-[0.08em] ${st.cls}`}>{st.label}</span>
                  </div>
                  <p className="font-sans text-sm font-medium text-charcoal/80">{vendor.companyName}</p>
                  <p className="font-sans text-xs text-charcoal/35">{vendor.contactName} · {vendor.email}</p>
                  <p className="font-sans text-xs text-charcoal/30 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{vendor.city} · GST: {vendor.gst}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="font-sans text-[11px] text-charcoal/25">{new Date(vendor.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  <p className="font-sans text-xs text-charcoal/40">Turnover: {vendor.turnover}</p>
                  <button type="button" onClick={() => setExpanded(isOpen ? null : vendor.id)}
                    className="font-sans text-[11px] text-charcoal/40 hover:text-charcoal transition-colors">
                    {isOpen ? "Less" : "Details"}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-black/6 px-5 py-4 bg-black/2 space-y-4">
                  <p className="font-sans text-sm text-charcoal/50 leading-relaxed">{vendor.description}</p>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Contact", value: vendor.phone },
                      { label: "City",    value: vendor.city },
                      { label: "Turnover", value: vendor.turnover },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-charcoal/25">{label}</p>
                        <p className="font-sans text-sm text-charcoal/60">{value}</p>
                      </div>
                    ))}
                  </div>
                  {vendor.status === "pending" && (
                    <div className="flex gap-2 pt-2">
                      <button type="button" onClick={() => update(vendor.id, "approved")}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.1em] text-emerald-700 hover:bg-emerald-100 transition-colors">
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button type="button" onClick={() => update(vendor.id, "info_requested")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.1em] text-purple-700 hover:bg-purple-50 transition-colors">
                        <Info className="h-3.5 w-3.5" /> Request Info
                      </button>
                      <button type="button" onClick={() => update(vendor.id, "rejected")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.1em] text-red-600 hover:bg-red-50 transition-colors">
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  )}
                  {vendor.status === "info_requested" && (
                    <div className="flex gap-2 pt-2">
                      <button type="button" onClick={() => update(vendor.id, "approved")}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.1em] text-emerald-700 hover:bg-emerald-100 transition-colors">
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button type="button" onClick={() => update(vendor.id, "rejected")}
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
          <div className="rounded-2xl border border-black/6 py-16 text-center font-sans text-sm text-charcoal/25">No vendors found</div>
        )}
      </div>
    </div>
  );
}
