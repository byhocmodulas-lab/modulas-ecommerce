"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type MatCategory = "laminate" | "board" | "hardware" | "glass" | "stone" | "fabric";

interface Material {
  id: string;
  name: string;
  category: MatCategory;
  code: string;
  finish: string;
  brand: string;
  available: boolean;
  notes?: string;
}

const MATERIALS: Material[] = [
  { id: "m1",  name: "Smoky Drift",        category: "laminate", code: "LM-4421", finish: "Matte",         brand: "Greenlam", available: true },
  { id: "m2",  name: "Alpine White",        category: "laminate", code: "LM-1002", finish: "Suede Touch",   brand: "Greenlam", available: true },
  { id: "m3",  name: "Dark Walnut",         category: "laminate", code: "LM-5533", finish: "Wood Grain",    brand: "Merino",   available: true },
  { id: "m4",  name: "Champagne Acrylic",   category: "laminate", code: "AC-8801", finish: "High Gloss",    brand: "Duratuf",  available: true },
  { id: "m5",  name: "Storm Grey",          category: "laminate", code: "LM-7712", finish: "Metallic Sheen", brand: "Merino",  available: false, notes: "Restocking mid-April" },
  { id: "m6",  name: "BWR Plywood 18mm",    category: "board",    code: "BD-PW18", finish: "Natural",        brand: "Century", available: true },
  { id: "m7",  name: "MDF 18mm",            category: "board",    code: "BD-MD18", finish: "Smooth",         brand: "Duratuf", available: true },
  { id: "m8",  name: "HDF 6mm (back panel)", category: "board",   code: "BD-HD06", finish: "Smooth",         brand: "Century", available: true },
  { id: "m9",  name: "Soft-close Hinge 110°", category: "hardware", code: "HW-SH01", finish: "Nickel",      brand: "Hettich", available: true },
  { id: "m10", name: "Tandem Plus Drawer",  category: "hardware", code: "HW-TD02", finish: "Stainless",      brand: "Blum",    available: true },
  { id: "m11", name: "Aventos HK-XS",       category: "hardware", code: "HW-AV03", finish: "Nickel",         brand: "Blum",    available: true },
  { id: "m12", name: "Lacquered Glass — White", category: "glass", code: "GL-LW01", finish: "Gloss",         brand: "In-house", available: true },
  { id: "m13", name: "Frosted Glass",        category: "glass",   code: "GL-FR02", finish: "Satin",          brand: "In-house", available: true },
  { id: "m14", name: "Carrara White Marble", category: "stone",   code: "ST-CW01", finish: "Polished",       brand: "Marbles of India", available: true },
  { id: "m15", name: "Black Galaxy Granite", category: "stone",   code: "ST-BG02", finish: "Polished",       brand: "Marbles of India", available: true },
  { id: "m16", name: "Kota Blue Limestone",  category: "stone",   code: "ST-KB03", finish: "Honed",          brand: "Marbles of India", available: false, notes: "On request" },
];

const CATEGORY_LABELS: Record<MatCategory | "all", string> = {
  all:      "All",
  laminate: "Laminates & Acrylic",
  board:    "Boards",
  hardware: "Hardware",
  glass:    "Glass",
  stone:    "Stone / Marble",
  fabric:   "Fabric",
};

const FINISH_COLOURS: Record<string, string> = {
  "Matte":         "bg-gray-300",
  "Suede Touch":   "bg-gray-100",
  "Wood Grain":    "bg-amber-800",
  "High Gloss":    "bg-yellow-200",
  "Metallic Sheen":"bg-slate-400",
  "Natural":       "bg-amber-100",
  "Smooth":        "bg-gray-200",
  "Nickel":        "bg-slate-300",
  "Stainless":     "bg-slate-400",
  "Gloss":         "bg-white border border-black/10",
  "Satin":         "bg-gray-100",
  "Polished":      "bg-stone-200",
  "Honed":         "bg-stone-300",
};

export default function MaterialsLibraryPage() {
  const [category, setCategory] = useState<MatCategory | "all">("all");
  const [search, setSearch]     = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filtered = MATERIALS.filter((m) => {
    const matchCat  = category === "all" || m.category === category;
    const matchAvail = !onlyAvailable || m.available;
    const q = search.toLowerCase();
    const matchSearch = !search || m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q);
    return matchCat && matchAvail && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-charcoal">Materials Library</h1>
        <p className="font-sans text-sm text-charcoal/40 mt-0.5">{MATERIALS.length} materials across laminates, boards, hardware, glass and stone</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/25" />
          <input type="text" placeholder="Search by name, code, brand…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-black/10 bg-white py-2.5 pl-9 pr-4 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:border-gold/60 focus:outline-none transition-colors w-64" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(Object.keys(CATEGORY_LABELS) as (MatCategory | "all")[]).map((c) => (
            <button key={c} type="button" onClick={() => setCategory(c)}
              className={["rounded-full px-3.5 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors capitalize",
                category === c ? "bg-charcoal text-cream" : "bg-black/5 text-charcoal/50 hover:bg-black/8",
              ].join(" ")}>{CATEGORY_LABELS[c]}</button>
          ))}
        </div>
        <label className="flex items-center gap-2 font-sans text-xs text-charcoal/50 cursor-pointer ml-auto">
          <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)}
            className="rounded accent-gold" />
          In stock only
        </label>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((mat) => {
          const swatchCls = FINISH_COLOURS[mat.finish] ?? "bg-black/10";
          return (
            <div key={mat.id} className={`rounded-2xl border bg-white p-4 ${mat.available ? "border-black/6" : "border-black/4 opacity-60"}`}>
              <div className="flex items-start gap-3">
                <div className={`h-10 w-10 rounded-xl shrink-0 ${swatchCls}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-medium text-charcoal">{mat.name}</p>
                  <p className="font-sans text-[11px] text-charcoal/40">{mat.brand} · {mat.code}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-sans text-[10px] uppercase tracking-[0.1em] text-charcoal/35">{mat.finish}</span>
                {mat.available
                  ? <span className="font-sans text-[10px] text-emerald-600">In stock</span>
                  : <span className="font-sans text-[10px] text-amber-600">{mat.notes ?? "Unavailable"}</span>
                }
              </div>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-black/6 py-16 text-center font-sans text-sm text-charcoal/30">No materials found</div>
      )}
    </div>
  );
}
