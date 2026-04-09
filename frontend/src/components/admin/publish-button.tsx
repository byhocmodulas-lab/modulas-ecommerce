"use client";

import { useState } from "react";
import { Rocket, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface PublishButtonProps {
  /** Paths to revalidate. Defaults to homepage + products + all CMS. */
  paths?: string[];
  /** Cache tags to revalidate */
  tags?: string[];
  label?: string;
  variant?: "default" | "compact";
}

const REVALIDATE_SECRET = process.env.NEXT_PUBLIC_REVALIDATE_SECRET ?? "modulas-revalidate";

export function PublishButton({
  paths = ["/", "/products", "/blog"],
  tags  = ["products", "cms", "articles"],
  label = "Publish to Site",
  variant = "default",
}: PublishButtonProps) {
  const [state, setState] = useState<"idle" | "publishing" | "done" | "error">("idle");

  async function handlePublish() {
    setState("publishing");
    try {
      const res = await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: REVALIDATE_SECRET, paths, tags }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState("done");
      setTimeout(() => setState("idle"), 3000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  const isCompact = variant === "compact";

  if (state === "done") {
    return (
      <div className={`flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 font-sans text-xs font-medium text-emerald-700 ${isCompact ? "" : "px-4 py-2"}`}>
        <CheckCircle2 className="h-3.5 w-3.5" />
        {isCompact ? "Published!" : "Site updated — changes are live!"}
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className={`flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-1.5 font-sans text-xs font-medium text-red-600 ${isCompact ? "" : "px-4 py-2"}`}>
        <AlertCircle className="h-3.5 w-3.5" />
        Publish failed — retry
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handlePublish}
      disabled={state === "publishing"}
      className={`flex items-center gap-1.5 rounded-xl font-sans font-medium transition-all
        ${isCompact
          ? "bg-gold/10 px-3 py-1.5 text-[11px] text-gold hover:bg-gold/20"
          : "bg-gold px-4 py-2 text-[12px] text-charcoal-950 hover:bg-gold-400 shadow-sm hover:shadow-md"
        }
        disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {state === "publishing"
        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
        : <Rocket className="h-3.5 w-3.5" />
      }
      {state === "publishing" ? "Publishing…" : label}
    </button>
  );
}
