export default function PortalAuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal-950 animate-pulse">
      <div className="w-full max-w-md space-y-6 px-6">
        <div className="h-8 w-32 rounded bg-white/10 mx-auto" />
        <div className="rounded-2xl border border-white/8 bg-charcoal-900 p-8 space-y-5">
          <div className="h-6 w-40 rounded bg-white/10" />
          <div className="h-3 w-56 rounded bg-white/8" />
          <div className="space-y-3 pt-2">
            <div className="h-11 rounded-lg bg-white/6" />
            <div className="h-11 rounded-lg bg-white/6" />
          </div>
          <div className="h-11 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}
