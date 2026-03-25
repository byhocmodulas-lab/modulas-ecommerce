"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkles, Calendar, Users, BarChart3, Send, Copy, Check,
  RefreshCw, Plus, Trash2, X, ChevronDown, Pencil, Globe,
  Instagram, Linkedin, Image as ImageIcon, Hash, Wand2,
  Clock, CheckCircle2, AlertCircle, FileText, Target,
} from "lucide-react";
import {
  aiContentApi, schedulerApi, competitorApi,
  type ScheduledPost, type CompetitorProfile, type SocialPlatform, type ContentTool,
} from "@/lib/api/client";
import { useAccessToken } from "@/lib/stores/auth-store";

type Tab = "create" | "schedule" | "competitors" | "analytics";

// ── Helpers ────────────────────────────────────────────────────
const PLATFORMS: { id: SocialPlatform; label: string; color: string }[] = [
  { id: "instagram", label: "Instagram", color: "text-pink-600 bg-pink-50 border-pink-200" },
  { id: "facebook",  label: "Facebook",  color: "text-blue-600 bg-blue-50 border-blue-200" },
  { id: "linkedin",  label: "LinkedIn",  color: "text-sky-700 bg-sky-50 border-sky-200" },
  { id: "pinterest", label: "Pinterest", color: "text-red-600 bg-red-50 border-red-200" },
];

const TONES = ["luxury", "informative", "promotional", "conversational"] as const;

const POST_TYPE_COLORS: Record<string, string> = {
  image:    "bg-violet-50 text-violet-700 border-violet-200",
  carousel: "bg-blue-50 text-blue-700 border-blue-200",
  reel:     "bg-pink-50 text-pink-700 border-pink-200",
  story:    "bg-amber-50 text-amber-700 border-amber-200",
  text:     "bg-stone-50 text-charcoal/60 border-black/10",
  article:  "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const STATUS_COLORS: Record<string, string> = {
  draft:     "bg-stone-50 text-charcoal/50 border-black/10",
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed:    "bg-red-50 text-red-600 border-red-200",
  cancelled: "bg-black/5 text-charcoal/30 border-black/8",
};

// ════════════════════════════════════════════════════════════════
// TAB 1 — AI Content Creation Studio
// ════════════════════════════════════════════════════════════════
function CreateTab() {
  const token = useAccessToken() ?? "";

  // Step state: 1 = brief, 2 = generated, 3 = schedule
  const [step, setStep]           = useState<1 | 2 | 3>(1);
  const [generating, setGenerating] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [copied, setCopied]       = useState<string | null>(null);

  // Brief inputs
  const [topic, setTopic]             = useState("");
  const [tone, setTone]               = useState<"luxury"|"informative"|"promotional"|"conversational">("luxury");
  const [audience, setAudience]       = useState("general");
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(["instagram"]);

  // Generated output
  const [caption, setCaption]         = useState("");
  const [hashtags, setHashtags]       = useState("");
  const [variants, setVariants]       = useState("");
  const [ideas, setIdeas]             = useState("");
  const [activeOutput, setActiveOutput] = useState<"caption"|"hashtags"|"variants"|"ideas">("caption");

  // Schedule fields
  const [schedTitle, setSchedTitle]   = useState("");
  const [schedDate, setSchedDate]     = useState("");
  const [schedTime, setSchedTime]     = useState("18:00");
  const [schedPost, setSchedPost]     = useState<"image"|"carousel"|"reel"|"story"|"text">("image");
  const [schedSaving, setSchedSaving] = useState(false);
  const [schedDone, setSchedDone]     = useState(false);

  async function generateAll() {
    if (!topic.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const result = await aiContentApi.campaignBrief(token, {
        topic,
        platforms: selectedPlatforms,
      });
      setCaption(result.caption);
      setHashtags(result.hashtags);
      setVariants(result.variants);
      setIdeas(result.ideas);
      setStep(2);
    } catch {
      setError("AI generation failed. Check that ANTHROPIC_API_KEY is configured.");
    } finally {
      setGenerating(false);
    }
  }

  async function generateSingle(tool: ContentTool) {
    if (!topic.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const result = await aiContentApi.generate(token, {
        tool, prompt: topic,
        platform: selectedPlatforms[0],
        tone, audience: audience as any,
      });
      if (tool === "caption")          { setCaption(result.text);  setActiveOutput("caption");  }
      if (tool === "hashtags")         { setHashtags(result.text); setActiveOutput("hashtags"); }
      if (tool === "platform_variants"){ setVariants(result.text); setActiveOutput("variants"); }
      if (tool === "content_ideas")    { setIdeas(result.text);    setActiveOutput("ideas");    }
    } catch {
      setError("Generation failed.");
    } finally {
      setGenerating(false);
    }
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  async function saveToScheduler() {
    setSchedSaving(true);
    try {
      await schedulerApi.create(token, {
        title:     schedTitle || topic.slice(0, 60),
        caption,
        hashtags,
        platforms: selectedPlatforms,
        postType:  schedPost,
        scheduledAt: schedDate ? `${schedDate}T${schedTime}:00` : undefined,
        platformVariants: variants ? { raw: variants } : undefined,
        campaign: "",
      });
      setSchedDone(true);
      setTimeout(() => { setSchedDone(false); setStep(1); setTopic(""); setCaption(""); setHashtags(""); setVariants(""); setIdeas(""); }, 2000);
    } catch {
      setError("Failed to save post.");
    } finally {
      setSchedSaving(false);
    }
  }

  function togglePlatform(p: SocialPlatform) {
    setSelectedPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 flex justify-between items-center">
          {error}<button onClick={() => setError(null)} aria-label="Dismiss error"><X className="h-4 w-4" aria-hidden="true" /></button>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-3">
        {[
          { n: 1, label: "Brief" },
          { n: 2, label: "Generated" },
          { n: 3, label: "Schedule" },
        ].map(({ n, label }) => (
          <div key={n} className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${step >= n ? "bg-charcoal text-white" : "bg-black/8 text-charcoal/40"}`}>
              {step > n ? <Check className="h-3.5 w-3.5" /> : n}
            </div>
            <span className={`text-sm ${step >= n ? "text-charcoal" : "text-charcoal/30"}`}>{label}</span>
            {n < 3 && <div className={`w-8 h-px ${step > n ? "bg-charcoal" : "bg-black/10"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1 — Brief */}
      {step === 1 && (
        <div className="rounded-xl border border-black/8 bg-white p-6 space-y-5">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Topic / Prompt *</label>
            <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={3}
              placeholder="e.g. walk-in wardrobe with island unit, Bandra residence, March 2026 project reveal"
              className="w-full rounded-xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Tone</label>
              <div className="flex flex-wrap gap-2">
                {TONES.map(t => (
                  <button key={t} type="button" onClick={() => setTone(t)}
                    className={`rounded-full border px-3 py-1.5 text-[11px] capitalize transition-colors ${tone === t ? "border-charcoal bg-charcoal text-white" : "border-black/10 text-charcoal/50 hover:border-black/20"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Audience</label>
              <select value={audience} onChange={e => setAudience(e.target.value)}
                title="Select target audience"
                className="w-full rounded-xl border border-black/10 bg-black/3 px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-black/20">
                <option value="general">General / Homeowners</option>
                <option value="architect">Architects & Designers</option>
                <option value="homeowner">Premium Homeowners</option>
                <option value="designer">Interior Designers</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Platforms</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => (
                <button key={p.id} type="button" onClick={() => togglePlatform(p.id)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] transition-colors ${selectedPlatforms.includes(p.id) ? p.color : "border-black/10 text-charcoal/40 hover:border-black/20"}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={generateAll} disabled={!topic.trim() || generating || selectedPlatforms.length === 0}
            className="flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-charcoal disabled:opacity-40 hover:bg-amber-300 transition-colors">
            {generating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {generating ? "Generating campaign…" : "Generate Full Campaign"}
          </button>
        </div>
      )}

      {/* Step 2 — Generated output */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Output tabs */}
          <div className="flex gap-1 border-b border-black/8">
            {([
              { key: "caption",  label: "Caption",   icon: FileText },
              { key: "hashtags", label: "Hashtags",  icon: Hash },
              { key: "variants", label: "Variants",  icon: Globe },
              { key: "ideas",    label: "Ideas",     icon: Wand2 },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setActiveOutput(key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm border-b-2 transition-colors -mb-px ${
                  activeOutput === key ? "border-amber-400 text-charcoal font-medium" : "border-transparent text-charcoal/40 hover:text-charcoal"
                }`}>
                <Icon className="h-3.5 w-3.5" />{label}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-black/8 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-black/6">
              <p className="text-xs text-charcoal/40 uppercase tracking-wider">{activeOutput}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => generateSingle(
                  activeOutput === "caption" ? "caption" :
                  activeOutput === "hashtags" ? "hashtags" :
                  activeOutput === "variants" ? "platform_variants" : "content_ideas"
                )} disabled={generating}
                  className="flex items-center gap-1 text-xs text-charcoal/40 hover:text-amber-600 transition-colors" title="Regenerate">
                  <RefreshCw className={`h-3.5 w-3.5 ${generating ? "animate-spin" : ""}`} />Regenerate
                </button>
                <button onClick={() => copy(
                  activeOutput === "caption" ? caption :
                  activeOutput === "hashtags" ? hashtags :
                  activeOutput === "variants" ? variants : ideas,
                  activeOutput
                )} className="flex items-center gap-1 text-xs text-charcoal/40 hover:text-charcoal transition-colors" title="Copy">
                  {copied === activeOutput ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied === activeOutput ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
            <div className="p-5">
              <textarea
                aria-label={`Generated ${activeOutput} output`}
                placeholder="Generated content will appear here…"
                value={activeOutput === "caption" ? caption : activeOutput === "hashtags" ? hashtags : activeOutput === "variants" ? variants : ideas}
                onChange={e => {
                  const v = e.target.value;
                  if (activeOutput === "caption")  setCaption(v);
                  else if (activeOutput === "hashtags") setHashtags(v);
                  else if (activeOutput === "variants") setVariants(v);
                  else setIdeas(v);
                }}
                rows={10}
                className="w-full font-sans text-sm text-charcoal/80 leading-relaxed focus:outline-none resize-none" />
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(3)}
              className="flex items-center gap-2 rounded-full bg-charcoal px-6 py-2.5 text-sm font-medium text-white hover:bg-charcoal/90 transition-colors">
              <Calendar className="h-4 w-4" />Schedule Post
            </button>
            <button onClick={() => setStep(1)}
              className="rounded-full border border-black/10 px-6 py-2.5 text-sm text-charcoal/50 hover:border-black/20 transition-colors">
              Edit Brief
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Schedule */}
      {step === 3 && (
        <div className="rounded-xl border border-black/8 bg-white p-6 space-y-5 max-w-lg">
          <h3 className="font-serif text-xl text-charcoal">Schedule Post</h3>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Post Title</label>
            <input value={schedTitle} onChange={e => setSchedTitle(e.target.value)}
              placeholder={topic.slice(0, 60)}
              className="w-full rounded-xl border border-black/10 bg-black/3 px-4 py-2.5 text-sm focus:outline-none focus:border-black/20" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="sched-date" className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Date</label>
              <input id="sched-date" type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-black/3 px-4 py-2.5 text-sm focus:outline-none focus:border-black/20" />
            </div>
            <div>
              <label htmlFor="sched-time" className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Time</label>
              <input id="sched-time" type="time" value={schedTime} onChange={e => setSchedTime(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-black/3 px-4 py-2.5 text-sm focus:outline-none focus:border-black/20" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1.5">Post Type</label>
            <div className="flex flex-wrap gap-2">
              {(["image","carousel","reel","story","text"] as const).map(t => (
                <button key={t} type="button" onClick={() => setSchedPost(t)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] capitalize transition-colors ${schedPost === t ? "border-charcoal bg-charcoal text-white" : "border-black/10 text-charcoal/50"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            {schedDone ? (
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                <CheckCircle2 className="h-4 w-4" />Scheduled successfully!
              </div>
            ) : (
              <>
                <button onClick={saveToScheduler} disabled={schedSaving}
                  className="flex items-center gap-2 rounded-full bg-charcoal px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50 hover:bg-charcoal/90 transition-colors">
                  {schedSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {schedSaving ? "Saving…" : "Save to Scheduler"}
                </button>
                <button onClick={() => setStep(2)}
                  className="rounded-full border border-black/10 px-4 py-2.5 text-sm text-charcoal/50 hover:border-black/20 transition-colors">
                  Back
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB 2 — Content Scheduler
// ════════════════════════════════════════════════════════════════
function ScheduleTab() {
  const token = useAccessToken() ?? "";
  const [posts, setPosts]       = useState<ScheduledPost[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<string>("all");
  const [summary, setSummary]   = useState({ total: 0, scheduled: 0, published: 0, drafts: 0 });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      schedulerApi.list(token),
      schedulerApi.summary(token),
    ]).then(([p, s]) => { setPosts(p); setSummary(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = filter === "all" ? posts : posts.filter(p => p.status === filter);

  async function removePost(id: string) {
    await schedulerApi.remove(token, id);
    setPosts(p => p.filter(x => x.id !== id));
    setDeleteId(null);
  }

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total",     value: summary.total,     color: "text-charcoal" },
          { label: "Scheduled", value: summary.scheduled, color: "text-blue-600" },
          { label: "Published", value: summary.published, color: "text-emerald-600" },
          { label: "Drafts",    value: summary.drafts,    color: "text-amber-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-black/8 bg-white p-4">
            <p className="text-[11px] uppercase tracking-wider text-charcoal/40">{label}</p>
            <p className={`mt-1.5 text-2xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {["all","draft","scheduled","published","failed","cancelled"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full border px-3.5 py-1.5 text-[11px] capitalize transition-colors ${filter === s ? "border-charcoal bg-charcoal text-white" : "border-black/8 text-charcoal/40 hover:text-charcoal"}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-black/5 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/15 bg-white py-14 text-center">
          <Calendar className="mx-auto h-8 w-8 text-charcoal/20 mb-3" />
          <p className="text-sm text-charcoal/40">No posts yet</p>
          <p className="text-xs text-charcoal/25 mt-1">Create content in the Create tab to get started</p>
        </div>
      ) : (
        <div className="rounded-xl border border-black/8 bg-white overflow-hidden divide-y divide-black/5">
          {filtered.map(post => (
            <div key={post.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-stone-50/50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-charcoal truncate">{post.title}</p>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] capitalize ${STATUS_COLORS[post.status]}`}>{post.status}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] capitalize ${POST_TYPE_COLORS[post.postType]}`}>{post.postType}</span>
                </div>
                <p className="text-xs text-charcoal/35 mt-0.5 line-clamp-1">{post.caption?.slice(0, 80)}…</p>
              </div>
              <div className="text-right shrink-0">
                {post.scheduledAt && (
                  <p className="text-xs text-charcoal/60 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(post.scheduledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    {" "}{new Date(post.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-1 justify-end">
                  {post.platforms.map(p => (
                    <span key={p} className={`rounded px-1.5 py-0.5 text-[9px] uppercase font-medium ${PLATFORMS.find(x => x.id === p)?.color}`}>{p.slice(0,2)}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => setDeleteId(post.id)} title="Delete post"
                className="p-1.5 rounded-lg text-charcoal/30 hover:text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-2xl bg-white p-6 w-72 space-y-4">
            <p className="font-serif text-lg text-charcoal">Delete this post?</p>
            <div className="flex gap-2">
              <button onClick={() => removePost(deleteId)}
                className="flex-1 rounded-full bg-red-600 text-white py-2 text-[11px] uppercase tracking-wider hover:bg-red-700">Delete</button>
              <button onClick={() => setDeleteId(null)}
                className="flex-1 rounded-full border border-black/10 text-charcoal/50 py-2 text-[11px] uppercase tracking-wider">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB 3 — Competitor Intelligence
// ════════════════════════════════════════════════════════════════
function CompetitorTab() {
  const token = useAccessToken() ?? "";
  const [profiles, setProfiles]   = useState<CompetitorProfile[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({ name: "", handle: "", segment: "premium", notes: "", followerCount: "", avgEngagement: "" });
  const [saving, setSaving]       = useState(false);
  const [deleteId, setDeleteId]   = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    competitorApi.listProfiles(token)
      .then(setProfiles)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  async function addCompetitor() {
    if (!form.name) return;
    setSaving(true);
    try {
      const created = await competitorApi.createProfile(token, {
        name: form.name,
        handle: form.handle || undefined,
        segment: form.segment || undefined,
        notes: form.notes || undefined,
        followerCount: form.followerCount ? Number(form.followerCount) : undefined,
        avgEngagement: form.avgEngagement ? Number(form.avgEngagement) : undefined,
        platforms: ["instagram"],
      });
      setProfiles(p => [...p, created]);
      setShowForm(false);
      setForm({ name: "", handle: "", segment: "premium", notes: "", followerCount: "", avgEngagement: "" });
    } catch {} finally { setSaving(false); }
  }

  async function deleteCompetitor(id: string) {
    await competitorApi.deleteProfile(token, id);
    setProfiles(p => p.filter(x => x.id !== id));
    setDeleteId(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-lg bg-charcoal px-4 py-2 text-xs font-medium text-white hover:bg-charcoal/90">
          <Plus className="h-3.5 w-3.5" />Add Competitor
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-black/5 animate-pulse" />)}</div>
      ) : profiles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/15 bg-white py-14 text-center">
          <Target className="mx-auto h-8 w-8 text-charcoal/20 mb-3" />
          <p className="text-sm text-charcoal/40">No competitors tracked yet</p>
          <button onClick={() => setShowForm(true)} className="mt-3 text-xs text-red-600 hover:underline">Add your first competitor</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map(c => (
            <div key={c.id} className="rounded-xl border border-black/8 bg-white p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-charcoal">{c.name}</p>
                  {c.handle && <p className="text-xs text-charcoal/40">@{c.handle}</p>}
                </div>
                <button onClick={() => setDeleteId(c.id)} title="Remove competitor"
                  className="p-1 text-charcoal/20 hover:text-red-500 rounded">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Followers", value: c.followerCount ? `${(c.followerCount/1000).toFixed(0)}K` : "—" },
                  { label: "Eng. Rate", value: c.avgEngagement ? `${c.avgEngagement}%` : "—" },
                  { label: "Segment",   value: c.segment ?? "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-stone-50 px-2 py-1.5">
                    <p className="text-[10px] text-charcoal/35 uppercase tracking-wider">{label}</p>
                    <p className="text-xs font-medium text-charcoal mt-0.5 capitalize">{value}</p>
                  </div>
                ))}
              </div>

              {c.notes && <p className="text-xs text-charcoal/45 leading-relaxed line-clamp-2">{c.notes}</p>}

              <div className="flex flex-wrap gap-1">
                {c.platforms.map(p => (
                  <span key={p} className={`rounded-full border px-2 py-0.5 text-[10px] capitalize ${PLATFORMS.find(x => x.id === p as SocialPlatform)?.color ?? "border-black/10 text-charcoal/40"}`}>{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add competitor modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-2xl bg-white p-6 w-96 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-charcoal">Add Competitor</h2>
              <button onClick={() => setShowForm(false)} aria-label="Close"><X className="h-5 w-5 text-charcoal/40" aria-hidden="true" /></button>
            </div>
            <div className="space-y-3">
              {[
                { key: "name",           label: "Brand Name *",         placeholder: "e.g. Godrej Interio" },
                { key: "handle",         label: "Instagram Handle",      placeholder: "@godrij_interio" },
                { key: "followerCount",  label: "Follower Count",        placeholder: "e.g. 250000" },
                { key: "avgEngagement",  label: "Avg Engagement Rate %", placeholder: "e.g. 2.4" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1">{label}</label>
                  <input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full rounded-xl border border-black/10 bg-black/3 px-4 py-2.5 text-sm focus:outline-none focus:border-black/20" />
                </div>
              ))}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-charcoal/40 mb-1">Notes / Strategy Observations</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                  placeholder="e.g. Strong carousel content, posts daily at 6pm"
                  className="w-full rounded-xl border border-black/10 bg-black/3 px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-black/20" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={addCompetitor} disabled={saving || !form.name}
                className="flex-1 rounded-full bg-charcoal text-white py-2 text-[11px] uppercase tracking-wider disabled:opacity-30">
                {saving ? "Adding…" : "Add"}
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex-1 rounded-full border border-black/10 text-charcoal/50 py-2 text-[11px] uppercase tracking-wider">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-2xl bg-white p-6 w-72 space-y-4">
            <p className="font-serif text-lg text-charcoal">Remove this competitor?</p>
            <div className="flex gap-2">
              <button onClick={() => deleteCompetitor(deleteId)}
                className="flex-1 rounded-full bg-red-600 text-white py-2 text-[11px] uppercase tracking-wider">Remove</button>
              <button onClick={() => setDeleteId(null)}
                className="flex-1 rounded-full border border-black/10 text-charcoal/50 py-2 text-[11px] uppercase tracking-wider">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB 4 — Performance Analytics
// ════════════════════════════════════════════════════════════════
function ScoreBar({ score }: { score: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.style.width = `${score}%`;
  }, [score]);
  return (
    <div className="w-24 h-1.5 rounded-full bg-black/5 overflow-hidden">
      <div ref={ref} className="h-full bg-amber-400 rounded-full" />
    </div>
  );
}

const CONNECT_PLATFORMS = [
  {
    id: "instagram",
    label: "Instagram",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
    badge: "bg-pink-100 text-pink-700",
    api: "Instagram Graph API",
    docsNote: "Requires Facebook Business account + approved app",
  },
  {
    id: "facebook",
    label: "Facebook",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    api: "Meta Pages API",
    docsNote: "Requires Page admin access + App Review",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    badge: "bg-sky-100 text-sky-700",
    api: "LinkedIn Marketing API",
    docsNote: "Requires LinkedIn Partner Programme approval",
  },
  {
    id: "pinterest",
    label: "Pinterest",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
    api: "Pinterest API v5",
    docsNote: "Requires Pinterest Business account",
  },
];

function AnalyticsTab() {
  const [platform, setPlatform] = useState<SocialPlatform>("instagram");
  const [showDemo, setShowDemo]   = useState(false);

  const MOCK_METRICS = {
    instagram: { followers: "24.8K", followersGrowth: "+3.2%", reach: "148K", reachGrowth: "+12%",  engRate: "4.7%",  engGrowth: "+0.4%",  posts: 12 },
    facebook:  { followers: "8.4K",  followersGrowth: "+1.1%", reach: "32K",  reachGrowth: "+6%",   engRate: "2.1%",  engGrowth: "-0.2%",  posts: 8  },
    linkedin:  { followers: "3.2K",  followersGrowth: "+5.8%", reach: "18K",  reachGrowth: "+22%",  engRate: "3.9%",  engGrowth: "+0.8%",  posts: 5  },
    pinterest: { followers: "1.1K",  followersGrowth: "+0.4%", reach: "9K",   reachGrowth: "+2%",   engRate: "1.2%",  engGrowth: "0.0%",   posts: 3  },
  };
  const m = MOCK_METRICS[platform];

  const TOP_POSTS = [
    { title: "Walk-in Wardrobe — Bandra",       reach: "48K", eng: "6.2%", type: "carousel", saved: 1240 },
    { title: "Modular Kitchen — White Oak",      reach: "36K", eng: "5.8%", type: "reel",     saved: 980  },
    { title: "Client Story — Whitefield",        reach: "28K", eng: "4.9%", type: "carousel", saved: 720  },
    { title: "BTS — Workshop Tour",              reach: "21K", eng: "4.1%", type: "reel",     saved: 560  },
    { title: "Product Drop — Sliding Wardrobe",  reach: "18K", eng: "3.7%", type: "image",    saved: 412  },
  ];

  const BEST_TIMES = [
    { day: "Mon", time: "7–9 PM",   score: 92 },
    { day: "Wed", time: "7–9 PM",   score: 88 },
    { day: "Fri", time: "6–8 PM",   score: 85 },
    { day: "Sat", time: "10–12 PM", score: 79 },
    { day: "Sun", time: "8–10 PM",  score: 74 },
  ];

  return (
    <div className="space-y-6">

      {/* ── Connect platform accounts ── */}
      <div className="rounded-2xl border border-black/8 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-black/6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-charcoal">Connect Platform Accounts</p>
            <p className="text-[11px] text-charcoal/40 mt-0.5">
              Connect official APIs to replace demo data with live metrics
            </p>
          </div>
          <span className="rounded-full bg-amber-100 border border-amber-200 px-2.5 py-1 text-[10px] font-medium text-amber-700 uppercase tracking-wider">
            Not connected
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-px bg-black/5">
          {CONNECT_PLATFORMS.map((p) => (
            <div key={p.id} className={`bg-white p-5 flex items-start gap-4`}>
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${p.border} ${p.bg}`}>
                {p.id === "instagram" && <Instagram className={`h-4 w-4 ${p.color}`} />}
                {p.id === "linkedin"  && <Linkedin  className={`h-4 w-4 ${p.color}`} />}
                {p.id === "facebook"  && <Globe     className={`h-4 w-4 ${p.color}`} />}
                {p.id === "pinterest" && <Globe     className={`h-4 w-4 ${p.color}`} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-charcoal">{p.label}</p>
                  <span className="text-[10px] rounded-full bg-stone-100 border border-black/8 px-2 py-0.5 text-charcoal/40 shrink-0">
                    Not connected
                  </span>
                </div>
                <p className="text-[11px] text-charcoal/40 mt-0.5">{p.api}</p>
                <p className="text-[10px] text-charcoal/30 mt-0.5 leading-relaxed">{p.docsNote}</p>
                <button
                  type="button"
                  className={`mt-2.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${p.border} ${p.color} hover:${p.bg}`}
                  onClick={() => alert(`${p.label} OAuth integration — add NEXT_PUBLIC_${p.id.toUpperCase()}_APP_ID and configure OAuth callback at /api/oauth/${p.id}`)}
                >
                  Connect {p.label}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-black/6 bg-stone-50/50 flex items-center justify-between">
          <p className="text-[11px] text-charcoal/40">
            Each platform requires an approved developer app. See platform API docs for setup.
          </p>
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className="text-[11px] text-charcoal/40 underline underline-offset-2 hover:text-charcoal transition-colors shrink-0 ml-4"
          >
            {showDemo ? "Hide" : "Preview demo data"}
          </button>
        </div>
      </div>

      {/* ── Demo data (shown only when toggled) ── */}
      {showDemo && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-black/8" />
            <span className="text-[10px] uppercase tracking-widest text-charcoal/30 px-2">Demo data — not live</span>
            <div className="h-px flex-1 bg-black/8" />
          </div>

          {/* Platform switcher */}
          <div className="flex gap-2 flex-wrap">
            {PLATFORMS.map(p => (
              <button type="button" key={p.id} onClick={() => setPlatform(p.id)}
                className={`rounded-full border px-3.5 py-1.5 text-[11px] transition-colors ${platform === p.id ? p.color : "border-black/8 text-charcoal/40"}`}>
                {p.label}
              </button>
            ))}
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Followers",      value: m.followers,     growth: m.followersGrowth },
              { label: "Monthly Reach",  value: m.reach,         growth: m.reachGrowth     },
              { label: "Eng. Rate",      value: m.engRate,       growth: m.engGrowth       },
              { label: "Posts (30d)",    value: String(m.posts), growth: ""                },
            ].map(({ label, value, growth }) => (
              <div key={label} className="rounded-xl border border-black/8 bg-white p-4">
                <p className="text-[11px] uppercase tracking-wider text-charcoal/40">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-charcoal">{value}</p>
                {growth && (
                  <p className={`text-xs mt-0.5 ${growth.startsWith("+") ? "text-emerald-600" : growth.startsWith("-") ? "text-red-500" : "text-charcoal/40"}`}>
                    {growth} vs last month
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top posts */}
            <div className="rounded-xl border border-black/8 bg-white overflow-hidden">
              <div className="px-5 py-3.5 border-b border-black/6">
                <p className="text-sm font-semibold text-charcoal">Top Performing Posts</p>
                <p className="text-[11px] text-charcoal/35">Last 30 days · {platform} · demo</p>
              </div>
              <div className="divide-y divide-black/5">
                {TOP_POSTS.map((p, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3">
                    <span className="text-xs font-semibold text-charcoal/25 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-charcoal truncate">{p.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] rounded-full border px-1.5 py-0.5 ${POST_TYPE_COLORS[p.type]}`}>{p.type}</span>
                        <span className="text-[11px] text-charcoal/35">{p.saved} saves</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-charcoal">{p.reach}</p>
                      <p className="text-[11px] text-emerald-600">{p.eng} eng</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best posting times */}
            <div className="rounded-xl border border-black/8 bg-white overflow-hidden">
              <div className="px-5 py-3.5 border-b border-black/6">
                <p className="text-sm font-semibold text-charcoal">AI Recommended Posting Times</p>
                <p className="text-[11px] text-charcoal/35">Based on typical audience patterns · demo</p>
              </div>
              <div className="p-5 space-y-3">
                {BEST_TIMES.map(({ day, time, score }) => (
                  <div key={day} className="flex items-center gap-3">
                    <span className="w-8 text-xs font-medium text-charcoal">{day}</span>
                    <span className="flex-1 text-sm text-charcoal/60">{time}</span>
                    <div className="flex items-center gap-2">
                      <ScoreBar score={score} />
                      <span className="text-xs font-medium text-charcoal/50 w-8">{score}</span>
                    </div>
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

// ════════════════════════════════════════════════════════════════
// Page
// ════════════════════════════════════════════════════════════════
export default function ContentStudioPage() {
  const [tab, setTab] = useState<Tab>("create");

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "create",      label: "AI Create",     icon: Sparkles },
    { id: "schedule",    label: "Scheduler",      icon: Calendar },
    { id: "competitors", label: "Competitors",    icon: Target },
    { id: "analytics",  label: "Analytics",      icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-light text-charcoal flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          Content Studio
        </h1>
        <p className="mt-0.5 text-sm text-charcoal/40">AI-powered content creation, scheduling, and competitive intelligence</p>
      </div>

      <div className="flex gap-1 border-b border-black/8 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
              tab === id ? "border-amber-400 text-charcoal font-medium" : "border-transparent text-charcoal/40 hover:text-charcoal"
            }`}>
            <Icon className="h-3.5 w-3.5" />{label}
          </button>
        ))}
      </div>

      {tab === "create"      && <CreateTab />}
      {tab === "schedule"    && <ScheduleTab />}
      {tab === "competitors" && <CompetitorTab />}
      {tab === "analytics"   && <AnalyticsTab />}
    </div>
  );
}
