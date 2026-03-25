"use client";

import { useEffect, useState } from "react";
import { leadsApi, type Lead as ApiLead } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import { BarFill } from "@/components/ui/bar-fill";
import {
  Target, Phone, Mail, MessageCircle, Instagram, Globe, Users,
  ChevronDown, ChevronUp, ChevronRight, Plus, Search, Filter,
  Clock, CheckCircle2, XCircle, AlertCircle, Star, Zap,
  Calendar, ArrowRight, BarChart2, TrendingUp, Heart,
  MapPin, Building2, Briefcase, Tag,
} from "lucide-react";

type CRMTab = "lobby" | "pipeline" | "followups" | "satisfaction";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  source: string;
  product: string;
  budget: string;
  stage: Stage;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  score: number;
  notes: string;
  tags: string[];
}

type Stage = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";

// ─── Mock data ────────────────────────────────────────────────────────────────
const SOURCE_CHANNELS = [
  { id: "website",   label: "Website Form",    color: "bg-blue-100 text-blue-700 border-blue-200",   icon: Globe,      count: 48, weekly: 12 },
  { id: "instagram", label: "Instagram DM",    color: "bg-pink-100 text-pink-700 border-pink-200",   icon: Instagram,  count: 34, weekly: 9  },
  { id: "houzz",     label: "Houzz Enquiry",   color: "bg-green-100 text-green-700 border-green-200",icon: Globe,      count: 28, weekly: 7  },
  { id: "homify",    label: "Homify Lead",     color: "bg-amber-100 text-amber-700 border-amber-200",icon: Globe,      count: 19, weekly: 5  },
  { id: "referral",  label: "Referral",        color: "bg-purple-100 text-purple-700 border-purple-200",icon: Users,   count: 22, weekly: 6  },
  { id: "whatsapp",  label: "WhatsApp",        color: "bg-emerald-100 text-emerald-700 border-emerald-200",icon: MessageCircle, count: 31, weekly: 8 },
  { id: "phone",     label: "Inbound Call",    color: "bg-sky-100 text-sky-700 border-sky-200",      icon: Phone,      count: 16, weekly: 4  },
  { id: "google",    label: "Google Ads",      color: "bg-red-100 text-red-700 border-red-200",      icon: Globe,      count: 41, weekly: 10 },
  { id: "facebook",  label: "Facebook Lead Ad",color: "bg-indigo-100 text-indigo-700 border-indigo-200",icon: Globe,  count: 26, weekly: 7  },
  { id: "architect", label: "Architect Ref.",  color: "bg-stone-100 text-charcoal border-stone-300", icon: Briefcase,  count: 15, weekly: 4  },
];

const LEADS: Lead[] = [
  { id: "L001", name: "Anjali Sharma",    email: "anjali@gmail.com",      phone: "+91 98200 11234", city: "Mumbai",    source: "website",  product: "Modular Kitchen",      budget: "₹3–5L",   stage: "proposal",    assignedTo: "Priya D.", createdAt: "12 Mar",  lastContact: "15 Mar",  score: 88, notes: "Very interested. Waiting on 3D design.", tags: ["hot", "kitchen"] },
  { id: "L002", name: "Rohan Verma",      email: "rohan.v@outlook.com",   phone: "+91 97300 55678", city: "Pune",      source: "instagram",product: "Wardrobe (Walk-in)",   budget: "₹5–8L",   stage: "qualified",   assignedTo: "Neha K.", createdAt: "11 Mar",  lastContact: "14 Mar",  score: 76, notes: "Architect recommended us.", tags: ["warm","wardrobe"] },
  { id: "L003", name: "Meera Iyer",       email: "meera.iyer@yahoo.com",  phone: "+91 99000 22345", city: "Bengaluru", source: "houzz",    product: "Full Home (3BHK)",     budget: "₹12–18L", stage: "negotiation", assignedTo: "Arjun S.", createdAt: "8 Mar",   lastContact: "16 Mar",  score: 95, notes: "Budget confirmed. Closing soon.", tags: ["hot","full-home"] },
  { id: "L004", name: "Suresh Nair",      email: "suresh@nairgroup.in",   phone: "+91 98700 33456", city: "Kochi",     source: "google",   product: "Modular Kitchen",      budget: "₹2–3L",   stage: "contacted",   assignedTo: "Priya D.", createdAt: "14 Mar",  lastContact: "14 Mar",  score: 62, notes: "Price sensitive. Exploring options.", tags: ["warm","kitchen"] },
  { id: "L005", name: "Kavya Reddy",      email: "kavya.r@hcltech.com",   phone: "+91 96400 44567", city: "Hyderabad", source: "referral", product: "Bedroom Wardrobe",     budget: "₹1.5–2L", stage: "new",         assignedTo: "Unassigned",createdAt: "16 Mar", lastContact: "—",       score: 55, notes: "New lead. Not yet contacted.", tags: ["cold"] },
  { id: "L006", name: "Akash Mehta",      email: "akash.m@gmail.com",     phone: "+91 93100 55678", city: "Ahmedabad", source: "whatsapp", product: "TV Unit + Wall Panel", budget: "₹80K–1.2L",stage: "won",         assignedTo: "Neha K.", createdAt: "28 Feb",  lastContact: "12 Mar",  score: 100, notes: "Order placed. Production started.", tags: ["converted"] },
  { id: "L007", name: "Divya Krishnan",   email: "divya.k@infosys.com",   phone: "+91 87200 66789", city: "Chennai",   source: "facebook", product: "Modular Kitchen",      budget: "₹4–6L",   stage: "lost",        assignedTo: "Arjun S.", createdAt: "3 Mar",   lastContact: "10 Mar",  score: 30, notes: "Went with competitor (Spacewood).", tags: ["lost","competitor"] },
  { id: "L008", name: "Vikram Bose",      email: "vikram.b@tcs.com",      phone: "+91 99900 77890", city: "Kolkata",   source: "architect",product: "Study + Home Office",  budget: "₹2–3L",   stage: "qualified",   assignedTo: "Priya D.", createdAt: "13 Mar",  lastContact: "15 Mar",  score: 72, notes: "Referred by architect Rajesh.", tags: ["warm","architect-ref"] },
  { id: "L009", name: "Pooja Singh",      email: "pooja.s@wipro.com",     phone: "+91 98800 88901", city: "Delhi",     source: "homify",   product: "Full Kitchen + 2 Wardrobes",budget:"₹8–12L",stage: "proposal",   assignedTo: "Neha K.", createdAt: "10 Mar",  lastContact: "15 Mar",  score: 84, notes: "Proposal sent. Follow-up due today.", tags: ["hot","full-home"] },
  { id: "L010", name: "Ravi Iyer",        email: "ravi.iyer@gmail.com",   phone: "+91 95100 99012", city: "Mumbai",    source: "website",  product: "Crockery Unit",        budget: "₹60–90K", stage: "contacted",   assignedTo: "Arjun S.", createdAt: "15 Mar",  lastContact: "15 Mar",  score: 48, notes: "Sent brochure over email.", tags: ["cold"] },
];

const STAGE_CONFIG: Record<Stage, { label: string; color: string; bg: string; dot: string }> = {
  new:         { label: "New",         color: "text-charcoal/60",  bg: "bg-stone-100 border-stone-300",       dot: "bg-charcoal/30" },
  contacted:   { label: "Contacted",   color: "text-blue-700",     bg: "bg-blue-50 border-blue-200",          dot: "bg-blue-500" },
  qualified:   { label: "Qualified",   color: "text-amber-700",    bg: "bg-amber-50 border-amber-200",        dot: "bg-amber-500" },
  proposal:    { label: "Proposal",    color: "text-violet-700",   bg: "bg-violet-50 border-violet-200",      dot: "bg-violet-500" },
  negotiation: { label: "Negotiation", color: "text-orange-700",   bg: "bg-orange-50 border-orange-200",      dot: "bg-orange-500" },
  won:         { label: "Won",         color: "text-emerald-700",  bg: "bg-emerald-50 border-emerald-200",    dot: "bg-emerald-500" },
  lost:        { label: "Lost",        color: "text-red-600",      bg: "bg-red-50 border-red-200",            dot: "bg-red-400" },
};

const STAGES: Stage[] = ["new","contacted","qualified","proposal","negotiation","won","lost"];

const FOLLOWUPS = [
  { lead: "Meera Iyer",    task: "Send revised quote for 3BHK",       due: "Today",  priority: "high",   done: false },
  { lead: "Anjali Sharma", task: "Share 3D design render",            due: "Today",  priority: "high",   done: false },
  { lead: "Pooja Singh",   task: "Proposal follow-up call",           due: "Today",  priority: "high",   done: false },
  { lead: "Rohan Verma",   task: "Schedule showroom visit",           due: "Tomorrow",priority: "medium",done: false },
  { lead: "Suresh Nair",   task: "Send EMI options brochure",         due: "Tomorrow",priority: "medium",done: false },
  { lead: "Vikram Bose",   task: "Confirm measurement site visit",    due: "18 Mar", priority: "medium", done: false },
  { lead: "Ravi Iyer",     task: "WhatsApp check-in on catalogue",    due: "18 Mar", priority: "low",    done: true  },
  { lead: "Kavya Reddy",   task: "First contact call",                due: "17 Mar", priority: "high",   done: false },
];

const SATISFACTION = [
  { customer: "Akash Mehta",     city: "Ahmedabad",product: "TV Unit",    rating: 5, nps: 9,  comment: "Absolutely love the finish and the delivery was on time. The motion-sensor lighting is a great touch!", stage: "delivered" },
  { customer: "Smita Kulkarni",  city: "Mumbai",   product: "Kitchen",    rating: 5, nps: 10, comment: "Dream kitchen. Our friends can't stop asking who did it!", stage: "delivered" },
  { customer: "Harsh Agarwal",   city: "Delhi",    product: "Wardrobe",   rating: 4, nps: 8,  comment: "Great quality. Minor delay in delivery but team communicated well throughout.", stage: "delivered" },
  { customer: "Nandini Rao",     city: "Bengaluru",product: "Full Home",  rating: 5, nps: 10, comment: "End-to-end experience was seamless. The 3D design tool sold us instantly.", stage: "delivered" },
  { customer: "Tushar Desai",    city: "Pune",     product: "Study Unit", rating: 4, nps: 7,  comment: "Good product. Would like better after-sales support response time.", stage: "delivered" },
  { customer: "Lakshmi Iyer",    city: "Chennai",  product: "Kitchen",    rating: 3, nps: 6,  comment: "Some gaps in the panel alignment on delivery. Team fixed it in 3 days but caused stress.", stage: "resolved" },
];

// ─── Tab: Lobby ───────────────────────────────────────────────────────────────
function LobbyTab({ leads }: { leads: Lead[] }) {
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("all");
  const filtered = leads.filter((l) =>
    (filterSource === "all" || l.source === filterSource) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) || l.product.toLowerCase().includes(search.toLowerCase()))
  );
  const totalLeads = SOURCE_CHANNELS.reduce((a, s) => a + s.count, 0);

  return (
    <div className="space-y-6">
      {/* Source channels */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {SOURCE_CHANNELS.map((s) => {
          const Icon = s.icon;
          return (
            <button key={s.id} onClick={() => setFilterSource(filterSource === s.id ? "all" : s.id)}
              className={`rounded-xl border p-3 text-left transition-all ${filterSource === s.id ? s.color + " ring-2 ring-offset-1 ring-amber-400" : "border-black/8 bg-white hover:border-black/20"}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <p className="text-[11px] font-semibold truncate">{s.label}</p>
              </div>
              <p className="text-xl font-bold text-charcoal">{s.count}</p>
              <p className="text-[10px] text-charcoal/40">+{s.weekly} this week</p>
            </button>
          );
        })}
      </div>

      {/* Summary bar */}
      <div className="flex items-center justify-between rounded-xl border border-black/8 bg-white px-5 py-3">
        <div className="flex gap-8">
          <div><p className="text-[10px] uppercase tracking-wider text-charcoal/40">Total Leads</p><p className="text-xl font-bold text-charcoal">{totalLeads}</p></div>
          <div><p className="text-[10px] uppercase tracking-wider text-charcoal/40">This Month</p><p className="text-xl font-bold text-charcoal">340</p></div>
          <div><p className="text-[10px] uppercase tracking-wider text-charcoal/40">Conversion Rate</p><p className="text-xl font-bold text-emerald-600">21.8%</p></div>
          <div><p className="text-[10px] uppercase tracking-wider text-charcoal/40">Avg Deal Value</p><p className="text-xl font-bold text-charcoal">₹1.55L</p></div>
        </div>
      </div>

      {/* Search & table */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/30" />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search lead name or product..."
          className="w-full rounded-lg border border-black/10 bg-white py-2.5 pl-9 pr-4 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
        />
      </div>

      <div className="rounded-xl border border-black/8 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50 text-left">
                {["Lead","City","Source","Product","Budget","Stage","Score","Assigned","Last Contact"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-charcoal/40 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/4">
              {filtered.map((l) => {
                const stage = STAGE_CONFIG[l.stage];
                const src = SOURCE_CHANNELS.find((s) => s.id === l.source);
                return (
                  <tr key={l.id} className="hover:bg-stone-50/50 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-charcoal">{l.name}</p>
                      <p className="text-[10px] text-charcoal/40">{l.email}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-charcoal/60 whitespace-nowrap">{l.city}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${src?.color ?? ""}`}>
                        {src?.label ?? l.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-charcoal whitespace-nowrap">{l.product}</td>
                    <td className="px-4 py-3 text-xs font-medium text-charcoal whitespace-nowrap">{l.budget}</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium w-fit ${stage.bg} ${stage.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${stage.dot}`} />{stage.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1.5 text-xs font-bold ${l.score >= 80 ? "text-emerald-600" : l.score >= 60 ? "text-amber-600" : "text-red-400"}`}>
                        <div className="w-12 h-1.5 bg-black/5 rounded-full overflow-hidden">
                          <BarFill pct={l.score} className={`h-full rounded-full ${l.score >= 80 ? "bg-emerald-500" : l.score >= 60 ? "bg-amber-400" : "bg-red-400"}`} />
                        </div>
                        {l.score}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-charcoal/60 whitespace-nowrap">{l.assignedTo}</td>
                    <td className="px-4 py-3 text-xs text-charcoal/50 whitespace-nowrap">{l.lastContact}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Pipeline ────────────────────────────────────────────────────────────
function PipelineTab({ leads }: { leads: Lead[] }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2 text-center">
        {STAGES.map((s) => {
          const cfg = STAGE_CONFIG[s];
          const count = leads.filter((l) => l.stage === s).length;
          return (
            <div key={s} className="rounded-xl border border-black/8 bg-white p-3">
              <span className={`flex items-center justify-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold border mx-auto w-fit ${cfg.bg} ${cfg.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />{cfg.label}
              </span>
              <p className="mt-2 text-2xl font-bold text-charcoal">{count}</p>
              <p className="text-[10px] text-charcoal/40">leads</p>
            </div>
          );
        })}
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(["new","contacted","qualified","proposal"] as Stage[]).map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage);
          const cfg = STAGE_CONFIG[stage];
          return (
            <div key={stage} className="rounded-xl border border-black/8 bg-stone-50 p-3">
              <div className="flex items-center justify-between mb-3">
                <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cfg.bg} ${cfg.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />{cfg.label}
                </span>
                <span className="text-xs text-charcoal/40">{stageLeads.length}</span>
              </div>
              <div className="space-y-2">
                {stageLeads.map((l) => {
                  const src = SOURCE_CHANNELS.find((s) => s.id === l.source);
                  return (
                    <div key={l.id} className="rounded-lg border border-black/8 bg-white p-3 cursor-pointer hover:border-amber-300 transition-colors">
                      <p className="text-sm font-semibold text-charcoal">{l.name}</p>
                      <p className="text-xs text-charcoal/50 mt-0.5">{l.product}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] font-medium text-charcoal/60">{l.budget}</span>
                        <div className={`flex items-center gap-1 text-[10px] font-bold ${l.score >= 80 ? "text-emerald-600" : l.score >= 60 ? "text-amber-600" : "text-red-400"}`}>
                          <Star className="h-3 w-3" />{l.score}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${src?.color ?? ""}`}>{src?.label ?? l.source}</span>
                        <span className="text-[10px] text-charcoal/30">{l.lastContact}</span>
                      </div>
                    </div>
                  );
                })}
                {stageLeads.length === 0 && (
                  <div className="rounded-lg border border-dashed border-black/10 p-4 text-center">
                    <p className="text-xs text-charcoal/30">No leads</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Won/Lost summary */}
      <div className="grid grid-cols-2 gap-4">
        {(["won","lost"] as Stage[]).map((s) => {
          const stageWonLost = leads.filter((l) => l.stage === s);
          const cfg = STAGE_CONFIG[s];
          return (
            <div key={s} className={`rounded-xl border p-4 ${s === "won" ? "border-emerald-200 bg-emerald-50/50" : "border-red-200 bg-red-50/40"}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-semibold ${s === "won" ? "text-emerald-700" : "text-red-600"}`}>{s === "won" ? "✓ Won" : "✗ Lost"}</span>
                <span className="text-lg font-bold text-charcoal">{stageWonLost.length}</span>
              </div>
              {stageWonLost.map((l) => (
                <div key={l.id} className="flex items-center justify-between py-1 border-t border-black/6">
                  <p className="text-xs font-medium text-charcoal">{l.name}</p>
                  <p className="text-xs text-charcoal/50">{l.product}</p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab: Follow-ups ──────────────────────────────────────────────────────────
function FollowupsTab() {
  const [done, setDone] = useState<Set<number>>(new Set());
  const pending  = FOLLOWUPS.filter((f, i) => !f.done && !done.has(i));
  const completed = FOLLOWUPS.filter((f, i) => f.done || done.has(i));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-red-500">Overdue / Today</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{pending.filter((f) => f.due === "Today").length}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-amber-600">Tomorrow</p>
          <p className="text-3xl font-bold text-amber-700 mt-1">{pending.filter((f) => f.due === "Tomorrow").length}</p>
        </div>
        <div className="rounded-xl border border-black/8 bg-white p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-charcoal/40">Upcoming</p>
          <p className="text-3xl font-bold text-charcoal mt-1">{pending.filter((f) => f.due !== "Today" && f.due !== "Tomorrow").length}</p>
        </div>
      </div>

      <div className="rounded-xl border border-black/8 bg-white overflow-hidden">
        <div className="p-4 border-b border-black/6 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-charcoal">Pending Follow-ups</h3>
          <button className="flex items-center gap-1.5 rounded-lg bg-charcoal px-3 py-1.5 text-xs font-medium text-white hover:bg-charcoal/90 transition-colors">
            <Plus className="h-3.5 w-3.5" />Add Task
          </button>
        </div>
        <div className="divide-y divide-black/4">
          {pending.map((f, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3">
              <button title="Mark as done" onClick={() => setDone((d) => new Set([...d, i]))}
                className="w-5 h-5 rounded-full border-2 border-black/20 hover:border-emerald-400 hover:bg-emerald-50 transition-colors shrink-0 flex items-center justify-center" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal">{f.task}</p>
                <p className="text-xs text-charcoal/40">Re: {f.lead}</p>
              </div>
              <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
                f.due === "Today" ? "border-red-200 bg-red-50 text-red-600"
                : f.due === "Tomorrow" ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-black/8 bg-stone-50 text-charcoal/60"
              }`}>{f.due}</span>
              <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
                f.priority === "high" ? "border-orange-200 bg-orange-50 text-orange-700"
                : f.priority === "medium" ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-black/8 bg-stone-50 text-charcoal/40"
              }`}>{f.priority}</span>
            </div>
          ))}
        </div>
      </div>

      {completed.length > 0 && (
        <div className="rounded-xl border border-black/6 bg-stone-50 overflow-hidden">
          <div className="p-4 border-b border-black/6">
            <h3 className="text-sm font-semibold text-charcoal/40">Completed ({completed.length})</h3>
          </div>
          <div className="divide-y divide-black/4">
            {completed.map((f, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <p className="flex-1 text-sm text-charcoal/40 line-through">{f.task}</p>
                <span className="text-xs text-charcoal/30">{f.lead}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Satisfaction ────────────────────────────────────────────────────────
function SatisfactionTab() {
  const avgRating = (SATISFACTION.reduce((a, s) => a + s.rating, 0) / SATISFACTION.length).toFixed(1);
  const avgNPS    = Math.round(SATISFACTION.reduce((a, s) => a + s.nps, 0) / SATISFACTION.length);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-black/8 bg-white p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-charcoal/40">Avg Rating</p>
          <p className="text-3xl font-bold text-amber-500 mt-1">⭐ {avgRating}</p>
        </div>
        <div className="rounded-xl border border-black/8 bg-white p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-charcoal/40">NPS Score</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{avgNPS}</p>
        </div>
        <div className="rounded-xl border border-black/8 bg-white p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-charcoal/40">5-Star Reviews</p>
          <p className="text-3xl font-bold text-charcoal mt-1">{SATISFACTION.filter((s) => s.rating === 5).length}/{SATISFACTION.length}</p>
        </div>
        <div className="rounded-xl border border-black/8 bg-white p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-charcoal/40">Referral Rate</p>
          <p className="text-3xl font-bold text-charcoal mt-1">68%</p>
        </div>
      </div>

      {/* Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SATISFACTION.map((s) => (
          <div key={s.customer} className={`rounded-xl border p-4 ${s.rating >= 5 ? "border-emerald-200 bg-emerald-50/40" : s.rating >= 4 ? "border-black/8 bg-white" : "border-amber-200 bg-amber-50/30"}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-charcoal">{s.customer}</p>
                <p className="text-xs text-charcoal/40">{s.city} · {s.product}</p>
              </div>
              <div className="text-right">
                <p className="text-amber-500 text-sm">{"★".repeat(s.rating)}{"☆".repeat(5-s.rating)}</p>
                <p className="text-[10px] text-charcoal/40 mt-0.5">NPS {s.nps}/10</p>
              </div>
            </div>
            <p className="text-sm text-charcoal/70 italic">"{s.comment}"</p>
            <span className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${s.stage === "delivered" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
              {s.stage}
            </span>
          </div>
        ))}
      </div>

      {/* NPS Distribution */}
      <div className="rounded-xl border border-black/8 bg-white p-5">
        <h3 className="text-sm font-semibold text-charcoal mb-4">NPS Distribution</h3>
        <div className="flex gap-1 items-end h-16">
          {[0,0,0,0,0,0,1,1,2,2].map((count, score) => (
            <div key={score} className="flex-1 flex flex-col items-center gap-1">
              <BarFill vertical pct={(count / 2) * 100}
                className={`w-full rounded-t-sm ${count > 0 ? "min-h-[8px]" : ""} ${score >= 9 ? "bg-emerald-500" : score >= 7 ? "bg-amber-400" : "bg-red-400"}`} />
              <p className="text-[9px] text-charcoal/30">{score}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-6 mt-3 text-xs text-charcoal/50">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" />Detractors (0–6)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" />Passives (7–8)</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />Promoters (9–10)</span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CRMPage() {
  const { accessToken } = useAuthStore();
  const [tab, setTab] = useState<CRMTab>("lobby");
  const [leads, setLeads] = useState<Lead[]>(LEADS);

  useEffect(() => {
    if (!accessToken) return;
    leadsApi.list(accessToken, { limit: 100 })
      .then((res) => {
        if (res.data.length === 0) return; // keep demo data if no real data yet
        setLeads(res.data.map((l: ApiLead) => ({
          id: l.id,
          name: l.name,
          email: l.email,
          phone: l.phone ?? "",
          city: (l.metadata?.city as string) ?? "",
          source: l.source === "website" ? "website" : l.source,
          product: (l.metadata?.product as string) ?? "",
          budget: (l.metadata?.budget as string) ?? "",
          stage: (l.stage === "converted" ? "won" : l.stage === "closed" ? "lost" : l.stage) as Stage,
          assignedTo: l.assignedTo ?? "Unassigned",
          createdAt: new Date(l.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
          lastContact: new Date(l.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
          score: (l.metadata?.score as number) ?? 50,
          notes: l.notes ?? "",
          tags: (l.metadata?.tags as string[]) ?? [],
        })));
      })
      .catch(() => {/* keep fallback data */});
  }, [accessToken]);

  const TABS = [
    { id: "lobby" as CRMTab,        label: "Lead Lobby",        icon: <Target className="h-3.5 w-3.5" /> },
    { id: "pipeline" as CRMTab,     label: "CRM Pipeline",      icon: <ArrowRight className="h-3.5 w-3.5" /> },
    { id: "followups" as CRMTab,    label: "Follow-ups",        icon: <Clock className="h-3.5 w-3.5" /> },
    { id: "satisfaction" as CRMTab, label: "Customer Satisfaction", icon: <Heart className="h-3.5 w-3.5" /> },
  ];

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light text-charcoal">Lead Hub & CRM</h1>
          <p className="mt-1 font-sans text-sm text-charcoal/50">
            All lead sources · pipeline · follow-ups · customer satisfaction
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-charcoal px-3.5 py-2 text-xs font-medium text-white hover:bg-charcoal/90 transition-colors">
          <Plus className="h-3.5 w-3.5" />Add Lead
        </button>
      </div>

      <div className="flex gap-1 border-b border-black/8 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-sans text-sm whitespace-nowrap border-b-2 transition-colors -mb-px ${
              tab === t.id
                ? "border-red-500 text-red-600 font-medium"
                : "border-transparent text-charcoal/50 hover:text-charcoal"
            }`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {tab === "lobby"        && <LobbyTab leads={leads} />}
      {tab === "pipeline"     && <PipelineTab leads={leads} />}
      {tab === "followups"    && <FollowupsTab />}
      {tab === "satisfaction" && <SatisfactionTab />}
    </div>
  );
}
