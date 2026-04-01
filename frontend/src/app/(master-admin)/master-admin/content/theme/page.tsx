"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Check, RotateCcw, Palette, Type, Sliders } from "lucide-react";
import { useAccessToken } from "@/lib/stores/auth-store";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

interface ThemeSettings {
  colors: {
    gold: string;
    charcoal: string;
    cream: string;
    background: string;
    text: string;
  };
  fonts: {
    serif: string;
    sans: string;
  };
  style: {
    borderRadius: "none" | "sm" | "md" | "lg";
    buttonStyle: "sharp" | "rounded" | "pill";
    density: "compact" | "normal" | "spacious";
  };
}

const DEFAULTS: ThemeSettings = {
  colors: {
    gold:       "#c9a96e",
    charcoal:   "#1a1a1a",
    cream:      "#f5f5f3",
    background: "#ffffff",
    text:       "#1a1a1a",
  },
  fonts: {
    serif: "Cormorant Garamond",
    sans:  "Inter",
  },
  style: {
    borderRadius: "none",
    buttonStyle:  "sharp",
    density:      "normal",
  },
};

const SERIF_FONTS = ["Cormorant Garamond", "Playfair Display", "Libre Baskerville", "Merriweather", "EB Garamond"];
const SANS_FONTS  = ["Inter", "DM Sans", "Outfit", "Nunito Sans", "Plus Jakarta Sans"];

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-black/5">
      <label className="font-sans text-sm text-charcoal/70">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-black/10"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-24 font-mono text-xs border border-black/10 rounded px-2 py-1 text-charcoal/70"
          maxLength={7}
        />
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-black/5">
      <label className="font-sans text-sm text-charcoal/70">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="font-sans text-sm border border-black/10 rounded px-3 py-1.5 text-charcoal bg-white"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

type Tab = "colors" | "fonts" | "style";

export default function ThemeEditorPage() {
  const token = useAccessToken() ?? "";
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULTS);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState<Tab>("colors");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API}/cms/pages/theme-settings/published`);
      if (res.ok) {
        const data = await res.json();
        if (data?.content) setSettings({ ...DEFAULTS, ...data.content });
      }
    } catch { /* use defaults */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Apply CSS vars live on every color change so admins see instant feedback
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-gold",    settings.colors.gold);
    root.style.setProperty("--color-charcoal", settings.colors.charcoal);
    root.style.setProperty("--color-cream",   settings.colors.cream);
    root.style.setProperty("--surface-primary", settings.colors.background);
    root.style.setProperty("--text-primary",  settings.colors.text);
  }, [settings.colors]);

  const save = async () => {
    if (!token) return;
    setSaving(true);
    try {
      await fetch(`${API}/cms/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ key: "theme-settings", title: "Theme Settings", content: settings, status: "published" }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const reset = () => setSettings(DEFAULTS);

  const set = (path: string[], value: string) => {
    setSettings(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as ThemeSettings;
      let obj: Record<string, unknown> = next as unknown as Record<string, unknown>;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]] as Record<string, unknown>;
      obj[path[path.length - 1]] = value;
      return next;
    });
  };

  const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
    { id: "colors", label: "Colors",     Icon: Palette  },
    { id: "fonts",  label: "Typography", Icon: Type     },
    { id: "style",  label: "Style",      Icon: Sliders  },
  ];

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-5 w-5 animate-spin text-charcoal/30" />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Theme Editor</h1>
          <p className="font-sans text-sm text-charcoal/40 mt-0.5">Customize colors, fonts, and visual style</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 font-sans text-xs text-charcoal/50 hover:text-charcoal transition-colors"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-full bg-charcoal px-4 py-1.5 font-sans text-xs text-white hover:bg-charcoal/80 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : saved ? <Check className="h-3 w-3" /> : null}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-black/8">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-sans text-sm transition-colors border-b-2 -mb-px ${
              tab === id ? "border-charcoal text-charcoal" : "border-transparent text-charcoal/40 hover:text-charcoal/60"
            }`}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* Colors tab */}
      {tab === "colors" && (
        <div className="rounded-2xl border border-black/6 bg-white px-6 py-2">
          <ColorField label="Brand Gold"   value={settings.colors.gold}       onChange={v => set(["colors","gold"], v)} />
          <ColorField label="Charcoal"     value={settings.colors.charcoal}   onChange={v => set(["colors","charcoal"], v)} />
          <ColorField label="Cream"        value={settings.colors.cream}      onChange={v => set(["colors","cream"], v)} />
          <ColorField label="Background"   value={settings.colors.background} onChange={v => set(["colors","background"], v)} />
          <ColorField label="Text"         value={settings.colors.text}       onChange={v => set(["colors","text"], v)} />

          {/* Preview */}
          <div className="mt-4 mb-3 rounded-xl overflow-hidden border border-black/6">
            <div className="p-4" style={{ background: settings.colors.background }}>
              <p className="font-sans text-xs mb-2" style={{ color: settings.colors.charcoal + "66" }}>PREVIEW</p>
              <h3 className="font-serif text-xl mb-1" style={{ color: settings.colors.text }}>Bespoke Furniture</h3>
              <p className="font-sans text-sm mb-3" style={{ color: settings.colors.text + "99" }}>Crafted for the way you live.</p>
              <button
                className="px-4 py-1.5 font-sans text-xs text-white"
                style={{ background: settings.colors.gold }}
              >
                Explore Collection
              </button>
            </div>
            <div className="p-3" style={{ background: settings.colors.charcoal }}>
              <p className="font-sans text-xs" style={{ color: settings.colors.cream + "cc" }}>
                Footer · Luxury furniture designed in India
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fonts tab */}
      {tab === "fonts" && (
        <div className="rounded-2xl border border-black/6 bg-white px-6 py-2">
          <SelectField label="Serif / Display font" value={settings.fonts.serif} options={SERIF_FONTS} onChange={v => set(["fonts","serif"], v)} />
          <SelectField label="Sans / Body font"      value={settings.fonts.sans}  options={SANS_FONTS}  onChange={v => set(["fonts","sans"], v)} />

          {/* Preview */}
          <div className="mt-4 mb-3 rounded-xl border border-black/6 p-5 space-y-3">
            <p className="text-[10px] font-sans tracking-widest uppercase text-charcoal/30">PREVIEW</p>
            <p style={{ fontFamily: `'${settings.fonts.serif}', Georgia, serif`, fontSize: "1.75rem", lineHeight: 1.2, color: "#1a1a1a" }}>
              Bespoke Furniture Studio
            </p>
            <p style={{ fontFamily: `'${settings.fonts.sans}', system-ui, sans-serif`, fontSize: "0.875rem", color: "#1a1a1a99" }}>
              A contemporary luxury studio redefining the way interiors are experienced. Crafted in India.
            </p>
            <button style={{ fontFamily: `'${settings.fonts.sans}', system-ui, sans-serif`, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.5rem 1.25rem", background: "#1a1a1a", color: "#fff" }}>
              Book Free Visit
            </button>
          </div>
        </div>
      )}

      {/* Style tab */}
      {tab === "style" && (
        <div className="rounded-2xl border border-black/6 bg-white px-6 py-2">
          <SelectField
            label="Border Radius"
            value={settings.style.borderRadius}
            options={["none", "sm", "md", "lg"]}
            onChange={v => set(["style","borderRadius"], v)}
          />
          <SelectField
            label="Button Style"
            value={settings.style.buttonStyle}
            options={["sharp", "rounded", "pill"]}
            onChange={v => set(["style","buttonStyle"], v)}
          />
          <SelectField
            label="Spacing Density"
            value={settings.style.density}
            options={["compact", "normal", "spacious"]}
            onChange={v => set(["style","density"], v)}
          />

          {/* Preview */}
          <div className="mt-4 mb-3 rounded-xl border border-black/6 p-5 space-y-3">
            <p className="text-[10px] font-sans tracking-widest uppercase text-charcoal/30">BUTTON PREVIEW</p>
            <div className="flex gap-3 flex-wrap">
              {(["primary", "secondary", "ghost"] as const).map(variant => (
                <button
                  key={variant}
                  className={`font-sans text-xs px-4 py-2 capitalize transition-colors
                    ${variant === "primary" ? "bg-charcoal text-white" : ""}
                    ${variant === "secondary" ? "bg-white border border-black/20 text-charcoal" : ""}
                    ${variant === "ghost" ? "text-charcoal/60 underline underline-offset-2" : ""}
                    ${settings.style.buttonStyle === "pill" ? "rounded-full" : ""}
                    ${settings.style.buttonStyle === "rounded" ? "rounded-lg" : ""}
                    ${settings.style.buttonStyle === "sharp" ? "rounded-none" : ""}
                  `}
                >
                  {variant}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="font-sans text-xs text-charcoal/30">
        Changes are saved to the CMS and take effect on the next frontend deploy or page revalidation.
      </p>
    </div>
  );
}
