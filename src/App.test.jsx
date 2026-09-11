import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App.jsx';
import { getExperimentAssignment, resetExperimentAssignments } from './experiments.js';
import { buildDeliveryPayload, getInquiryEndpoint, ROOT_FORM_RELAY } from './modules/glass-core/formDelivery.js';
import { buildInquiryMailto, buildInquirySummary } from './modules/glass-core/inquiryTemplate.js';

function renderRoute(path = '/') {
  window.history.pushState({}, '', path);
  return render(<App />);
}

afterEach(() => {
  cleanup();
  window.history.pushState({}, '', '/');
  sessionStorage.clear();
  localStorage.clear();
  resetExperimentAssignments();
  vi.restoreAllMocks();
});

describe('ROOT commercial site', () => {
  it('renders full MSO homepage positioning and primary navigation', () => {
    const { container } = renderRoute('/');

    expect(screen.getByRole('heading', { name: /run the business side of medicine better/i })).toBeTruthy();
    expect(screen.getByText(/one operating partner for the business side of medicine/i)).toBeTruthy();
    const primaryDiagnosticLinks = screen.getAllByRole('link', { name: /Start the \$2,500 Revenue Optimization Diagnostic/i });
    expect(primaryDiagnosticLinks[0].getAttribute('data-cta')).toBe('book-diagnostic');
    expect(primaryDiagnosticLinks[0].getAttribute('data-location')).toBe('home-hero');
    expect(screen.getAllByRole('link', { name: /WhatsApp/i })[0].getAttribute('href')).toContain('https://wa.me/13025064685');
    expect(container.querySelector('img[src="/brand/logos/root/root-fallback-mark.svg"]')).toBeTruthy();
    expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeTruthy();
    expect(screen.getAllByText(/^Platform$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^Solutions$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^Services$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^Pricing$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^Resources$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Built toward future certification discipline/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /proof of work, rebuilt as public-safe demonstrations/i })).toBeTruthy();
    expect(screen.getAllByText(/fictional practice/i).length).toBeGreaterThan(0);
  });

  it('renders platform architecture with clinical practice at the center', () => {
    renderRoute('/platform/');

    expect(screen.getByRole('heading', { name: /one operating layer/i })).toBeTruthy();
    expect(screen.getAllByText(/Clinical Practice/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/DIRT Intelligence/i).length).toBeGreaterThan(0);
  });

  it('renders solution, service, technology, pricing, and resource routes', () => {
    renderRoute('/solutions/denials/');
    expect(screen.getByRole('heading', { name: /^Denials$/i })).toBeTruthy();
    expect(screen.getAllByText(/preventable patterns/i).length).toBeGreaterThan(0);

    cleanup();
    renderRoute('/services/credentialing/');
    expect(screen.getByRole('heading', { name: /^Credentialing$/i })).toBeTruthy();
    expect(screen.getByText(/\$750-\$1,500 per provider/i)).toBeTruthy();

    cleanup();
    renderRoute('/technology/dirt/');
    expect(screen.getByRole('heading', { name: /intelligence layer inside ROOT/i })).toBeTruthy();
    expect(screen.getAllByText(/aging landscape/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /raw signals become prioritized management intelligence/i })).toBeTruthy();

    cleanup();
    renderRoute('/pricing/');
    expect(screen.getAllByText(/Full MSO Partnership/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/\$2,500 fixed fee/i)).toBeTruthy();
    expect(screen.getByText(/Onboarding from \$1,500; approximately 5% of collections where appropriate/i)).toBeTruthy();
    expect(screen.getByText(/\$1,500-\$2,500\/month/i)).toBeTruthy();
    expect(screen.getByText(/No public guarantee claims/i)).toBeTruthy();

    cleanup();
    renderRoute('/resources/denial-management-root-cause/');
    expect(screen.getByRole('heading', { name: /denial management root-cause guide/i })).toBeTruthy();
    expect(screen.getByText(/X12 Claim Adjustment Reason Codes/i)).toBeTruthy();
  });

  it('supports accessible carousel controls, approved DIRT pricing, and CTA events without form content', () => {
    renderRoute('/');
    expect(screen.getByRole('heading', { name: /^Diagnostic$/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /next engagement model/i }));
    expect(screen.getByRole('heading', { name: /Managed RCM/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /next engagement model/i }));
    expect(screen.getByRole('heading', { name: /DIRT Intelligence/i })).toBeTruthy();
    expect(screen.getByText(/\$1,500-\$2,500\/month when scoped/i)).toBeTruthy();

    const ctaEvents = [];
    window.addEventListener('root:cta', (event) => ctaEvents.push(event.detail), { once: true });
    const diagnosticLink = screen.getAllByRole('link', { name: /Start the \$2,500 Revenue Optimization Diagnostic/i })[0];
    diagnosticLink.addEventListener('click', (event) => event.preventDefault(), { once: true });
    fireEvent.click(diagnosticLink);

    expect(ctaEvents[0]).toMatchObject({
      cta: 'book-diagnostic',
      location: 'home-hero',
      destination: '/diagnostic/',
      page: '/',
      experiment: 'home-hero-revenue-framing-v1',
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

    expect(screen.getAllByText(/ROOT RCM LLC/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/2803 Philadelphia Pike/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\+1 \(302\) 506 4685/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/info@rootrcm.com/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /WhatsApp/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /^Call/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /^Email/i }).length).toBeGreaterThan(0);
    expect(screen.queryByText(/^LinkedIn$/i)).toBeNull();
    expect(screen.getByRole('heading', { name: /Chatbot and virtual front desk/i })).toBeTruthy();
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
});
