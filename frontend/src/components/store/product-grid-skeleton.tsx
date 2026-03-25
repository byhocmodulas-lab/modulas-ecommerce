export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="space-y-8">
      {/* Count shimmer */}
      <div className="h-4 w-28 rounded-full shimmer-bg" />

      <ul
        role="list"
        aria-busy="true"
        aria-label="Loading products"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {Array.from({ length: count }).map((_, i) => (
          <li key={i}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-charcoal-900 shadow-none">
      {/* Image */}
      <div className="aspect-[3/4] shimmer-bg" />
      {/* Info */}
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 rounded-full shimmer-bg" />
        <div className="h-5 w-3/4 rounded-md shimmer-bg" />
        <div className="h-3 w-1/2 rounded-full shimmer-bg" />
        <div className="h-4 w-24 rounded-full shimmer-bg mt-2" />
      </div>
    </div>
  );
}
