"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { analyticsApi } from "@/lib/api/client";
import {
  TrendingUp, TrendingDown, Users, Eye, Heart, Share2,
  Target, Calendar, Download, ArrowUpRight, ArrowDownRight,
  FileText, Zap, CheckCircle2, Clock, BarChart2,
  Instagram, Facebook, Linkedin, Twitter, Globe,
} from "lucide-react";

type Period = "daily" | "weekly" | "monthly";

// ─── Mock data ────────────────────────────────────────────────────────────────
const DAILY_DATA = {
  date: "Monday, 16 Mar 2026",
  reach: 48200,      reachDelta: 12.4,
  leads: 14,         leadsDelta: 40,
  engagement: "4.8%",engagementDelta: 0.6,
  conversions: 3,    conversionsDelta: -1,
  posts: [
    { title: "Wardrobe Reveal — Andheri Client",  platform: "Instagram", reach: 22400, likes: 1820, comments: 147, shares: 89, type: "Reel" },
    { title: "Kitchen Tip: The Pull-Out Revolution", platform: "Facebook", reach: 14300, likes: 610, comments: 58, shares: 34, type: "Post" },
    { title: "Design Insight: Small Space Wardrobes", platform: "LinkedIn", reach: 8100, likes: 340, comments: 82, shares: 61, type: "Article" },
    { title: "Behind the Glass Door Story",         platform: "Instagram", reach: 3400, likes: 210, comments: 28, shares: 0, type: "Story" },
  ],
  platforms: [
    { id: "Instagram", reach: 22400, leads: 8,  color: "bg-pink-500" },
    { id: "Facebook",  reach: 14300, leads: 3,  color: "bg-blue-500" },
    { id: "LinkedIn",  reach: 8100,  leads: 2,  color: "bg-sky-600"  },
    { id: "Houzz",     reach: 3400,  leads: 1,  color: "bg-green-500"},
  ],
};

const WEEKLY_DATA = {
  period: "10 Mar – 16 Mar 2026",
  reach: 312000,     reachDelta: 18.2,
  leads: 87,         leadsDelta: 22.5,
  engagement: "4.3%",engagementDelta: 0.4,
  conversions: 19,   conversionsDelta: 5,
  posts: [
    { title: "Full Kitchen Reveal — Bandra Project",    platform: "Instagram", reach: 94200, likes: 7830, comments: 612, shares: 420, type: "Reel" },
    { title: "Competitor: We Do It Better",             platform: "Twitter",   reach: 48100, likes: 2140, comments: 287, shares: 180, type: "Thread" },
    { title: "5 Reasons Modulas > Off-the-shelf",       platform: "Instagram", reach: 38400, likes: 3200, comments: 390, shares: 240, type: "Carousel" },
    { title: "Client Testimonial — Priya & Rahul",     platform: "Facebook",  reach: 31800, likes: 1410, comments: 180, shares: 95,  type: "Video" },
    { title: "Architect Partnership Programme Launch",  platform: "LinkedIn",  reach: 28600, likes: 1820, comments: 310, shares: 290, type: "Post" },
    { title: "Material: The Art of Grain Matching",    platform: "Houzz",     reach: 22000, likes: 920,  comments: 148, shares: 77,  type: "Post" },
    { title: "Studio Behind-the-Scenes",               platform: "Instagram", reach: 14900, likes: 880,  comments: 84,  shares: 0,   type: "Story" },
  ],
  platforms: [
    { id: "Instagram", reach: 146800, leads: 38, color: "bg-pink-500" },
    { id: "Facebook",  reach: 62400,  leads: 20, color: "bg-blue-500" },
    { id: "LinkedIn",  reach: 48200,  leads: 16, color: "bg-sky-600"  },
    { id: "Houzz",     reach: 34600,  leads: 9,  color: "bg-green-500"},
    { id: "Twitter",   reach: 20000,  leads: 4,  color: "bg-charcoal" },
  ],
};

const MONTHLY_DATA = {
  period: "March 2026",
  reach: 1240000,    reachDelta: 23.8,
  leads: 340,        leadsDelta: 31.2,
  engagement: "4.6%",engagementDelta: 0.8,
  conversions: 74,   conversionsDelta: 18,
  posts: [
    { title: "Spring Collection Launch Campaign",      platform: "Instagram", reach: 284000, likes: 21400, comments: 1820, shares: 1240, type: "Reel" },
    { title: "Home Interior Trends 2025 Guide",        platform: "LinkedIn",  reach: 192000, likes: 8400,  comments: 1240, shares: 2100, type: "Article" },
    { title: "Mumbai Showroom Grand Event",            platform: "Facebook",  reach: 168000, likes: 7200,  comments: 840,  shares: 610,  type: "Video" },
    { title: "Client Stories — 10 Transformations",   platform: "Instagram", reach: 148000, likes: 12100, comments: 1420, shares: 870,  type: "Carousel" },
    { title: "Modular Kitchen Cost Breakdown 2025",   platform: "Houzz",     reach: 124000, likes: 4800,  comments: 720,  shares: 490,  type: "Post" },
  ],
  platforms: [
    { id: "Instagram", reach: 640000, leads: 152, color: "bg-pink-500" },
    { id: "Facebook",  reach: 248000, leads: 74,  color: "bg-blue-500" },
    { id: "LinkedIn",  reach: 192000, leads: 58,  color: "bg-sky-600"  },
    { id: "Houzz",     reach: 124000, leads: 36,  color: "bg-green-500"},
    { id: "Google",    reach: 36000,  leads: 20,  color: "bg-red-500"  },
  ],
};

const FUTURE_TARGETS = [
  { metric: "Monthly Reach",    current: "1.24M",  target: "1.6M",   due: "Apr 2026", progress: 77  },
  { metric: "Instagram Followers", current: "42.8K", target: "55K",  due: "Jun 2026", progress: 78  },
  { metric: "Monthly Leads",    current: "340",    target: "500",    due: "May 2026", progress: 68  },
  { metric: "Lead→Consult Rate",current: "21.8%",  target: "30%",    due: "Jun 2026", progress: 73  },
  { metric: "Consult→Order Rate",current: "22.2%", target: "28%",    due: "Jun 2026", progress: 79  },
  { metric: "Monthly Revenue",  current: "₹48L",   target: "₹65L",   due: "Jun 2026", progress: 74  },
];

const UPCOMING_CONTENT: { date: string; title: string; platform: string; type: string; status: "ready" | "draft" | "idea" }[] = [
  { date: "17 Mar", title: "Wardrobe vs. Walk-in — What's Right for You?", platform: "Instagram", type: "Reel",     status: "ready" },
  { date: "18 Mar", title: "Client Testimonial — Juhu Residence",          platform: "Facebook",  type: "Video",    status: "ready" },
  { date: "19 Mar", title: "5 Kitchen Accessories You Didn't Know Existed", platform: "Houzz",    type: "Article",  status: "draft" },
  { date: "21 Mar", title: "Behind the Workshop — Craftsmen Story",        platform: "Instagram", type: "Story",    status: "draft" },
  { date: "22 Mar", title: "Spring Living Room Lookbook",                  platform: "Instagram", type: "Carousel", status: "idea"  },
  { date: "25 Mar", title: "Architect & Designer Partnership Q&A",         platform: "LinkedIn",  type: "Live",     status: "idea"  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function KPICard({ label, value, delta, sub }: { label: string; value: string | number; delta: number; sub?: string }) {
  const up = delta >= 0;
  return (
    <div className="rounded-xl border border-black/8 bg-white p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-charcoal/40">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-charcoal">{value}</p>
      <div className={`mt-1 flex items-center gap-1 text-xs font-medium ${up ? "text-emerald-600" : "text-red-500"}`}>
        {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
        {up ? "+" : ""}{delta}{typeof delta === "number" && Math.abs(delta) < 20 ? "%" : ""} vs prev period
        {sub && <span className="ml-1 text-charcoal/30 font-normal">{sub}</span>}
      </div>
    </div>
  );
}

function PostTable({ posts }: { posts: typeof DAILY_DATA.posts }) {
  return (
    <div className="rounded-xl border border-black/8 bg-white overflow-hidden">
      <div className="p-4 border-b border-black/6">
        <h3 className="text-sm font-semibold text-charcoal">Top Performing Content</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-stone-50 text-left">
              <th className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-charcoal/40">Post</th>
              <th className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-charcoal/40">Platform</th>
              <th className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-charcoal/40 text-right">Reach</th>
              <th className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-charcoal/40 text-right">Likes</th>
              <th className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-charcoal/40 text-right">Comments</th>
              <th className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-charcoal/40 text-right">Shares</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/4">
            {posts.map((p) => (
              <tr key={p.title} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-charcoal">{p.title}</p>
                  <span className="text-[10px] text-charcoal/40">{p.type}</span>
                </td>
                <td className="px-4 py-3 text-xs text-charcoal/60">{p.platform}</td>
                <td className="px-4 py-3 text-sm font-medium text-charcoal text-right">{p.reach.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-charcoal/70 text-right">{p.likes.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-charcoal/70 text-right">{p.comments.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-charcoal/70 text-right">{p.shares.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlatformBreakdown({ platforms }: { platforms: { id: string; reach: number; leads: number; color: string }[] }) {
  const maxReach = Math.max(...platforms.map((p) => p.reach));
  return (
    <div className="rounded-xl border border-black/8 bg-white p-5">
      <h3 className="text-sm font-semibold text-charcoal mb-4">Platform Breakdown</h3>
      <div className="space-y-3">
        {platforms.map((p) => (
          <div key={p.id} className="flex items-center gap-3">
            <p className="w-20 shrink-0 text-xs text-charcoal/60">{p.id}</p>
            <div className="flex-1 h-2 bg-black/5 rounded-full overflow-hidden">
              <div className={`h-full ${p.color} rounded-full`} style={{ width: `${(p.reach / maxReach) * 100}%` }} />
            </div>
            <p className="w-16 shrink-0 text-right text-xs font-medium text-charcoal">{p.reach.toLocaleString()}</p>
            <p className="w-14 shrink-0 text-right text-xs text-emerald-600 font-medium">{p.leads} leads</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportContent({ data }: { data: typeof DAILY_DATA & { date?: string; period?: string } }) {
  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KPICard label="Total Reach"    value={data.reach.toLocaleString()} delta={data.reachDelta} />
        <KPICard label="Leads Generated" value={data.leads}                 delta={data.leadsDelta} />
        <KPICard label="Avg Engagement" value={data.engagement}             delta={data.engagementDelta} sub="pts" />
        <KPICard label="Conversions"    value={data.conversions}            delta={data.conversionsDelta} />
      </div>
      {/* Platform breakdown + top posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PlatformBreakdown platforms={data.platforms} />
        </div>
        <div className="lg:col-span-2">
          <PostTable posts={data.posts} />
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const { accessToken } = useAuthStore();
  const [period, setPeriod] = useState<Period>("weekly");
  const [realLeads, setRealLeads] = useState<number | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    analyticsApi.dashboard(accessToken)
      .then((res) => setRealLeads(res.kpis.totalLeads))
      .catch(() => {});
  }, [accessToken]);

  const data = period === "daily" ? DAILY_DATA : period === "weekly" ? WEEKLY_DATA : MONTHLY_DATA;
  // Overlay real leads from API if available
  const reportData = realLeads != null
    ? { ...data, leads: realLeads, leadsDelta: 0 }
    : data;
  const periodLabel = "date" in data ? data.date : data.period;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-light text-charcoal">Reports & Targets</h1>
          <p className="mt-1 font-sans text-sm text-charcoal/50">{periodLabel}</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3.5 py-2 text-xs font-medium text-charcoal/60 hover:bg-black/5 transition-colors">
          <Download className="h-3.5 w-3.5" />Export PDF
        </button>
      </div>

      {/* Period tabs */}
      <div className="flex gap-1 border-b border-black/8 mb-6">
        {(["daily","weekly","monthly"] as Period[]).map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-5 py-2.5 font-sans text-sm capitalize border-b-2 transition-colors -mb-px ${
              period === p
                ? "border-red-500 text-red-600 font-medium"
                : "border-transparent text-charcoal/50 hover:text-charcoal"
            }`}>{p}</button>
        ))}
      </div>

      {/* Report content */}
      <ReportContent data={reportData as any} />

      {/* Future Targets */}
      <div className="mt-8 rounded-xl border border-black/8 bg-white overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-black/6">
          <h3 className="text-sm font-semibold text-charcoal flex items-center gap-2">
            <Target className="h-4 w-4 text-red-500" />Future Growth Targets
          </h3>
          <p className="text-xs text-charcoal/40">Q2 2026</p>
        </div>
        <div className="divide-y divide-black/4">
          {FUTURE_TARGETS.map((t) => (
            <div key={t.metric} className="flex items-center gap-4 px-5 py-3">
              <div className="w-44 shrink-0">
                <p className="text-sm font-medium text-charcoal">{t.metric}</p>
                <p className="text-xs text-charcoal/40">Due {t.due}</p>
              </div>
              <div className="flex items-center gap-3 flex-1">
                <span className="text-xs text-charcoal/50 w-14 shrink-0">{t.current}</span>
                <div className="flex-1 h-2 bg-black/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${t.progress >= 80 ? "bg-emerald-500" : t.progress >= 60 ? "bg-amber-400" : "bg-red-400"}`}
                    style={{ width: `${t.progress}%` }} />
                </div>
                <span className="text-xs font-semibold text-charcoal w-14 text-right">{t.target}</span>
              </div>
              <span className={`w-14 shrink-0 text-right text-xs font-semibold ${t.progress >= 80 ? "text-emerald-600" : t.progress >= 60 ? "text-amber-600" : "text-red-500"}`}>
                {t.progress}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming content plan */}
      <div className="mt-6 rounded-xl border border-black/8 bg-white overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-black/6">
          <h3 className="text-sm font-semibold text-charcoal flex items-center gap-2">
            <Calendar className="h-4 w-4 text-charcoal/40" />Upcoming Content Plan
          </h3>
          <p className="text-xs text-charcoal/40">Next 10 days</p>
        </div>
        <div className="divide-y divide-black/4">
          {UPCOMING_CONTENT.map((c) => (
            <div key={c.title} className="flex items-center gap-4 px-5 py-3">
              <p className="w-12 shrink-0 text-xs font-medium text-charcoal/40">{c.date}</p>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal truncate">{c.title}</p>
                <p className="text-[11px] text-charcoal/40">{c.platform} · {c.type}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium border ${
                c.status === "ready" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : c.status === "draft" ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-stone-100 text-charcoal/50 border-stone-200"
              }`}>{c.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
