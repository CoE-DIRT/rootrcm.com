import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BuyerConfidence, ThreeStepTransition, CredentialingReadiness } from './BuyerConfidence';

describe('ROOT buyer confidence and enrollment narrative', () => {
  it('addresses the black box, transition and upstream denial objections without invented guarantees', () => {
    const { container } = render(<BuyerConfidence />);
    expect(screen.getByRole('heading', { name: /keep visibility.*keep control/i })).toBeTruthy();
    expect(screen.getByText(/Outsourcing turns billing into a black box/)).toBeTruthy();
    expect(screen.getByText(/Changing vendors will disrupt collections/)).toBeTruthy();
    expect(screen.getByText(/blame our front desk/)).toBeTruthy();
    const disclosure = container.querySelector('details');
    expect(disclosure).toBeTruthy();
    expect(within(disclosure!).getByText(/Interoperability/)).toBeTruthy();
    expect(disclosure?.hasAttribute('open')).toBe(false);
  });

  it('explains a three-step system-preserving path linked to the existing diagnostic', () => {
    const { container } = render(<ThreeStepTransition />);
    expect(container.querySelectorAll('.buyer-transition-step')).toHaveLength(3);
    expect(screen.getByText(/Measure collections, not activity/)).toBeTruthy();
    expect(screen.getByText(/Make aging A\/R traceable/)).toBeTruthy();
    expect(screen.getByText(/Prevent repeat denials upstream/)).toBeTruthy();
    expect(screen.getByRole('link', { name: /\$2,500 Diagnostic/i }).getAttribute('href')).toBe('/diagnostic/');
  });

  it('describes scoped credentialing verification and preserves legitimate payer authority', () => {
    render(<CredentialingReadiness />);
    expect(screen.getByText(/Credentialing delays can stop a practice from collecting/)).toBeTruthy();
    expect(screen.getByText(/Connected intake/)).toBeTruthy();
    expect(screen.getByText(/Pre-submission verification/)).toBeTruthy();
    expect(screen.getByText(/Payers determine acceptance and approval dates/)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Explore credentialing/i }).getAttribute('href')).toBe('/services/credentialing/');
    expect(screen.getByRole('link', { name: /CMS enrollment guidance/i }).getAttribute('rel')).toContain('noopener');
  });
});
