'use client';

import { useEffect, useRef, HTMLAttributes } from 'react';

interface BarFillProps extends HTMLAttributes<HTMLDivElement> {
  /** 0–100 percentage value */
  pct: number;
  vertical?: boolean;
}

/**
 * A progress bar fill element that sets the fill amount via a CSS custom
 * property on the DOM node — no `style` attribute in the rendered HTML.
 *
 * The parent track must have `overflow-hidden`.
 * CSS classes `.bar-fill` (width) and `.bar-fill-h` (height) in globals.css
 * consume the `--bar-fill` custom property.
 */
export function BarFill({ pct, className = '', vertical = false, ...rest }: BarFillProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.style.setProperty('--bar-fill', `${pct}%`);
  }, [pct]);

  return (
    <div
      ref={ref}
      className={`${vertical ? 'bar-fill-h' : 'bar-fill'} ${className}`}
      {...rest}
    />
  );
}
