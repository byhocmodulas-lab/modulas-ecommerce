'use client';

interface MiniChartProps {
  /** Ordered data points — values only */
  data: number[];
  width?: number;
  height?: number;
  color?: 'green' | 'red' | 'blue' | 'amber';
  className?: string;
}

const STROKE: Record<NonNullable<MiniChartProps['color']>, string> = {
  green: '#22c55e',
  red:   '#ef4444',
  blue:  '#3b82f6',
  amber: '#f59e0b',
};

const FILL: Record<NonNullable<MiniChartProps['color']>, string> = {
  green: '#22c55e22',
  red:   '#ef444422',
  blue:  '#3b82f622',
  amber: '#f59e0b22',
};

/**
 * Lightweight SVG sparkline — no external charting library.
 */
export function MiniChart({
  data,
  width = 80,
  height = 32,
  color = 'blue',
  className = '',
}: MiniChartProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;

  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = pad + ((max - v) / range) * (height - pad * 2);
    return [x, y] as [number, number];
  });

  const polyline = pts.map(([x, y]) => `${x},${y}`).join(' ');
  const [fx, fy0] = pts[0];
  const [lx, ly0] = pts[pts.length - 1];
  void fy0; void ly0;

  const areaD = `M ${fx},${height} L ${pts.map(([x, y]) => `${x},${y}`).join(' L ')} L ${lx},${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
    >
      <path d={areaD} fill={FILL[color]} stroke="none" />
      <polyline
        points={polyline}
        fill="none"
        stroke={STROKE[color]}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
