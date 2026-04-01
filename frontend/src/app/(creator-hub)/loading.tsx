export default function CreatorHubLoading() {
  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-charcoal-950 animate-pulse">
      {/* Sidebar */}
      <div className="w-60 shrink-0 border-r border-black/8 dark:border-white/8 bg-white dark:bg-charcoal-900 p-5 space-y-2">
        <div className="h-8 w-32 rounded bg-charcoal-200 dark:bg-charcoal-700 mb-8" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 rounded-lg bg-charcoal-100 dark:bg-charcoal-800" />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8 space-y-6">
        <div className="h-7 w-44 rounded bg-charcoal-200 dark:bg-charcoal-700" />
        <div className="grid grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-charcoal-200 dark:bg-charcoal-700" />
          ))}
        </div>
        <div className="h-56 rounded-2xl bg-charcoal-200 dark:bg-charcoal-700" />
      </div>
    </div>
  );
}
