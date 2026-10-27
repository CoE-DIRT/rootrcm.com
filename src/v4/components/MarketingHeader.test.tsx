import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MarketingHeader } from './MarketingHeader';
import { FloatingSiteControls } from '../../components/SiteChrome.jsx';

afterEach(() => {
  cleanup();
  window.history.pushState({}, '', '/');
});
const at = (path: string) => {
  window.history.pushState({}, '', path);
  return render(<MarketingHeader />);
};
const trigger = (label: string) => screen.getByRole('button', { name: label });

describe('navigation current-state and semantic destinations', () => {
  it('marks the exact top page and a contained detail page', () => {
    at('/services/');
    expect(trigger('Services').getAttribute('aria-current')).toBe('page');
    expect(trigger('Services').getAttribute('data-current')).toBe('page');
    cleanup();
    at('/services/rcm/');
    expect(trigger('Services').getAttribute('aria-current')).toBe('true');
    expect(trigger('Services').getAttribute('data-current')).toBe('section');
    expect(trigger('Solutions').getAttribute('aria-current')).toBeNull();
  });

  it('uses shared focus tokens and marks the active section', () => {
    at('/pricing/');
    expect(trigger('Technology').getAttribute('data-current')).toBe('section');
    expect(trigger('Technology').className).toContain('--color-focus');
    expect(screen.getByRole('link', { name: 'Book a Consultation with ROOT' }).getAttribute('href')).toBe('/book/');
  });
});

describe('full-screen mobile navigation', () => {
  it('identifies the section, expands the current child and reports a correct active link', () => {
    at('/services/rcm/');
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const nav = within(screen.getByRole('dialog', { name: 'Menu' })).getByRole('navigation', { name: 'Mobile' });
    const services = within(nav).getByRole('button', { name: 'Services' });
    expect(services.getAttribute('data-current')).toBe('section');
    fireEvent.click(services);
    expect(within(nav).getByRole('link', { name: /Revenue Cycle Management/ }).getAttribute('aria-current')).toBe('page');
  });

  it('announces menu opening only once and closes floating Follow', () => {
    render(<><MarketingHeader /><FloatingSiteControls /></>);
    const opened = vi.fn();
    window.addEventListener('root:nav-open', opened);
    act(() => void window.dispatchEvent(new CustomEvent('root:open-follow')));
    expect(screen.getByRole('dialog', { name: /Follow ROOT/i })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(opened).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog', { name: /Follow ROOT/i })).toBeNull();
    fireEvent.keyDown(screen.getByRole('dialog', { name: 'Menu' }), { key: 'Escape' });
    expect(opened).toHaveBeenCalledTimes(1);
    window.removeEventListener('root:nav-open', opened);
  });
});
