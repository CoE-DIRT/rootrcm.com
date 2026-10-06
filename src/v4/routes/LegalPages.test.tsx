import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../../App.jsx';
import { resetExperimentsForTests } from '../experiments/engine';

const GA_ID = 'G-TEST12345';

const privacy = () => {
  window.history.pushState({}, '', '/privacy-policy/');
  return render(<App />);
};
const text = () => document.body.textContent ?? '';

afterEach(() => {
  cleanup();
  resetExperimentsForTests();
  vi.unstubAllEnvs();
  window.history.pushState({}, '', '/');
});

describe('privacy policy follows the build configuration', () => {
  it('says plainly that no analytics tool runs when none is configured, and names none', () => {
    privacy();
    expect(screen.getByTestId('no-analytics')).toBeTruthy();
    expect(screen.queryByTestId('analytics-tools')).toBeNull();
    for (const named of [/Google Analytics/, /PostHog/, /session replay/, /first-party measurement/]) expect(text()).not.toMatch(named);
    expect(text()).not.toMatch(/coarse device and browser/);
  });

  it('lists exactly the configured tools, each described by what it actually does', () => {
    vi.stubEnv('VITE_TRACKING_ENDPOINT', 'https://tracking.example.test/ingest');
    privacy();
    const tools = screen.getByTestId('analytics-tools');
    expect(within(tools).getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByTestId('tool-first-party').textContent).toMatch(/does not record IP addresses or browser user-agent strings/);
    expect(screen.queryByTestId('tool-ga4')).toBeNull();
    expect(screen.queryByTestId('tool-posthog')).toBeNull();
    expect(text()).not.toMatch(/Google Analytics|PostHog/);
    expect(text()).toMatch(/Global Privacy Control signal is treated as a refusal/);
  });

  it('describes Google Analytics only when GA4 can actually run, including what Google itself receives', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', GA_ID);
    vi.stubEnv('VITE_GA_NON_PRODUCTION', 'true');
    privacy();
    expect(screen.getByTestId('tool-ga4').textContent).toMatch(/browser, device type and approximate location/);
    expect(screen.getByTestId('tool-ga4').textContent).toMatch(/Advertising features and Google signals are switched off/);
    expect(screen.queryByTestId('tool-first-party')).toBeNull();
  });

  it('does not describe Google Analytics where it is configured but cannot run (a non-production host)', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', GA_ID); // jsdom is on localhost and there is no opt-in
    privacy();
    expect(screen.getByTestId('no-analytics')).toBeTruthy();
    expect(text()).not.toMatch(/Google Analytics/);
  });

  it('discloses PostHog and its session replay only when a project key is configured', () => {
    vi.stubEnv('VITE_PUBLIC_POSTHOG_KEY', 'phc_SYNTHETICxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    privacy();
    expect(screen.getByTestId('tool-posthog').textContent).toMatch(/session replay/);
    expect(screen.getByTestId('tool-posthog').textContent).toMatch(/masked/);
  });

  it('discloses site tests only when they can store an assignment', () => {
    vi.stubEnv('VITE_TRACKING_ENDPOINT', 'https://tracking.example.test/ingest');
    vi.stubEnv('VITE_EXPERIMENTS_ENABLED', 'true');
    privacy();
    expect(screen.getByTestId('tool-experiments')).toBeTruthy();
    cleanup();
    vi.stubEnv('VITE_EXPERIMENTS_ENABLED', 'false');
    privacy();
    expect(screen.queryByTestId('tool-experiments')).toBeNull();
  });
});

describe('privacy policy on how inquiries are delivered', () => {
  it('does not claim a bot-protection challenge for the default relay', () => {
    privacy();
    expect(screen.getByTestId('contact-delivery-relay').textContent).toMatch(/FormSubmit/);
    expect(screen.getByTestId('contact-delivery-relay').textContent).toMatch(/does not use a bot-protection challenge/);
    expect(text()).not.toMatch(/verified with a bot-protection challenge|Cloudflare Turnstile/);
  });

  it('does not claim a bot-protection challenge for a configured endpoint that has none', () => {
    vi.stubEnv('VITE_FORM_ENDPOINT', 'https://forms.example.test/submit');
    privacy();
    expect(screen.getByTestId('contact-delivery-endpoint').textContent).toMatch(/does not use a bot-protection challenge/);
    expect(screen.queryByTestId('contact-delivery-relay')).toBeNull();
  });

  it('describes the challenge only for owned delivery, which is what renders it', () => {
    vi.stubEnv('VITE_CONTACT_MODE', 'owned');
    vi.stubEnv('VITE_FORM_ENDPOINT', 'https://fn.example.test/contact');
    vi.stubEnv('VITE_TURNSTILE_SITE_KEY', '0x4AAAAAAAexample');
    privacy();
    expect(screen.getByTestId('contact-delivery-owned').textContent).toMatch(/Cloudflare Turnstile/);
    expect(text()).not.toMatch(/FormSubmit|does not use a bot-protection challenge/);
  });

  it('keeps the no-PHI warning in every configuration', () => {
    privacy();
    expect(text()).toMatch(/Do not submit patient names/);
    expect(text()).toMatch(/Do not use any form on this website for sensitive data/);
  });
});
