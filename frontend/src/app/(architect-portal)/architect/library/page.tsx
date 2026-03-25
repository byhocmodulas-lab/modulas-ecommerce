import { Download, FileText, Ruler, Wrench, BookOpen } from "lucide-react";

const CATEGORIES = [
  {
    label: "CAD Files",
    icon: Ruler,
    files: [
      { name: "Modular Kitchen — Full Layout Pack", format: "DWG / DXF", size: "12.4 MB", updated: "2026-02-10" },
      { name: "Wardrobe Module Library", format: "DWG / DXF", size: "8.7 MB", updated: "2026-01-20" },
      { name: "Storage Units — All Types", format: "DWG", size: "5.2 MB", updated: "2026-01-15" },
      { name: "Furniture Dimensions Pack", format: "DWG / PDF", size: "3.8 MB", updated: "2025-12-01" },
    ],
  },
  {
    label: "Technical Specifications",
    icon: FileText,
    files: [
      { name: "Board Specifications — HDF, MDF, Plywood", format: "PDF", size: "2.1 MB", updated: "2026-03-01" },
      { name: "Hardware Load Ratings — Hettich & Blum", format: "PDF", size: "1.4 MB", updated: "2026-02-05" },
      { name: "Modular Kitchen Configuration Guide", format: "PDF", size: "3.6 MB", updated: "2026-01-25" },
      { name: "Walk-in Wardrobe Planning Guide", format: "PDF", size: "2.9 MB", updated: "2026-01-10" },
    ],
  },
  {
    label: "Installation Guides",
    icon: Wrench,
    files: [
      { name: "Kitchen Installation Manual", format: "PDF", size: "6.4 MB", updated: "2026-02-20" },
      { name: "Wardrobe Assembly Guide", format: "PDF", size: "4.1 MB", updated: "2026-01-28" },
      { name: "Hinge & Hardware Adjustment Guide", format: "PDF", size: "1.8 MB", updated: "2025-12-15" },
      { name: "Countertop Installation — All Materials", format: "PDF", size: "2.3 MB", updated: "2025-11-30" },
    ],
  },
  {
    label: "Presentation Materials",
    icon: BookOpen,
    files: [
      { name: "Modulas Trade Presentation 2026", format: "PPTX / PDF", size: "18.2 MB", updated: "2026-03-05" },
      { name: "Client Brochure — Modular Solutions", format: "PDF", size: "9.6 MB", updated: "2026-02-28" },
      { name: "Collections Lookbook 2026", format: "PDF", size: "24.1 MB", updated: "2026-03-10" },
      { name: "Finish Sample Card Labels", format: "PDF (print-ready)", size: "0.8 MB", updated: "2026-01-05" },
    ],
  },
];

export default function ArchitectLibraryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-charcoal">Technical Library</h1>
        <p className="font-sans text-sm text-charcoal/40 mt-0.5">CAD files, specs, installation guides and presentation materials for trade partners</p>
      </div>

      <div className="space-y-6">
        {CATEGORIES.map(({ label, icon: Icon, files }) => (
          <div key={label} className="rounded-2xl border border-black/6 bg-white overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5 bg-black/1">
              <Icon className="h-4 w-4 text-charcoal/40" />
              <h2 className="font-sans text-sm font-medium text-charcoal/70">{label}</h2>
              <span className="ml-auto font-sans text-[11px] text-charcoal/30">{files.length} files</span>
            </div>
            <div className="divide-y divide-black/4">
              {files.map((file) => (
                <div key={file.name} className="flex items-center gap-4 px-5 py-3.5 hover:bg-black/1 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm text-charcoal/80">{file.name}</p>
                    <p className="font-sans text-[11px] text-charcoal/35 mt-0.5">
                      {file.format} · {file.size} · Updated {new Date(file.updated).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <button type="button"
                    className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 font-sans text-[11px] text-charcoal/50 hover:border-gold hover:text-gold transition-colors shrink-0">
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gold/20 bg-gold/5 p-5">
        <p className="font-sans text-sm font-medium text-charcoal/70 mb-1">Need a custom resource?</p>
        <p className="font-sans text-xs text-charcoal/50 mb-3">If you need project-specific shop drawings, custom configuration files, or specialised specs, contact your account manager.</p>
        <a href="mailto:trade@modulas.in" className="font-sans text-[12px] text-gold hover:text-gold-600 transition-colors">trade@modulas.in</a>
      </div>
    </div>
  );
}
