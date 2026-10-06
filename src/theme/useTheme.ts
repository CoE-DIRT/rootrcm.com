import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { THEME_CHANGE_EVENT, applyTheme, followSystemTheme, getActiveTheme, toggleTheme, type Theme } from './theme';

function subscribe(onChange: () => void): () => void {
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, onChange);
}

const serverTheme = (): Theme => 'dark';

/** Reactive view of the active theme. The DOM attribute set by the bootstrap script is the source of truth. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getActiveTheme, serverTheme);

  // Follow OS preference changes until the visitor makes an explicit choice.
  useEffect(() => followSystemTheme(), []);

  const toggle = useCallback(() => toggleTheme(), []);
  const set = useCallback((next: Theme) => applyTheme(next, { persist: true }), []);
  return { theme, toggle, set };
}
