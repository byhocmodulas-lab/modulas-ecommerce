"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff, Loader2, Check, RotateCcw } from "lucide-react";
import { useAccessToken } from "@/lib/stores/auth-store";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

interface VisibilitySection {
  id:      string;
  label:   string;
  group:   string;
  visible: boolean;
}

const DEFAULTS: VisibilitySection[] = [
  // Homepage sections
  { id: "home_hero",           label: "Hero Banner",           group: "Homepage",      visible: true  },
  { id: "home_marquee",        label: "Marquee Strip",         group: "Homepage",      visible: true  },
  { id: "home_featured_prods", label: "Featured Products",     group: "Homepage",      visible: true  },
  { id: "home_configurator",   label: "Configurator CTA",      group: "Homepage",      visible: true  },
  { id: "home_press",          label: "Press Quotes",          group: "Homepage",      visible: true  },
  { id: "home_categories",     label: "Shop by Category",      group: "Homepage",      visible: true  },
  { id: "home_editorial",      label: "Editorial Panel",       group: "Homepage",      visible: true  },
  { id: "home_services",       label: "Services Strip",        group: "Homepage",      visible: true  },
  { id: "home_stories",        label: "Stories / Journal",     group: "Homepage",      visible: true  },
  { id: "home_brand_story",    label: "Brand Story",           group: "Homepage",      visible: true  },
  { id: "home_newsletter",     label: "Newsletter Signup",     group: "Homepage",      visible: true  },
  // Navigation
  { id: "nav_announcement",    label: "Announcement Bar",      group: "Navigation",    visible: true  },
  { id: "nav_search",          label: "Search Icon",           group: "Navigation",    visible: true  },
  { id: "nav_cart",            label: "Cart Icon",             group: "Navigation",    visible: true  },
  { id: "nav_book_visit",      label: "Book Free Visit Button","group": "Navigation",  visible: true  },
  // Product pages
  { id: "pdp_3d_viewer",       label: "3D / AR Viewer",        group: "Product Page",  visible: true  },
  { id: "pdp_reviews",         label: "Customer Reviews",      group: "Product Page",  visible: true  },
  { id: "pdp_related",         label: "Related Products",      group: "Product Page",  visible: true  },
  { id: "pdp_accessories",     label: "Product Accessories",   group: "Product Page",  visible: true  },
  { id: "pdp_people_viewed",   label: "People Also Viewed",    group: "Product Page",  visible: true  },
  // Footer
  { id: "footer_social",       label: "Social Links",          group: "Footer",        visible: true  },
  { id: "footer_newsletter",   label: "Footer Newsletter",     group: "Footer",        visible: true  },
  { id: "footer_certifications",label: "Certifications Row",   group: "Footer",        visible: true  },
];

export default function VisibilityManagerPage() {
  const token = useAccessToken() ?? "";
  const [sections, setSections] = useState<VisibilitySection[]>(DEFAULTS);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState<string>("All");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API}/cms/pages/visibility-settings/published`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.content)) {
          // Merge saved state with defaults (in case new sections were added)
          const saved = data.content as VisibilitySection[];
          setSections(DEFAULTS.map(d => ({ ...d, ...saved.find(s => s.id === d.id) })));
        }
      }
    } catch { /* use defaults */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const toggleGroup = (group: string, value: boolean) => {
    setSections(prev => prev.map(s => s.group === group ? { ...s, visible: value } : s));
  };

  const save = async () => {
    if (!token) return;
    setSaving(true);
    try {
      await fetch(`${API}/cms/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          key: "visibility-settings",
          title: "Visibility Settings",
          content: sections,
          status: "published",
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const groups = ["All", ...Array.from(new Set(DEFAULTS.map(s => s.group)))];
  const visible = filter === "All" ? sections : sections.filter(s => s.group === filter);
  const groupedVisible = visible.reduce<Record<string, VisibilitySection[]>>((acc, s) => {
    (acc[s.group] ??= []).push(s);
    return acc;
  }, {});

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
          <h1 className="font-serif text-2xl text-charcoal">Visibility Manager</h1>
          <p className="font-sans text-sm text-charcoal/40 mt-0.5">Show or hide sections across the website</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSections(DEFAULTS)}
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

      {/* Group filter */}
      <div className="flex gap-2 flex-wrap">
        {groups.map(g => (
          <button
            key={g}
            onClick={() => setFilter(g)}
            className={`rounded-full px-3 py-1 font-sans text-xs transition-colors ${
              filter === g
                ? "bg-charcoal text-white"
                : "border border-black/10 text-charcoal/50 hover:text-charcoal"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Sections */}
      {Object.entries(groupedVisible).map(([group, items]) => (
        <div key={group} className="rounded-2xl border border-black/6 bg-white overflow-hidden">
          {/* Group header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-black/5 bg-black/[0.02]">
            <p className="font-sans text-xs font-medium text-charcoal/60 tracking-wide">{group}</p>
            <div className="flex gap-2">
              <button
                onClick={() => toggleGroup(group, true)}
                className="font-sans text-[10px] text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Show all
              </button>
              <span className="text-charcoal/20">·</span>
              <button
                onClick={() => toggleGroup(group, false)}
                className="font-sans text-[10px] text-red-500 hover:text-red-600 transition-colors"
              >
                Hide all
              </button>
            </div>
          </div>

          {/* Items */}
          {items.map((section, i) => (
            <div
              key={section.id}
              className={`flex items-center justify-between px-5 py-3.5 ${
                i < items.length - 1 ? "border-b border-black/5" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                {section.visible
                  ? <Eye className="h-4 w-4 text-emerald-500 shrink-0" />
                  : <EyeOff className="h-4 w-4 text-charcoal/20 shrink-0" />
                }
                <span className={`font-sans text-sm ${section.visible ? "text-charcoal" : "text-charcoal/30 line-through"}`}>
                  {section.label}
                </span>
              </div>

              {/* Toggle switch */}
              <button
                onClick={() => toggle(section.id)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                  section.visible ? "bg-emerald-500" : "bg-black/15"
                }`}
                aria-label={`Toggle ${section.label}`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform mt-0.5 ${
                    section.visible ? "translate-x-4 ml-0.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      ))}

      <p className="font-sans text-xs text-charcoal/30">
        Changes take effect on the next page load. Hidden sections are removed from the HTML entirely.
      </p>
    </div>
  );
}
