export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-charcoal animate-pulse">
      <div className="w-full max-w-md space-y-6 px-6">
        {/* Logo */}
        <div className="h-8 w-32 rounded bg-charcoal-200 dark:bg-charcoal-700 mx-auto" />
        {/* Card */}
        <div className="rounded-2xl border border-black/8 dark:border-white/8 bg-white dark:bg-charcoal-900 p-8 space-y-5">
          <div className="h-6 w-40 rounded bg-charcoal-200 dark:bg-charcoal-700" />
          <div className="h-3 w-56 rounded bg-charcoal-200 dark:bg-charcoal-700" />
          <div className="space-y-3 pt-2">
            <div className="h-11 rounded-lg bg-charcoal-100 dark:bg-charcoal-800" />
            <div className="h-11 rounded-lg bg-charcoal-100 dark:bg-charcoal-800" />
          </div>
          <div className="h-11 rounded-full bg-charcoal-200 dark:bg-charcoal-700" />
        </div>
      </div>
    </div>
  );
}
