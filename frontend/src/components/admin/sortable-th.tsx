'use client';

import type { ThHTMLAttributes } from 'react';

type SortDir = 'asc' | 'desc' | null;

interface SortableThProps extends ThHTMLAttributes<HTMLTableCellElement> {
  label: string;
  /** Current sort direction for this column (null = unsorted) */
  direction?: SortDir;
  onSort?: () => void;
}

function SortIcon({ direction }: { direction: SortDir }) {
  if (direction === 'asc') {
    return (
      <svg className="inline h-3.5 w-3.5 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    );
  }
  if (direction === 'desc') {
    return (
      <svg className="inline h-3.5 w-3.5 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    );
  }
  return (
    <svg className="inline h-3.5 w-3.5 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4M8 15l4 4 4-4" />
    </svg>
  );
}

/**
 * A <th> element that shows a sort icon and calls onSort when clicked.
 */
export function SortableTh({ label, direction = null, onSort, className = '', ...rest }: SortableThProps) {
  return (
    <th
      {...rest}
      className={`cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 hover:text-zinc-800 ${className}`}
      onClick={onSort}
      aria-sort={direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'}
    >
      <span className="flex items-center gap-1.5">
        {label}
        <SortIcon direction={direction} />
      </span>
    </th>
  );
}
