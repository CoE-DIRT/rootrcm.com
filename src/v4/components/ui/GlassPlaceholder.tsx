import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Space-reserving glass fallback for image, dashboard, carousel and table media.
 * Explicit aspect ratio / minimum block size is present before assets hydrate.
 * The skeleton is decorative; content remains readable to screen readers.
 */
export type PlaceholderAspect = 'video' | 'wide' | 'square' | 'hero' | 'carousel';
const ratio: Record<PlaceholderAspect, string> = {
  video: '16 / 9',
  wide: '21 / 9',
  square: '1 / 1',
  hero: '16 / 10',
  carousel: '16 / 9',
};

interface GlassPlaceholderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  aspect?: PlaceholderAspect;
  minHeight?: number | string;
  children?: ReactNode;
  busy?: boolean;
  label?: string;
}

export function GlassPlaceholder({
  aspect,
  minHeight,
  children,
  busy = false,
  label = 'Loading media',
  className,
  style,
  ...rest
}: GlassPlaceholderProps) {
  const reserve: CSSProperties = {
    ...(aspect ? { aspectRatio: ratio[aspect] } : {}),
    ...(minHeight === undefined ? {} : { minHeight }),
    ...style,
  };
  return (
    <div
      className={cn('glass-placeholder relative w-full overflow-hidden', className)}
      style={reserve}
      aria-busy={busy ? true : undefined}
      aria-label={busy ? label : undefined}
      {...rest}
    >
      {children ?? (busy ? <span aria-hidden="true" className="glass-placeholder-sheen absolute inset-0" /> : null)}
    </div>
  );
}
