"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

// Thin wrapper — PostHog / GA4 page-view tracking
// Swap posthog.capture for your analytics SDK of choice
function PageViewTracker() {
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : "");

    // PostHog (loaded via script tag or SDK)
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Suspense required: useSearchParams needs a boundary in App Router */}
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </>
  );
}
