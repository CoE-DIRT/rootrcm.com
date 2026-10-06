import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { THEME_COLORS, THEME_STORAGE_KEY, themeBootstrapScript } from './themeConfig.js';
import { THEME_CHANGE_EVENT, applyTheme, followSystemTheme, getActiveTheme, getStoredTheme, toggleTheme } from './theme';
import { ThemeToggle } from '../v4/components/ThemeToggle';

type Listener = () => void;

function stubMatchMedia(matchesLight: boolean) {
  const listeners = new Set<Listener>();
  const query = {
    matches: matchesLight,
    addEventListener: (_: string, listener: Listener) => listeners.add(listener),
    removeEventListener: (_: string, listener: Listener) => listeners.delete(listener),
  };
  vi.stubGlobal('matchMedia', () => query);
  Object.defineProperty(window, 'matchMedia', { configurable: true, writable: true, value: () => query });
  return {
    set(next: boolean) {
      query.matches = next;
      listeners.forEach((listener) => listener());
    },
  };
}

beforeEach(() => {
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.style.colorScheme = '';
  document.head.innerHTML = '<meta name="theme-color" content="#07110e">';
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

/** Runs the exact inline script that ships in every page <head>. */
function runBootstrap({ stored, systemLight, storageThrows = false, mediaThrows = false }: { stored?: string; systemLight?: boolean; storageThrows?: boolean; mediaThrows?: boolean }) {
  const meta = { content: THEME_COLORS.dark, setAttribute(name: string, value: string) { if (name === 'content') this.content = value; } };
  const root = { attrs: {} as Record<string, string>, style: {} as Record<string, string>, setAttribute(name: string, value: string) { this.attrs[name] = value; } };
  const doc = { documentElement: root, querySelector: () => meta };
  const storage = {
    getItem: (key: string) => {
      if (storageThrows) throw new Error('blocked');
      return key === THEME_STORAGE_KEY ? stored ?? null : null;
    },
  };
  const media = () => {
    if (mediaThrows) throw new Error('unsupported');
    return { matches: Boolean(systemLight) };
  };
  new Function('document', 'localStorage', 'matchMedia', themeBootstrapScript())(doc, storage, media);
  return { theme: root.attrs['data-theme'], colorScheme: root.style.colorScheme, themeColor: meta.content };
}

describe('no-flash theme bootstrap (inline <head> script)', () => {
  it('uses the saved choice first', () => {
    expect(runBootstrap({ stored: 'light', systemLight: false }).theme).toBe('light');
    expect(runBootstrap({ stored: 'dark', systemLight: true }).theme).toBe('dark');
  });

  it('respects the system preference on a first visit', () => {
    expect(runBootstrap({ systemLight: true }).theme).toBe('light');
    expect(runBootstrap({ systemLight: false }).theme).toBe('dark');
  });

  it('ignores invalid saved values and survives blocked storage or missing matchMedia', () => {
    expect(runBootstrap({ stored: 'blue', systemLight: true }).theme).toBe('light');
    expect(runBootstrap({ storageThrows: true, systemLight: true }).theme).toBe('light');
    expect(runBootstrap({ mediaThrows: true }).theme).toBe('dark');
    expect(runBootstrap({ storageThrows: true, mediaThrows: true }).theme).toBe('dark');
  });

  it('sets color-scheme and the browser theme-color together', () => {
    expect(runBootstrap({ stored: 'light' })).toEqual({ theme: 'light', colorScheme: 'light', themeColor: THEME_COLORS.light });
    expect(runBootstrap({ stored: 'dark' })).toEqual({ theme: 'dark', colorScheme: 'dark', themeColor: THEME_COLORS.dark });
  });
});

describe('theme runtime', () => {
  it('toggles instantly, persists the choice and announces the change', () => {
    stubMatchMedia(false);
    applyTheme('dark', { persist: false });
    const seen: string[] = [];
    window.addEventListener(THEME_CHANGE_EVENT, (event) => seen.push((event as CustomEvent).detail.theme), { once: false });

    expect(toggleTheme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe(THEME_COLORS.light);

    expect(toggleTheme()).toBe('dark');
    expect(getStoredTheme()).toBe('dark');
    expect(seen).toEqual(['light', 'dark']);
  });

  it('does not persist system-driven changes, and follows the OS until the visitor chooses', () => {
    const media = stubMatchMedia(false);
    applyTheme('dark', { persist: false });
    const stop = followSystemTheme();

    media.set(true);
    expect(getActiveTheme()).toBe('light');
    expect(getStoredTheme()).toBeNull();

    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    media.set(false);
    media.set(true);
    expect(getActiveTheme()).toBe('light'); // explicit choice wins: no further system-driven change
    stop();
  });

  it('survives storage that throws', () => {
    stubMatchMedia(true);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(getStoredTheme()).toBeNull();
    expect(() => applyTheme('light', { persist: true })).not.toThrow();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    vi.restoreAllMocks();
  });
});

describe('ThemeToggle', () => {
  it('is an accessible switch that reflects and flips the active theme', () => {
    stubMatchMedia(false);
    applyTheme('dark', { persist: false });
    render(<ThemeToggle />);

    const toggle = screen.getByRole('switch', { name: 'Light theme' });
    expect(toggle.getAttribute('aria-checked')).toBe('false');
    expect(toggle.getAttribute('title')).toBe('Switch to light theme');

    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-checked')).toBe('true');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(toggle.getAttribute('title')).toBe('Switch to dark theme');

    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-checked')).toBe('false');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
