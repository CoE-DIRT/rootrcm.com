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

it('maps 409 to non-enumerating copy with retryable error banner and toast', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 409 }));
  const { container } = render(<InquiryForm variant="diagnostic" />);
  for (const [label, value] of [
    ['Name','Synthetic QA'], ['Work email','qa@example.test'], ['Practice / organization','Synthetic Organization'],
    ['Number of providers','1-5'], ['Biggest current challenge','High / aging A/R'],
  ]) fireEvent.change(screen.getByLabelText(label, { exact: true }), { target: { value } });
  fireEvent.click(screen.getByLabelText(/will not submit Protected Health Information/));
  fireEvent.click(screen.getByRole('button', { name: /Request Diagnostic/ }));
  await waitFor(() => expect(screen.getByText('We could not process this request. Please try again shortly.')).toBeTruthy());
  expect(container.querySelector('form').getAttribute('data-state')).toBe('error');
  expect(screen.getByRole('button', { name: /Request Diagnostic/ }).disabled).toBe(false);
  expect(screen.getByText('Something went wrong — please try again')).toBeTruthy();
});

it('shows data use and leaves acknowledgement unchecked', () => {
  render(<InquiryForm />);
  expect(screen.getByText('We use the information you provide to prepare your diagnostic and respond to your inquiry. We do not sell or share it.')).toBeTruthy();
  expect(screen.getByLabelText(/will not submit Protected Health Information/).checked).toBe(false);
});
