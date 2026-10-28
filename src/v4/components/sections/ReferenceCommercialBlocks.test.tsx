import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { CommercialServiceShowcase, DirtOperatingBridge, RevenueSignalsRail } from './ReferenceCommercialBlocks';

afterEach(cleanup);

const services = [
  { slug: 'medical-billing', title: 'Medical Billing', summary: 'Claim preparation and payer follow-up.' },
  { slug: 'denial-management', title: 'Denial Management', summary: 'Denial review and appeals.' },
  { slug: 'ar-recovery', title: 'A/R Recovery', summary: 'Financially prioritized follow-up.' },
  { slug: 'credentialing', title: 'Credentialing', summary: 'Payer enrollment and maintenance.' },
  { slug: 'reporting-analytics', title: 'Reporting & Analytics', summary: 'Revenue visibility and measures.' },
  { slug: 'workflow-automation', title: 'Workflow Automation', summary: 'Operational process automation.' },
  { slug: 'rcm', title: 'Revenue Cycle Management', summary: 'End-to-end managed RCM.' },
];

describe('reference-led ROOT commercial blocks', () => {
  it('uses operational measures without inventing client performance statistics', () => {
    render(<RevenueSignalsRail />);
    expect(screen.getByRole('heading', { name: 'Collections visibility' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Denial intelligence' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'A/R recovery' })).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/98\.5%|500\+|30% average revenue/);
  });

  it('resolves featured service URLs using ROOT existing service slugs', () => {
    render(<CommercialServiceShowcase services={services} />);
    for (const service of services) {
      expect(screen.getByRole('link', { name: new RegExp(service.title, 'i') }).getAttribute('href')).toBe(`/services/${service.slug}/`);
    }
    expect(screen.getByRole('link', { name: /all services/i }).getAttribute('href')).toBe('/services/');
    expect(document.querySelectorAll('a[href="/services/medical-billing/"]')).toHaveLength(1);
  });

  it('identifies DIRT as ROOT\'s embedded capability and has working destinations', () => {
    render(<DirtOperatingBridge />);
    expect(screen.getByRole('heading', { name: /your revenue cycle, connected by dirt/i })).toBeTruthy();
    expect(document.body.textContent).toMatch(/embedded analytical capability/);
    expect(screen.getByRole('link', { name: /explore dirt/i }).getAttribute('href')).toBe('/technology/dirt/');
    expect(screen.getByRole('link', { name: /discuss your workflows/i }).getAttribute('href')).toBe('/contact/');
  });
});
