import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DirtCommandCenter } from './DirtCommandCenter';

afterEach(() => {
  cleanup();
});

describe('DirtCommandCenter', () => {
  it('expands/collapses a triage row and shows the operational pattern panel', () => {
    render(<DirtCommandCenter />);
    const toggle = screen.getByRole('button', { name: /Eligibility denials — new patient front end/i });
    expect(screen.queryByText(/Eligibility checks skipped for same-day/i)).toBeNull();

    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText(/Operational pattern/i)).toBeTruthy();
    expect(screen.getByText(/Eligibility checks skipped for same-day/i)).toBeTruthy();

    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens Explain for two different rows and shows the matching evidence, then closes it', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    render(<DirtCommandCenter />);

    const explainButtons = screen.getAllByRole('button', { name: /^Explain$/i });
    fireEvent.click(explainButtons[0]);
    expect(screen.getByText('Explain this recommendation')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: /Eligibility denials — new patient front end/i })).toBeTruthy();

    fireEvent.click(explainButtons[2]);
    expect(screen.getByRole('heading', { level: 3, name: /Aging 120\+ — Commercial follow-up overdue/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Close/i }));
    expect(screen.queryByText('Explain this recommendation')).toBeNull();

    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
