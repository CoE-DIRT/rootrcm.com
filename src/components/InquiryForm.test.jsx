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
  await waitFor(() => expect(screen.getByText(/We could not confirm delivery/)).toBeTruthy());
  expect(failure).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button', { name: 'Edit inquiry' }));
  expect(screen.getByLabelText('Name', { exact: true }).value).toBe('Synthetic QA');
});

it('only accepts the explicit owned delivery contract in owned mode', () => {
  expect(isDeliveryAcknowledged({ success: 'true' })).toBe(true);
  expect(isDeliveryAcknowledged({ success: 'true' }, true)).toBe(false);
  expect(isDeliveryAcknowledged({ ok: true, delivered: true }, true)).toBe(true);
  expect(isDeliveryAcknowledged({ ok: true, delivered: false }, true)).toBe(false);
  expect(isDeliveryAcknowledged({})).toBe(false);
});
