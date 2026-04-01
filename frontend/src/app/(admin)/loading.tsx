export default function AdminLoading() {
  return (
    <div className="flex h-screen bg-charcoal-50 dark:bg-charcoal-950 animate-pulse">
      {/* Sidebar skeleton */}
      <div className="w-60 shrink-0 border-r border-black/8 dark:border-white/8 bg-white dark:bg-charcoal-900 p-5 space-y-2">
        <div className="h-8 w-32 rounded bg-charcoal-200 dark:bg-charcoal-700 mb-8" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-9 rounded-lg bg-charcoal-100 dark:bg-charcoal-800" />
        ))}
      </div>

      {/* Main skeleton */}
      <div className="flex-1 overflow-auto p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-7 w-48 rounded bg-charcoal-200 dark:bg-charcoal-700" />
          <div className="h-9 w-32 rounded-full bg-charcoal-200 dark:bg-charcoal-700" />
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-charcoal-200 dark:bg-charcoal-700" />
          ))}
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-black/8 dark:border-white/8 bg-white dark:bg-charcoal-900 overflow-hidden">
          <div className="h-12 border-b border-black/5 dark:border-white/5 bg-charcoal-50 dark:bg-charcoal-800" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 border-b border-black/5 dark:border-white/5 last:border-0" />
          ))}
        </div>
      </div>
    </div>
  );
}
