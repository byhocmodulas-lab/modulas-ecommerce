"use client";

import { useState, useEffect } from "react";
import { Instagram, Youtube, Camera, ArrowRight } from "lucide-react";
import { campaignsApi, type Campaign as ApiCampaign } from "@/lib/api/client";

type OppType = "reel" | "youtube" | "blog" | "series";
type OppStatus = "open" | "applied" | "closed";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: OppType;
  platform: string[];
  deadline: string;
  fee: string;
  deliverables: string[];
  status: OppStatus;
}

const OPPORTUNITIES: Opportunity[] = [
  {
    id: "op1", title: "Modular Kitchen Reveal — Spring 2026", type: "reel", platform: ["Instagram"],
    description: "Showcase a completed Modulas modular kitchen installation in a 60–90s Reel. Client home in Mumbai (Bandra area). Kitchen already installed — you just shoot and edit.",
    deadline: "2026-03-30", fee: "₹35,000 + Modulas product (RRP ₹12K)", status: "applied",
    deliverables: ["1 × Instagram Reel (60–90s)", "3 × feed photos", "Stories coverage (3 days)", "Link in bio for 30 days"],
  },
  {
    id: "op2", title: "Walk-in Wardrobe Series", type: "series", platform: ["Instagram", "YouTube"],
    description: "3-part content series touring walk-in wardrobe installations across 3 homes in Mumbai, Delhi and Bengaluru. Travel and stay covered.",
    deadline: "2026-04-15", fee: "₹55,000", status: "open",
    deliverables: ["3 × Reels (60s each)", "3 × YouTube Shorts", "1 × long-form YouTube video", "Behind-the-scenes Stories"],
  },
  {
    id: "op3", title: "Home Office Makeover", type: "youtube", platform: ["YouTube"],
    description: "Full before/after home office makeover video featuring Modulas study furniture. Integrated segment within a broader home tour video. 10–15 min runtime.",
    deadline: "2026-04-20", fee: "₹40,000 + Study furniture set", status: "open",
    deliverables: ["1 × YouTube integration (10–15 min)", "Pinned comment with product links", "End screen CTA"],
  },
  {
    id: "op4", title: "Living Room Furniture Styling", type: "reel", platform: ["Instagram"],
    description: "Style and shoot Modulas furniture in your own home or a client home. Lifestyle-focused content — less product, more living.",
    deadline: "2026-05-01", fee: "₹28,000 + Lounge chair (RRP ₹22K)", status: "open",
    deliverables: ["1 × Instagram Reel (45–60s)", "2 × feed photos with tag", "Stories x 2"],
  },
  {
    id: "op5", title: "Hospitality Room Reveal — Goa", type: "blog", platform: ["Blog", "Instagram"],
    description: "Visit the Skyline Boutique Hotel in Goa (stay covered) and document the room interiors featuring Modulas wardrobe and TV panels.",
    deadline: "2026-05-15", fee: "₹45,000 + 3-night stay", status: "open",
    deliverables: ["1 × long-form blog post (1500+ words)", "10 editorial photos", "2 × Instagram posts", "1 × Reel"],
  },
];

const TYPE_ICONS: Record<OppType, React.ElementType> = {
  reel:    Instagram,
  youtube: Youtube,
  blog:    Camera,
  series:  Camera,
};

const STATUS_CFG: Record<OppStatus, { label: string; cls: string }> = {
  open:    { label: "Open",    cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  applied: { label: "Applied", cls: "text-sky-700 bg-sky-50 border-sky-200" },
  closed:  { label: "Closed",  cls: "text-charcoal/40 bg-black/4 border-black/10" },
};

export default function CreatorOpportunitiesPage() {
  const [filter, setFilter]     = useState<OppType | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(OPPORTUNITIES);

  useEffect(() => {
    campaignsApi.list()
      .then((items: ApiCampaign[]) => {
        if (items.length === 0) return;
        setOpportunities(items.map((c) => ({
          id:           c.id,
          title:        c.title,
          description:  c.description,
          type:         (c.type as OppType) ?? "reel",
          platform:     c.platforms,
          deadline:     c.deadline ?? "",
          fee:          c.fee ?? "",
          deliverables: c.deliverables ?? [],
          status:       (c.status as OppStatus) ?? "open",
        })));
      })
      .catch(() => {});
  }, []);

  const filtered = filter === "all" ? opportunities : opportunities.filter((o) => o.type === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-charcoal">Opportunities</h1>
        <p className="font-sans text-sm text-charcoal/40 mt-0.5">{opportunities.filter((o) => o.status === "open").length} open opportunities this month</p>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {(["all", "reel", "youtube", "series", "blog"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setFilter(t)}
            className={["rounded-full px-3.5 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors",
              filter === t ? "bg-pink-600 text-white" : "bg-black/5 text-charcoal/50 hover:bg-black/8",
            ].join(" ")}>{t}</button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((opp) => {
          const Icon = TYPE_ICONS[opp.type];
          const st = STATUS_CFG[opp.status];
          const isOpen = expanded === opp.id;

          return (
            <div key={opp.id} className="rounded-2xl border border-black/6 bg-white overflow-hidden">
              <div className="flex flex-wrap items-start gap-4 p-5">
                <div className="rounded-xl bg-pink-50 border border-pink-100 p-2.5">
                  <Icon className="h-4 w-4 text-pink-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`rounded-full border px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.08em] font-medium ${st.cls}`}>{st.label}</span>
                    <span className="font-sans text-[10px] text-charcoal/35">Due {new Date(opp.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  </div>
                  <p className="font-sans text-sm font-medium text-charcoal">{opp.title}</p>
                  <p className="font-sans text-xs text-charcoal/45 mt-1 leading-relaxed">{opp.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="font-serif text-lg text-emerald-700">{opp.fee.split("+")[0].trim()}</p>
                  {opp.fee.includes("+") && <p className="font-sans text-[11px] text-charcoal/40">+ {opp.fee.split("+")[1].trim()}</p>}
                </div>
              </div>

              <div className="px-5 pb-4 flex items-center gap-3">
                <div className="flex gap-1.5">
                  {opp.platform.map((p) => (
                    <span key={p} className="rounded-full border border-black/8 px-2.5 py-0.5 font-sans text-[10px] text-charcoal/40">{p}</span>
                  ))}
                </div>
                <button type="button" onClick={() => setExpanded(isOpen ? null : opp.id)}
                  className="font-sans text-[11px] text-charcoal/35 hover:text-charcoal transition-colors">
                  {isOpen ? "Less" : "Deliverables"}
                </button>
                {opp.status === "open" && (
                  <button type="button"
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-pink-600 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.1em] text-white hover:bg-pink-700 transition-colors">
                    Apply <ArrowRight className="h-3 w-3" />
                  </button>
                )}
                {opp.status === "applied" && (
                  <span className="ml-auto font-sans text-[11px] text-sky-600">Application submitted</span>
                )}
              </div>

              {isOpen && (
                <div className="border-t border-black/5 px-5 py-4 bg-black/1">
                  <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-charcoal/35 mb-2">Deliverables</p>
                  <ul className="space-y-1.5">
                    {opp.deliverables.map((d) => (
                      <li key={d} className="font-sans text-xs text-charcoal/60 flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-charcoal/30 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
