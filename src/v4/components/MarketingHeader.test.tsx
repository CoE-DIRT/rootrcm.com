import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
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

const trigger = (name: string) => screen.getByRole('button', { name: new RegExp(`^${name}$`) });

describe('primary navigation current state', () => {
  it('marks the Services trigger as the current page on the services hub, visibly and for assistive technology', () => {
    at('/services/');
    expect(trigger('Services').getAttribute('aria-current')).toBe('page');
    expect(trigger('Services').getAttribute('data-current')).toBe('page');
    expect(trigger('Solutions').getAttribute('aria-current')).toBeNull();
    expect(trigger('Solutions').hasAttribute('data-current')).toBe(false);
  });

  it('marks the trigger as the current section on a detail page inside it', () => {
    at('/services/rcm/');
    expect(trigger('Services').getAttribute('aria-current')).toBe('true');
    expect(trigger('Services').getAttribute('data-current')).toBe('section');
    cleanup();
    at('/solutions/revenue-leakage/');
    expect(trigger('Solutions').getAttribute('aria-current')).toBe('true');
    expect(trigger('Services').getAttribute('aria-current')).toBeNull();
  });

  it('styles the trigger from its current state, with the same indicator the plain links use', () => {
    at('/services/');
    const classes = trigger('Services').className;
    expect(classes).toContain('data-[current=page]:after:bg-accent');
    expect(classes).toContain('relative'); // the underline is positioned against the trigger
    // The plain links keep working exactly as before.
    cleanup();
    at('/pricing/');
    expect(screen.getAllByRole('link', { name: 'Pricing' })[0].getAttribute('aria-current')).toBe('page');
    expect(screen.getAllByRole('link', { name: 'About' })[0].getAttribute('aria-current')).toBeNull();
  });
});

describe('mobile menu and the floating panels', () => {
  it('announces that the menu opened, once, and not when it closes', () => {
    at('/');
    const opened = vi.fn();
    window.addEventListener('root:nav-open', opened);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(opened).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog', { name: /Menu/i })).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('dialog', { name: /Menu/i }), { key: 'Escape' });
    expect(opened).toHaveBeenCalledTimes(1);
    window.removeEventListener('root:nav-open', opened);
  });

  it('closes an open Follow panel when the menu opens, so it cannot sit above the menu', () => {
    window.history.pushState({}, '', '/');
    render(
      <>
        <MarketingHeader />
        <FloatingSiteControls />
      </>,
    );
    act(() => void window.dispatchEvent(new CustomEvent('root:open-follow')));
    expect(screen.getByRole('dialog', { name: /Follow ROOT/i })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.queryByRole('dialog', { name: /Follow ROOT/i })).toBeNull();
  });
});
