import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Vite/React replacement for the fixed-geometry placeholder provided by next/image.
 * The wrapper exists in the DOM before image decoding or a lazy component resolves.
 * Width and height are image-intrinsic dimensions; CSS holds the final visual ratio.
 */
export type PlaceholderAspect = 'video' | 'wide' | 'square' | 'hero';
export const reservedAspect: Record<PlaceholderAspect, string> = {
  video: '16 / 9',
  wide: '7 / 3',
  square: '1 / 1',
  hero: '8 / 5',
};
export const reservedIntrinsic: Record<PlaceholderAspect, { width: number; height: number }> = {
  video: { width: 1200, height: 675 },
  wide: { width: 1680, height: 720 },
  square: { width: 800, height: 800 },
  hero: { width: 1600, height: 1000 },
};

export function GlassPlaceholder({
  aspect = 'video', className, children, state = 'ready',
}: {
  aspect?: PlaceholderAspect;
  className?: string;
  children?: ReactNode;
  state?: 'loading' | 'ready' | 'error';
}) {
  return (
    <div
      data-glass-placeholder=""
      data-state={state}
      aria-busy={state === 'loading' ? 'true' : undefined}
      className={cn('media-placeholder relative w-full overflow-hidden bg-panel-solid', className)}
      style={{ aspectRatio: reservedAspect[aspect] }}
    >
      {children}
    </div>
  );
}

/** Fixed vertical space for costly async dashboard/table/carousel modules.
 * Caller chooses the same min-block-size as the resolved module's shell.
 */
export function GlassSkeleton({ minHeight = '24rem', label = 'Loading section' }: {
  minHeight?: string;
  label?: string;
}) {
  return (
    <div
      className="glass glass-skeleton relative w-full overflow-hidden rounded-[var(--radius-root)] border border-border"
      style={{ minHeight }}
      role="status"
      aria-label={label}
      aria-busy="true"
    >
      <span className="sr-only">{label}</span>
    </div>
  );
}
