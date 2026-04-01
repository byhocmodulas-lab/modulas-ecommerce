export default function ContentLoading() {
  return (
    <div className="min-h-screen bg-cream dark:bg-charcoal animate-pulse">
      {/* Nav */}
      <div className="h-16 border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-charcoal-950/80" />

      {/* Content area */}
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-10">
        {/* Title */}
        <div className="space-y-3 text-center">
          <div className="h-3 w-20 rounded bg-charcoal-200 dark:bg-charcoal-700 mx-auto" />
          <div className="h-10 w-96 rounded bg-charcoal-200 dark:bg-charcoal-700 mx-auto" />
          <div className="h-4 w-64 rounded bg-charcoal-200 dark:bg-charcoal-700 mx-auto" />
        </div>

        {/* Article grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-video rounded-xl bg-charcoal-200 dark:bg-charcoal-700" />
              <div className="h-3 w-16 rounded bg-charcoal-200 dark:bg-charcoal-700" />
              <div className="h-5 w-full rounded bg-charcoal-200 dark:bg-charcoal-700" />
              <div className="h-3 w-3/4 rounded bg-charcoal-200 dark:bg-charcoal-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
