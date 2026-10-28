import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import InquiryForm from './InquiryForm.jsx';
import { isDeliveryAcknowledged } from '../modules/glass-core/formDelivery.js';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it('recovers from asynchronous application rejection and preserves entered fields', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: 'false' }) }));
  const { container } = render(<InquiryForm />);
  for (const [label, value] of [['Name', 'Synthetic QA'], ['Work email', 'qa@example.test'], ['Practice / organization', 'Synthetic Organization'], ['How can we help?', 'Synthetic inquiry']]) {
    fireEvent.change(screen.getByLabelText(label, { exact: true }), { target: { value } });
  }
  fireEvent.click(screen.getByLabelText(/will not submit Protected Health Information/));
  const failure = vi.fn();
  container.querySelector('form').addEventListener('root:form-failure', failure);
  fireEvent.click(screen.getByRole('button', { name: /Start the Conversation/ }));
  await waitFor(() => expect(screen.getByText(/Our system is temporarily unavailable/)).toBeTruthy());
  expect(failure).toHaveBeenCalledTimes(1);
  expect(container.querySelector('form').getAttribute('data-state')).toBe('error');
  expect(screen.getByLabelText('Name', { exact: true }).value).toBe('Synthetic QA');
  expect(screen.getByRole('button', { name: /Start the Conversation/ }).disabled).toBe(false);
  expect(screen.getByText('Something went wrong — please try again')).toBeTruthy();
});

it('only accepts the explicit owned delivery contract in owned mode', () => {
  expect(isDeliveryAcknowledged({ success: 'true' })).toBe(true);
  expect(isDeliveryAcknowledged({ success: 'true' }, true)).toBe(false);
  expect(isDeliveryAcknowledged({ ok: true, delivered: true }, true)).toBe(true);
  expect(isDeliveryAcknowledged({ ok: true, delivered: false }, true)).toBe(false);
  expect(isDeliveryAcknowledged({})).toBe(false);
});

it('validates on blur, displays an associated error, and never sends while invalid', async () => {
  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  const { container } = render(<InquiryForm variant="diagnostic" />);
  const email = screen.getByLabelText('Work email', { exact: true });
  fireEvent.blur(email);
  expect(container.querySelector('form').getAttribute('data-state')).toBe('validating');
  expect(email.getAttribute('aria-invalid')).toBe('true');
  const message = container.querySelector('[id$="-email-error"]');
  expect(message.textContent).toMatch(/valid work email/i);
  expect(email.getAttribute('aria-describedby')).toBe(message.id);
  fireEvent.click(screen.getByRole('button', { name: /Request Diagnostic/ }));
  expect(fetchMock).not.toHaveBeenCalled();
  expect(container.querySelector('form').getAttribute('data-state')).toBe('validating');
  fireEvent.change(email, { target: { value: 'qa@example.test' } });
  expect(email.getAttribute('aria-invalid')).toBe('false');
});

it('submitting locks fields, shows inline spinner, and only succeeds on acknowledged delivery', async () => {
  let complete;
  const fetchMock = vi.fn(() => new Promise(resolve => { complete = resolve; }));
  vi.stubGlobal('fetch', fetchMock);
  const { container } = render(<InquiryForm variant="diagnostic" />);
  for (const [label, value] of [
    ['Name','Synthetic QA'], ['Work email','qa@example.test'], ['Practice / organization','Synthetic Organization'],
    ['Number of providers','6-10'], ['Biggest current challenge','Denials and rejections'],
  ]) fireEvent.change(screen.getByLabelText(label, { exact: true }), { target: { value } });
  fireEvent.click(screen.getByLabelText(/will not submit Protected Health Information/));
  const success = vi.fn();
  container.querySelector('form').addEventListener('root:form-success', success);
  fireEvent.click(screen.getByRole('button', { name: /Request Diagnostic/ }));
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  const form = container.querySelector('form');
  expect(form.getAttribute('data-state')).toBe('submitting');
  expect(form.getAttribute('aria-busy')).toBe('true');
  expect(screen.getByLabelText('Name', { exact: true }).readOnly).toBe(true);
  expect(screen.getByRole('button', { name: /Sending/ }).disabled).toBe(true);
  expect(form.querySelector('.inquirySpinner')).toBeTruthy();
  complete({ ok: true, json: async () => ({ success: 'true' }) });
  await waitFor(() => expect(screen.getByText(/We've received your Diagnostic inquiry/)).toBeTruthy());
  expect(success).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('link', { name: /Book another diagnostic/ }).getAttribute('href')).toBe('/diagnostic/#diagnostic-form');
  expect(screen.getByText('Your inquiry was received.')).toBeTruthy();
  expect(container.querySelector('form')).toBeNull();
});

it('maps 409 to duplicate-booking copy with retryable error banner and toast', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 409 }));
  const { container } = render(<InquiryForm variant="diagnostic" />);
  for (const [label, value] of [
    ['Name','Synthetic QA'], ['Work email','qa@example.test'], ['Practice / organization','Synthetic Organization'],
    ['Number of providers','1-5'], ['Biggest current challenge','High / aging A/R'],
  ]) fireEvent.change(screen.getByLabelText(label, { exact: true }), { target: { value } });
  fireEvent.click(screen.getByLabelText(/will not submit Protected Health Information/));
  fireEvent.click(screen.getByRole('button', { name: /Request Diagnostic/ }));
  await waitFor(() => expect(screen.getByText('A booking already exists for this email.')).toBeTruthy());
  expect(container.querySelector('form').getAttribute('data-state')).toBe('error');
  expect(screen.getByRole('button', { name: /Request Diagnostic/ }).disabled).toBe(false);
  expect(screen.getByText('Something went wrong — please try again')).toBeTruthy();
});

it('sends only registered campaign labels on an acknowledged contact inquiry', async () => {
  window.sessionStorage.clear();
  window.history.replaceState({}, '', '/contact/?utm_source=Google&utm_medium=CPC&utm_campaign=person%40example.com&utm_content=sensitive');
  try {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: 'true' }) });
    vi.stubGlobal('fetch', fetchMock);
    render(<InquiryForm />);
    for (const [label, value] of [
      ['Name', 'Synthetic QA'], ['Work email', 'qa@example.test'],
      ['Practice / organization', 'Synthetic Organization'], ['How can we help?', 'Discuss revenue workflow'],
    ]) fireEvent.change(screen.getByLabelText(label, { exact: true }), { target: { value } });
    fireEvent.click(screen.getByLabelText(/will not submit Protected Health Information/));
    fireEvent.click(screen.getByRole('button', { name: /Start the Conversation/ }));
    await waitFor(() => expect(screen.getByText(/We've received your inquiry/)).toBeTruthy());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, options] = fetchMock.mock.calls[0];
    const lead = JSON.parse(options.body);
    expect(lead.utm_source).toBe('google');
    expect(lead.utm_medium).toBe('cpc');
    expect(lead.utm_campaign).toBeUndefined();
    expect(lead.utm_content).toBeUndefined();
    expect(lead._url).toBe(window.location.origin + '/contact/');
    expect(window.sessionStorage.getItem('root-attribution')).not.toContain('person%40example.com');
  } finally {
    window.history.replaceState({}, '', '/');
    window.sessionStorage.clear();
  }
});

it('renders the contact form when reading window.sessionStorage throws SecurityError', () => {
  const descriptor = Object.getOwnPropertyDescriptor(window, 'sessionStorage');
  Object.defineProperty(window, 'sessionStorage', {
    configurable: true,
    get() { throw new DOMException('Storage blocked', 'SecurityError'); },
  });
  try {
    render(<InquiryForm />);
    expect(screen.getByLabelText('Name', { exact: true })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Start the Conversation/ })).toBeTruthy();
  } finally {
    if (descriptor) Object.defineProperty(window, 'sessionStorage', descriptor);
  }
});
