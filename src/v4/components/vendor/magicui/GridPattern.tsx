/**
 * Adapted from Magic UI Grid Pattern (MIT).
 * Original: https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/grid-pattern.tsx
 * Copyright (c) Magic UI. See LICENSE.magicui.md.
 */
import { useId, type SVGProps } from 'react';
import { cn } from '@/lib/cn';

export interface GridPatternProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  squares?: Array<[number, number]>;
  strokeDasharray?: string;
}

export function GridPattern({
  width = 48,
  height = 48,
  x = -1,
  y = -1,
  strokeDasharray = '0',
  squares,
  className,
  ...props
}: GridPatternProps) {
  const id = useId();
  return (
    <svg
      {...props}
      aria-hidden="true"
      focusable="false"
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full fill-current stroke-current',
        className,
      )}
    >
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" strokeDasharray={strokeDasharray} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares ? (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([col, row]) => (
            <rect
              key={`${col}-${row}`}
              strokeWidth={0}
              width={width - 1}
              height={height - 1}
              x={col * width + 1}
              y={row * height + 1}
            />
          ))}
        </svg>
      ) : null}
    </svg>
  );
}
