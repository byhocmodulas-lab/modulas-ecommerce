'use client';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterPillsProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Pill-style filter group. Pass `value` and `onChange` to control it.
 * The first option is treated as "All" (empty string value is conventional).
 */
export function FilterPills({ options, value, onChange, className = '' }: FilterPillsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`} role="group">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              active
                ? 'border-zinc-800 bg-zinc-800 text-white'
                : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-800'
            }`}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
