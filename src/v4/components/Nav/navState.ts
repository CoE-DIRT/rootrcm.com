import type { NavItem } from './types';
import { normalizePath, resolveCanonicalPath } from '../../../seo/routeRegistry.js';

export function isCurrent(item: NavItem, pathname: string): boolean {
  return normalizePath(resolveCanonicalPath(item.href)) === normalizePath(resolveCanonicalPath(pathname));
}

export function isSectionCurrent(item: NavItem, pathname: string): boolean {
  return isCurrent(item, pathname) || (item.children ?? []).some((child) => isCurrent(child, pathname));
}
