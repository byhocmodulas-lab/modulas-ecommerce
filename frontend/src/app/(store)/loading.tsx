export default function StoreLoading() {
  return (
    <div className="min-h-screen bg-cream dark:bg-charcoal animate-pulse">
      {/* Nav skeleton */}
      <div className="h-16 border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-charcoal-950/80" />

      {/* Hero skeleton */}
      <div className="h-[70vh] bg-charcoal-100 dark:bg-charcoal-800" />

      {/* Content rows */}
      <div className="mx-auto max-w-7xl px-6 py-20 space-y-16">
        {/* Section heading */}
        <div className="space-y-3">
          <div className="h-3 w-24 rounded bg-charcoal-200 dark:bg-charcoal-700 mx-auto" />
          <div className="h-8 w-64 rounded bg-charcoal-200 dark:bg-charcoal-700 mx-auto" />
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] rounded-xl bg-charcoal-200 dark:bg-charcoal-700" />
              <div className="h-3 w-3/4 rounded bg-charcoal-200 dark:bg-charcoal-700" />
              <div className="h-3 w-1/2 rounded bg-charcoal-200 dark:bg-charcoal-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
