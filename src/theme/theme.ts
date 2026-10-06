import { THEME_COLORS, THEME_STORAGE_KEY } from './themeConfig.js';

export type Theme = 'dark' | 'light';

export const THEME_CHANGE_EVENT = 'root:theme-change';

function isTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light';
}

/** The visitor's explicit choice, if any. Storage can throw (private mode, blocked cookies) — never trust it. */
export function getStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

export function getSystemTheme(): Theme {
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

/** Theme currently painted: the bootstrap script's result, falling back to the same resolution rules. */
export function getActiveTheme(): Theme {
  const attribute = document.documentElement.getAttribute('data-theme');
  return isTheme(attribute) ? attribute : getStoredTheme() ?? getSystemTheme();
}

/** Paint a theme. `persist` records an explicit choice; system-driven changes are not persisted. */
export function applyTheme(theme: Theme, { persist }: { persist: boolean }): void {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
  if (persist) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* The choice still applies for this page view. */
    }
  }
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { theme } }));
}

export function toggleTheme(): Theme {
  const next: Theme = getActiveTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next, { persist: true });
  return next;
}

/**
 * Follow OS preference changes until the visitor makes an explicit choice.
 * Returns an unsubscribe function.
 */
export function followSystemTheme(): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
  const query = window.matchMedia('(prefers-color-scheme: light)');
  const onChange = () => {
    if (getStoredTheme() === null) applyTheme(query.matches ? 'light' : 'dark', { persist: false });
  };
  query.addEventListener?.('change', onChange);
  return () => query.removeEventListener?.('change', onChange);
}
