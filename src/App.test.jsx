import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App.jsx';
import { buildInquiryMailto } from './modules/glass-core/inquiryTemplate.js';

afterEach(() => cleanup());

describe('ROOT site', () => {
  it('renders the revenue journey', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /find the friction/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /book a revenue diagnostic/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /ROOT carries the business load/i })).toBeTruthy();
    expect(screen.getByText(/PHI-capable Management Services Organization platform/i)).toBeTruthy();
  });

  it('requires the no-PHI and secure-channel acknowledgement before preparing an inquiry', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Alex Rivera' } });
    fireEvent.change(screen.getByLabelText(/work email/i), { target: { value: 'alex@example.com' } });
    fireEvent.change(screen.getByLabelText(/practice/i), { target: { value: 'Northstar Clinic' } });
    fireEvent.change(screen.getByLabelText(/what needs attention/i), {
      target: { value: 'Denials and aging A/R are rising.' },
    });

    expect(screen.getByRole('button', { name: /prepare inquiry/i }).disabled).toBe(true);

    fireEvent.click(screen.getByLabelText(/approved secure channel and BAA/i));
    fireEvent.click(screen.getByRole('button', { name: /prepare inquiry/i }));

    const emailLink = screen.getByRole('link', { name: /open email/i });
    expect(emailLink.getAttribute('href')).toContain('mailto:hello@rootrcm.com');
    expect(screen.getByText(/nothing was stored/i)).toBeTruthy();
  });

  it('builds a deidentified inquiry mailto', () => {
    const href = buildInquiryMailto({
      name: 'Alex Rivera',
      email: 'alex@example.com',
      organization: 'Northstar Clinic',
      focus: 'Denials and aging A/R are rising.',
    });

    expect(decodeURIComponent(href)).toContain('ROOT MSO platform inquiry - Northstar Clinic');
    expect(decodeURIComponent(href)).toContain('ROOT PHI-capable MSO platform inquiry');
    expect(decodeURIComponent(href)).toContain('A BAA, access control, and approved secure channel');
  });
});