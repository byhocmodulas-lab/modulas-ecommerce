"use client";

import { useState, useRef } from "react";
import {
  Sparkles, Send, RefreshCw, Copy, Check, ChevronDown,
  Image as ImageIcon, FileText, Tag, Wand2, Layers,
  MessageSquare, Zap,
} from "lucide-react";
import { aiContentApi, type ContentTool } from "@/lib/api/client";
import { useAccessToken } from "@/lib/stores/auth-store";

// ── Types ─────────────────────────────────────────────────────
type Tool = "copy" | "description" | "tags" | "blog" | "names" | "email";

const TOOL_MAP: Record<Tool, ContentTool> = {
  copy:        "product_copy",
  description: "product_description",
  tags:        "seo_tags",
  blog:        "blog",
  names:       "product_names",
  email:       "email",
};

interface ToolConfig {
  id: Tool;
  label: string;
  description: string;
  icon: React.ElementType;
  placeholder: string;
  outputLabel: string;
}

// ── Tool definitions ──────────────────────────────────────────
const TOOLS: ToolConfig[] = [
  {
    id: "copy",
    label: "Product copy",
    description: "Generate compelling product descriptions and short blurbs from basic details.",
    icon: FileText,
    placeholder: "Oslo modular sofa, 3-seat, oatmeal boucle, solid oak legs, removable covers, 220cm wide",
    outputLabel: "Generated copy",
  },
  {
    id: "description",
    label: "Long description",
    description: "Write a detailed editorial product description with materials, dimensions and care.",
    icon: Layers,
    placeholder: "Oslo modular sofa, 3-seat, oatmeal boucle, solid oak legs, removable covers, 220cm wide",
    outputLabel: "Long description",
  },
  {
    id: "tags",
    label: "SEO tags",
    description: "Generate keyword-rich meta title, meta description, and alt text.",
    icon: Tag,
    placeholder: "Oslo modular sofa, 3-seat, oatmeal boucle, solid oak legs, removable covers, 220cm wide",
    outputLabel: "SEO tags",
  },
  {
    id: "blog",
    label: "Journal post",
    description: "Draft a design story or inspiration piece for the journal.",
    icon: MessageSquare,
    placeholder: "Write a piece about the revival of boucle fabric in contemporary interior design",
    outputLabel: "Journal draft",
  },
  {
    id: "names",
    label: "Product names",
    description: "Suggest five evocative, on-brand product names from a brief description.",
    icon: Wand2,
    placeholder: "A tall minimalist bookcase in smoked oak with adjustable shelves and integrated lighting",
    outputLabel: "Name suggestions",
  },
  {
    id: "email",
    label: "Email campaign",
    description: "Write a marketing email for a product launch, seasonal promotion, or restock.",
    icon: Zap,
    placeholder: "New arrival: Oslo sofa in Forest Green. Spring collection launch, 10% off first week.",
    outputLabel: "Email copy",
  },
];

// ── Stub AI responses (replace with real Claude API calls) ────
const STUB_OUTPUTS: Record<Tool, string> = {
  copy: `**Oslo — The Modular Sofa Reinvented**

Softness without compromise. The Oslo modular sofa wraps hand-loomed oatmeal boucle around a solid English oak frame, creating a piece that feels as considered from across the room as it does from within it.

Configure your Oslo in 2, 3 or 4 seats, with optional chaise extension and contrast-piped cushions. Every cover is removable and dry-cleanable. Every leg is individually adjustable.

*Lead time: 8–10 weeks. Free delivery on orders over £500.*`,

  description: `**Oslo Modular Sofa — Full Description**

Designed in our London studio and hand-assembled in the UK, the Oslo is our most popular modular piece for good reason. Its geometry is deceptively simple — generous seat depth (95cm), low-slung backrest and slender oak legs that give the illusion of floating — yet the construction behind it is painstaking.

**Material & Upholstery**
The oatmeal boucle is woven on traditional Jacquard looms in Portugal from 80% wool and 20% polyester. The textured loop pile provides natural resilience against pilling while remaining sumptuously soft to the touch. All covers are removable via concealed zip and rated for professional dry-cleaning.

**Frame & Legs**
The internal frame is kiln-dried beech hardwood with 8-way hand-tied spring suspension and high-density Dacron-wrapped foam seats rated at 40kg/m³. Legs are individually turned from solid English white oak, oil-finished, and fitted with floor-protector glides.

**Dimensions (3-seat)**
W 220cm × D 95cm × H 78cm. Seat height: 42cm.

**Configuration**
Available in 2, 3 and 4-seat formats with optional right or left-hand chaise extension. Mix modules freely — all join with concealed magnetic clasps.`,

  tags: `**Meta title (58 chars)**
Oslo Modular Sofa | Bespoke Boucle | Modulas UK

**Meta description (155 chars)**
Shop the Oslo 3-seat modular sofa in oatmeal boucle with solid oak legs. Configure, visualise in AR, and order bespoke. Free UK delivery over £500.

**Image alt texts**
- "Oslo 3-seat modular sofa in oatmeal boucle with solid oak legs — front view"
- "Oslo modular sofa close-up boucle fabric texture"
- "Oslo sofa in a minimalist living room setting"
- "Oslo sofa oak leg detail"

**Keywords to target**
modular sofa UK, boucle sofa, bespoke sofa UK, configure sofa online, oatmeal sofa`,

  blog: `**The Return of Boucle: Why Texture is the New Neutral**

There is something deeply reassuring about boucle. Its looped, nubby surface invites touch before you've even crossed the room — a reminder, perhaps, that furniture should be felt as much as seen.

Once the preserve of 1970s living rooms and Coco Chanel's legendary jackets, boucle has staged a quiet but decisive comeback in contemporary interiors. Walk through any design fair from Milan to London and you will encounter it draped across modular sofas, dining chairs, even headboards. But this is not mere nostalgia.

**Texture as a response to minimalism**

The spare, white-walled aesthetic that dominated the 2010s left many homes feeling clinical rather than calm. Boucle — with its organic irregularity, its warmth, its sheer refusal to be flat — offers a corrective. It brings depth without colour, interest without pattern, comfort without clutter.

**Why it works with natural materials**

Boucle's magic is in the pairing. Against smooth oak, it softens. Against raw linen, it adds refinement. Against concrete or plaster, it humanises. The material is, in the best sense, promiscuous — it gets on with everything.

At Modulas, we source our boucle from a family-run mill in northern Portugal...`,

  names: `**Five name suggestions**

1. **Fjord** — evokes Nordic calm and considered craftsmanship
2. **Kira** — short, distinctive, works across all languages
3. **Holt** — Anglo-Saxon for woodland grove; quiet strength
4. **Lune** — French for moon; soft, considered, luminous
5. **Peel** — references the elegant curves of early Scandinavian chair design`,

  email: `**Subject line options**
- Introducing Oslo in Forest Green →
- Spring just arrived. So did Oslo.
- New colour. Same obsession with detail.

---

**Email body**

We've been waiting to share this one.

Oslo — our best-selling modular sofa — is now available in Forest Green: a deep, botanical shade developed in collaboration with our boucle mill in Portugal. Warm enough for winter, fresh enough for spring.

To celebrate the launch, every Oslo ordered this week ships with complimentary contrast cushions (worth £180).

[Configure your Oslo →]

The offer ends Sunday. Lead time is 8–10 weeks, so if you're planning a spring refresh, now is the moment.

— The Modulas Studio`,
};

export default function AdminAiStudioPage() {
  const token = useAccessToken() ?? "";
  const [activeTool, setActiveTool] = useState<Tool>("copy");
  const [prompt, setPrompt]         = useState("");
  const [output, setOutput]         = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [copied, setCopied]         = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const tool = TOOLS.find((t) => t.id === activeTool)!;

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput("");
    setError("");
    try {
      const result = await aiContentApi.generate(token, {
        tool: TOOL_MAP[activeTool],
        prompt: prompt.trim(),
      });
      setOutput(result.text);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Generation failed. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function handleReset() {
    setPrompt("");
    setOutput("");
  }

  function handleUsePlaceholder() {
    setPrompt(tool.placeholder);
    if (textareaRef.current) textareaRef.current.focus();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-charcoal flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-gold" />
          AI Studio
        </h1>
        <p className="font-sans text-sm text-charcoal/40 mt-0.5">
          Claude-powered copy, descriptions, SEO tags and content — generated in seconds
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Tool sidebar */}
        <div className="space-y-1.5">
          <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-charcoal/35 px-1 mb-2">
            Choose a tool
          </p>
          {TOOLS.map((t) => {
            const Icon = t.icon;
            const active = activeTool === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => { setActiveTool(t.id); setOutput(""); setPrompt(""); }}
                className={[
                  "flex w-full items-start gap-3 rounded-xl px-3.5 py-3 text-left transition-colors",
                  active
                    ? "bg-gold/10 border border-gold/30"
                    : "hover:bg-black/3 border border-transparent",
                ].join(" ")}
              >
                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${active ? "bg-gold/20" : "bg-black/5"}`}>
                  <Icon className={`h-3.5 w-3.5 ${active ? "text-gold" : "text-charcoal/40"}`} />
                </div>
                <div>
                  <p className={`font-sans text-sm font-medium ${active ? "text-charcoal" : "text-charcoal/60"}`}>
                    {t.label}
                  </p>
                  <p className="font-sans text-[11px] text-charcoal/35 leading-relaxed mt-0.5 line-clamp-2">
                    {t.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main panel */}
        <div className="space-y-4">
          {/* Tool header */}
          <div className="rounded-2xl border border-black/6 bg-white p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-serif text-xl text-charcoal">{tool.label}</h2>
                <p className="font-sans text-sm text-charcoal/50 mt-0.5">{tool.description}</p>
              </div>
            </div>

            {/* Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="ai-prompt" className="font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/40">
                  Prompt
                </label>
                <button
                  type="button"
                  onClick={handleUsePlaceholder}
                  className="font-sans text-[11px] text-gold hover:text-gold-600 transition-colors"
                >
                  Use example
                </button>
              </div>
              <textarea
                id="ai-prompt"
                ref={textareaRef}
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={tool.placeholder}
                className="w-full rounded-xl border border-black/10 bg-transparent px-3.5 py-2.5 font-sans text-sm text-charcoal placeholder:text-charcoal/25 focus:border-gold/60 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex items-center gap-3 mt-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Generating…</>
                ) : (
                  <><Sparkles className="h-3.5 w-3.5" /> Generate</>
                )}
              </button>
              {(prompt || output) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="font-sans text-sm text-charcoal/35 hover:text-charcoal transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Output */}
          {(output || loading) && (
            <div className="rounded-2xl border border-black/6 bg-white overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-black/5">
                <p className="font-sans text-[11px] tracking-[0.1em] uppercase text-charcoal/40">
                  {tool.outputLabel}
                </p>
                {output && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-black/8 px-3 py-1.5 font-sans text-[11px] text-charcoal/50 hover:border-gold hover:text-gold transition-colors"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                )}
              </div>
              <div className="p-5">
                {loading && !output ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-4 animate-pulse rounded bg-charcoal/6 ${i === 3 ? "w-2/3" : "w-full"}`} />
                    ))}
                  </div>
                ) : (
                  <div className="font-sans text-sm text-charcoal/80 leading-relaxed whitespace-pre-wrap">
                    {output}
                  </div>
                )}
              </div>

              {output && !loading && (
                <div className="px-5 py-3 border-t border-black/5 flex gap-2">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-black/8 px-3 py-1.5 font-sans text-[11px] text-charcoal/50 hover:border-gold hover:text-gold transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" /> Regenerate
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!output && !loading && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 py-16 text-center">
              <Sparkles className="mx-auto mb-3 h-8 w-8 text-charcoal/12" />
              <p className="font-sans text-sm text-charcoal/40">Enter a prompt and click Generate</p>
              <p className="font-sans text-xs text-charcoal/25 mt-1">
                Powered by Claude
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
