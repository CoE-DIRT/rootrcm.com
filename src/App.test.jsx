import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App.jsx';
import { buildInquiryMailto, buildInquirySummary } from './modules/glass-core/inquiryTemplate.js';

afterEach(() => {
  cleanup();
  window.history.pushState({}, '', '/');
  sessionStorage.clear();
});

describe('ROOT commercial site', () => {
  it('renders the homepage revenue journey', () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    expect(screen.getByRole('heading', { name: /stop revenue leakage/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /book a revenue diagnostic/i })).toBeTruthy();
    expect(screen.getByText(/independent physician practices/i)).toBeTruthy();
  });

  it('renders the diagnostic route and enforces the no-PHI acknowledgement', () => {
    window.history.pushState({}, '', '/diagnostic/');
    render(<App />);

    expect(screen.getByRole('heading', { name: /see where your revenue is leaking/i })).toBeTruthy();

    fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: 'Alex Rivera' } });
    fireEvent.change(screen.getByLabelText(/work email/i), { target: { value: 'alex@northstar.example' } });
    fireEvent.change(screen.getByLabelText(/practice \/ organization/i), { target: { value: 'Northstar Clinic' } });
    fireEvent.change(screen.getByLabelText(/number of providers/i), { target: { value: '6-10' } });
    fireEvent.change(screen.getByLabelText(/biggest current challenge/i), { target: { value: 'Denials and rejections' } });

    const submit = screen.getByRole('button', { name: /request diagnostic/i });
    expect(submit.disabled).toBe(true);

    fireEvent.click(screen.getByLabelText(/will not submit protected health information/i));
    expect(submit.disabled).toBe(false);
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
    expect(href).toContain('mailto:hello@rootrcm.com');
  });
});
