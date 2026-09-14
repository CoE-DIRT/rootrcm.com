import { useEffect, useState } from 'react';

/**
 * Recharts drives its bar/line-entry animation with JS-scheduled attribute updates,
 * not CSS transitions/animations — so the `prefers-reduced-motion` CSS media-query
 * rule in tailwind.css (which only shortens CSS animation/transition durations)
 * cannot stop it. Charts that animate on mount should pass
 * `isAnimationActive={!usePrefersReducedMotion()}`.
 */
function supportsMatchMedia(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() =>
    supportsMatchMedia() ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
  );

  useEffect(() => {
    if (!supportsMatchMedia()) return undefined;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (event: MediaQueryListEvent) => setPrefersReduced(event.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
