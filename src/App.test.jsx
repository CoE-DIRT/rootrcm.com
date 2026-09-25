import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App.jsx';
import { getExperimentAssignment, resetExperimentAssignments } from './experiments.js';
import { buildDeliveryPayload, getInquiryEndpoint, ROOT_FORM_RELAY } from './modules/glass-core/formDelivery.js';
import { buildInquiryMailto, buildInquirySummary } from './modules/glass-core/inquiryTemplate.js';
import { validateContentSchemas, buildSocialPack } from './v4/content/engine.ts';
import { FormField, Input } from './v4/components/ui/Input.tsx';

function renderRoute(path = '/') {
  window.history.pushState({}, '', path);
  return render(<App />);
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  window.history.pushState({}, '', '/');
  sessionStorage.clear();
  localStorage.clear();
  resetExperimentAssignments();
  vi.restoreAllMocks();
});

describe('ROOT commercial site', () => {
  it('associates form hints and errors with the control', () => {
    const { rerender } = render(
      <FormField label="Email" htmlFor="email" hint="Use a work email">
        <Input id="email" />
      </FormField>,
    );
    const input = screen.getByLabelText('Email');
    expect(input.getAttribute('aria-describedby')).toBeTruthy();
    expect(input.getAttribute('aria-invalid')).toBeNull();

    rerender(
      <FormField label="Email" htmlFor="email" error="Enter a valid email">
        <Input id="email" aria-describedby="existing-help" />
      </FormField>,
    );
    expect(input.getAttribute('aria-describedby')).toMatch(/^existing-help \S+$/);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('renders V4 homepage positioning and primary navigation', () => {
    const { container } = renderRoute('/');

    expect(screen.getByRole('heading', { name: /the intelligence behind healthcare revenue/i })).toBeTruthy();
    expect(screen.getByText(/where revenue cycle management meets data intelligence/i)).toBeTruthy();
    const primaryDiagnosticLinks = screen.getAllByRole('link', { name: /Start the \$2,500 Diagnostic/i });
    expect(primaryDiagnosticLinks[0].getAttribute('data-cta')).toBe('book-diagnostic');
    expect(primaryDiagnosticLinks[0].getAttribute('data-location')).toBe('home-hero');
    expect(screen.getAllByRole('link', { name: /WhatsApp/i })[0].getAttribute('href')).toContain('https://wa.me/13025064685');
    expect(container.querySelector('img[src="/brand/logos/root/root-mark-76.webp"]')).toBeTruthy();
    expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeTruthy();
    expect(screen.getAllByText(/^Platform$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^Solutions$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^Services$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^Pricing$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^Resources$/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /from a revenue signal to a decision/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /one revenue story across every system/i })).toBeTruthy();
    expect(screen.getAllByText(/fictional practice|synthetic/i).length).toBeGreaterThan(0);
    expect(container.querySelector('img[src="/media/images/practice-team-collaboration.jpg"]')).toBeTruthy();
    expect(container.querySelector('.heroWorkstation')).toBeFalsy();
    expect(container.querySelector('.v4-root')).toBeTruthy();
    expect(container.querySelector('[data-dirt-command]')).toBeTruthy();
    expect(screen.getAllByRole('link', { name: /Talk to ROOT/i })[0].getAttribute('href')).toBe('/contact/');
    expect(screen.getByRole('heading', { name: /revenue is lost between disconnected workflows/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /find the cause. own the next action/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /\$2,500 fixed. A clear plan/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /DIRT · Data Intelligence for Revenue Transformation/i })).toBeTruthy();
    expect(screen.getAllByRole('link', { name: /Explore revenue intelligence/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/RCM \+ Operations \+ Technology/i).length).toBeGreaterThan(0);
  });

  it('renders platform architecture with clinical practice at the center', () => {
    renderRoute('/platform/');

    expect(screen.getByRole('heading', { name: /the operating infrastructure behind healthcare revenue/i })).toBeTruthy();
    expect(screen.getAllByText(/Clinical practice/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/DIRT intelligence/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Management action/i).length).toBeGreaterThan(0);
  });

  it('renders solution, service, technology, pricing, and resource routes', async () => {
    renderRoute('/solutions/denials/');
    expect(screen.getByRole('heading', { name: /^Denials$/i })).toBeTruthy();
    expect(screen.getAllByText(/preventable patterns/i).length).toBeGreaterThan(0);

    cleanup();
    renderRoute('/services/credentialing/');
    expect(screen.getByRole('heading', { name: /^Credentialing$/i })).toBeTruthy();
    expect(screen.getByText(/\$750-\$1,500 per provider/i)).toBeTruthy();

    cleanup();
    renderRoute('/technology/dirt/');
    expect(screen.getByRole('heading', { name: /your data already contains the signals. DIRT connects them/i })).toBeTruthy();
    expect(screen.getAllByText(/aging landscape/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('heading', { name: /From signal to an owned next action/i }).length).toBeGreaterThan(0);
    expect(document.querySelector('[data-dirt-command]')).toBeTruthy();

    cleanup();
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
    }));
    renderRoute('/case-studies/dirt-poc-01/');
    expect(screen.getByRole('heading', { name: /dirt revenue intelligence/i })).toBeTruthy();
    expect(screen.getByText(/publication review required/i)).toBeTruthy();
    expect(screen.getAllByText(/anonymized proof of concept/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/not a client success story/i)).toBeTruthy();
    expect(await screen.findByText('Slide 1 of 6')).toBeTruthy();
    fireEvent.click(await screen.findByRole('button', { name: /next slide/i }));
    expect(await screen.findByText('Slide 2 of 6')).toBeTruthy();

    cleanup();
    renderRoute('/pricing/');
    expect(screen.getAllByText(/Full MSO Partnership/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$2,500 fixed fee/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Onboarding from \$1,500/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/approximately 5% of collections where appropriate/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$1,500-\$2,500\/month/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Scope and outcomes/i).length).toBeGreaterThan(0);

    cleanup();
    renderRoute('/resources/denial-management-root-cause/');
    expect(screen.getByRole('heading', { name: /denial management root-cause guide/i })).toBeTruthy();
    expect(screen.getByText(/X12 Claim Adjustment Reason Codes/i)).toBeTruthy();
  });

  it('supports engagement rows, approved DIRT pricing, and CTA events without form content', () => {
    renderRoute('/platform/');
    expect(screen.getAllByRole('heading', { name: /^Diagnostic$/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /Managed RCM/i })).toBeTruthy();
    expect(screen.getAllByRole('heading', { name: /DIRT Intelligence/i }).length).toBeGreaterThan(0);
    expect(screen.getByText(/\$1,500-\$2,500\/month when scoped/i)).toBeTruthy();

    cleanup();
    renderRoute('/');
    const ctaEvents = [];
    window.addEventListener('root:cta', (event) => ctaEvents.push(event.detail), { once: true });
    const diagnosticLink = screen.getAllByRole('link', { name: /Start the \$2,500 Diagnostic/i })[0];
    diagnosticLink.addEventListener('click', (event) => event.preventDefault(), { once: true });
    fireEvent.click(diagnosticLink);

    expect(ctaEvents[0]).toMatchObject({
      cta: 'book-diagnostic',
      location: 'home-hero',
      destination: '/diagnostic/',
      page: '/',
      experiment: 'home-hero-revenue-intelligence-v2',
      experiment_variant: 'a',
    });
    expect(JSON.stringify(ctaEvents[0])).not.toMatch(/alex|patient|diagnosis/i);
  });

  it('renders the diagnostic route and enforces the no-PHI acknowledgement', () => {
    renderRoute('/diagnostic/');

    expect(screen.getByRole('heading', { name: /see where your revenue system is leaking/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Illustrative Revenue Optimization Diagnostic/i })).toBeTruthy();
    expect(screen.getAllByText(/Willowbend Physician Group/i).length).toBeGreaterThan(0);

    fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: 'Alex Rivera' } });
    fireEvent.change(screen.getByLabelText(/work email/i), { target: { value: 'alex@northstar.example' } });
    fireEvent.change(screen.getByLabelText(/practice \/ organization/i), { target: { value: 'Northstar Clinic' } });
    fireEvent.change(screen.getByLabelText(/number of providers/i), { target: { value: '6-10' } });
    fireEvent.change(screen.getByLabelText(/biggest current challenge/i), { target: { value: 'Denials and rejections' } });

    const submit = screen.getByRole('button', { name: /request diagnostic/i });
    expect(submit.disabled).toBe(true);
    expect(submit.getAttribute('data-cta')).toBe('request-diagnostic');
    expect(submit.getAttribute('data-destination')).toBe('info@rootrcm.com');

    fireEvent.click(screen.getByLabelText(/will not submit Protected Health Information/i));
    expect(submit.disabled).toBe(false);
  });

  it('renders launch contact details and only live outreach channels', () => {
    renderRoute('/contact/');

    expect(screen.getAllByText(/ROOT Revenue Operations & Outcomes Technology Incorporated/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/2803 Philadelphia Pike/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\+1 \(302\) 506 4685/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/info@rootrcm.com/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /WhatsApp/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /^Call/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /^Email/i }).length).toBeGreaterThan(0);
    // LinkedIn is social-only (footer Follow ROOT), not a live outreach channel on Contact.
    expect(screen.getByText(/Chatbot and virtual front desk are planned/i)).toBeTruthy();
  });

  it('provides Talk to us and Follow ROOT floating controls', () => {
    renderRoute('/');

    const talkButton = screen.getByRole('button', { name: /Talk to us/i });
    const followButton = screen.getAllByRole('button', { name: /Follow ROOT/i }).find((button) => button.getAttribute('aria-controls') === 'follow-panel');
    expect(talkButton).toBeTruthy();
    expect(followButton).toBeTruthy();
    expect(screen.queryByText(/Chat assistant coming soon/i)).toBeNull();

    fireEvent.click(talkButton);
    expect(screen.getByRole('dialog', { name: /Talk to ROOT/i })).toBeTruthy();
    expect(screen.getByText(/Discuss your practice's operations. Do not include PHI./i)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Contact ROOT/i }).getAttribute('href')).toBe('/contact/');

    fireEvent.click(followButton);
    expect(screen.queryByRole('dialog', { name: /Talk to ROOT/i })).toBeNull();
    expect(screen.getByRole('dialog', { name: /Follow ROOT/i })).toBeTruthy();
    expect(screen.getAllByRole('link', { name: /ROOT on LinkedIn/i })[0].getAttribute('href')).toBe('https://www.linkedin.com/company/rootrcm/posts/?viewAsMember=true');
    expect(screen.getAllByRole('link', { name: /ROOT on Facebook/i })[0].getAttribute('href')).toBe('https://www.facebook.com/root.rcm/');
    expect(screen.getAllByRole('link', { name: /ROOT on Instagram/i })[0].getAttribute('href')).toBe('https://www.instagram.com/root.rcm/');
    expect(screen.getAllByRole('link', { name: /ROOT on Pinterest/i })[0].getAttribute('href')).toBe('https://pinterest.com/root.rcm/');
    expect(screen.getAllByRole('link', { name: /ROOT on X/i })[0].getAttribute('href')).toBe('https://x.com/root.rcm/');
    expect(screen.getAllByRole('link', { name: /ROOT on Reddit/i })[0].getAttribute('href')).toBe('https://reddit.com/root.rcm/');
  });

  it('keeps Talk to us mounted on Diagnostic and Contact routes', () => {
    cleanup();
    renderRoute('/diagnostic/');
    expect(screen.getAllByRole('button', { name: /Talk to us/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Follow ROOT/i }).length).toBeGreaterThan(0);

    cleanup();
    renderRoute('/contact/');
    expect(screen.getAllByRole('button', { name: /Talk to us/i }).length).toBeGreaterThan(0);
  });

  it('builds a deidentified fallback inquiry with attribution', () => {
    const inquiry = {
      name: 'Alex Rivera',
      email: 'alex@northstar.example',
      organization: 'Northstar Clinic',
      providers: '6-10',
      challenge: 'High / aging A/R',
      inquiryType: 'diagnostic',
      utm_source: 'linkedin',
      utm_campaign: 'founder-outbound',
    };

    const summary = buildInquirySummary(inquiry);
    const href = decodeURIComponent(buildInquiryMailto(inquiry));

    expect(summary).toContain('ROOT Revenue Optimization Diagnostic inquiry');
    expect(summary).toContain('Providers: 6-10');
    expect(summary).toContain('Source: linkedin');
    expect(summary).toContain('Do not send PHI');
    expect(href).toContain('mailto:info@rootrcm.com');
  });

  it('uses the ROOT inbox relay by default and preserves endpoint override support', () => {
    expect(ROOT_FORM_RELAY).toBe('https://formsubmit.co/ajax/info@rootrcm.com');
    expect(getInquiryEndpoint()).toBe(ROOT_FORM_RELAY);
    expect(getInquiryEndpoint('https://forms.example.test/root')).toBe('https://forms.example.test/root');

    const delivery = buildDeliveryPayload({
      name: 'Alex Rivera',
      email: 'alex@northstar.example',
      organization: 'Northstar Clinic',
      inquiryType: 'diagnostic',
      noPhi: true,
      experiment: 'diagnostic-hero-value-framing-v1',
      experiment_variant: 'a',
    }, 'https://rootrcm.com/diagnostic/');

    expect(delivery._subject).toContain('Revenue Optimization Diagnostic');
    expect(delivery._replyto).toBe('alex@northstar.example');
    expect(delivery._url).toBe('https://rootrcm.com/diagnostic/');
    expect(delivery.experiment_variant).toBe('a');
  });

  it('supports deterministic experiment overrides for QA', () => {
    window.history.pushState({}, '', '/?exp_homeHero=b');
    expect(getExperimentAssignment('homeHero')).toBe('b');
    render(<App />);
    expect(screen.getByRole('heading', { name: /find where your practice is losing revenue/i })).toBeTruthy();
    expect(document.querySelector('.homeHero')?.dataset.variant).toBe('b');
  });

  it('renders the 404 fallback route', () => {
    renderRoute('/does-not-exist/');

    expect(screen.getByText('404')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Revenue Diagnostic/i }).getAttribute('data-cta')).toBe('book-diagnostic');
  });

  it('keeps content schema and six approved social profiles', () => {
    expect(validateContentSchemas().ok).toBe(true);
    expect(buildSocialPack()).toHaveLength(6);
  });
});
