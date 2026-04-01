export default function MasterAdminLoading() {
  return (
    <div className="flex h-screen bg-[#0a0a0a] animate-pulse">
      {/* Sidebar skeleton */}
      <div className="w-64 shrink-0 border-r border-white/6 bg-[#111] p-5 space-y-2">
        <div className="h-9 w-36 rounded-lg bg-white/8 mb-8" />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-10 rounded-lg bg-white/5" />
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto p-8 space-y-6">
        <div className="h-8 w-56 rounded bg-white/10" />
        <div className="grid grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white/6" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-white/6" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-white/6" />
      </div>
    </div>
  );
}
