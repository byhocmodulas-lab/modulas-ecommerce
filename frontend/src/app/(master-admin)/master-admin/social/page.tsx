"use client";

import React, { useState } from "react";
import { BarFill } from "@/components/ui/bar-fill";
import {
  Instagram, Facebook, Linkedin, Twitter, Globe,
  TrendingUp, TrendingDown, Eye, Heart, MessageCircle, Share2,
  Users, Calendar, Clock, Search, Hash,
  ChevronDown, ChevronUp, Play, FileText, Send,
  BarChart2, Target, Sparkles, Plus, ExternalLink, RefreshCw,
  Image as ImageIcon, Copy, BookmarkPlus, Bell, AlertCircle,
  CheckCircle2, ArrowUpRight, Zap, Video, AlignLeft, Layers,
  Repeat2, Filter, Download, Star, ThumbsUp, Bookmark,
} from "lucide-react";

type Tab = "overview" | "trends" | "competitors" | "studio" | "scheduler";
type Platform = "instagram" | "facebook" | "linkedin" | "twitter" | "google" | "houzz" | "homify";

const PLATFORMS: { id: Platform; label: string; color: string; bg: string; border: string }[] = [
  { id: "instagram", label: "Instagram",   color: "text-pink-600",   bg: "bg-pink-50",   border: "border-pink-200" },
  { id: "facebook",  label: "Facebook",    color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200" },
  { id: "linkedin",  label: "LinkedIn",    color: "text-sky-700",    bg: "bg-sky-50",    border: "border-sky-200"  },
  { id: "twitter",   label: "X / Twitter", color: "text-charcoal",   bg: "bg-stone-50",  border: "border-stone-200"},
  { id: "google",    label: "Google",      color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200"  },
  { id: "houzz",     label: "Houzz",       color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200"},
  { id: "homify",    label: "Homify",      color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200"},
];

const PLATFORM_STATS: Record<Platform, {
  followers: string; reach: string; engagement: string; posts: number;
  weeklyGrowth: number; impressions: string; clicks: string;
}> = {
  instagram: { followers: "42.8K", reach: "1.2M", engagement: "4.7%", posts: 18, weeklyGrowth: 3.2, impressions: "890K", clicks: "12.4K" },
  facebook:  { followers: "28.1K", reach: "680K", engagement: "2.1%", posts: 12, weeklyGrowth: 1.1, impressions: "540K", clicks: "8.2K"  },
  linkedin:  { followers: "9.4K",  reach: "210K", engagement: "5.8%", posts: 8,  weeklyGrowth: 4.6, impressions: "180K", clicks: "4.1K"  },
  twitter:   { followers: "11.2K", reach: "320K", engagement: "1.8%", posts: 34, weeklyGrowth: 0.9, impressions: "290K", clicks: "3.8K"  },
  google:    { followers: "—",     reach: "94K",  engagement: "3.2%", posts: 4,  weeklyGrowth: 2.8, impressions: "120K", clicks: "6.7K"  },
  houzz:     { followers: "6.8K",  reach: "180K", engagement: "6.2%", posts: 22, weeklyGrowth: 5.4, impressions: "160K", clicks: "9.3K"  },
  homify:    { followers: "3.2K",  reach: "88K",  engagement: "4.1%", posts: 14, weeklyGrowth: 3.7, impressions: "74K",  clicks: "5.6K"  },
};

function PlatformIcon({ id, size = "h-4 w-4" }: { id: Platform; size?: string }) {
  const map: Record<Platform, React.ReactNode> = {
    instagram: <Instagram className={size} />,
    facebook:  <Facebook  className={size} />,
    linkedin:  <Linkedin  className={size} />,
    twitter:   <Twitter   className={size} />,
    google:    <Globe      className={size} />,
    houzz:     <Globe      className={size} />,
    homify:    <Globe      className={size} />,
  };
  return <>{map[id]}</>;
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 1 — Overview (unchanged, kept compact)
// ─────────────────────────────────────────────────────────────────────────────
function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {PLATFORMS.map((p) => {
          const s = PLATFORM_STATS[p.id];
          const up = s.weeklyGrowth > 2;
          return (
            <div key={p.id} className={`rounded-xl border ${p.border} ${p.bg} p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center gap-2 ${p.color} font-semibold text-sm`}>
                  <PlatformIcon id={p.id} />{p.label}
                </div>
                <span className={`flex items-center gap-0.5 text-[11px] font-medium ${up ? "text-emerald-600" : "text-charcoal/40"}`}>
                  {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}+{s.weeklyGrowth}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[["Followers",s.followers],["Reach",s.reach],["Engagement",s.engagement],["Posts/mo",s.posts]].map(([l,v])=>(
                  <div key={String(l)}><p className="text-[10px] uppercase tracking-wider text-charcoal/40">{l}</p><p className="font-semibold text-charcoal">{v}</p></div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="rounded-xl border border-black/8 bg-white p-5">
        <h3 className="text-sm font-semibold text-charcoal mb-4">Monthly Reach Targets</h3>
        <div className="space-y-3">
          {[
            { platform:"Instagram", current:1200000, target:1500000, color:"bg-pink-500" },
            { platform:"Facebook",  current:680000,  target:900000,  color:"bg-blue-500" },
            { platform:"LinkedIn",  current:210000,  target:350000,  color:"bg-sky-600"  },
            { platform:"Houzz",     current:180000,  target:200000,  color:"bg-green-500"},
            { platform:"Google",    current:94000,   target:150000,  color:"bg-red-500"  },
          ].map((t) => {
            const pct = Math.round((t.current/t.target)*100);
            return (
              <div key={t.platform} className="flex items-center gap-4">
                <p className="w-24 shrink-0 text-xs text-charcoal/60">{t.platform}</p>
                <div className="flex-1 h-2 bg-black/5 rounded-full overflow-hidden">
                  <BarFill pct={pct} className={`h-full ${t.color} rounded-full`} />
                </div>
                <p className="w-20 shrink-0 text-right text-xs text-charcoal/60">{pct}% of target</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 2 — Trends & Keywords (DETAILED)
// ─────────────────────────────────────────────────────────────────────────────
const KEYWORD_DATA: Record<string, {
  keyword: string; volume: string; volNum: number; cpc: string; difficulty: number;
  competition: "Low"|"Medium"|"High"; trend: "up"|"down"|"stable"; relevance: number;
  sparkline: number[]; platforms: Platform[]; intent: "informational"|"commercial"|"transactional";
}[]> = {
  "Modular Furniture": [
    { keyword:"modular kitchen india",          volume:"22K/mo", volNum:22000, cpc:"₹28",  difficulty:38, competition:"Low",    trend:"up",     relevance:98, sparkline:[40,45,52,48,60,70,88], platforms:["google","instagram","houzz"],     intent:"transactional"  },
    { keyword:"modular wardrobe design 2025",   volume:"14.6K/mo",volNum:14600,cpc:"₹22",  difficulty:34, competition:"Low",    trend:"up",     relevance:95, sparkline:[30,35,42,55,65,72,80], platforms:["instagram","houzz","homify"],     intent:"informational"  },
    { keyword:"luxury modular furniture",       volume:"8.1K/mo", volNum:8100, cpc:"₹44",  difficulty:52, competition:"Medium", trend:"up",     relevance:94, sparkline:[20,28,32,40,52,60,68], platforms:["google","linkedin","houzz"],      intent:"commercial"     },
    { keyword:"modular furniture price india",  volume:"18.4K/mo",volNum:18400,cpc:"₹19",  difficulty:28, competition:"Low",    trend:"up",     relevance:91, sparkline:[50,55,58,62,68,74,82], platforms:["google","facebook"],             intent:"transactional"  },
    { keyword:"best modular kitchen brand",     volume:"6.3K/mo", volNum:6300, cpc:"₹35",  difficulty:41, competition:"Medium", trend:"stable", relevance:88, sparkline:[60,58,62,60,64,62,65], platforms:["google","houzz"],                intent:"commercial"     },
    { keyword:"home interior designer near me", volume:"40.5K/mo",volNum:40500,cpc:"₹52",  difficulty:62, competition:"High",   trend:"up",     relevance:82, sparkline:[45,50,58,64,72,80,90], platforms:["google","instagram","facebook"],  intent:"transactional"  },
    { keyword:"tv unit design ideas",           volume:"18.2K/mo",volNum:18200,cpc:"₹14",  difficulty:22, competition:"Low",    trend:"stable", relevance:79, sparkline:[55,56,58,55,57,58,60], platforms:["instagram","homify","houzz"],     intent:"informational"  },
    { keyword:"bedroom wardrobe designs",       volume:"29.3K/mo",volNum:29300,cpc:"₹18",  difficulty:30, competition:"Low",    trend:"up",     relevance:77, sparkline:[40,48,55,60,68,75,84], platforms:["instagram","houzz","homify"],     intent:"informational"  },
  ],
  "Kitchen": [
    { keyword:"modular kitchen cost mumbai",    volume:"4.2K/mo", volNum:4200, cpc:"₹42",  difficulty:29, competition:"Low",    trend:"up",     relevance:99, sparkline:[30,40,52,58,64,72,88], platforms:["google","houzz"],                intent:"transactional"  },
    { keyword:"parallel kitchen design",        volume:"11.4K/mo",volNum:11400,cpc:"₹16",  difficulty:24, competition:"Low",    trend:"up",     relevance:94, sparkline:[35,42,50,56,62,70,78], platforms:["instagram","houzz","homify"],    intent:"informational"  },
    { keyword:"l shaped kitchen design india",  volume:"8.8K/mo", volNum:8800, cpc:"₹20",  difficulty:26, competition:"Low",    trend:"up",     relevance:91, sparkline:[28,36,44,52,60,68,76], platforms:["instagram","houzz"],             intent:"informational"  },
    { keyword:"kitchen cabinet manufacturer",   volume:"5.4K/mo", volNum:5400, cpc:"₹31",  difficulty:44, competition:"Medium", trend:"down",   relevance:86, sparkline:[70,66,62,58,55,50,48], platforms:["google","linkedin"],             intent:"commercial"     },
    { keyword:"kitchen renovation cost india",  volume:"9.6K/mo", volNum:9600, cpc:"₹38",  difficulty:36, competition:"Medium", trend:"up",     relevance:88, sparkline:[32,40,50,58,66,74,82], platforms:["google","facebook","houzz"],      intent:"transactional"  },
  ],
  "Wardrobe": [
    { keyword:"walk in wardrobe design india",  volume:"7.2K/mo", volNum:7200, cpc:"₹26",  difficulty:31, competition:"Low",    trend:"up",     relevance:98, sparkline:[25,35,45,55,65,74,85], platforms:["instagram","houzz","homify"],     intent:"informational"  },
    { keyword:"sliding door wardrobe price",    volume:"6.8K/mo", volNum:6800, cpc:"₹22",  difficulty:27, competition:"Low",    trend:"up",     relevance:95, sparkline:[30,38,46,54,62,70,80], platforms:["google","houzz"],                intent:"transactional"  },
    { keyword:"wardrobe with mirror design",    volume:"12.1K/mo",volNum:12100,cpc:"₹15",  difficulty:20, competition:"Low",    trend:"up",     relevance:88, sparkline:[40,48,55,62,68,76,84], platforms:["instagram","homify","houzz"],     intent:"informational"  },
    { keyword:"bedroom storage solutions india",volume:"9.4K/mo", volNum:9400, cpc:"₹18",  difficulty:24, competition:"Low",    trend:"stable", relevance:82, sparkline:[55,56,58,57,58,60,62], platforms:["google","instagram","houzz"],     intent:"informational"  },
  ],
  "Living Room": [
    { keyword:"living room furniture set india",volume:"11.8K/mo",volNum:11800,cpc:"₹24",  difficulty:38, competition:"Medium", trend:"up",     relevance:85, sparkline:[35,42,50,56,62,70,78], platforms:["instagram","facebook","houzz"],   intent:"commercial"     },
    { keyword:"tv unit with storage ideas",     volume:"14.2K/mo",volNum:14200,cpc:"₹12",  difficulty:18, competition:"Low",    trend:"up",     relevance:80, sparkline:[40,48,55,62,68,76,84], platforms:["instagram","houzz","homify"],    intent:"informational"  },
    { keyword:"sofa design for living room",    volume:"22.6K/mo",volNum:22600,cpc:"₹20",  difficulty:42, competition:"Medium", trend:"stable", relevance:72, sparkline:[58,60,62,60,62,62,64], platforms:["instagram","facebook"],           intent:"informational"  },
  ],
  "Bedroom": [
    { keyword:"bedroom interior design india",  volume:"18.4K/mo",volNum:18400,cpc:"₹22",  difficulty:40, competition:"Medium", trend:"up",     relevance:88, sparkline:[38,45,52,58,65,72,80], platforms:["instagram","houzz","homify"],     intent:"informational"  },
    { keyword:"platform bed with storage",      volume:"8.6K/mo", volNum:8600, cpc:"₹18",  difficulty:28, competition:"Low",    trend:"up",     relevance:82, sparkline:[30,38,46,54,62,70,78], platforms:["instagram","houzz"],             intent:"commercial"     },
    { keyword:"kids bedroom furniture india",   volume:"12.4K/mo",volNum:12400,cpc:"₹16",  difficulty:24, competition:"Low",    trend:"stable", relevance:74, sparkline:[50,52,54,52,54,55,56], platforms:["google","facebook"],             intent:"commercial"     },
  ],
  "Home Decor": [
    { keyword:"home decor trends 2025 india",   volume:"52.1K/mo",volNum:52100,cpc:"₹14",  difficulty:48, competition:"High",   trend:"up",     relevance:74, sparkline:[45,55,65,70,78,88,95], platforms:["instagram","homify","houzz"],     intent:"informational"  },
    { keyword:"minimalist home interior",       volume:"28.4K/mo",volNum:28400,cpc:"₹10",  difficulty:35, competition:"Medium", trend:"up",     relevance:70, sparkline:[40,48,56,64,70,78,85], platforms:["instagram","houzz"],             intent:"informational"  },
    { keyword:"luxury interior design mumbai",  volume:"6.4K/mo", volNum:6400, cpc:"₹58",  difficulty:55, competition:"Medium", trend:"up",     relevance:85, sparkline:[22,28,36,44,52,60,70], platforms:["google","instagram","houzz"],     intent:"commercial"     },
  ],
};

const HASHTAG_DATA = [
  { tag:"#ModularFurniture",  uses:"48K",  engRate:"5.2%", reach:"1.4M",  growth:"up",   category:"furniture"  },
  { tag:"#HomeInterior",      uses:"132K", engRate:"3.8%", reach:"4.2M",  growth:"up",   category:"decor"      },
  { tag:"#KitchenDesign",     uses:"74K",  engRate:"4.4%", reach:"2.1M",  growth:"up",   category:"kitchen"    },
  { tag:"#WardrobeGoals",     uses:"29K",  engRate:"6.1%", reach:"820K",  growth:"up",   category:"wardrobe"   },
  { tag:"#LuxuryLiving",      uses:"61K",  engRate:"4.9%", reach:"1.8M",  growth:"up",   category:"luxury"     },
  { tag:"#ModulasIndia",      uses:"1.2K", engRate:"8.4%", reach:"38K",   growth:"up",   category:"brand"      },
  { tag:"#InteriorIndia",     uses:"88K",  engRate:"3.6%", reach:"2.6M",  growth:"stable",category:"decor"     },
  { tag:"#HomeDecor2025",     uses:"220K", engRate:"2.8%", reach:"6.8M",  growth:"up",   category:"trending"   },
  { tag:"#CustomFurniture",   uses:"18K",  engRate:"5.8%", reach:"520K",  growth:"up",   category:"furniture"  },
  { tag:"#FurnitureDesign",   uses:"56K",  engRate:"4.2%", reach:"1.6M",  growth:"stable",category:"furniture" },
  { tag:"#Houzz",             uses:"4.3M", engRate:"2.1%", reach:"18.4M", growth:"stable",category:"platform"  },
  { tag:"#IndianInterior",    uses:"42K",  engRate:"4.6%", reach:"1.2M",  growth:"up",   category:"regional"   },
  { tag:"#ModularKitchen",    uses:"36K",  engRate:"5.4%", reach:"1.1M",  growth:"up",   category:"kitchen"    },
  { tag:"#WalkInWardrobe",    uses:"14K",  engRate:"7.2%", reach:"400K",  growth:"up",   category:"wardrobe"   },
  { tag:"#HomeRenovation",    uses:"94K",  engRate:"3.2%", reach:"2.8M",  growth:"up",   category:"decor"      },
  { tag:"#ArchitectDesign",   uses:"22K",  engRate:"5.6%", reach:"640K",  growth:"up",   category:"professional"},
];

const PLATFORM_INSIGHTS: Record<Platform, { insight: string; opportunity: string; bestContent: string; bestTime: string }> = {
  instagram: { insight:"Reels with before/after kitchen transformations get 3.4× avg reach",   opportunity:"Stories with 'poll' sticker on kitchen style preferences drive DMs",         bestContent:"15–30s Reels, Carousels (8–10 slides)",   bestTime:"6–8 PM weekdays, 11 AM weekends" },
  facebook:  { insight:"Video posts 4+ min outperform images by 2.1× in reach",               opportunity:"Facebook Groups in interior design communities — organic reach untapped",   bestContent:"Long-form video, link posts",             bestTime:"9 AM, 12 PM, 7 PM" },
  linkedin:  { insight:"B2B design content (architect partnerships) gets 5.8% engagement",    opportunity:"'Thought leadership' articles on modular design trends get 3× shares",       bestContent:"Articles, PDF carousels, company updates",bestTime:"Tue–Thu, 8–10 AM" },
  twitter:   { insight:"Threads on 'furniture buying mistakes' go viral in interior community",opportunity:"Engaging competitor complaints — respond publicly with solutions",            bestContent:"Threads, polls, quick tips",              bestTime:"8–10 AM, 12–1 PM" },
  google:    { insight:"'Modular kitchen cost india 2025' — CPC ₹28, low competition",       opportunity:"Google My Business posts drive 40% of consultation inquiries",               bestContent:"How-to articles, FAQ pages",              bestTime:"Search peaks: 8 PM weekdays" },
  houzz:     { insight:"Wardrobe & storage project queries up 42% this month",                opportunity:"Detailed project write-ups rank in Houzz search for 2+ years",              bestContent:"Project portfolios, ideabooks",           bestTime:"Weekend browsing: Sat 10 AM–2 PM" },
  homify:    { insight:"Kitchen projects with ₹ range in title get 60% more enquiries",       opportunity:"Homify leads show 28% higher conversion to paid orders vs other sources",    bestContent:"Before/after projects with cost",         bestTime:"Evenings 7–10 PM" },
};

function Sparkline({ data, color = "stroke-amber-500" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 80; const H = 24; const pad = 2;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={W} height={H} className="shrink-0">
      <polyline points={pts} fill="none" className={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Extra data for enhanced TrendsTab ────────────────────────────────────────
const KEYWORD_GAP: Record<string, {
  keyword: string; competitorUsing: string[]; volume: string; difficulty: number;
  opportunity: string; priority: "high"|"medium"|"low";
}[]> = {
  "Modular Furniture": [
    { keyword:"modular kitchen with island india",   competitorUsing:["Godrej Interio","Livspace"], volume:"3.2K/mo", difficulty:24, opportunity:"High buying-intent — nobody ranking organically", priority:"high" },
    { keyword:"custom wardrobe manufacturer india",  competitorUsing:["Spacewood"],                 volume:"2.8K/mo", difficulty:19, opportunity:"B2B keyword — architect & builder searches",       priority:"high" },
    { keyword:"modular furniture emi options",       competitorUsing:["Livspace","Sleek"],           volume:"5.6K/mo", difficulty:22, opportunity:"Finance-led buyer — converts 40% higher",          priority:"high" },
    { keyword:"furniture brand india luxury",        competitorUsing:["Godrej Interio"],             volume:"4.1K/mo", difficulty:31, opportunity:"Aspirational search — brand positioning keyword",   priority:"medium"},
    { keyword:"modular kitchen video tour",          competitorUsing:["Livspace","Spacewood"],       volume:"6.8K/mo", difficulty:16, opportunity:"YouTube + Reel SEO — no strong Modulas content",    priority:"medium"},
    { keyword:"wardrobe with charging station india",competitorUsing:[],                             volume:"1.4K/mo", difficulty:8,  opportunity:"Uncontested niche — unique tech wardrobe feature",  priority:"high" },
  ],
  "Kitchen": [
    { keyword:"modular kitchen under 2 lakh",        competitorUsing:["Sleek","Spacewood"],          volume:"8.2K/mo", difficulty:18, opportunity:"Budget-segment intent — huge volume, easy win",    priority:"high" },
    { keyword:"kitchen design with breakfast counter",competitorUsing:["Livspace"],                  volume:"4.6K/mo", difficulty:21, opportunity:"Lifestyle aspirational — Instagram Reel material",  priority:"high" },
    { keyword:"german hinges modular kitchen india", competitorUsing:["Spacewood"],                  volume:"2.1K/mo", difficulty:12, opportunity:"Quality differentiator keyword — Modulas strength", priority:"medium"},
  ],
  "Wardrobe": [
    { keyword:"wardrobe with shoe rack and dresser", competitorUsing:["Godrej Interio"],             volume:"5.3K/mo", difficulty:20, opportunity:"Full-unit search — maps to our combo products",     priority:"high" },
    { keyword:"motion sensor wardrobe india",        competitorUsing:[],                             volume:"1.8K/mo", difficulty:7,  opportunity:"Feature keyword — completely uncontested niche",    priority:"high" },
    { keyword:"wardrobe for small bedroom india",    competitorUsing:["Sleek","Livspace"],           volume:"9.1K/mo", difficulty:25, opportunity:"Space-saving — massive apartment segment in India",  priority:"high" },
  ],
  "Living Room": [
    { keyword:"modular tv unit with storage india",  competitorUsing:["Godrej Interio","Sleek"],    volume:"6.2K/mo", difficulty:22, opportunity:"Combo product keyword — high avg order value",       priority:"high" },
    { keyword:"wall panel design living room",       competitorUsing:["Livspace"],                  volume:"12.4K/mo",difficulty:28, opportunity:"Visual content keyword — perfect for Reels",         priority:"medium"},
  ],
  "Bedroom": [
    { keyword:"king bed with hydraulic storage",    competitorUsing:["Godrej Interio"],             volume:"4.8K/mo", difficulty:23, opportunity:"High-ticket item — architect clientele searches",    priority:"high" },
  ],
  "Home Decor": [
    { keyword:"luxury home interior under 50 lakh", competitorUsing:["Livspace"],                   volume:"2.6K/mo", difficulty:31, opportunity:"High-intent HNI audience — LinkedIn material",       priority:"medium"},
    { keyword:"minimalist indian home interior",    competitorUsing:["Homify"],                     volume:"7.2K/mo", difficulty:24, opportunity:"Aesthetic trend — high save/share rate on Instagram", priority:"medium"},
  ],
};

const CONTENT_ANGLES: Record<string, {
  angle: string; format: string; platform: Platform[]; hook: string;
  estimatedReach: string; difficulty: "Easy"|"Medium"|"Hard"; tag: string;
}[]> = {
  "Modular Furniture": [
    { angle:"Before/After: Complete home transformation",          format:"Reel (30s)",      platform:["instagram","facebook"],  hook:"We turned this bare flat into a dream home in 30 days 🏠",       estimatedReach:"80–120K", difficulty:"Easy",   tag:"trending" },
    { angle:"Cost breakdown: What does a modular home cost?",      format:"Carousel (8 slides)", platform:["instagram","houzz"],  hook:"The honest price breakdown nobody shows you",                    estimatedReach:"40–65K",  difficulty:"Easy",   tag:"educational" },
    { angle:"Wardrobe vs Walk-in: Which is right for you?",        format:"Thread + Reel",   platform:["twitter","instagram"],   hook:"Spending 3 lakhs on a walk-in? Read this first 👇",              estimatedReach:"35–50K",  difficulty:"Easy",   tag:"decision-aid" },
    { angle:"Behind the scenes: Our craftsmen at work",            format:"Reel (60s)",      platform:["instagram","linkedin"],  hook:"It takes 14 artisans to build one Modulas wardrobe. Here's how.", estimatedReach:"55–90K",  difficulty:"Medium", tag:"brand-story" },
    { angle:"Client testimonial: Architect-referred project",      format:"Video (3 min)",   platform:["facebook","linkedin"],   hook:"Why Mumbai's top architects refer their clients to us",           estimatedReach:"25–40K",  difficulty:"Medium", tag:"social-proof"},
    { angle:"Feature spotlight: Motion sensor wardrobe lighting",  format:"Reel (15s)",      platform:["instagram"],             hook:"This wardrobe turns on when you open it 💡",                     estimatedReach:"100–180K",difficulty:"Easy",   tag:"viral-potential"},
  ],
  "Kitchen": [
    { angle:"10 kitchen storage hacks you didn't know",            format:"Carousel (10 slides)",platform:["instagram","facebook"], hook:"The pull-out mistake 90% of people make",                    estimatedReach:"60–95K",  difficulty:"Easy",   tag:"educational" },
    { angle:"Small kitchen → big kitchen: 1BHK transformation",   format:"Reel (45s)",      platform:["instagram","houzz"],     hook:"8ft × 10ft kitchen, infinite storage. Watch 👆",               estimatedReach:"90–140K", difficulty:"Easy",   tag:"trending"    },
    { angle:"Parallel vs L-shape vs U-shape kitchen explained",    format:"Carousel (6 slides)",platform:["instagram","linkedin"],hook:"Pick the wrong layout and regret it forever. Here's the guide.", estimatedReach:"30–50K", difficulty:"Easy",   tag:"educational" },
    { angle:"Our German hardware vs local: A 10-year test",        format:"Article + Post",  platform:["houzz","linkedin"],      hook:"Why we pay 4× more for European hinges",                        estimatedReach:"15–25K",  difficulty:"Medium", tag:"trust-builder"},
  ],
  "Wardrobe": [
    { angle:"The wardrobe that fits your actual life",             format:"Reel (30s)",      platform:["instagram","facebook"],  hook:"Stop buying wardrobes built for someone else's clothes 👗",      estimatedReach:"75–110K", difficulty:"Easy",   tag:"trending"    },
    { angle:"Walk-in wardrobe under ₹4L: Is it possible?",        format:"Carousel + Blog", platform:["houzz","instagram"],     hook:"We built a walk-in wardrobe for ₹3.8L. Here's everything.",     estimatedReach:"45–70K",  difficulty:"Medium", tag:"budget-guide"},
    { angle:"Wardrobe internal layout guide: For women",          format:"Carousel (12 slides)",platform:["instagram"],         hook:"How many shelves do you actually need? This changed everything.",estimatedReach:"55–85K",  difficulty:"Easy",   tag:"niche-specific"},
    { angle:"Motion sensor lighting: Show don't tell",            format:"Reel (10s)",       platform:["instagram"],            hook:"Open the door… 💡 (no caption needed)",                         estimatedReach:"120–200K",difficulty:"Easy",   tag:"viral-potential"},
  ],
  "Living Room": [
    { angle:"TV unit + wall panel complete makeover",             format:"Reel (30s)",       platform:["instagram","facebook"],  hook:"This wall was blank. Now it's the focal point of the home.",    estimatedReach:"65–100K", difficulty:"Easy",   tag:"trending"    },
    { angle:"Living room furniture layout mistakes",              format:"Carousel (8 slides)",platform:["instagram","linkedin"],hook:"Why your living room feels wrong (it's not the sofa)",          estimatedReach:"40–60K",  difficulty:"Easy",   tag:"educational" },
  ],
  "Bedroom": [
    { angle:"Platform bed with hydraulic storage reveal",        format:"Reel (20s)",        platform:["instagram","houzz"],    hook:"A bed with 400L of hidden storage. Really.",                   estimatedReach:"80–120K", difficulty:"Easy",   tag:"viral-potential"},
    { angle:"Bedroom design guide: Small to luxurious",          format:"Article + Carousel",platform:["houzz","homify"],       hook:"The 7 changes that make a bedroom feel 3× bigger",             estimatedReach:"20–35K",  difficulty:"Medium", tag:"seo-content"  },
  ],
  "Home Decor": [
    { angle:"India's interior design trends 2025: A deep dive",  format:"Article + Reel",    platform:["linkedin","instagram"], hook:"What 2,400 home projects taught us about Indian taste",         estimatedReach:"55–85K",  difficulty:"Medium", tag:"thought-leadership"},
    { angle:"Luxury home under ₹40L: A case study",             format:"Carousel (10 slides)",platform:["instagram","houzz"],  hook:"This entire 3BHK looks like a ₹1Cr home. Here's how.",         estimatedReach:"70–110K", difficulty:"Easy",   tag:"aspirational" },
  ],
};

const VOLUME_HISTORY: Record<string, { month: string; values: Record<string, number> }[]> = {
  "Modular Furniture": [
    { month:"Oct", values:{"modular kitchen india":14000, "modular wardrobe design 2025":8000, "luxury modular furniture":4200, "bedroom wardrobe designs":16000} },
    { month:"Nov", values:{"modular kitchen india":16000, "modular wardrobe design 2025":9400, "luxury modular furniture":5100, "bedroom wardrobe designs":18000} },
    { month:"Dec", values:{"modular kitchen india":24000, "modular wardrobe design 2025":13000,"luxury modular furniture":7800, "bedroom wardrobe designs":24000} },
    { month:"Jan", values:{"modular kitchen india":18000, "modular wardrobe design 2025":11000,"luxury modular furniture":6200, "bedroom wardrobe designs":22000} },
    { month:"Feb", values:{"modular kitchen india":20000, "modular wardrobe design 2025":12800,"luxury modular furniture":7100, "bedroom wardrobe designs":25000} },
    { month:"Mar", values:{"modular kitchen india":22000, "modular wardrobe design 2025":14600,"luxury modular furniture":8100, "bedroom wardrobe designs":29300} },
  ],
  "Kitchen": [
    { month:"Oct", values:{"modular kitchen cost mumbai":2200, "parallel kitchen design":7000, "kitchen renovation cost india":5800} },
    { month:"Nov", values:{"modular kitchen cost mumbai":2800, "parallel kitchen design":8200, "kitchen renovation cost india":6400} },
    { month:"Dec", values:{"modular kitchen cost mumbai":4100, "parallel kitchen design":12000,"kitchen renovation cost india":9200} },
    { month:"Jan", values:{"modular kitchen cost mumbai":3200, "parallel kitchen design":9400, "kitchen renovation cost india":7200} },
    { month:"Feb", values:{"modular kitchen cost mumbai":3800, "parallel kitchen design":10400,"kitchen renovation cost india":8200} },
    { month:"Mar", values:{"modular kitchen cost mumbai":4200, "parallel kitchen design":11400,"kitchen renovation cost india":9600} },
  ],
};

const TRENDING_TOPICS_BY_CATEGORY: Record<string, { topic: string; spike: string; context: string; contentIdea: string }[]> = {
  "Modular Furniture": [
    { topic:"Vastu-compliant kitchen layouts", spike:"+340% this week", context:"Festive season + new home purchases spike Vastu searches",  contentIdea:"Reel: 'Our kitchens are designed Vastu-first. Here's why'" },
    { topic:"Soft-close vs push-to-open drawers", spike:"+180% this week", context:"YouTube reviews driving comparison searches",            contentIdea:"Comparison Reel: demonstrate both in 15 seconds" },
    { topic:"Bamboo & sustainable furniture india", spike:"+210% this month",context:"Gen-Z buyers increasingly eco-conscious",              contentIdea:"LinkedIn article: Our sustainable sourcing story" },
    { topic:"AI furniture design tool", spike:"+420% this month", context:"ChatGPT hype driving AI tool searches across categories",        contentIdea:"Tease our 3D config tool as 'AI-powered design'" },
  ],
  "Kitchen": [
    { topic:"Open kitchen vs closed kitchen india", spike:"+290% this week", context:"Post-COVID home redesign wave continues in 2025",     contentIdea:"Carousel: pros/cons for Indian families (smell, privacy)" },
    { topic:"Kitchen chimney buying guide 2025",    spike:"+160% this week", context:"Seasonal purchase spike with kitchen renovations",     contentIdea:"Bundle guide: chimney + kitchen — joint content with partner brand" },
    { topic:"Quartz vs granite countertop",         spike:"+140% this month",context:"Premium kitchen upgrades trending post-festive season",contentIdea:"Side-by-side comparison in a client's kitchen" },
  ],
  "Wardrobe": [
    { topic:"Capsule wardrobe india 2025",           spike:"+510% this month", context:"Minimalism trend + Marie Kondo influence still strong", contentIdea:"'We designed India's first capsule wardrobe. Here's what's inside'" },
    { topic:"Walk-in closet tour india",             spike:"+380% this week", context:"Instagram aspirational content — high save rates",       contentIdea:"Client walk-in tour Reel — before, during, after" },
  ],
  "Living Room": [
    { topic:"Japandi interior design india",         spike:"+240% this month", context:"Minimalist Japanese-Scandinavian aesthetic trending globally", contentIdea:"Showcase a Japandi-style living room we completed" },
  ],
  "Bedroom": [
    { topic:"Bedroom makeover under 2 lakh india", spike:"+190% this week",  context:"Budget renovation searches surge in Q1",               contentIdea:"Budget breakdown Carousel: what ₹1.8L gets you at Modulas" },
  ],
  "Home Decor": [
    { topic:"Wabi-sabi interior design india",      spike:"+310% this month", context:"Imperfect, natural aesthetic trend from Japan going global", contentIdea:"Feature a raw-edge wood finish wardrobe as 'wabi-sabi'" },
    { topic:"Terracotta home decor india 2025",     spike:"+180% this week",  context:"Earthy colour palette trending across interior platforms",  contentIdea:"Show terracotta accent panel options in our collections" },
  ],
};

// ── Enhanced TrendsTab ────────────────────────────────────────────────────────
function TrendsTab() {
  const [category, setCategory] = useState("Modular Furniture");
  const [sortBy, setSortBy] = useState<"relevance"|"volume"|"difficulty">("relevance");
  const [intentFilter, setIntentFilter] = useState<"all"|"transactional"|"commercial"|"informational">("all");
  const [hashtagCategory, setHashtagCategory] = useState("all");
  const [selectedPlatformInsight, setSelectedPlatformInsight] = useState<Platform>("instagram");
  const [activeSection, setActiveSection] = useState<"keywords"|"gap"|"angles"|"hashtags"|"insights">("keywords");
  const [expandedKeyword, setExpandedKeyword] = useState<string|null>(null);
  const [selectedVolumeKws, setSelectedVolumeKws] = useState<string[]>([]);

  const categories = Object.keys(KEYWORD_DATA);
  const keywords = KEYWORD_DATA[category] ?? [];
  const filtered = keywords
    .filter((k) => intentFilter === "all" || k.intent === intentFilter)
    .sort((a, b) => sortBy === "relevance" ? b.relevance - a.relevance : sortBy === "volume" ? b.volNum - a.volNum : a.difficulty - b.difficulty);
  const quickWins = keywords.filter((k) => k.difficulty < 32 && k.relevance >= 80).sort((a, b) => b.relevance - a.relevance).slice(0, 4);
  const trendingUp = keywords.filter((k) => k.trend === "up").length;
  const gapKeywords = KEYWORD_GAP[category] ?? [];
  const contentAngles = CONTENT_ANGLES[category] ?? [];
  const trendingTopics = TRENDING_TOPICS_BY_CATEGORY[category] ?? [];
  const volumeHistory = VOLUME_HISTORY[category] ?? [];
  const hashtagCategories = ["all","furniture","kitchen","wardrobe","decor","luxury","brand","trending","professional","regional"];
  const filteredHashtags = HASHTAG_DATA.filter((h) => hashtagCategory === "all" || h.category === hashtagCategory);
  const insight = PLATFORM_INSIGHTS[selectedPlatformInsight];

  const intentColors: Record<string, string> = {
    transactional: "bg-emerald-50 text-emerald-700 border-emerald-200",
    commercial:    "bg-blue-50 text-blue-700 border-blue-200",
    informational: "bg-stone-100 text-charcoal/60 border-stone-200",
  };
  const priorityColors = { high:"bg-red-50 text-red-700 border-red-200", medium:"bg-amber-50 text-amber-700 border-amber-200", low:"bg-stone-100 text-charcoal/50 border-stone-200" };
  const tagColors: Record<string, string> = {
    trending:"bg-pink-50 text-pink-700 border-pink-200",
    educational:"bg-blue-50 text-blue-700 border-blue-200",
    "viral-potential":"bg-orange-50 text-orange-700 border-orange-200",
    "brand-story":"bg-violet-50 text-violet-700 border-violet-200",
    "social-proof":"bg-sky-50 text-sky-700 border-sky-200",
    "decision-aid":"bg-teal-50 text-teal-700 border-teal-200",
    "trust-builder":"bg-emerald-50 text-emerald-700 border-emerald-200",
    "budget-guide":"bg-amber-50 text-amber-700 border-amber-200",
    "niche-specific":"bg-purple-50 text-purple-700 border-purple-200",
    "thought-leadership":"bg-sky-50 text-sky-700 border-sky-200",
    "seo-content":"bg-green-50 text-green-700 border-green-200",
    aspirational:"bg-rose-50 text-rose-700 border-rose-200",
    default:"bg-stone-100 text-charcoal/50 border-stone-200",
  };

  const allVolKws = volumeHistory.length > 0 ? Object.keys(volumeHistory[0].values) : [];
  const activeVolKws = selectedVolumeKws.length > 0 ? selectedVolumeKws : allVolKws.slice(0, 3);
  const volColors = ["bg-amber-400","bg-pink-500","bg-sky-500","bg-emerald-500","bg-violet-500"];

  const SECTION_TABS = [
    { id:"keywords" as const, label:"Keyword Intelligence",   count: filtered.length },
    { id:"gap"      as const, label:"Keyword Gap Analysis",   count: gapKeywords.length },
    { id:"angles"   as const, label:"Content Angles",         count: contentAngles.length },
    { id:"hashtags" as const, label:"Hashtag Tracker",        count: filteredHashtags.length },
    { id:"insights" as const, label:"Platform Insights",      count: 7 },
  ];

  return (
    <div className="space-y-5">
      {/* ── Category selector ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button type="button" key={c} onClick={() => { setCategory(c); setExpandedKeyword(null); setSelectedVolumeKws([]); }}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              category === c ? "border-red-300 bg-red-50 text-red-600" : "border-black/8 bg-white text-charcoal/60 hover:border-black/20"
            }`}>{c}</button>
        ))}
      </div>

      {/* ── Summary stat bar ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label:"Keywords Tracked",  value: keywords.length, accent:"text-charcoal",   bg:"bg-white border-black/8" },
          { label:"Trending Up",       value: trendingUp,      accent:"text-emerald-600", bg:"bg-emerald-50 border-emerald-200" },
          { label:"Quick Wins",        value: quickWins.length,accent:"text-amber-700",   bg:"bg-amber-50 border-amber-200" },
          { label:"Keyword Gaps",      value: gapKeywords.length,accent:"text-red-600",   bg:"bg-red-50 border-red-200" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border ${s.bg} px-4 py-3`}>
            <p className={`text-2xl font-bold ${s.accent}`}>{s.value}</p>
            <p className="text-[10px] text-charcoal/40 mt-0.5 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Quick Wins Spotlight ─────────────────────────────────────────────── */}
      {quickWins.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-charcoal">Quick Win Keywords — Act Now</h3>
            <span className="ml-auto text-[10px] text-amber-600 font-medium">Low difficulty · High relevance</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickWins.map((k) => (
              <div key={k.keyword} className="rounded-lg border border-amber-200 bg-white p-3">
                <div className="flex items-start gap-1.5 mb-2">
                  <Hash className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-xs font-semibold text-charcoal leading-tight">{k.keyword}</p>
                </div>
                <div className="flex items-center justify-between text-[10px] mb-1.5">
                  <span className="text-charcoal/50">{k.volume}</span>
                  <span className="font-medium text-amber-700">{k.cpc} CPC</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${k.difficulty < 25 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                    Diff: {k.difficulty}
                  </span>
                  <span className="text-[10px] font-bold text-amber-700">{k.relevance}/100</span>
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {k.platforms.slice(0, 2).map((pl) => {
                    const cfg = PLATFORMS.find((x) => x.id === pl)!;
                    return <span key={pl} className={`rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${cfg.color} ${cfg.bg} ${cfg.border}`}>{cfg.label.split(" ")[0]}</span>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Trending Topics Alert ─────────────────────────────────────────────── */}
      {trendingTopics.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50/30 p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-semibold text-charcoal">Trending Topics Right Now</h3>
            <span className="ml-auto text-[10px] text-red-600 font-medium uppercase tracking-wider">Live Signals</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trendingTopics.map((t) => (
              <div key={t.topic} className="rounded-lg border border-red-100 bg-white p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-xs font-semibold text-charcoal leading-tight">{t.topic}</p>
                  <span className="shrink-0 rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[9px] font-bold text-red-600">{t.spike}</span>
                </div>
                <p className="text-[10px] text-charcoal/50 mb-2 leading-relaxed">{t.context}</p>
                <div className="flex items-start gap-1.5 rounded-lg bg-amber-50/80 border border-amber-200 px-2.5 py-2">
                  <Sparkles className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-amber-700 leading-relaxed font-medium">{t.contentIdea}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Section sub-tabs ─────────────────────────────────────────────────── */}
      <div className="flex gap-1 border-b border-black/8 overflow-x-auto">
        {SECTION_TABS.map((t) => (
          <button type="button" key={t.id} onClick={() => setActiveSection(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors -mb-px ${
              activeSection === t.id ? "border-red-400 text-red-600" : "border-transparent text-charcoal/50 hover:text-charcoal"
            }`}>
            {t.label}
            <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${activeSection===t.id ? "bg-red-100 text-red-600" : "bg-black/5 text-charcoal/40"}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* ── SECTION: Keyword Intelligence ─────────────────────────────────────── */}
      {activeSection === "keywords" && (
        <div className="space-y-4">
          {/* Volume trend chart */}
          {volumeHistory.length > 0 && (
            <div className="rounded-xl border border-black/8 bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-charcoal">6-Month Search Volume Trends</h3>
                <div className="flex gap-1 flex-wrap justify-end">
                  {allVolKws.map((kw, i) => {
                    const on = activeVolKws.includes(kw);
                    return (
                      <button type="button" key={kw} onClick={() => setSelectedVolumeKws(
                        on ? activeVolKws.filter((x) => x !== kw) : [...activeVolKws, kw].slice(0, 4)
                      )}
                        className={`rounded-full border px-2.5 py-0.5 text-[9px] font-medium transition-colors max-w-[120px] truncate ${on ? `${volColors[i % volColors.length].replace("bg-","border-").replace("-400","-300").replace("-500","-300")} bg-stone-50 text-charcoal` : "border-black/8 text-charcoal/30"}`}>
                        {kw.split(" ").slice(0, 3).join(" ")}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-end gap-3 h-32">
                {volumeHistory.map((m, mi) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center gap-0.5 flex-1">
                      {allVolKws.map((kw, ki) => {
                        if (!activeVolKws.includes(kw)) return null;
                        const val = m.values[kw] ?? 0;
                        const maxVal = Math.max(...volumeHistory.flatMap((mm) => activeVolKws.map((k) => mm.values[k] ?? 0)));
                        const h = maxVal > 0 ? Math.round((val / maxVal) * 100) : 0;
                        return (
                          <BarFill key={kw} title={`${kw}: ${val.toLocaleString()}`}
                            pct={h} vertical
                            className={`flex-1 rounded-t-sm ${volColors[ki % volColors.length]} ${h > 0 ? "min-h-[4px]" : ""}`} />
                        );
                      })}
                    </div>
                    <p className="text-[9px] text-charcoal/40 font-medium">{m.month}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-3 flex-wrap">
                {allVolKws.map((kw, i) => (
                  <span key={kw} className="flex items-center gap-1.5 text-[10px] text-charcoal/50">
                    <span className={`w-3 h-2 rounded-sm inline-block ${volColors[i % volColors.length]}`} />
                    {kw.split(" ").slice(0, 3).join(" ")}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Keyword table */}
          <div className="rounded-xl border border-black/8 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/6">
              <div>
                <h3 className="text-sm font-semibold text-charcoal">Keyword Intelligence — {category}</h3>
                <p className="text-xs text-charcoal/40 mt-0.5">{filtered.length} keywords tracked · updated daily</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <div className="flex gap-1">
                  {(["all","transactional","commercial","informational"] as const).map((i) => (
                    <button type="button" key={i} onClick={() => setIntentFilter(i)}
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-medium capitalize transition-colors ${intentFilter === i ? "border-amber-400 bg-amber-50 text-amber-700" : "border-black/8 text-charcoal/50 hover:border-black/20"}`}>
                      {i}
                    </button>
                  ))}
                </div>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
                  title="Sort keywords" aria-label="Sort keywords"
                  className="rounded-lg border border-black/10 bg-stone-50 px-2.5 py-1.5 text-xs text-charcoal focus:outline-none focus:border-amber-400">
                  <option value="relevance">Sort: Relevance</option>
                  <option value="volume">Sort: Volume</option>
                  <option value="difficulty">Sort: Easiest</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 text-left">
                    {["#","Keyword","Volume","CPC","Difficulty","Competition","Intent","Trend (7d)","Platforms","Score","Action"].map((h) => (
                      <th key={h} className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-charcoal/40 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/4">
                  {filtered.map((k, i) => (
                    <React.Fragment key={k.keyword}>
                      <tr
                        className={`hover:bg-stone-50/60 transition-colors cursor-pointer ${expandedKeyword===k.keyword ? "bg-amber-50/30" : ""}`}
                        onClick={() => setExpandedKeyword(expandedKeyword===k.keyword ? null : k.keyword)}>
                        <td className="px-4 py-3 text-[11px] text-charcoal/30 font-mono">{i+1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Hash className="h-3 w-3 text-charcoal/20 shrink-0" />
                            <p className="text-sm font-medium text-charcoal">{k.keyword}</p>
                            {k.difficulty < 30 && k.relevance >= 85 && (
                              <span className="rounded-full bg-amber-400 px-1.5 py-0.5 text-[8px] font-bold text-white">WIN</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-charcoal whitespace-nowrap">{k.volume}</td>
                        <td className="px-4 py-3 text-sm text-charcoal whitespace-nowrap">{k.cpc}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 bg-black/5 rounded-full overflow-hidden">
                              <BarFill pct={k.difficulty} className={`h-full rounded-full ${k.difficulty < 35 ? "bg-emerald-400" : k.difficulty < 50 ? "bg-amber-400" : "bg-red-400"}`} />
                            </div>
                            <span className={`text-xs font-bold ${k.difficulty < 35 ? "text-emerald-600" : k.difficulty < 50 ? "text-amber-600" : "text-red-500"}`}>{k.difficulty}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-medium ${k.competition==="Low"?"text-emerald-600":k.competition==="Medium"?"text-amber-600":"text-red-500"}`}>{k.competition}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${intentColors[k.intent]}`}>{k.intent}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Sparkline data={k.sparkline} color={k.trend==="up"?"stroke-emerald-500":k.trend==="down"?"stroke-red-400":"stroke-amber-400"} />
                            {k.trend==="up"     && <TrendingUp   className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                            {k.trend==="down"   && <TrendingDown  className="h-3.5 w-3.5 text-red-400 shrink-0" />}
                            {k.trend==="stable" && <span className="text-[10px] text-charcoal/30">—</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {k.platforms.slice(0, 3).map((pl) => {
                              const cfg = PLATFORMS.find((x) => x.id === pl)!;
                              return <span key={pl} className={`rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${cfg.color} ${cfg.bg} ${cfg.border}`}>{cfg.label.split(" ")[0]}</span>;
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 h-1.5 bg-black/5 rounded-full overflow-hidden">
                              <BarFill pct={k.relevance} className="h-full bg-amber-400 rounded-full" />
                            </div>
                            <span className="text-xs font-bold text-amber-700">{k.relevance}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button type="button" onClick={(e) => { e.stopPropagation(); }}
                              className="rounded-md border border-black/8 px-2 py-1 text-[10px] text-charcoal/50 hover:bg-black/5 transition-colors">
                              Use
                            </button>
                            {expandedKeyword === k.keyword
                              ? <ChevronUp className="h-4 w-4 text-charcoal/30" />
                              : <ChevronDown className="h-4 w-4 text-charcoal/30" />}
                          </div>
                        </td>
                      </tr>
                      {expandedKeyword === k.keyword && (
                        <tr>
                          <td colSpan={11} className="px-5 py-4 bg-amber-50/30 border-b border-amber-100">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/40 mb-2">Content Ideas</p>
                                <div className="space-y-1.5">
                                  {(contentAngles.slice(0, 3)).map((a) => (
                                    <div key={a.angle} className="flex items-start gap-1.5 text-xs text-charcoal/70">
                                      <span className="text-amber-500 mt-0.5 shrink-0">→</span>{a.angle}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/40 mb-2">Best Platforms for this Keyword</p>
                                <div className="flex flex-wrap gap-2">
                                  {k.platforms.map((pl) => {
                                    const cfg = PLATFORMS.find((x) => x.id === pl)!;
                                    return (
                                      <div key={pl} className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 ${cfg.bg} ${cfg.border}`}>
                                        <PlatformIcon id={pl} size="h-3 w-3" />
                                        <span className={`text-[11px] font-medium ${cfg.color}`}>{cfg.label}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/40 mb-2">Quick Actions</p>
                                <div className="flex flex-col gap-1.5">
                                  <button type="button" className="flex items-center gap-2 rounded-lg bg-charcoal px-3 py-1.5 text-xs font-medium text-white hover:bg-charcoal/90 transition-colors">
                                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />Generate content for this keyword
                                  </button>
                                  <button type="button" className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-charcoal hover:bg-black/5 transition-colors">
                                    <Bell className="h-3.5 w-3.5" />Set volume spike alert
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-black/6 flex items-center gap-6 text-xs text-charcoal/40">
              <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-emerald-400 inline-block" />Difficulty &lt;35: Easy win</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-amber-400 inline-block" />35–50: Moderate</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-red-400 inline-block" />&gt;50: Competitive</span>
              <span className="ml-auto flex items-center gap-1 cursor-pointer hover:text-charcoal">
                <Download className="h-3.5 w-3.5" />Export CSV
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION: Keyword Gap Analysis ──────────────────────────────────────── */}
      {activeSection === "gap" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-red-200 bg-red-50/30 px-5 py-4">
            <p className="text-xs text-red-700 leading-relaxed">
              <strong>Keyword gaps</strong> are high-opportunity terms your competitors are ranking for or using in their content — but Modulas is not yet targeting. These represent direct traffic and audience you're leaving on the table.
            </p>
          </div>
          <div className="rounded-xl border border-black/8 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-black/6 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-charcoal">Gap Keywords — {category}</h3>
              <span className="text-xs text-charcoal/40">{gapKeywords.length} opportunities identified</span>
            </div>
            {gapKeywords.length > 0 ? (
              <div className="divide-y divide-black/4">
                {gapKeywords.map((g, i) => (
                  <div key={g.keyword} className="p-4 hover:bg-stone-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[11px] text-charcoal/30 font-mono w-5 shrink-0">{i+1}</span>
                          <Hash className="h-3 w-3 text-charcoal/20 shrink-0" />
                          <p className="text-sm font-semibold text-charcoal">{g.keyword}</p>
                          <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${priorityColors[g.priority]}`}>{g.priority} priority</span>
                        </div>
                        <div className="flex items-center gap-4 ml-7 mb-2 text-xs">
                          <span className="text-charcoal/50">{g.volume}</span>
                          <span className={`font-medium ${g.difficulty < 25 ? "text-emerald-600" : g.difficulty < 40 ? "text-amber-600" : "text-red-500"}`}>Diff: {g.difficulty}</span>
                          {g.competitorUsing.length > 0
                            ? <span className="text-red-500">Used by: {g.competitorUsing.join(", ")}</span>
                            : <span className="text-emerald-600 font-medium">Uncontested — no one is targeting this!</span>}
                        </div>
                        <div className="ml-7 flex items-start gap-2 rounded-lg bg-amber-50/80 border border-amber-200 px-3 py-2">
                          <Zap className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                          <p className="text-[11px] text-amber-700 leading-relaxed">{g.opportunity}</p>
                        </div>
                      </div>
                      <button type="button" className="shrink-0 flex items-center gap-1.5 rounded-lg bg-charcoal px-3 py-1.5 text-[11px] font-medium text-white hover:bg-charcoal/90 transition-colors">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />Create Content
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-charcoal/30">
                <p className="text-sm">No keyword gaps identified for this category yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SECTION: Content Angles ────────────────────────────────────────────── */}
      {activeSection === "angles" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-black/8 bg-white p-1 overflow-hidden">
            <div className="px-4 pt-4 pb-3 border-b border-black/6">
              <h3 className="text-sm font-semibold text-charcoal">Content Angle Recommendations — {category}</h3>
              <p className="text-xs text-charcoal/40 mt-0.5">AI-suggested content angles based on trending keywords and what's working in your category</p>
            </div>
            <div className="divide-y divide-black/4">
              {contentAngles.map((a, i) => (
                <div key={a.angle} className="p-4 hover:bg-stone-50/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="text-[11px] text-charcoal/30 font-mono pt-0.5 w-5 shrink-0">{i+1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <p className="text-sm font-semibold text-charcoal">{a.angle}</p>
                        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${tagColors[a.tag] ?? tagColors.default}`}>{a.tag.replace(/-/g," ")}</span>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap text-xs text-charcoal/50 mb-2">
                        <span className="flex items-center gap-1"><Play className="h-3 w-3" />{a.format}</span>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />Est. reach: <strong className="text-emerald-600 ml-1">{a.estimatedReach}</strong></span>
                        <span className={`font-medium ${a.difficulty==="Easy"?"text-emerald-600":a.difficulty==="Medium"?"text-amber-600":"text-red-500"}`}>{a.difficulty} to produce</span>
                      </div>
                      {/* Hook preview */}
                      <div className="rounded-lg bg-stone-50 border border-black/6 px-3 py-2 mb-2">
                        <p className="text-[10px] text-charcoal/40 uppercase tracking-wider mb-0.5">Opening hook</p>
                        <p className="text-xs text-charcoal italic">"{a.hook}"</p>
                      </div>
                      {/* Platforms */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-charcoal/40">Best on:</span>
                        {a.platform.map((pl) => {
                          const cfg = PLATFORMS.find((x) => x.id === pl)!;
                          return (
                            <span key={pl} className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                              <PlatformIcon id={pl} size="h-3 w-3" />{cfg.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button type="button" className="flex items-center gap-1.5 rounded-lg bg-charcoal px-3 py-1.5 text-[11px] font-medium text-white hover:bg-charcoal/90 transition-colors">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />Generate
                      </button>
                      <button type="button" className="flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-1.5 text-[11px] font-medium text-charcoal hover:bg-black/5 transition-colors">
                        <Calendar className="h-3.5 w-3.5" />Schedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION: Hashtag Tracker ───────────────────────────────────────────── */}
      {activeSection === "hashtags" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-black/8 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-charcoal">Hashtag Performance Tracker</h3>
              <button type="button" className="flex items-center gap-1.5 rounded-lg border border-black/8 px-3 py-1.5 text-xs text-charcoal/60 hover:border-black/20 transition-colors">
                <Plus className="h-3.5 w-3.5" />Track Hashtag
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {hashtagCategories.map((c) => (
                <button type="button" key={c} onClick={() => setHashtagCategory(c)}
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-medium capitalize transition-colors ${hashtagCategory===c ? "border-amber-400 bg-amber-50 text-amber-700" : "border-black/8 text-charcoal/50 hover:border-black/14"}`}>
                  {c}
                </button>
              ))}
            </div>
            {/* Top performers highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 pb-5 border-b border-black/6">
              {HASHTAG_DATA.filter((h) => parseFloat(h.engRate) > 6).slice(0, 3).map((h) => (
                <div key={h.tag} className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 text-center">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">🏆 Top Performer</span>
                  <p className="text-sm font-bold text-amber-700">{h.tag}</p>
                  <p className="text-xl font-bold text-emerald-600 mt-1">{h.engRate}</p>
                  <p className="text-[10px] text-charcoal/40">{h.reach} reach</p>
                </div>
              ))}
            </div>
            {/* Full table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 text-left">
                    {["Hashtag","Posts","Reach","Eng Rate","Growth","Category","Action"].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-charcoal/40 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/4">
                  {filteredHashtags.map((h) => (
                    <tr key={h.tag} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-3 py-2.5">
                        <p className="text-xs font-bold text-amber-700">{h.tag}</p>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-charcoal/60">{h.uses}</td>
                      <td className="px-3 py-2.5 text-xs font-medium text-charcoal">{h.reach}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-sm font-bold ${parseFloat(h.engRate) > 5 ? "text-emerald-600" : parseFloat(h.engRate) > 3.5 ? "text-amber-600" : "text-charcoal/60"}`}>{h.engRate}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        {h.growth==="up"     && <span className="flex items-center gap-0.5 text-[11px] text-emerald-600 font-medium"><TrendingUp className="h-3 w-3" />Growing</span>}
                        {h.growth==="down"   && <span className="flex items-center gap-0.5 text-[11px] text-red-500 font-medium"><TrendingDown className="h-3 w-3" />Declining</span>}
                        {h.growth==="stable" && <span className="text-[11px] text-charcoal/30">Stable</span>}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="rounded-full bg-stone-100 border border-stone-200 px-2 py-0.5 text-[9px] font-medium text-charcoal/60 capitalize">{h.category}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <button type="button" className="rounded-md border border-black/8 px-2.5 py-1 text-[10px] text-charcoal/50 hover:bg-black/5 transition-colors">Add to set</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION: Platform Insights ─────────────────────────────────────────── */}
      {activeSection === "insights" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-black/8 bg-white p-5">
            <h3 className="text-sm font-semibold text-charcoal mb-4">Platform-Specific Trend Intelligence</h3>
            <div className="flex gap-2 flex-wrap mb-5">
              {PLATFORMS.map((p) => (
                <button type="button" key={p.id} onClick={() => setSelectedPlatformInsight(p.id)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${selectedPlatformInsight===p.id ? `${p.bg} ${p.border} ${p.color}` : "border-black/8 text-charcoal/50 hover:border-black/20"}`}>
                  <PlatformIcon id={p.id} size="h-3.5 w-3.5" />{p.label}
                </button>
              ))}
            </div>
            {/* 4-card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              {[
                { label:"Key Insight",   value:insight.insight,     icon:<BarChart2 className="h-4 w-4 text-charcoal/30" />, accent:"bg-stone-50 border-black/6" },
                { label:"Opportunity",   value:insight.opportunity, icon:<Zap className="h-4 w-4 text-amber-400" />,         accent:"bg-amber-50/60 border-amber-200" },
                { label:"Best Format",   value:insight.bestContent, icon:<Star className="h-4 w-4 text-blue-400" />,          accent:"bg-blue-50/60 border-blue-200" },
                { label:"Best Time",     value:insight.bestTime,    icon:<Clock className="h-4 w-4 text-emerald-500" />,      accent:"bg-emerald-50/60 border-emerald-200" },
              ].map((item) => (
                <div key={item.label} className={`rounded-xl border ${item.accent} p-4`}>
                  <div className="flex items-center gap-2 mb-2">{item.icon}<p className="text-[10px] uppercase tracking-wider font-semibold text-charcoal/50">{item.label}</p></div>
                  <p className="text-xs text-charcoal leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
            {/* All platforms comparison table */}
            <div className="border-t border-black/6 pt-5">
              <h4 className="text-xs font-semibold text-charcoal mb-3">All Platforms at a Glance</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-stone-50 text-left">
                      {["Platform","Key Insight","Opportunity","Best Format","Best Time"].map((h) => (
                        <th key={h} className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-charcoal/40 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/4">
                    {PLATFORMS.map((p) => {
                      const ins = PLATFORM_INSIGHTS[p.id];
                      return (
                        <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="px-3 py-3">
                            <div className={`flex items-center gap-2 ${p.color} font-semibold text-xs`}>
                              <PlatformIcon id={p.id} size="h-3.5 w-3.5" />{p.label}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-xs text-charcoal/70 max-w-[180px]">{ins.insight}</td>
                          <td className="px-3 py-3 text-xs text-amber-700 max-w-[180px]">{ins.opportunity}</td>
                          <td className="px-3 py-3 text-xs text-charcoal/60 whitespace-nowrap">{ins.bestContent}</td>
                          <td className="px-3 py-3 text-xs text-charcoal/60 whitespace-nowrap">{ins.bestTime}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 3 — Competitors (DETAILED)
// ─────────────────────────────────────────────────────────────────────────────
const COMPETITOR_DATA = [
  {
    name: "Godrej Interio", handle: "@godrejinterio", platform: "instagram" as Platform,
    allPlatforms: ["instagram","facebook","linkedin","houzz"] as Platform[],
    followers: "1.24M", weeklyGrowth: "+2.1K", avgEngagement: "4.2%", postsPerWeek: 7, monthlyPosts: 28,
    topContentType: "Reels", followerGrowthRate: "+0.17%/wk",
    avgSavedPerPost: "2.8K", avgViewsPerReel: "240K", audienceQuality: 7,
    contentBreakdown: { Reels: 40, Carousels: 25, Posts: 20, Videos: 10, Stories: 5 },
    postingPattern: "Mon/Wed/Fri 5–8 PM IST · Sat/Sun 10 AM–1 PM",
    themes: ["Product launches","Festive campaigns","Celebrity endorsements","Home makeovers","Brand heritage"],
    strategy: "Heavy on product launches + festive campaigns. Uses celebrity endorsements. Consistent brand voice. Invests in high-production Reels. Strong Facebook for older HNI segment.",
    weakness: "Inconsistent DM responses. Generic captions. Limited educational content. Poor SEO-optimised descriptions.",
    adActivity: "Active Meta ads — retargeting + lookalike campaigns. Est. ₹8–15L/month ad spend.",
    keywords: ["#GodrejInterio","#ModularFurniture","#HomeDecor","#InteriorDesign","#FurnitureShopping"],
    posts: [
      { type:"reel",     caption:"Introducing our Vertex collection — seamless lines, limitless style. 🏠✨", postedAgo:"2h",  likes:"12.4K", comments:"847", shares:"1.2K", saved:"3.4K", views:"284K", engagement:"4.8%", hashtags:["#GodrejInterio","#ModularFurniture","#HomeDecor"] },
      { type:"carousel", caption:"5 reasons why modular is the future of Indian homes. Swipe to see →",    postedAgo:"1d",  likes:"8.2K",  comments:"410", shares:"890",  saved:"2.1K", views:null,   engagement:"3.9%", hashtags:["#ModularHome","#InteriorDesign"] },
      { type:"story",    caption:"LIMITED OFFER: Free consultation this weekend at all showrooms",          postedAgo:"3h",  likes:"—",     comments:"—",   shares:"—",    saved:"—",    views:"48K",  engagement:"—",    hashtags:[] },
      { type:"post",     caption:"Your home, your rules. Explore 2400+ configurations at Godrej Interio.", postedAgo:"3d",  likes:"5.8K",  comments:"224", shares:"412",  saved:"1.4K", views:null,   engagement:"2.8%", hashtags:["#GodrejInterio","#HomeInterior"] },
    ],
  },
  {
    name: "Livspace", handle: "@livspace", platform: "instagram" as Platform,
    allPlatforms: ["instagram","facebook","linkedin","google"] as Platform[],
    followers: "892K", weeklyGrowth: "+3.8K", avgEngagement: "3.8%", postsPerWeek: 5, monthlyPosts: 20,
    topContentType: "Before/After", followerGrowthRate: "+0.43%/wk",
    avgSavedPerPost: "3.6K", avgViewsPerReel: "185K", audienceQuality: 8,
    contentBreakdown: { Reels: 50, Carousels: 30, Posts: 12, Videos: 5, Stories: 3 },
    postingPattern: "Tue/Thu/Sat 6–9 PM IST · Heavy on Sat/Sun",
    themes: ["Client transformation stories","Tech-forward design","Budget breakdowns","City-specific homes","Architect collab"],
    strategy: "Focus on transformation stories. Heavy use of client testimonials. Tech + design messaging. City-targeting (Bengaluru, Mumbai, Delhi) works very well for them.",
    weakness: "Too templated — same format every post. Weak niche content (wardrobe-only). No B2B/architect content. Houzz/Homify absent.",
    adActivity: "Very aggressive Google + Meta ads. Est. ₹25–40L/month. Heavy 'free consultation' CTAs.",
    keywords: ["#Livspace","#InteriorDesign","#HomeTransformation","#ModularKitchen","#HouseGoals"],
    posts: [
      { type:"reel",     caption:"From bare walls to dream home — Priya's 3BHK transformation in Bengaluru 🏡", postedAgo:"5h",  likes:"9.4K",  comments:"512", shares:"980",  saved:"4.2K", views:"198K", engagement:"5.1%", hashtags:["#Livspace","#HomeTransformation","#BengaluruHomes"] },
      { type:"carousel", caption:"Transform your kitchen in 45 days. Our designers make it seamless.",          postedAgo:"2d",  likes:"6.8K",  comments:"284", shares:"540",  saved:"1.8K", views:null,   engagement:"3.4%", hashtags:["#ModularKitchen","#KitchenDesign"] },
      { type:"post",     caption:"We've designed 50,000+ homes. Yours could be next. Book free consultation.", postedAgo:"4d",  likes:"4.2K",  comments:"168", shares:"320",  saved:"980",  views:null,   engagement:"2.1%", hashtags:["#Livspace","#InteriorDesign"] },
    ],
  },
  {
    name: "Spacewood", handle: "@spacewoodfurniture", platform: "facebook" as Platform,
    allPlatforms: ["facebook","instagram","houzz","linkedin"] as Platform[],
    followers: "342K", weeklyGrowth: "+480", avgEngagement: "5.1%", postsPerWeek: 4, monthlyPosts: 16,
    topContentType: "Product Videos", followerGrowthRate: "+0.14%/wk",
    avgSavedPerPost: "920", avgViewsPerReel: "84K", audienceQuality: 6,
    contentBreakdown: { Reels: 15, Carousels: 20, Posts: 25, Videos: 35, Stories: 5 },
    postingPattern: "Mon/Wed/Fri 9–11 AM · Fri 4–6 PM peak engagement",
    themes: ["German technology","Quality craftsmanship","Architect B2B","Wardrobe systems","Hardware features"],
    strategy: "German technology positioning. Quality-first messaging. Strong B2B architect targeting. Heavy product demo videos. LinkedIn active for trade/architect audience.",
    weakness: "Product-centric only — zero lifestyle or storytelling. Never engages with comments. Houzz profile outdated. No educational content.",
    adActivity: "Moderate Meta ads focused on B2B. LinkedIn sponsored posts for architects. Est. ₹4–8L/month.",
    keywords: ["#Spacewood","#GermanTech","#ModularWardrobe","#QualityFurniture","#HomeInterior"],
    posts: [
      { type:"video",    caption:"German precision. Indian craftsmanship. The perfect wardrobe awaits. 🇩🇪",  postedAgo:"1d",  likes:"6.2K",  comments:"298", shares:"840",  saved:"1.1K", views:"92K",  engagement:"5.1%", hashtags:["#Spacewood","#Wardrobe","#ModularFurniture"] },
      { type:"post",     caption:"Why 10,000+ architects trust Spacewood. Quality is non-negotiable.",         postedAgo:"3d",  likes:"3.8K",  comments:"142", shares:"520",  saved:"640",  views:null,   engagement:"3.8%", hashtags:["#ArchitectChoice","#QualityFurniture"] },
    ],
  },
  {
    name: "Sleek", handle: "@sleekworld", platform: "instagram" as Platform,
    allPlatforms: ["instagram","facebook","google"] as Platform[],
    followers: "214K", weeklyGrowth: "+220", avgEngagement: "3.3%", postsPerWeek: 6, monthlyPosts: 24,
    topContentType: "Tips & Hacks", followerGrowthRate: "+0.10%/wk",
    avgSavedPerPost: "2.1K", avgViewsPerReel: "68K", audienceQuality: 6,
    contentBreakdown: { Reels: 35, Carousels: 40, Posts: 15, Videos: 5, Stories: 5 },
    postingPattern: "Daily 8–10 AM · Tue/Thu/Sun 7 PM peak",
    themes: ["Kitchen storage hacks","Cost guides","Product comparisons","DIY organisation","Before/after kitchens"],
    strategy: "Educational content focus. Kitchen storage hacks. Mid-market positioning with aspirational tone. Very high carousel save rates — their clear strength. Consistent daily schedule.",
    weakness: "Kitchen-only — missing bedroom, wardrobe, living room. Low brand premium perception. No B2B/architect angle. Houzz/LinkedIn absent.",
    adActivity: "Light ad spend. Mainly boosted posts on Facebook. Est. ₹1–3L/month.",
    keywords: ["#SleekKitchen","#KitchenHacks","#KitchenDesign","#StorageSolutions","#HomeOrganization"],
    posts: [
      { type:"carousel", caption:"10 kitchen storage hacks you didn't know you needed. Swipe → 💡",           postedAgo:"2d",  likes:"3.8K",  comments:"187", shares:"920",  saved:"2.8K", views:null,   engagement:"5.4%", hashtags:["#KitchenHacks","#KitchenDesign","#StorageSolutions"] },
      { type:"reel",     caption:"Watch how a small kitchen becomes a chef's paradise in 60 seconds ⏱️",       postedAgo:"5d",  likes:"5.1K",  comments:"310", shares:"680",  saved:"1.9K", views:"78K",  engagement:"4.1%", hashtags:["#SleekKitchen","#KitchenTransformation"] },
    ],
  },
];

const BENCHMARK_DATA = [
  { metric:"Total Social Followers",    modulas:"86K",     godrej:"2.8M",    livspace:"1.9M",   spacewood:"580K",  sleek:"420K",   modulasWins:false },
  { metric:"Avg Engagement Rate",       modulas:"4.7%",    godrej:"4.2%",    livspace:"3.8%",   spacewood:"5.1%",  sleek:"3.3%",   modulasWins:false },
  { metric:"Monthly Post Volume",       modulas:"58",      godrej:"28",      livspace:"20",     spacewood:"16",    sleek:"24",     modulasWins:true  },
  { metric:"Platforms Active",          modulas:"7",       godrej:"4",       livspace:"4",      spacewood:"4",     sleek:"3",      modulasWins:true  },
  { metric:"Houzz Presence",            modulas:"Strong",  godrej:"Weak",    livspace:"None",   spacewood:"Weak",  sleek:"None",   modulasWins:true  },
  { metric:"Avg Saves per Post",        modulas:"1.4K",    godrej:"2.8K",    livspace:"3.6K",   spacewood:"920",   sleek:"2.1K",   modulasWins:false },
  { metric:"DM Response Time",          modulas:"<2 hrs",  godrej:"12 hrs",  livspace:"4 hrs",  spacewood:"24 hrs",sleek:"8 hrs",  modulasWins:true  },
  { metric:"Educational Content %",     modulas:"30%",     godrej:"10%",     livspace:"15%",    spacewood:"5%",    sleek:"55%",    modulasWins:false },
  { metric:"B2B / Architect Content",   modulas:"Active",  godrej:"Rare",    livspace:"None",   spacewood:"Active",sleek:"None",   modulasWins:true  },
  { metric:"Avg Reel Views",            modulas:"82K",     godrej:"240K",    livspace:"185K",   spacewood:"84K",   sleek:"68K",    modulasWins:false },
];

const COMPETITOR_GAP_INTEL: Record<string, {
  topicGaps: string[]; platformGaps: Platform[]; formatGaps: string[]; audienceGaps: string[]; counterMove: string;
}> = {
  "Godrej Interio": {
    topicGaps:    ["Educational buying guides","Vastu-compliant design content","EMI & finance content","Wardrobe tech features","B2B architect marketing"],
    platformGaps: ["homify","twitter"] as Platform[],
    formatGaps:   ["Long-form LinkedIn articles","Houzz project portfolios","X/Twitter threads","Homify project listings"],
    audienceGaps: ["First-time homebuyers","Tier-2 city buyers","Gen-Z aesthetic-first buyers"],
    counterMove:  "Publish 'honest buying guides' that Godrej Interio avoids — builds trust with buyers who find Godrej too salesy. Target their audience with educational Reels + Houzz listings they've neglected.",
  },
  "Livspace": {
    topicGaps:    ["Standalone product category content","Wardrobe-only deep-dives","Houzz SEO listings","B2B trade content","Premium niche audience"],
    platformGaps: ["houzz","homify","twitter"] as Platform[],
    formatGaps:   ["Short-form product spotlights","Detailed cost breakdown carousels","Technical deep-dive articles"],
    audienceGaps: ["Premium luxury buyers (₹50L+ budget)","Wardrobe-only buyers","Tier-1 HNI homeowners"],
    counterMove:  "Livspace goes broad — Modulas should go deep. Own the 'wardrobe-only' and 'modular kitchen premium' niches. Exploit their Houzz/Homify absence with rich project portfolios.",
  },
  "Spacewood": {
    topicGaps:    ["Lifestyle & storytelling content","Before/after transformations","Client testimonials","Trending design aesthetics","Home decor culture"],
    platformGaps: ["homify","twitter"] as Platform[],
    formatGaps:   ["Instagram Reels with lifestyle footage","Story polls & quizzes","Carousels with aspirational imagery"],
    audienceGaps: ["D2C homeowner segment","Women 28–40 (primary home design decision-maker)","First-time home buyers"],
    counterMove:  "Spacewood is cold and clinical — Modulas should be warm and human. Client transformation stories with emotional hooks will pull their audience. Beat their B2B angle with better LinkedIn thought leadership.",
  },
  "Sleek": {
    topicGaps:    ["Wardrobe & bedroom furniture","Living room design","Luxury & premium positioning","Architect partnerships","Complete home packages"],
    platformGaps: ["houzz","homify","linkedin"] as Platform[],
    formatGaps:   ["LinkedIn B2B content","Long-form Houzz project portfolios","Instagram Stories with strong CTAs"],
    audienceGaps: ["Premium buyers","B2B/architects","Homify browsing audience","LinkedIn-active professionals"],
    counterMove:  "Sleek only does kitchens. Modulas owns kitchen + wardrobe + bedroom + living room. Publish cross-category 'complete home' content they can't match. Adopt their educational carousel style but apply it across all categories at premium positioning.",
  },
};

function CompetitorsTab() {
  const [activeComp, setActiveComp] = useState(0);
  const [postFilter, setPostFilter] = useState<"all"|"reel"|"carousel"|"post"|"video"|"story">("all");
  const [activeCompSection, setActiveCompSection] = useState<"feed"|"strategy"|"benchmark"|"opportunities">("feed");
  const comp = COMPETITOR_DATA[activeComp];
  const filteredPosts = comp.posts.filter((p) => postFilter === "all" || p.type === postFilter);
  const platCfg = PLATFORMS.find((p) => p.id === comp.platform)!;
  const gapIntel = COMPETITOR_GAP_INTEL[comp.name];

  const typeIcons: Record<string, React.ReactNode> = {
    reel: <Play className="h-3.5 w-3.5" />, carousel: <Layers className="h-3.5 w-3.5" />,
    post: <ImageIcon className="h-3.5 w-3.5" />, video: <Video className="h-3.5 w-3.5" />, story: <AlignLeft className="h-3.5 w-3.5" />,
  };
  const typeColors: Record<string, string> = {
    reel:"bg-pink-50 text-pink-600 border-pink-200", carousel:"bg-violet-50 text-violet-600 border-violet-200",
    post:"bg-blue-50 text-blue-600 border-blue-200", video:"bg-amber-50 text-amber-600 border-amber-200",
    story:"bg-stone-100 text-charcoal/60 border-stone-200",
  };
  const breakdownColors = ["bg-pink-500","bg-violet-500","bg-blue-500","bg-amber-500","bg-stone-400"];
  const COMP_SECTIONS = [
    { id:"feed"          as const, label:"Content Feed"        },
    { id:"strategy"      as const, label:"Strategy Intel"      },
    { id:"benchmark"     as const, label:"Benchmark"           },
    { id:"opportunities" as const, label:"Opportunities"       },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-charcoal/50">Tracking {COMPETITOR_DATA.length} competitors · auto-refreshes every 4 hours</p>
        <button type="button" className="flex items-center gap-1.5 rounded-lg border border-black/8 bg-white px-3 py-1.5 text-xs text-charcoal/60 hover:border-black/20 transition-colors">
          <RefreshCw className="h-3.5 w-3.5" />Refresh Feed
        </button>
      </div>

      {/* Competitor selector cards */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {COMPETITOR_DATA.map((c, i) => {
          const p = PLATFORMS.find((pl) => pl.id === c.platform)!;
          return (
            <button type="button" key={c.name} onClick={() => setActiveComp(i)}
              className={`flex-shrink-0 rounded-xl border p-3 text-left transition-all min-w-[170px] ${activeComp === i ? `${p.bg} ${p.border} ring-2 ring-offset-1 ring-amber-400` : "border-black/8 bg-white hover:border-black/20"}`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold mb-1 ${p.color}`}>
                <PlatformIcon id={c.platform} size="h-3.5 w-3.5" />{c.name}
              </div>
              <p className="text-base font-bold text-charcoal">{c.followers}</p>
              <p className="text-[10px] text-charcoal/40 mb-2">{c.weeklyGrowth} this week · {c.avgEngagement} eng</p>
              <div className="flex gap-1 flex-wrap">
                {c.allPlatforms.slice(0, 4).map((pl) => {
                  const cfg = PLATFORMS.find((x) => x.id === pl)!;
                  return <span key={pl} className={`rounded-full border px-1.5 py-0.5 text-[8px] font-medium ${cfg.color} ${cfg.bg} ${cfg.border}`}>{cfg.label.slice(0,3)}</span>;
                })}
              </div>
            </button>
          );
        })}
      </div>

      {/* Sub-section tabs */}
      <div className="flex gap-1 border-b border-black/8 overflow-x-auto">
        {COMP_SECTIONS.map((s) => (
          <button type="button" key={s.id} onClick={() => setActiveCompSection(s.id)}
            className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors -mb-px ${
              activeCompSection === s.id ? "border-red-400 text-red-600" : "border-transparent text-charcoal/50 hover:text-charcoal"
            }`}>{s.label}</button>
        ))}
      </div>

      {/* ── SECTION: Content Feed ──────────────────────────────────────────────── */}
      {activeCompSection === "feed" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left panel */}
          <div className="space-y-4">
            <div className={`rounded-xl border ${platCfg.border} ${platCfg.bg} p-4`}>
              <div className={`flex items-center gap-2 ${platCfg.color} font-semibold text-sm mb-3`}>
                <PlatformIcon id={comp.platform} />{comp.name}
                <span className="ml-auto text-[10px] font-normal text-charcoal/40">{comp.handle}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Followers",     comp.followers],
                  ["Avg Engagement",comp.avgEngagement],
                  ["Posts/week",    comp.postsPerWeek],
                  ["Growth/wk",     comp.followerGrowthRate],
                  ["Top Format",    comp.topContentType],
                  ["Avg Saves",     comp.avgSavedPerPost],
                ].map(([l,v]) => (
                  <div key={String(l)}>
                    <p className="text-[10px] uppercase tracking-wider text-charcoal/40">{l}</p>
                    <p className="text-sm font-semibold text-charcoal">{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-black/8 bg-white p-4">
              <h4 className="text-xs font-semibold text-charcoal mb-3 flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-charcoal/40" />Their Top Hashtags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {comp.keywords.map((k) => (
                  <span key={k} className="rounded-full bg-stone-100 border border-stone-200 px-2.5 py-1 text-[10px] font-medium text-charcoal/70">{k}</span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 space-y-2">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-amber-700 mb-1">Beat {comp.name}</p>
              <button type="button" className="w-full flex items-center gap-2 rounded-lg bg-charcoal px-3 py-2 text-xs font-medium text-white hover:bg-charcoal/90 transition-colors">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />Generate counter-content with AI
              </button>
              <button type="button" className="w-full flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-medium text-charcoal hover:bg-black/5 transition-colors">
                <Bell className="h-3.5 w-3.5" />Alert me when they post
              </button>
              <button type="button" className="w-full flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-medium text-charcoal hover:bg-black/5 transition-colors">
                <Download className="h-3.5 w-3.5" />Export competitor report
              </button>
            </div>
          </div>

          {/* Right: Post feed */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-charcoal">Recent Posts — {comp.name}</h4>
              <div className="flex gap-1 flex-wrap justify-end">
                {(["all","reel","carousel","post","video","story"] as const).map((f) => (
                  <button type="button" key={f} onClick={() => setPostFilter(f)}
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-medium capitalize transition-colors ${postFilter === f ? "border-charcoal bg-charcoal text-white" : "border-black/8 text-charcoal/50 hover:border-black/20"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {filteredPosts.map((post, pi) => (
              <div key={pi} className="rounded-xl border border-black/8 bg-white">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${typeColors[post.type]}`}>
                        {typeIcons[post.type]}{post.type}
                      </span>
                      <span className="text-[11px] text-charcoal/40">{post.postedAgo}</span>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-[10px] font-medium text-amber-700 hover:bg-amber-100 transition-colors">
                        <Sparkles className="h-3 w-3" />Beat this
                      </button>
                      <button type="button" className="flex items-center gap-1.5 rounded-lg border border-black/8 px-2.5 py-1 text-[10px] text-charcoal/50 hover:bg-black/5 transition-colors">
                        <ExternalLink className="h-3 w-3" />View
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-charcoal leading-relaxed mb-3">"{post.caption}"</p>
                  {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.hashtags.map((h) => <span key={h} className="text-[10px] text-blue-600 font-medium">{h}</span>)}
                    </div>
                  )}
                  <div className="flex items-center gap-4 pt-3 border-t border-black/6">
                    {post.views    && <span className="flex items-center gap-1 text-xs text-charcoal/50"><Eye className="h-3.5 w-3.5" />{post.views}</span>}
                    {post.likes    !== "—" && <span className="flex items-center gap-1 text-xs text-charcoal/50"><Heart className="h-3.5 w-3.5" />{post.likes}</span>}
                    {post.comments !== "—" && <span className="flex items-center gap-1 text-xs text-charcoal/50"><MessageCircle className="h-3.5 w-3.5" />{post.comments}</span>}
                    {post.shares   !== "—" && <span className="flex items-center gap-1 text-xs text-charcoal/50"><Share2 className="h-3.5 w-3.5" />{post.shares}</span>}
                    {post.saved    !== "—" && <span className="flex items-center gap-1 text-xs text-charcoal/50"><Bookmark className="h-3.5 w-3.5" />{post.saved}</span>}
                    {post.engagement !== "—" && (
                      <span className="ml-auto flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <ArrowUpRight className="h-3.5 w-3.5" />{post.engagement} eng
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION: Strategy Intel ────────────────────────────────────────────── */}
      {activeCompSection === "strategy" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Strategy analysis card */}
            <div className="rounded-xl border border-black/8 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4 text-charcoal/30" />
                <h3 className="text-sm font-semibold text-charcoal">{comp.name} — Content Strategy</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/40 mb-1.5">Strategy Overview</p>
                  <p className="text-sm text-charcoal/80 leading-relaxed">{comp.strategy}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/40 mb-1.5">Key Content Themes</p>
                  <div className="flex flex-wrap gap-2">
                    {comp.themes.map((t) => (
                      <span key={t} className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-[10px] font-medium text-blue-700">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/40 mb-1.5">Posting Pattern</p>
                  <div className="flex items-center gap-2 rounded-lg bg-stone-50 border border-black/6 px-3 py-2">
                    <Clock className="h-3.5 w-3.5 text-charcoal/40 shrink-0" />
                    <p className="text-xs text-charcoal/70">{comp.postingPattern}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/40 mb-1.5">Ad Activity</p>
                  <div className="flex items-start gap-2 rounded-lg bg-amber-50/80 border border-amber-200 px-3 py-2">
                    <Target className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 leading-relaxed">{comp.adActivity}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-red-500 mb-1.5">Their Weakness</p>
                  <div className="flex items-start gap-2 rounded-lg bg-red-50/80 border border-red-200 px-3 py-2">
                    <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700 leading-relaxed">{comp.weakness}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Content format breakdown */}
              <div className="rounded-xl border border-black/8 bg-white p-5">
                <h3 className="text-sm font-semibold text-charcoal mb-4">Content Format Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(comp.contentBreakdown).map(([format, pct], i) => (
                    <div key={format} className="flex items-center gap-3">
                      <p className="w-20 shrink-0 text-xs text-charcoal/60">{format}</p>
                      <div className="flex-1 h-2 bg-black/5 rounded-full overflow-hidden">
                        <BarFill pct={pct} className={`h-full ${breakdownColors[i]} rounded-full`} />
                      </div>
                      <p className="w-10 shrink-0 text-right text-xs font-bold text-charcoal/70">{pct}%</p>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-charcoal/40 mt-3">{comp.monthlyPosts} posts/month · {comp.postsPerWeek}/week avg</p>
              </div>

              {/* Platform presence */}
              <div className="rounded-xl border border-black/8 bg-white p-5">
                <h3 className="text-sm font-semibold text-charcoal mb-3">Platform Presence</h3>
                <div className="space-y-2">
                  {PLATFORMS.map((p) => {
                    const active = comp.allPlatforms.includes(p.id);
                    return (
                      <div key={p.id} className={`flex items-center justify-between rounded-lg border px-3 py-2 ${active ? `${p.bg} ${p.border}` : "border-black/5 bg-stone-50"}`}>
                        <div className={`flex items-center gap-2 text-xs font-medium ${active ? p.color : "text-charcoal/30"}`}>
                          <PlatformIcon id={p.id} size="h-3.5 w-3.5" />{p.label}
                        </div>
                        {active
                          ? <CheckCircle2 className={`h-4 w-4 ${p.color}`} />
                          : <span className="text-[10px] text-charcoal/25 italic">Not active</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION: Benchmark ─────────────────────────────────────────────────── */}
      {activeCompSection === "benchmark" && (
        <div className="space-y-5">
          {/* Summary KPI cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label:"Metrics where Modulas Leads", value: BENCHMARK_DATA.filter((b) => b.modulasWins).length, color:"text-emerald-600", bg:"bg-emerald-50 border-emerald-200" },
              { label:"Metrics to Improve",          value: BENCHMARK_DATA.filter((b) => !b.modulasWins).length,color:"text-red-500",     bg:"bg-red-50 border-red-200" },
              { label:"More platforms than avg comp", value:"+3",  color:"text-amber-700", bg:"bg-amber-50 border-amber-200" },
              { label:"Engagement vs avg competitor", value:"+0.9%",color:"text-sky-600",  bg:"bg-sky-50 border-sky-200" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl border ${s.bg} px-4 py-3`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-charcoal/40 mt-0.5 uppercase tracking-wider leading-snug">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="rounded-xl border border-black/8 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-black/6">
              <h3 className="text-sm font-semibold text-charcoal">Modulas vs Competitors — Key Metrics</h3>
              <p className="text-xs text-charcoal/40 mt-0.5">Green rows = Modulas leads · Data as of March 2026</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 text-left">
                    {["Metric","Modulas","Godrej Interio","Livspace","Spacewood","Sleek"].map((h) => (
                      <th key={h} className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-charcoal/40 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/4">
                  {BENCHMARK_DATA.map((row) => (
                    <tr key={row.metric} className={row.modulasWins ? "bg-emerald-50/40" : "hover:bg-stone-50/50"}>
                      <td className="px-4 py-3 text-xs font-medium text-charcoal/70">{row.metric}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold ${row.modulasWins ? "text-emerald-600" : "text-charcoal/70"}`}>{row.modulas}</span>
                        {row.modulasWins && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 inline ml-1.5" />}
                      </td>
                      <td className="px-4 py-3 text-xs text-charcoal/60">{row.godrej}</td>
                      <td className="px-4 py-3 text-xs text-charcoal/60">{row.livspace}</td>
                      <td className="px-4 py-3 text-xs text-charcoal/60">{row.spacewood}</td>
                      <td className="px-4 py-3 text-xs text-charcoal/60">{row.sleek}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Engagement rate visual comparison */}
          <div className="rounded-xl border border-black/8 bg-white p-5">
            <h3 className="text-sm font-semibold text-charcoal mb-4">Engagement Rate — Visual Comparison</h3>
            <div className="space-y-3">
              {[
                { name:"Spacewood",      rate:5.1, color:"bg-amber-400",   highlight:false },
                { name:"Modulas",        rate:4.7, color:"bg-emerald-500", highlight:true  },
                { name:"Godrej Interio", rate:4.2, color:"bg-blue-400",    highlight:false },
                { name:"Livspace",       rate:3.8, color:"bg-violet-400",  highlight:false },
                { name:"Sleek",          rate:3.3, color:"bg-stone-400",   highlight:false },
              ].map((item) => (
                <div key={item.name} className={`flex items-center gap-3 rounded-lg p-2.5 ${item.highlight ? "bg-emerald-50/60 border border-emerald-200" : ""}`}>
                  <p className={`w-28 shrink-0 text-xs font-medium ${item.highlight ? "text-emerald-700 font-bold" : "text-charcoal/60"}`}>{item.name}</p>
                  <div className="flex-1 h-2.5 bg-black/5 rounded-full overflow-hidden">
                    <BarFill pct={(item.rate / 6) * 100} className={`h-full ${item.color} rounded-full`} />
                  </div>
                  <p className={`w-12 shrink-0 text-right text-sm font-bold ${item.highlight ? "text-emerald-600" : "text-charcoal/60"}`}>{item.rate}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION: Opportunities ─────────────────────────────────────────────── */}
      {activeCompSection === "opportunities" && (
        <div className="space-y-5">
          {/* Counter-move callout */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
            <div className="flex items-start gap-3">
              <Zap className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-charcoal mb-1">How to Beat {comp.name}</p>
                <p className="text-xs text-amber-800 leading-relaxed">{gapIntel.counterMove}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Topic gaps */}
            <div className="rounded-xl border border-black/8 bg-white p-5">
              <h3 className="text-sm font-semibold text-charcoal mb-1 flex items-center gap-2">
                <FileText className="h-4 w-4 text-charcoal/30" />Topics They Are NOT Covering
              </h3>
              <p className="text-[11px] text-charcoal/40 mb-3">Publish these first — {comp.name} has left these gaps open.</p>
              <div className="space-y-2">
                {gapIntel.topicGaps.map((t) => (
                  <div key={t} className="flex items-center justify-between gap-3 rounded-lg border border-black/6 bg-stone-50 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <p className="text-xs text-charcoal/80">{t}</p>
                    </div>
                    <button type="button" className="shrink-0 flex items-center gap-1 rounded-md border border-black/8 px-2 py-1 text-[10px] text-charcoal/50 hover:bg-black/5 transition-colors">
                      <Sparkles className="h-3 w-3 text-amber-400" />Create
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform + format gaps */}
            <div className="rounded-xl border border-black/8 bg-white p-5">
              <h3 className="text-sm font-semibold text-charcoal mb-1 flex items-center gap-2">
                <Share2 className="h-4 w-4 text-charcoal/30" />Platforms They Are Ignoring
              </h3>
              <p className="text-[11px] text-charcoal/40 mb-3">Modulas can dominate here while {comp.name} isn't competing.</p>
              <div className="space-y-2 mb-5">
                {gapIntel.platformGaps.map((pl) => {
                  const cfg = PLATFORMS.find((x) => x.id === pl)!;
                  return (
                    <div key={pl} className={`flex items-center justify-between rounded-lg border ${cfg.border} ${cfg.bg} px-3 py-2.5`}>
                      <div className={`flex items-center gap-2 text-xs font-medium ${cfg.color}`}>
                        <PlatformIcon id={pl} size="h-3.5 w-3.5" />{cfg.label}
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600">Uncontested ✓</span>
                    </div>
                  );
                })}
              </div>
              <h4 className="text-xs font-semibold text-charcoal mb-2">Content Formats They Are Missing</h4>
              <div className="space-y-1.5">
                {gapIntel.formatGaps.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-charcoal/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />{f}
                  </div>
                ))}
              </div>
            </div>

            {/* Audience gaps */}
            <div className="rounded-xl border border-black/8 bg-white p-5 lg:col-span-2">
              <h3 className="text-sm font-semibold text-charcoal mb-1 flex items-center gap-2">
                <Users className="h-4 w-4 text-charcoal/30" />Audience Segments They Are Missing
              </h3>
              <p className="text-[11px] text-charcoal/40 mb-4">These segments are underserved by {comp.name} — prime Modulas targeting opportunities.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {gapIntel.audienceGaps.map((a) => (
                  <div key={a} className="rounded-xl border border-violet-200 bg-violet-50/40 p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <ArrowUpRight className="h-3.5 w-3.5 text-violet-500 mt-0.5 shrink-0" />
                      <p className="text-xs font-medium text-violet-800 leading-relaxed">{a}</p>
                    </div>
                    <button type="button" className="w-full rounded-md bg-violet-600 px-2 py-1.5 text-[10px] font-semibold text-white hover:bg-violet-700 transition-colors">
                      Target This Segment
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 4 — Content Studio (DETAILED)
// ─────────────────────────────────────────────────────────────────────────────
const POST_TYPES = ["Reel / Video", "Story", "Carousel", "Static Post", "Thread", "Article", "LinkedIn PDF"];
const CAPTION_TONES = ["Luxury & Editorial", "Friendly & Warm", "Educational", "Bold & Punchy", "Minimal", "Urgency / FOMO"];
const CAPTION_GOALS = ["Brand Awareness", "Drive Consultations", "Product Showcase", "Architect Targeting", "Festive / Sale", "Client Story"];

const HASHTAG_SETS = [
  { name:"Kitchen Essentials",   tags:["#ModularKitchen","#KitchenDesign","#KitchenGoals","#ModulasKitchen","#IndianKitchen","#KitchenInspiration","#KitchenRenovation","#LuxuryKitchen"] },
  { name:"Wardrobe Focus",       tags:["#ModularWardrobe","#WardrobeGoals","#WalkInWardrobe","#WardrobeDesign","#ClosetGoals","#SlideWardrobe","#ModulasWardrobe","#BedroomStorage"] },
  { name:"Brand Core",           tags:["#ModulasIndia","#ModulasFurniture","#LuxuryFurniture","#CustomFurniture","#HandcraftedFurniture","#MadeInIndia","#PremiumFurniture"] },
  { name:"Interior Design Wide", tags:["#InteriorDesign","#HomeInterior","#HomeDecor","#IndianInterior","#InteriorIndia","#HomeGoals","#HomeTransformation","#LuxuryLiving"] },
  { name:"Trending 2025",        tags:["#HomeDecor2025","#InteriorTrends2025","#ModernHome","#ContemporaryDesign","#FurnitureTrends","#HomeInspiration2025"] },
];

const GENERATED_CAPTIONS: Record<string, string> = {
  "Luxury & Editorial": `✨ Craftsmanship meets intelligence.

Introducing our new wardrobe series — engineered for the way you actually live. Soft-close drawers, motion-sensor lighting, and a layout that remembers you.

This is furniture that thinks.

📍 Showroom: BKC Mumbai · Koramangala Bengaluru · Vasant Kunj Delhi
🔗 Book your complimentary consultation (link in bio)

#ModulasFurniture #LuxuryWardrobe #ModularFurniture #HomeInterior #WardrobeDesign #IndianInterior #LuxuryLiving #HomeDecor2025 #InteriorDesign #FurnitureIndia #CustomWardrobe #ModulasIndia`,

  "Friendly & Warm": `Hey! 👋 We just finished this stunning wardrobe for a family in Mumbai and honestly — we're obsessed 😍

Soft-close drawers ✅
Motion-sensor lighting ✅
A spot for literally everything ✅

Your home deserves this too! DM us or tap the link in bio to book your free design consultation 💛

#ModulasFurniture #WardrobeGoals #HomeInterior #ModularWardrobe #MumbaiHomes #HomeDecor2025 #InteriorDesign`,

  "Bold & Punchy": `YOUR WARDROBE IS LYING TO YOU.
Off-the-shelf isn't built for your life.
Modulas is.

→ Custom dimensions
→ Motion sensor lighting
→ Delivered in 30 days

Stop settling. Start designing.

📍 Mumbai · Bengaluru · Delhi NCR
🔗 Free consultation — link in bio

#ModulasFurniture #LuxuryWardrobe #ModularFurniture #CustomFurniture #HomeInterior`,

  "Educational": `💡 5 things to check before buying a modular wardrobe in India:

1️⃣ Board quality — ask for BWR (Boiling Water Resistant) grade
2️⃣ Hardware origin — European hinges last 10× longer than local ones
3️⃣ Lam finish — matte vs gloss wears differently over time
4️⃣ Internal layout — one size does NOT fit all
5️⃣ Delivery timeline — under 30 days is achievable

At Modulas, we tick all 5.

Save this for your reference 📌

#WardrobeDesign #ModularFurniture #HomeRenovationTips #InteriorDesignIndia #FurnitureTips`,

  "Minimal": `A wardrobe that thinks before it speaks.

Modulas — Custom modular furniture.
Mumbai · Bengaluru · Delhi

→ Book a consultation

#ModulasFurniture #Minimal #LuxuryLiving`,

  "Urgency / FOMO": `⏰ Last 3 slots this month — Design Consultation FREE

Our Bengaluru studio is nearly fully booked for March. If you've been thinking about that kitchen or wardrobe redesign — now is the time.

✅ 30-day delivery
✅ 5-year warranty
✅ Free 3D design visualisation

👉 Book NOW — link in bio (slots go fast!)

#ModulasFurniture #ModularKitchen #WardrobeDesign #LimitedSlots #FreeConsultation`,
};

function StudioTab() {
  const [postType, setPostType] = useState("Reel / Video");
  const [tone, setTone] = useState("Luxury & Editorial");
  const [goal, setGoal] = useState("Product Showcase");
  const [keyword, setKeyword] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["instagram","facebook","houzz"]);
  const [generated, setGenerated] = useState(false);
  const [activeHashtagSet, setActiveHashtagSet] = useState(0);
  const [captionVariant, setCaptionVariant] = useState(0);
  const [previewPlatform, setPreviewPlatform] = useState<Platform>("instagram");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("18:00");

  const captionText = GENERATED_CAPTIONS[tone] ?? GENERATED_CAPTIONS["Luxury & Editorial"];

  function togglePlatform(id: Platform) {
    setSelectedPlatforms((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Input: col 1-2 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-black/8 bg-white p-5">
            <h3 className="text-sm font-semibold text-charcoal mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />Content Brief
            </h3>

            {/* Post type */}
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/40 mb-2">Content Format</p>
              <div className="flex flex-wrap gap-1.5">
                {POST_TYPES.map((t) => (
                  <button type="button" key={t} onClick={() => setPostType(t)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${postType===t ? "border-amber-400 bg-amber-50 text-amber-700 font-medium" : "border-black/8 text-charcoal/50 hover:border-black/20"}`}>{t}</button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/40 mb-2">Tone</p>
              <div className="flex flex-wrap gap-1.5">
                {CAPTION_TONES.map((t) => (
                  <button type="button" key={t} onClick={() => setTone(t)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${tone===t ? "border-red-300 bg-red-50 text-red-600 font-medium" : "border-black/8 text-charcoal/50 hover:border-black/20"}`}>{t}</button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/40 mb-2">Goal / Campaign</p>
              <div className="flex flex-wrap gap-1.5">
                {CAPTION_GOALS.map((g) => (
                  <button type="button" key={g} onClick={() => setGoal(g)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${goal===g ? "border-sky-300 bg-sky-50 text-sky-700 font-medium" : "border-black/8 text-charcoal/50 hover:border-black/20"}`}>{g}</button>
                ))}
              </div>
            </div>

            {/* Focus */}
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/40 mb-1.5">Product / Keyword Focus</p>
              <input type="text" value={keyword} onChange={(e)=>setKeyword(e.target.value)}
                placeholder="e.g. walk-in wardrobe with island, Bengaluru project"
                className="w-full rounded-lg border border-black/10 bg-stone-50 px-3 py-2.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20" />
            </div>

            {/* Platforms */}
            <div className="mb-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/40 mb-2">Publish To</p>
              <div className="grid grid-cols-2 gap-1.5">
                {PLATFORMS.map((p) => {
                  const on = selectedPlatforms.includes(p.id);
                  return (
                    <button type="button" key={p.id} onClick={() => togglePlatform(p.id)}
                      className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${on ? `${p.bg} ${p.border} ${p.color}` : "border-black/8 text-charcoal/50 hover:border-black/20"}`}>
                      <PlatformIcon id={p.id} size="h-3.5 w-3.5" />
                      {p.label}
                      {on && <CheckCircle2 className="h-3.5 w-3.5 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="button" onClick={() => setGenerated(true)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-charcoal px-4 py-2.5 text-sm font-semibold text-white hover:bg-charcoal/90 transition-colors">
              <Sparkles className="h-4 w-4 text-amber-400" />Generate Caption + Hashtags
            </button>
          </div>
        </div>

        {/* Output: col 3-5 */}
        <div className="lg:col-span-3 space-y-4">
          {generated ? (
            <>
              {/* Caption output */}
              <div className="rounded-xl border border-black/8 bg-white p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-charcoal">Generated Caption</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0,1].map((v) => (
                        <button type="button" key={v} onClick={() => setCaptionVariant(v)}
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors ${captionVariant===v ? "bg-charcoal text-white" : "border border-black/10 text-charcoal/50"}`}>
                          Variant {v+1}
                        </button>
                      ))}
                    </div>
                    <button type="button" className="text-[11px] text-amber-600 hover:underline font-medium">Regenerate</button>
                  </div>
                </div>
                <textarea defaultValue={captionText} rows={12} aria-label="Caption text"
                  className="w-full rounded-lg border border-black/10 bg-stone-50 p-3 text-sm text-charcoal leading-relaxed font-sans focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 resize-none" />
                <div className="flex gap-2 mt-3">
                  <button type="button" className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-charcoal px-4 py-2 text-xs font-medium text-white hover:bg-charcoal/90 transition-colors">
                    <Copy className="h-3.5 w-3.5" />Copy Caption
                  </button>
                  <button type="button" className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-black/10 px-4 py-2 text-xs font-medium text-charcoal hover:bg-black/5 transition-colors">
                    <BookmarkPlus className="h-3.5 w-3.5" />Save Draft
                  </button>
                </div>
              </div>

              {/* Hashtag sets */}
              <div className="rounded-xl border border-black/8 bg-white p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-charcoal">Hashtag Sets</h3>
                  <button type="button" className="text-[11px] text-amber-600 hover:underline font-medium flex items-center gap-1">
                    <Plus className="h-3 w-3" />New Set
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 mb-3">
                  {HASHTAG_SETS.map((s, i) => (
                    <button type="button" key={s.name} onClick={() => setActiveHashtagSet(i)}
                      className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors ${activeHashtagSet===i ? "border-amber-400 bg-amber-50 text-amber-700" : "border-black/8 text-charcoal/50 hover:border-black/20"}`}>
                      {s.name}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {HASHTAG_SETS[activeHashtagSet].tags.map((t) => (
                    <span key={t} className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-[11px] font-medium text-amber-700 cursor-pointer hover:bg-amber-100 transition-colors">{t}</span>
                  ))}
                </div>
                <button type="button" className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg border border-black/10 px-4 py-2 text-xs font-medium text-charcoal hover:bg-black/5 transition-colors">
                  <Copy className="h-3.5 w-3.5" />Copy all hashtags
                </button>
              </div>

              {/* Phone preview */}
              <div className="rounded-xl border border-black/8 bg-white p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-charcoal">Post Preview</h3>
                  <div className="flex gap-1">
                    {(["instagram","facebook","linkedin"] as Platform[]).map((pl) => {
                      const cfg = PLATFORMS.find((p)=>p.id===pl)!;
                      return (
                        <button type="button" key={pl} onClick={() => setPreviewPlatform(pl)}
                          className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors ${previewPlatform===pl ? `${cfg.bg} ${cfg.border} ${cfg.color}` : "border-black/8 text-charcoal/50"}`}>
                          <PlatformIcon id={pl} size="h-3 w-3" />{cfg.label.split(" ")[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Mock phone */}
                <div className="mx-auto w-64 rounded-[24px] border-4 border-charcoal/10 bg-white shadow-lg overflow-hidden">
                  <div className="bg-stone-100 h-4 flex items-center justify-center">
                    <div className="w-12 h-1.5 rounded-full bg-charcoal/20" />
                  </div>
                  {/* Platform bar */}
                  <div className={`px-3 py-2 flex items-center gap-2 border-b border-black/6 ${PLATFORMS.find(p=>p.id===previewPlatform)?.bg}`}>
                    <div className="w-7 h-7 rounded-full bg-charcoal/10 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-charcoal/50">M</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-charcoal">modulasfurniture</p>
                      <p className="text-[9px] text-charcoal/40">Mumbai, India</p>
                    </div>
                  </div>
                  {/* Image area */}
                  <div className="bg-gradient-to-br from-stone-200 to-stone-300 h-40 flex items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-stone-400" />
                  </div>
                  {/* Actions */}
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-3 mb-2">
                      <Heart className="h-4 w-4 text-charcoal/40" />
                      <MessageCircle className="h-4 w-4 text-charcoal/40" />
                      <Share2 className="h-4 w-4 text-charcoal/40" />
                      <Bookmark className="h-4 w-4 ml-auto text-charcoal/40" />
                    </div>
                    <p className="text-[9px] text-charcoal leading-relaxed line-clamp-3">{captionText.slice(0,120)}…</p>
                  </div>
                </div>
              </div>

              {/* Best time to post */}
              <div className="rounded-xl border border-black/8 bg-white p-5">
                <h3 className="text-sm font-semibold text-charcoal mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-charcoal/40" />Best Times to Post
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedPlatforms.map((pl) => {
                    const times: Record<Platform, string> = {
                      instagram:"6:00 PM", facebook:"9:00 AM", linkedin:"8:00 AM",
                      twitter:"12:00 PM", google:"—", houzz:"10:00 AM", homify:"7:30 PM",
                    };
                    const cfg = PLATFORMS.find((p) => p.id===pl)!;
                    return (
                      <div key={pl} className={`flex items-center gap-2.5 rounded-lg border ${cfg.border} ${cfg.bg} px-3 py-2`}>
                        <PlatformIcon id={pl} size="h-4 w-4" />
                        <div>
                          <p className={`text-xs font-bold ${cfg.color}`}>{times[pl]}</p>
                          <p className="text-[10px] text-charcoal/40">{cfg.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Schedule inline */}
                <div className="mt-4 pt-4 border-t border-black/6">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/40 mb-2">Schedule This Post</p>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label htmlFor="sched-date" className="text-[10px] text-charcoal/40 mb-1 block">Date</label>
                      <input id="sched-date" type="date" value={scheduleDate} onChange={(e)=>setScheduleDate(e.target.value)}
                        className="w-full rounded-lg border border-black/10 bg-stone-50 px-2.5 py-2 text-xs text-charcoal focus:border-amber-400 focus:outline-none" />
                    </div>
                    <div>
                      <label htmlFor="sched-time" className="text-[10px] text-charcoal/40 mb-1 block">Time</label>
                      <input id="sched-time" type="time" value={scheduleTime} onChange={(e)=>setScheduleTime(e.target.value)}
                        className="w-full rounded-lg border border-black/10 bg-stone-50 px-2.5 py-2 text-xs text-charcoal focus:border-amber-400 focus:outline-none" />
                    </div>
                  </div>
                  <button type="button" className="w-full flex items-center justify-center gap-2 rounded-lg bg-charcoal px-4 py-2 text-xs font-medium text-white hover:bg-charcoal/90 transition-colors">
                    <Send className="h-3.5 w-3.5" />Add to Scheduler Queue
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-black/10 bg-stone-50 flex flex-col items-center justify-center h-80 text-center text-charcoal/30 p-8">
              <Sparkles className="h-12 w-12 mb-4 text-amber-200" />
              <p className="text-sm font-medium text-charcoal/40">Configure your brief on the left</p>
              <p className="text-xs mt-1">Select format, tone, goal, keywords and platforms — then click Generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 5 — Scheduler (DETAILED)
// ─────────────────────────────────────────────────────────────────────────────
type PostStatus = "published"|"scheduled"|"draft"|"failed";

interface ScheduledPost {
  id: number; title: string; platforms: Platform[]; type: string;
  date: string; time: string; month: number; day: number;
  status: PostStatus; reach_est?: string; note?: string;
}

const ALL_POSTS: ScheduledPost[] = [
  // Past / published
  { id:1,  title:"Spring Wardrobe Collection Launch",         platforms:["instagram","facebook"],  type:"reel",     date:"Mon 10 Mar", time:"6:00 PM",  month:3, day:10, status:"published", reach_est:"84K" },
  { id:2,  title:"Client Transformation — Juhu 3BHK",        platforms:["instagram","houzz"],     type:"carousel", date:"Wed 12 Mar", time:"10:00 AM", month:3, day:12, status:"published", reach_est:"52K" },
  { id:3,  title:"5 Kitchen Layout Mistakes to Avoid",       platforms:["facebook","linkedin"],   type:"post",     date:"Thu 13 Mar", time:"12:00 PM", month:3, day:13, status:"published", reach_est:"38K" },
  { id:4,  title:"BTS Workshop — Craftsmen at Work",         platforms:["instagram"],             type:"story",    date:"Fri 14 Mar", time:"9:00 AM",  month:3, day:14, status:"published", reach_est:"21K" },
  // Today / upcoming this week
  { id:5,  title:"Wardrobe Collection — Motion Sensor Reel", platforms:["instagram","facebook"],  type:"reel",     date:"Mon 16 Mar", time:"6:00 PM",  month:3, day:16, status:"scheduled", reach_est:"90K" },
  { id:6,  title:"Client Story — Bandra Residence",          platforms:["instagram","houzz"],     type:"carousel", date:"Tue 17 Mar", time:"10:00 AM", month:3, day:17, status:"scheduled", reach_est:"48K" },
  { id:7,  title:"Kitchen Tip: The Pull-Out Revolution",     platforms:["facebook","linkedin"],   type:"post",     date:"Wed 18 Mar", time:"12:00 PM", month:3, day:18, status:"draft",    note:"Needs copy review" },
  { id:8,  title:"BTS — New Showroom Setup",                 platforms:["instagram"],             type:"story",    date:"Thu 19 Mar", time:"9:00 AM",  month:3, day:19, status:"scheduled" },
  { id:9,  title:"Competitor Comparison Thread",             platforms:["twitter","linkedin"],    type:"thread",   date:"Fri 20 Mar", time:"11:00 AM", month:3, day:20, status:"draft",    note:"Approve before publish" },
  // Next week
  { id:10, title:"Modular Kitchen — Cost Breakdown 2025",    platforms:["houzz","homify"],        type:"article",  date:"Mon 23 Mar", time:"9:00 AM",  month:3, day:23, status:"draft" },
  { id:11, title:"Spring Living Room Lookbook",              platforms:["instagram","facebook"],  type:"carousel", date:"Tue 24 Mar", time:"6:00 PM",  month:3, day:24, status:"draft" },
  { id:12, title:"Architect Partnership Programme",          platforms:["linkedin"],              type:"article",  date:"Wed 25 Mar", time:"8:00 AM",  month:3, day:25, status:"scheduled" },
  { id:13, title:"Client Video Testimonial — Pune",         platforms:["instagram","facebook"],  type:"reel",     date:"Thu 26 Mar", time:"7:00 PM",  month:3, day:26, status:"draft" },
  { id:14, title:"Weekend Showroom Stories",                 platforms:["instagram"],             type:"story",    date:"Sat 28 Mar", time:"10:00 AM", month:3, day:28, status:"scheduled" },
  { id:15, title:"March Monthly Recap Reel",                platforms:["instagram","facebook","linkedin"], type:"reel", date:"Mon 30 Mar", time:"6:00 PM", month:3, day:30, status:"draft" },
];

const TYPE_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  reel:     { color:"bg-pink-50 text-pink-600 border-pink-200",     icon:<Play className="h-3.5 w-3.5" />     },
  carousel: { color:"bg-violet-50 text-violet-600 border-violet-200",icon:<Layers className="h-3.5 w-3.5" />  },
  post:     { color:"bg-blue-50 text-blue-600 border-blue-200",     icon:<ImageIcon className="h-3.5 w-3.5" />},
  video:    { color:"bg-amber-50 text-amber-600 border-amber-200",  icon:<Video className="h-3.5 w-3.5" />    },
  story:    { color:"bg-stone-100 text-charcoal/60 border-stone-200",icon:<AlignLeft className="h-3.5 w-3.5"/>},
  thread:   { color:"bg-charcoal/5 text-charcoal/70 border-charcoal/15",icon:<AlignLeft className="h-3.5 w-3.5"/>},
  article:  { color:"bg-sky-50 text-sky-600 border-sky-200",        icon:<FileText className="h-3.5 w-3.5" />},
};

const STATUS_CONFIG: Record<PostStatus, { label: string; color: string }> = {
  published: { label:"Published", color:"bg-emerald-50 text-emerald-700 border-emerald-200" },
  scheduled: { label:"Scheduled", color:"bg-blue-50 text-blue-700 border-blue-200"          },
  draft:     { label:"Draft",     color:"bg-amber-50 text-amber-700 border-amber-200"       },
  failed:    { label:"Failed",    color:"bg-red-50 text-red-600 border-red-200"             },
};

const WEEK_DAYS = ["Mon 10","Tue 11","Wed 12","Thu 13","Fri 14","Sat 15","Sun 16"];
const WEEK2_DAYS = ["Mon 16","Tue 17","Wed 18","Thu 19","Fri 20","Sat 21","Sun 22"];
const WEEK3_DAYS = ["Mon 23","Tue 24","Wed 25","Thu 26","Fri 27","Sat 28","Sun 29"];

const MARCH_CALENDAR: { day: number; label: string; posts: ScheduledPost[] }[] = Array.from({length:31},(_,i)=>{
  const d = i+1;
  const labels = ["","Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const dayOfWeek = ((d + 5) % 7);
  return {
    day: d,
    label: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][dayOfWeek],
    posts: ALL_POSTS.filter((p) => p.day===d),
  };
});

function SchedulerTab() {
  const [view, setView] = useState<"queue"|"calendar">("queue");
  const [statusFilter, setStatusFilter] = useState<"all"|PostStatus>("all");
  const [platformFilter, setPlatformFilter] = useState<"all"|Platform>("all");
  const [newPostOpen, setNewPostOpen] = useState(false);

  const filtered = ALL_POSTS.filter((p) => {
    if (statusFilter!=="all" && p.status!==statusFilter) return false;
    if (platformFilter!=="all" && !p.platforms.includes(platformFilter)) return false;
    return true;
  });

  const stats = {
    scheduled: ALL_POSTS.filter((p)=>p.status==="scheduled").length,
    draft:     ALL_POSTS.filter((p)=>p.status==="draft").length,
    published: ALL_POSTS.filter((p)=>p.status==="published").length,
    thisWeek:  ALL_POSTS.filter((p)=>p.day>=16&&p.day<=22).length,
  };

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label:"Scheduled", value:stats.scheduled, color:"text-blue-600",    bg:"bg-blue-50 border-blue-200"   },
          { label:"Drafts",    value:stats.draft,     color:"text-amber-600",   bg:"bg-amber-50 border-amber-200" },
          { label:"Published", value:stats.published, color:"text-emerald-600", bg:"bg-emerald-50 border-emerald-200"},
          { label:"This Week", value:stats.thisWeek,  color:"text-charcoal",    bg:"bg-white border-black/8"      },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border ${s.bg} p-3 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-charcoal/40 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg border border-black/8 overflow-hidden bg-white">
            <button type="button" onClick={()=>setView("queue")}    className={`px-3.5 py-1.5 text-xs font-medium transition-colors ${view==="queue"    ? "bg-charcoal text-white" : "text-charcoal/50 hover:bg-black/5"}`}>Queue</button>
            <button type="button" onClick={()=>setView("calendar")} className={`px-3.5 py-1.5 text-xs font-medium transition-colors ${view==="calendar" ? "bg-charcoal text-white" : "text-charcoal/50 hover:bg-black/5"}`}>Calendar</button>
          </div>
          {/* Status filter */}
          <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value as any)}
            title="Filter by status" aria-label="Filter by status"
            className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs text-charcoal focus:outline-none focus:border-amber-400">
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          {/* Platform filter */}
          <select value={platformFilter} onChange={(e)=>setPlatformFilter(e.target.value as any)}
            title="Filter by platform" aria-label="Filter by platform"
            className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs text-charcoal focus:outline-none focus:border-amber-400">
            <option value="all">All Platforms</option>
            {PLATFORMS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>
        <button type="button" onClick={()=>setNewPostOpen(!newPostOpen)}
          className="flex items-center gap-1.5 rounded-lg bg-charcoal px-3.5 py-2 text-xs font-medium text-white hover:bg-charcoal/90 transition-colors">
          <Plus className="h-3.5 w-3.5" />New Post
        </button>
      </div>

      {/* New post form */}
      {newPostOpen && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
          <h4 className="text-sm font-semibold text-charcoal mb-3">Schedule New Post</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[10px] uppercase tracking-wider text-charcoal/40 mb-1 block">Post Title</label>
              <input type="text" placeholder="e.g. Spring Kitchen Reveal"
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-amber-400 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="queue-date" className="text-[10px] uppercase tracking-wider text-charcoal/40 mb-1 block">Date</label>
              <input id="queue-date" type="date" className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-charcoal focus:border-amber-400 focus:outline-none" />
            </div>
            <div>
              <label htmlFor="queue-time" className="text-[10px] uppercase tracking-wider text-charcoal/40 mb-1 block">Time</label>
              <input id="queue-time" type="time" defaultValue="18:00" className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-charcoal focus:border-amber-400 focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button type="button" className="flex-1 rounded-lg bg-charcoal px-4 py-2 text-xs font-medium text-white hover:bg-charcoal/90 transition-colors">Add to Queue</button>
            <button type="button" onClick={()=>setNewPostOpen(false)} className="rounded-lg border border-black/10 px-4 py-2 text-xs font-medium text-charcoal hover:bg-black/5 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Queue view */}
      {view==="queue" && (
        <div className="space-y-2">
          {filtered.map((p) => {
            const typeCfg = TYPE_CONFIG[p.type] ?? TYPE_CONFIG.post;
            const statCfg = STATUS_CONFIG[p.status];
            return (
              <div key={p.id} className={`flex items-center gap-3 rounded-xl border bg-white p-4 hover:border-black/14 transition-colors ${p.status==="published" ? "opacity-60" : ""}`}>
                {/* Type icon */}
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${typeCfg.color}`}>
                  {typeCfg.icon}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-charcoal truncate">{p.title}</p>
                    {p.note && <span className="flex items-center gap-1 text-[10px] text-amber-600"><AlertCircle className="h-3 w-3" />{p.note}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {p.platforms.map((pl) => {
                      const cfg = PLATFORMS.find((x)=>x.id===pl)!;
                      return (
                        <span key={pl} className={`flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                          <PlatformIcon id={pl} size="h-2.5 w-2.5" />{cfg.label.split(" ")[0]}
                        </span>
                      );
                    })}
                    <span className="text-[10px] text-charcoal/40">·</span>
                    <span className="text-[10px] text-charcoal/40">{p.date} · {p.time}</span>
                    {p.reach_est && <span className="text-[10px] text-emerald-600 font-medium">~{p.reach_est} est. reach</span>}
                  </div>
                </div>
                {/* Status + actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${statCfg.color}`}>{statCfg.label}</span>
                  {p.status !== "published" && (
                    <button type="button" className="rounded-lg border border-black/8 px-2.5 py-1 text-[10px] text-charcoal/50 hover:bg-black/5 transition-colors">Edit</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Calendar view */}
      {view==="calendar" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-charcoal">March 2026</h3>
            <div className="flex gap-3 text-xs text-charcoal/40">
              {(["published","scheduled","draft"] as PostStatus[]).map((s) => (
                <span key={s} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full inline-block ${s==="published"?"bg-emerald-400":s==="scheduled"?"bg-blue-400":"bg-amber-400"}`} />
                  {STATUS_CONFIG[s].label}
                </span>
              ))}
            </div>
          </div>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
              <p key={d} className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/30 py-1">{d}</p>
            ))}
          </div>
          {/* Calendar grid — 5 weeks offset for March 2026 starting Saturday */}
          <div className="grid grid-cols-7 gap-1">
            {/* March 2026 starts on Sunday — offset 6 days */}
            {Array.from({length:6}).map((_,i) => <div key={`empty-${i}`} />)}
            {MARCH_CALENDAR.map(({day, posts}) => {
              const today = day===16;
              return (
                <div key={day} className={`rounded-lg border min-h-[72px] p-1.5 ${today ? "border-red-300 bg-red-50/30" : "border-black/6 bg-white hover:border-black/14"} transition-colors`}>
                  <p className={`text-[11px] font-bold mb-1 ${today ? "text-red-600" : "text-charcoal/40"}`}>{day}</p>
                  <div className="space-y-0.5">
                    {posts.slice(0,2).map((p) => (
                      <div key={p.id} className={`rounded px-1 py-0.5 text-[9px] font-medium truncate ${p.status==="published"?"bg-emerald-100 text-emerald-700":p.status==="scheduled"?"bg-blue-100 text-blue-700":"bg-amber-100 text-amber-700"}`}>
                        {p.title.length > 18 ? p.title.slice(0,16)+"…" : p.title}
                      </div>
                    ))}
                    {posts.length > 2 && (
                      <p className="text-[9px] text-charcoal/30 pl-1">+{posts.length-2} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Best time recommendations */}
      <div className="rounded-xl border border-black/8 bg-white p-5">
        <h3 className="text-sm font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-charcoal/40" />Optimal Posting Windows
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { platform:"instagram" as Platform, slots:["6–8 PM weekdays","11 AM–1 PM Sat","9 PM Sun"], note:"Reels get 3× reach during evening hours" },
            { platform:"facebook"  as Platform, slots:["9 AM, 12 PM, 7 PM","Avoid Mon mornings","Wednesday peaks"], note:"Long-form video works best on Facebook evenings" },
            { platform:"linkedin"  as Platform, slots:["8–10 AM Tue–Thu","12 PM Thu articles","Avoid weekends"], note:"B2B decision makers check LinkedIn at 8 AM" },
            { platform:"houzz"     as Platform, slots:["Sat 10 AM–2 PM","Sun 11 AM","Fri evenings"], note:"Weekend browsing drives the most enquiries" },
          ].map(({platform, slots, note}) => {
            const cfg = PLATFORMS.find((p)=>p.id===platform)!;
            return (
              <div key={platform} className={`rounded-xl border ${cfg.border} ${cfg.bg} p-3`}>
                <div className={`flex items-center gap-1.5 ${cfg.color} font-semibold text-xs mb-2`}>
                  <PlatformIcon id={platform} size="h-3.5 w-3.5" />{cfg.label}
                </div>
                <div className="space-y-1 mb-2">
                  {slots.map((s) => (
                    <p key={s} className="flex items-center gap-1.5 text-[11px] text-charcoal">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />{s}
                    </p>
                  ))}
                </div>
                <p className="text-[10px] text-charcoal/50 italic leading-relaxed">{note}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page shell
// ─────────────────────────────────────────────────────────────────────────────
export default function SocialMediaPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const TABS = [
    { id:"overview"    as Tab, label:"Overview",          icon:<BarChart2 className="h-3.5 w-3.5" />  },
    { id:"trends"      as Tab, label:"Trends & Keywords",  icon:<TrendingUp className="h-3.5 w-3.5" /> },
    { id:"competitors" as Tab, label:"Competitors",        icon:<Target className="h-3.5 w-3.5" />     },
    { id:"studio"      as Tab, label:"Content Studio",     icon:<Sparkles className="h-3.5 w-3.5" />   },
    { id:"scheduler"   as Tab, label:"Scheduler",          icon:<Calendar className="h-3.5 w-3.5" />   },
  ];
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-light text-charcoal">Social Media Hub</h1>
        <p className="mt-1 font-sans text-sm text-charcoal/50">All platforms · trends · competitors · content generation · scheduling</p>
      </div>
      <div className="flex gap-1 border-b border-black/8 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button type="button" key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-sans text-sm whitespace-nowrap border-b-2 transition-colors -mb-px ${tab===t.id ? "border-red-500 text-red-600 font-medium" : "border-transparent text-charcoal/50 hover:text-charcoal"}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>
      {tab==="overview"    && <OverviewTab />}
      {tab==="trends"      && <TrendsTab />}
      {tab==="competitors" && <CompetitorsTab />}
      {tab==="studio"      && <StudioTab />}
      {tab==="scheduler"   && <SchedulerTab />}
    </div>
  );
}
