import Link from 'next/link';
import { MiniChart } from './mini-chart';

interface StatCardProps {
  label: string;
  value: string | number;
  /** e.g. "+12.4%" — positive implies green, negative implies red */
  trend?: string;
  /** Sparkline data points */
  sparkline?: number[];
  sparklineColor?: 'green' | 'red' | 'blue' | 'amber';
  /** Optional icon (any ReactNode) */
  icon?: React.ReactNode;
  /** If provided, the card is a link */
  href?: string;
  /** Show a skeleton shimmer instead of data */
  loading?: boolean;
}

function TrendBadge({ trend }: { trend: string }) {
  const isPositive = trend.startsWith('+');
  const isNegative = trend.startsWith('-');
  const color = isPositive
    ? 'text-emerald-600 bg-emerald-50'
    : isNegative
    ? 'text-red-600 bg-red-50'
    : 'text-zinc-500 bg-zinc-100';
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
      {isPositive ? '▲' : isNegative ? '▼' : '●'} {trend.replace(/^[+-]/, '')}
    </span>
  );
}

export function StatCard({
  label,
  value,
  trend,
  sparkline,
  sparklineColor = 'blue',
  icon,
  href,
  loading = false,
}: StatCardProps) {
  const inner = (
    <div className="relative flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {loading ? (
        <>
          <div className="h-3 w-24 animate-pulse rounded bg-zinc-200" />
          <div className="h-7 w-32 animate-pulse rounded bg-zinc-200" />
          <div className="h-3 w-16 animate-pulse rounded bg-zinc-200" />
        </>
      ) : (
        <>
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-zinc-500">{label}</p>
            {icon && (
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 text-zinc-400">
                {icon}
              </span>
            )}
          </div>
          <p className="text-2xl font-semibold tracking-tight text-zinc-900">{value}</p>
          <div className="flex items-end justify-between gap-2">
            {trend ? <TrendBadge trend={trend} /> : <span />}
            {sparkline && sparkline.length >= 2 && (
              <MiniChart data={sparkline} color={sparklineColor} />
            )}
          </div>
        </>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-xl">
        {inner}
      </Link>
    );
  }
  return inner;
}
