import { describe, expect, it, afterEach, beforeAll, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import { primaryNav } from '../../../../siteData.js';
import { allRoutes } from '../../../../seo/routeRegistry.js';
import { routeCoverage, assertNavCoverage } from '../coverage';
import { DesktopNav } from '../DesktopNav';
import { MobileNav } from '../MobileNav';

beforeAll(() => {
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  document.body.style.overflow = '';
});

describe('UX-1.1 navigation model', () => {
  it('has five destination groups and one distinctly labeled consultation CTA', () => {
    expect(primaryNav).toHaveLength(6);
    expect(primaryNav.filter((item) => item.isCTA)).toHaveLength(1);
    expect(primaryNav.map((item) => item.label)).toEqual([
      'Services', 'Solutions', 'Technology', 'Resources', 'Company', 'Book a Consultation',
    ]);
    for (const item of primaryNav.filter((entry) => !entry.isCTA)) {
      expect(item.children?.length).toBeGreaterThan(0);
      for (const child of item.children ?? []) {
        expect(child.description?.trim().length).toBeGreaterThan(8);
      }
    }
  });

  it('maps every indexable route in two interactions and records excluded routes', () => {
    const result = routeCoverage(primaryNav);
    expect(result.eligible.length + result.excluded.length).toBe(allRoutes.length);
    expect(result.eligible.length).toBe(48);
    expect(result.unreachable).toEqual([]);
    expect(result.unregistered).toEqual([]);
    for (const route of result.eligible) {
      expect(result.destinations.get(route.path)).toBeLessThanOrEqual(2);
    }
    expect(result.excluded.map((route) => route.path)).toContain('/__v4-lab/');
    expect(result.excluded.map((route) => route.path)).toContain('/checkout/success/');
  });

  it('performs a development coverage assertion with no inaccessible canonical routes', () => {
    const assertion = vi.spyOn(console, 'assert').mockImplementation(() => {});
    assertNavCoverage(primaryNav);
    expect(assertion).toHaveBeenCalledWith(true, expect.any(String), expect.any(Object));
  });
});

describe('Desktop NavigationMenu', () => {
  it('exposes triggers, active state, and an explicitly named consultation CTA', () => {
    const { container } = render(<DesktopNav currentPath="/services/rcm/" />);
    const nav = within(container).getByRole('navigation', { name: 'Primary navigation' });
    const services = within(nav).getByRole('button', { name: 'Services' });
    expect(services.getAttribute('data-current')).toBe('section');
    expect(services.getAttribute('aria-expanded')).toBe('false');
    const consultation = within(nav).getByRole('link', { name: 'Book a Consultation with ROOT' });
    expect(consultation.getAttribute('href')).toBe('/book/');
  });

  it('opens dropdown by keyboard activation and dismisses with Escape', async () => {
    const { container } = render(<DesktopNav currentPath="/" />);
    const services = within(container).getByRole('button', { name: 'Services' });
    services.focus();
    fireEvent.keyDown(services, { key: 'Enter', code: 'Enter' });
    fireEvent.click(services); // jsdom does not synthesize native button-click after Enter
    await waitFor(() => expect(services.getAttribute('aria-expanded')).toBe('true'));
    expect(screen.getByText('All services')).toBeTruthy();
    fireEvent.keyDown(services, { key: 'Escape', code: 'Escape' });
    await waitFor(() => expect(services.getAttribute('aria-expanded')).toBe('false'));
  });
});

describe('Mobile Dialog / Accordion', () => {
  it('opens the full-screen modal, expands a route group, closes via Escape and restores focus', async () => {
    const { container } = render(<MobileNav currentPath="/services/rcm/" />);
    const open = within(container).getByRole('button', { name: 'Open menu' });
    fireEvent.click(open);
    const dialog = await screen.findByRole('dialog', { name: 'Menu' });
    expect(dialog.getAttribute('data-state')).toBe('open');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(document.body.style.overflow).toBe('hidden');
    const nav = within(dialog).getByRole('navigation', { name: 'Mobile' });
    const group = within(nav).getByRole('button', { name: 'Services' });
    expect(group.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(group);
    expect(group.getAttribute('data-state')).toBe('open');
    expect(within(nav).getByRole('link', { name: /Revenue Cycle Management/i })).toBeTruthy();
    expect(within(dialog).getByRole('link', { name: 'Book a Consultation with ROOT' })).toBeTruthy();
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Menu' })).toBeNull());
    expect(document.body.style.overflow).toBe('');
    await waitFor(() => expect(document.activeElement).toBe(open));
  });

  it('contains keyboard focus within the modal while it is open', async () => {
    render(<><button type="button">Outside</button><MobileNav currentPath="/" /></>);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const dialog = await screen.findByRole('dialog', { name: 'Menu' });
    const close = within(dialog).getByRole('button', { name: 'Close menu' });
    close.focus();
    expect(document.activeElement).toBe(close);
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(screen.queryByRole('button', { name: 'Outside' })).toBeNull();
  });
});
