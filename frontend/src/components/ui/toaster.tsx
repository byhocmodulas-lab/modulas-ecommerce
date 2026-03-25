"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { cn } from "@/lib/utils/format";

/* ── Types ─────────────────────────────────────────────────────── */
type Variant = "default" | "success" | "error" | "warning";

interface Toast {
  id:      string;
  title:   string;
  body?:   string;
  variant: Variant;
}

interface ToasterContextValue {
  toast: (opts: Omit<Toast, "id">) => void;
}

/* ── Context ───────────────────────────────────────────────────── */
const ToasterContext = createContext<ToasterContextValue>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToasterContext);
}

/* ── Provider + Renderer ───────────────────────────────────────── */
export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((opts: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...opts, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToasterContext.Provider value={{ toast }}>
      {/* Portal: fixed bottom-right */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-[min(360px,calc(100vw-3rem))]"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToasterContext.Provider>
  );
}

/* ── Individual Toast ──────────────────────────────────────────── */
const VARIANT_STYLES: Record<Variant, string> = {
  default: "border-charcoal/10 dark:border-cream/10",
  success: "border-l-4 border-l-emerald-500 border-charcoal/10 dark:border-cream/10",
  error:   "border-l-4 border-l-red-500    border-charcoal/10 dark:border-cream/10",
  warning: "border-l-4 border-l-amber-500  border-charcoal/10 dark:border-cream/10",
};

const ICONS: Record<Variant, React.ReactNode> = {
  default: null,
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-emerald-500 shrink-0">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-red-500 shrink-0">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-amber-500 shrink-0">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
};

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-2xl border bg-white dark:bg-charcoal-900 p-4 shadow-luxury-lg animate-fade-in",
        VARIANT_STYLES[t.variant],
      )}
    >
      {ICONS[t.variant]}
      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm font-medium text-charcoal dark:text-cream">{t.title}</p>
        {t.body && (
          <p className="mt-0.5 font-sans text-xs text-charcoal/55 dark:text-cream/55 leading-relaxed">{t.body}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(t.id)}
        aria-label="Dismiss"
        className="shrink-0 text-charcoal/30 dark:text-cream/30 hover:text-charcoal dark:hover:text-cream transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
}
