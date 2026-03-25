"use client";

import React from "react";

export function ProductSuggestions({ products, className }: { products?: any[]; className?: string }) {
  return (
    <div className={className}>
      {(products || []).map((p, i) => (
        <div key={i} className="text-sm">{p?.name ?? p?.title ?? 'Product'}</div>
      ))}
    </div>
  );
}

export default ProductSuggestions;
