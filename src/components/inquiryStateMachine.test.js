import { describe, expect, it } from 'vitest';
import {
  PHASES, createInquiryState, fieldError, inquiryReducer, mapLeadError, validateFields,
} from './inquiryStateMachine.js';

const synthetic = {
  name: 'Synthetic QA', email: 'qa@example.test', organization: 'Example Practice',
  providers: '6-10', system: '', challenge: 'Denials and rejections',
  focus: 'Practice workflow question', noPhi: true, _honey: '',
};
const run = (state, action) => inquiryReducer(state, action);

describe('Phase 3.2 finite inquiry state machine', () => {
  it('declares exactly the five approved states', () => {
    expect(PHASES).toEqual(['idle', 'validating', 'submitting', 'success', 'error']);
    expect(createInquiryState().phase).toBe('idle');
  });
  it('marks a field on blur and clears the error when corrected without a network transition', () => {
    let state = createInquiryState();
    state = run(state, { type: 'BLUR', field: 'email', variant: 'diagnostic' });
    expect(state).toMatchObject({ phase: 'validating', touched: { email: true } });
    expect(state.errors.email).toMatch(/valid work email/i);
    state = run(state, { type: 'EDIT', field: 'email', value: 'qa@example.test', variant: 'diagnostic' });
    expect(state.errors.email).toBeUndefined();
    expect(state.fields.email).toBe('qa@example.test');
  });
  it('validates the complete form before submitting', () => {
    const errors = validateFields(createInquiryState().fields, 'diagnostic');
    expect(errors).toHaveProperty('name');
    expect(errors).toHaveProperty('email');
    expect(errors).toHaveProperty('organization');
    expect(errors).toHaveProperty('providers');
    expect(errors).toHaveProperty('challenge');
    expect(errors).toHaveProperty('noPhi');
    expect(validateFields(synthetic, 'diagnostic')).toEqual({});
    expect(validateFields(synthetic, 'contact')).toEqual({});
  });
  it('locks submission until confirmed and prevents stale late events', () => {
    let state = { ...createInquiryState(), fields: synthetic };
    state = run(state, { type: 'SUBMIT' });
    expect(state.phase).toBe('submitting');
    expect(run(state, { type: 'EDIT', field: 'email', value: 'other@example.test', variant: 'diagnostic' })).toEqual(state);
    expect(run(state, { type: 'SUBMIT' })).toEqual(state);
    state = run(state, { type: 'SUCCESS' });
    expect(state).toMatchObject({ phase: 'success', toast: { kind: 'success' } });
    expect(run(state, { type: 'FAILURE', message: 'late failure' })).toEqual(state);
    expect(run(state, { type: 'RESET' }).phase).toBe('idle');
  });
  it('keeps error banner, email fallback and toast intact when unchanged inputs blur', () => {
    let state = { ...createInquiryState(), fields: synthetic };
    state = run(state, { type: 'SUBMIT' });
    state = run(state, { type: 'FAILURE', message: 'Safe retry message' });
    state = run(state, { type: 'BLUR', field: 'email', variant: 'diagnostic' });
    expect(state.phase).toBe('error');
    expect(state.message).toBe('Safe retry message');
    expect(state.toast).toEqual({ kind: 'error', message: 'Something went wrong — please try again' });
    state = run(state, { type: 'EDIT', field: 'email', value: 'different@example.test', variant: 'diagnostic' });
    expect(state.phase).toBe('validating');
  });

  it('maps all failed requests to safe error state and allows editing without losing input', () => {
    let state = { ...createInquiryState(), fields: synthetic };
    state = run(state, { type: 'SUBMIT' });
    state = run(state, { type: 'FAILURE', message: mapLeadError({ code: 503, message: 'never render raw' }) });
    expect(state.phase).toBe('error');
    expect(state.toast).toEqual({ kind: 'error', message: 'Something went wrong — please try again' });
    expect(state.message).not.toContain('never render raw');
    state = run(state, { type: 'EDIT', field: 'organization', value: 'Updated Practice', variant: 'diagnostic' });
    expect(state.phase).toBe('validating');
    expect(state.fields.organization).toBe('Updated Practice');
  });
  it('never renders raw SDK messages and handles exact 401, 409, 5xx copy', () => {
    expect(mapLeadError({ code: 401 })).toBe('Your session expired. Refresh and try again.');
    expect(mapLeadError({ code: 409 })).toBe('We could not process this request. Please try again shortly.');
    expect(mapLeadError({ code: 500 })).toBe('Our system is temporarily unavailable. Please retry in a moment.');
    expect(mapLeadError({ code: 503 })).toBe('Our system is temporarily unavailable. Please retry in a moment.');
    expect(mapLeadError({ code: 429 })).toMatch(/Too many requests/);
    expect(mapLeadError({ code: 400, message: 'Internal token secret' })).not.toMatch(/secret/);
  });
  it('validates field lengths, format and mandatory PHI acknowledgement', () => {
    expect(fieldError('organization', 'a')).toMatch(/practice name/i);
    expect(fieldError('noPhi', false)).toMatch(/no PHI/i);
    expect(fieldError('system', 'z'.repeat(201))).toMatch(/200/);
    expect(fieldError('providers', '51+', 'diagnostic')).toMatch(/providers/);
    expect(fieldError('focus', '', 'contact')).toMatch(/inquiry/);
  });
});
