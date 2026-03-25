"use client";

import { useState, useEffect } from "react";
import {
  Instagram, Twitter, MessageSquare, ThumbsUp, ThumbsDown,
  Minus, AlertTriangle, RefreshCw, ExternalLink, Bell,
  TrendingUp, Heart, MessageCircle,
} from "lucide-react";
import { mentionsApi, type Mention as ApiMention } from "@/lib/api/client";
import { useAccessToken } from "@/lib/stores/auth-store";

// ── Types ─────────────────────────────────────────────────────
type Sentiment = "positive" | "neutral" | "negative" | "mixed";
type Platform  = "instagram" | "twitter" | "pinterest" | "tiktok";

interface Mention {
  id: string;
  platform: Platform;
  author: string;
  handle: string;
  content: string;
  sentiment: Sentiment;
  likes: number;
  requiresResponse: boolean;
  responded: boolean;
  detectedAt: string;
  url?: string;
}

// ── Placeholder data ──────────────────────────────────────────
const MENTIONS: Mention[] = [
  {
    id: "m-1", platform: "instagram", author: "Interiors Daily", handle: "interiors_daily",
    content: "Just received our Modulas Arc Sofa — the boucle fabric is even more beautiful in person. Absolutely stunning craftsmanship. Highly recommend for anyone looking for bespoke UK-made pieces. 🛋️",
    sentiment: "positive", likes: 312, requiresResponse: false, responded: false,
    detectedAt: "2026-03-14T14:20:00Z",
  },
  {
    id: "m-2", platform: "twitter", author: "Design Lover", handle: "designlover92",
    content: "The @Modulas configurator is genuinely impressive. Spent an hour designing my dream living room layout. The AR preview sealed the deal.",
    sentiment: "positive", likes: 47, requiresResponse: false, responded: false,
    detectedAt: "2026-03-14T11:45:00Z",
  },
  {
    id: "m-3", platform: "instagram", author: "Home Studio UK", handle: "home_studio_uk",
    content: "Has anyone ordered from Modulas recently? Curious about the lead times for their dining tables — their website says 8 weeks but a friend waited 12.",
    sentiment: "neutral", likes: 89, requiresResponse: true, responded: false,
    detectedAt: "2026-03-13T18:30:00Z",
  },
  {
    id: "m-4", platform: "twitter", author: "Arch Matters", handle: "arch_matters",
    content: "Love the new Modulas workshop programme. Signed up for the joinery masterclass in April — exactly the kind of thing that sets them apart from generic furniture brands.",
    sentiment: "positive", likes: 134, requiresResponse: false, responded: false,
    detectedAt: "2026-03-13T09:10:00Z",
  },
  {
    id: "m-5", platform: "pinterest", author: "Lena Walters", handle: "lenawaltersstyle",
    content: "Saved 24 products from Modulas to my 'dream home' board. Their material photography is stunning.",
    sentiment: "positive", likes: 208, requiresResponse: false, responded: false,
    detectedAt: "2026-03-12T16:00:00Z",
  },
  {
    id: "m-6", platform: "twitter", author: "Flat Pack Hater", handle: "flp_hater",
    content: "Modulas pricing is steep. You can get something similar from Made.com for half the price. Not sure the 'bespoke' label justifies it.",
    sentiment: "negative", likes: 18, requiresResponse: true, responded: false,
    detectedAt: "2026-03-12T08:40:00Z",
  },
  {
    id: "m-7", platform: "tiktok", author: "Room Tour UK", handle: "roomtouruk",
    content: "Full room tour featuring our Modulas Oslo sofa ✨ — get the look in bio. Lead time was exactly as quoted.",
    sentiment: "positive", likes: 1820, requiresResponse: false, responded: false,
    detectedAt: "2026-03-11T20:15:00Z",
  },
  {
    id: "m-8", platform: "instagram", author: "Neutral Home", handle: "neutralhomestyle",
    content: "Slight disappointment with the shade of cream we received — it photographs lighter than the swatch we chose. Customer service was very helpful though.",
    sentiment: "mixed", likes: 55, requiresResponse: true, responded: true,
    detectedAt: "2026-03-10T12:00:00Z",
  },
];

const PLATFORM_COLOUR: Record<Platform, string> = {
  instagram: "text-pink-600 bg-pink-50",
  twitter:   "text-sky-600 bg-sky-50",
  pinterest: "text-red-600 bg-red-50",
  tiktok:    "text-charcoal bg-charcoal/6",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PLATFORM_ICON: Record<Platform, any> = {
  instagram: Instagram,
  twitter:   Twitter,
  pinterest: Heart,
  tiktok:    MessageCircle,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SENTIMENT_CFG: Record<Sentiment, { label: string; colour: string; icon: any }> = {
  positive: { label: "Positive", colour: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: ThumbsUp },
  neutral:  { label: "Neutral",  colour: "text-charcoal/60 bg-black/4 border-black/10",       icon: Minus },
  negative: { label: "Negative", colour: "text-red-600 bg-red-50 border-red-200",             icon: ThumbsDown },
  mixed:    { label: "Mixed",    colour: "text-amber-700 bg-amber-50 border-amber-200",        icon: MessageSquare },
};

const FILTERS = ["all", "positive", "neutral", "negative", "mixed", "needs-response"] as const;
type Filter = typeof FILTERS[number];

// ── Subcomponents ─────────────────────────────────────────────
function PlatformIcon({ platform }: { platform: Platform }) {
  const Icon   = PLATFORM_ICON[platform];
  const colour = PLATFORM_COLOUR[platform];
  return (
    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colour}`}>
      <Icon className="h-3.5 w-3.5" />
    </span>
  );
}

function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  const cfg  = SENTIMENT_CFG[sentiment];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-sans text-[10px] tracking-[0.08em] uppercase font-medium ${cfg.colour}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

export default function SocialMonitoringPage() {
  const token = useAccessToken() ?? "";
  const [mentions, setMentions]   = useState<Mention[]>(MENTIONS);
  const [filter, setFilter]       = useState<Filter>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [responded, setResponded] = useState<Set<string>>(
    new Set(MENTIONS.filter((m) => m.responded).map((m) => m.id))
  );

  useEffect(() => {
    if (!token) return;
    mentionsApi.list(token)
      .then((items: ApiMention[]) => {
        if (items.length === 0) return;
        setMentions(items.map((m) => ({
          id:              m.id,
          platform:        m.platform as Platform,
          author:          m.author,
          handle:          m.handle,
          content:         m.content,
          sentiment:       m.sentiment as Sentiment,
          likes:           m.likes,
          requiresResponse: m.requiresResponse,
          responded:       m.responded,
          detectedAt:      m.detectedAt,
          url:             m.url ?? undefined,
        })));
        setResponded(new Set(items.filter((m) => m.responded).map((m) => m.id)));
      })
      .catch(() => {});
  }, [token]);

  function handleRefresh() {
    if (!token) return;
    setRefreshing(true);
    mentionsApi.list(token)
      .then((items: ApiMention[]) => {
        if (items.length > 0) {
          setMentions(items.map((m) => ({
            id:              m.id,
            platform:        m.platform as Platform,
            author:          m.author,
            handle:          m.handle,
            content:         m.content,
            sentiment:       m.sentiment as Sentiment,
            likes:           m.likes,
            requiresResponse: m.requiresResponse,
            responded:       m.responded,
            detectedAt:      m.detectedAt,
            url:             m.url ?? undefined,
          })));
        }
      })
      .catch(() => {})
      .finally(() => setRefreshing(false));
  }

  function markResponded(id: string) {
    setResponded((prev: Set<string>) => new Set([...prev, id]));
    if (token) mentionsApi.update(token, id, { responded: true }).catch(() => {});
  }

  const filtered = mentions.filter((m) => {
    if (filter === "needs-response") return m.requiresResponse && !responded.has(m.id);
    if (filter === "all") return true;
    return m.sentiment === filter;
  });

  const positive   = mentions.filter((m) => m.sentiment === "positive").length;
  const needsResp  = mentions.filter((m) => m.requiresResponse && !responded.has(m.id)).length;
  const totalLikes = mentions.reduce((s, m) => s + m.likes, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Social Monitoring</h1>
          <p className="font-sans text-sm text-charcoal/40 mt-0.5">
            Brand mentions, sentiment and engagement across platforms
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-2.5 font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/60 hover:border-gold hover:text-gold transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Fetching…" : "Refresh"}
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total mentions",    value: mentions.length, icon: MessageSquare, colour: "text-charcoal" },
          { label: "Positive",          value: positive,        icon: ThumbsUp,      colour: "text-emerald-600" },
          { label: "Needs response",    value: needsResp,       icon: Bell,          colour: needsResp > 0 ? "text-red-500" : "text-charcoal/30" },
          { label: "Total engagements", value: totalLikes.toLocaleString(), icon: TrendingUp, colour: "text-charcoal" },
        ].map(({ label, value, icon: Icon, colour }) => (
          <div key={label} className="rounded-2xl border border-black/6 bg-white p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 mb-3">
              <Icon className="h-4 w-4 text-gold" />
            </div>
            <p className={`font-serif text-2xl ${colour}`}>{value}</p>
            <p className="font-sans text-xs text-charcoal/40 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Platform breakdown */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["instagram", "twitter", "tiktok", "pinterest"] as Platform[]).map((p) => {
          const count = mentions.filter((m) => m.platform === p).length;
          const Icon  = PLATFORM_ICON[p];
          const colour = PLATFORM_COLOUR[p];
          return (
            <div key={p} className="flex items-center gap-3 rounded-xl border border-black/6 bg-white px-4 py-3">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colour}`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="font-serif text-lg text-charcoal">{count}</p>
                <p className="font-sans text-[10px] uppercase tracking-[0.08em] text-charcoal/40">{p}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={[
              "rounded-full px-3.5 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors",
              filter === f ? "bg-charcoal text-cream" : "bg-black/5 text-charcoal/50 hover:bg-black/8",
            ].join(" ")}
          >
            {f === "needs-response" ? `Needs response${needsResp > 0 ? ` (${needsResp})` : ""}` : f}
          </button>
        ))}
      </div>

      {/* Mentions feed */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-black/6 bg-white py-20 text-center">
          <MessageSquare className="mx-auto mb-3 h-10 w-10 text-charcoal/12" />
          <p className="font-sans text-sm text-charcoal/40">No mentions match your filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((mention) => {
            const isResponded = responded.has(mention.id);
            const date = new Date(mention.detectedAt).toLocaleDateString("en-GB", {
              day: "numeric", month: "short",
            });
            const time = new Date(mention.detectedAt).toLocaleTimeString("en-GB", {
              hour: "2-digit", minute: "2-digit",
            });
            return (
              <div
                key={mention.id}
                className={[
                  "rounded-2xl border bg-white p-5 transition-colors",
                  mention.requiresResponse && !isResponded
                    ? "border-amber-200 bg-amber-50/30"
                    : "border-black/6",
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  <PlatformIcon platform={mention.platform} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <p className="font-sans text-sm font-medium text-charcoal">{mention.author}</p>
                      <p className="font-sans text-xs text-charcoal/35">@{mention.handle}</p>
                      <p className="font-sans text-xs text-charcoal/30">{date} · {time}</p>
                      <SentimentBadge sentiment={mention.sentiment} />
                      {mention.requiresResponse && !isResponded && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-200 px-2 py-0.5 font-sans text-[10px] tracking-[0.08em] uppercase font-medium text-amber-700">
                          <AlertTriangle className="h-3 w-3" /> Respond
                        </span>
                      )}
                      {isResponded && (
                        <span className="font-sans text-[10px] text-charcoal/30">Responded</span>
                      )}
                    </div>

                    <p className="font-sans text-sm text-charcoal/70 leading-relaxed">{mention.content}</p>

                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1 font-sans text-xs text-charcoal/35">
                        <Heart className="h-3 w-3" /> {mention.likes.toLocaleString()}
                      </span>
                      {mention.requiresResponse && !isResponded && (
                        <button
                          type="button"
                          onClick={() => markResponded(mention.id)}
                          className="font-sans text-[11px] tracking-[0.08em] uppercase text-gold hover:text-gold-600 transition-colors"
                        >
                          Mark responded
                        </button>
                      )}
                      {mention.url && (
                        <a
                          href={mention.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 font-sans text-[11px] text-charcoal/30 hover:text-gold transition-colors ml-auto"
                        >
                          View post <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
