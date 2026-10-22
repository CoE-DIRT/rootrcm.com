import { useState } from 'react';
import { cn } from '@/lib/cn';

interface MediaFrameProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  aspect?: 'video' | 'wide' | 'square' | 'hero';
}

const aspectClass = {
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
  square: 'aspect-square',
  hero: 'aspect-[16/10] min-h-[280px] md:min-h-[420px]',
};

export function MediaFrame({
  src,
  alt,
  caption,
  className,
  imgClassName,
  priority = false,
  aspect = 'video',
}: MediaFrameProps) {
  const [loaded, setLoaded] = useState({ src: '', state: 'loading' });
  const state = loaded.src === src ? loaded.state : 'loading';
  return (
    <figure className={cn('overflow-hidden rounded-[var(--radius-root)] border border-border bg-panel', className)}>
      <div data-state={state} className={cn('media-placeholder relative w-full overflow-hidden', aspectClass[aspect])}>
        <img
          key={src}
          src={src}
          onLoad={() => setLoaded({ src, state: 'ready' })}
          onError={() => setLoaded({ src, state: 'error' })}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={cn('h-full w-full object-cover object-center', imgClassName)}
        />
        {state === 'error' ? <p className="absolute inset-0 flex items-center justify-center p-4 text-sm text-muted">Image unavailable: {alt}</p> : null}
      </div>
      {caption ? <figcaption className="border-t border-border px-4 py-2 text-xs text-muted">{caption}</figcaption> : null}
    </figure>
  );
}
