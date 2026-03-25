"use client";

import { cn } from "@/lib/utils/format";

export interface SpecItem {
  label: string;
  value: string;
}

export interface SpecGroup {
  heading: string;
  items: SpecItem[];
}

export interface SpecDownload {
  label: string;
  description?: string;
  url: string;
  fileType: "pdf" | "dwg" | "gltf" | "usdz";
  fileSizeKb?: number;
}

interface ProductSpecificationsProps {
  specGroups?: SpecGroup[];
  downloads?: SpecDownload[];
  className?: string;
}

const FILE_ICONS: Record<SpecDownload["fileType"], React.ReactNode> = {
  pdf:  <PdfIcon />,
  dwg:  <CadIcon />,
  gltf: <ModelIcon />,
  usdz: <ModelIcon />,
};

const FILE_LABELS: Record<SpecDownload["fileType"], string> = {
  pdf:  "PDF",
  dwg:  "CAD",
  gltf: "3D",
  usdz: "AR",
};

export function ProductSpecifications({ specGroups = [], downloads = [], className }: ProductSpecificationsProps) {

  if (specGroups.length === 0 && downloads.length === 0) return null;

  return (
    <div className={cn("space-y-8", className)}>

      {/* Section label */}
      <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-gold">
        Specifications
      </p>

      {/* Spec groups (accordion) */}
      {specGroups.length > 0 && (
        <div className="divide-y divide-black/6 dark:divide-white/6 rounded-2xl border border-black/8 dark:border-white/8 overflow-hidden">
          {specGroups.map((group, i) => (
            <details key={group.heading} className="group" open={i === 0 || undefined}>
              <summary className="flex w-full items-center justify-between px-5 py-4 text-left cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-cream-50/50 dark:hover:bg-charcoal-800/50 transition-colors">
                <span className="font-sans text-[12px] tracking-[0.12em] uppercase text-charcoal dark:text-cream">
                  {group.heading}
                </span>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-charcoal/30 dark:text-cream/30 transition-transform duration-200 shrink-0 group-open:rotate-180"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>

              <div className="px-5 pb-5">
                <dl className="space-y-0 divide-y divide-black/4 dark:divide-white/4">
                  {group.items.map(({ label, value }) => (
                    <div key={label} className="flex items-start justify-between gap-8 py-2.5">
                      <dt className="font-sans text-[12px] text-charcoal/50 dark:text-cream/50 shrink-0 min-w-[120px]">
                        {label}
                      </dt>
                      <dd className="font-sans text-[13px] text-charcoal dark:text-cream text-right">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </details>
          ))}
        </div>
      )}

      {/* Downloads */}
      {downloads.length > 0 && (
        <div className="space-y-3">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal/40 dark:text-cream/40">
            Downloads
          </p>
          <ul className="space-y-2">
            {downloads.map((dl) => (
              <li key={dl.url}>
                <a
                  href={dl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className={cn(
                    "group flex items-center gap-4 rounded-xl border border-black/6 dark:border-white/6 p-4",
                    "bg-white dark:bg-charcoal-900 transition-all duration-200",
                    "hover:border-gold/30 hover:shadow-luxury",
                  )}
                >
                  {/* File type icon */}
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/8 dark:bg-gold/12 text-gold transition-colors group-hover:bg-gold group-hover:text-charcoal-950">
                    {FILE_ICONS[dl.fileType]}
                  </span>

                  {/* Label + description */}
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-[13px] font-medium text-charcoal dark:text-cream group-hover:text-gold transition-colors truncate">
                      {dl.label}
                    </p>
                    {dl.description && (
                      <p className="font-sans text-[11px] text-charcoal/40 dark:text-cream/40 mt-0.5">
                        {dl.description}
                      </p>
                    )}
                  </div>

                  {/* File meta */}
                  <div className="shrink-0 text-right">
                    <span className="block font-sans text-[10px] tracking-[0.15em] uppercase text-gold">
                      {FILE_LABELS[dl.fileType]}
                    </span>
                    {dl.fileSizeKb && (
                      <span className="block font-sans text-[10px] text-charcoal/30 dark:text-cream/30 mt-0.5">
                        {dl.fileSizeKb < 1024
                          ? `${dl.fileSizeKb} KB`
                          : `${(dl.fileSizeKb / 1024).toFixed(1)} MB`}
                      </span>
                    )}
                  </div>

                  {/* Download arrow */}
                  <DownloadIcon />
                </a>
              </li>
            ))}
          </ul>

          <p className="font-sans text-[11px] text-charcoal/30 dark:text-cream/30 leading-relaxed pt-1">
            For trade enquiries and custom specification sheets, contact our studio team.
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Icons ────────────────────────────────────────────────────── */
function PdfIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
function CadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
    </svg>
  );
}
function ModelIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal/25 dark:text-cream/25 shrink-0">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
