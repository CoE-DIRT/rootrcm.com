import { useState } from 'react';
import { cn } from '@/lib/cn';
import { GlassPlaceholder, reservedIntrinsic, type PlaceholderAspect } from './GlassPlaceholder';

interface MediaFrameProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  aspect?: PlaceholderAspect;
}

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
      <GlassPlaceholder aspect={aspect} state={state} className={cn('media-frame-image', aspect === 'hero' && 'min-h-[280px] md:min-h-[420px]')}>
        <img
          key={src}
          src={src}
          onLoad={() => setLoaded({ src, state: 'ready' })}
          onError={() => setLoaded({ src, state: 'error' })}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          width={reservedIntrinsic[aspect].width}
          height={reservedIntrinsic[aspect].height}
          className={cn('h-full w-full object-cover object-center', imgClassName)}
        />
        {state === 'error' ? <p className="absolute inset-0 flex items-center justify-center p-4 text-sm text-muted">Image unavailable: {alt}</p> : null}
      </GlassPlaceholder>
      {caption ? <figcaption className="border-t border-border px-4 py-2 text-xs text-muted">{caption}</figcaption> : null}
    </figure>
  );
}
