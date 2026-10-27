import { allRoutes, resolveCanonicalPath } from '../../../seo/routeRegistry.js';
import type { NavItem } from './types';

/**
 * Each visible canonical route needs at most two interactions:
 * hover/Enter or accordion open, then destination link. The ROOT logo gives
 * direct home access. System states, aliases and unpublished routes are NOT
 * exposed as marketing navigation entries just to satisfy a coverage counter.
 */
export function routeCoverage(items: readonly NavItem[]) {
  // The JS registry infers a union with optional flags only on some members.
  const routes: Array<{ path: string; internal?: boolean; system?: boolean; alias?: boolean; noindex?: boolean }> = allRoutes;
  const eligible = routes.filter((route) =>
    !route.internal && !route.system && !route.alias && !route.noindex,
  );
  const excluded = routes.filter((route) =>
    route.internal || route.system || route.alias || route.noindex,
  );
  const destinations = new Map<string, number>();
  destinations.set('/', 1); // Header logo (available on every public route).
  for (const item of items) {
    const top = resolveCanonicalPath(item.href);
    destinations.set(top, Math.min(destinations.get(top) ?? 99, 1));
    for (const child of item.children ?? []) {
      const path = resolveCanonicalPath(child.href);
      destinations.set(path, Math.min(destinations.get(path) ?? 99, 2));
    }
  }
  const unreachable = eligible.filter((route) => (destinations.get(route.path) ?? 99) > 2);
  const unregistered = items.flatMap((item) => [item, ...(item.children ?? [])])
    .filter((item) => !allRoutes.some((route) => route.path === item.href));
  return { eligible, excluded, unreachable, unregistered, destinations };
}

/** Emits the requested assertion in development without publishing private routes. */
export function assertNavCoverage(items: readonly NavItem[]): void {
  if (!import.meta.env.DEV) return;
  const { eligible, excluded, unreachable, unregistered } = routeCoverage(items);
  console.assert(
    unreachable.length === 0 && unregistered.length === 0,
    'ROOT nav: every public canonical route must be reachable in <=2 interactions',
    {
      missing: unreachable.map((route) => route.path),
      invalidLinks: unregistered.map((item) => item.href),
      eligible: eligible.length,
      excluded: excluded.map((route) => ({ path: route.path, reason: route.internal ? 'unpublished' : route.alias ? 'canonical alias' : 'system / post-action state' })),
    },
  );
}
