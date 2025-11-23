import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders with label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
    const input = screen.getByRole('checkbox');
    expect(input).not.toBeChecked();
  });

  it('toggles checked state on click', () => {
    render(<Checkbox label="Subscribe" />);
    const input = screen.getByRole('checkbox');
    fireEvent.click(input);
    expect(input).toBeChecked();
    fireEvent.click(input);
    expect(input).not.toBeChecked();
  });

  it('applies invalid styling and aria attribute', () => {
    render(<Checkbox label="Error" invalid />);
    const input = screen.getByRole('checkbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.className).toMatch(/border-red-500|dark:border-red-400/);
  });

  it('respects disabled state', () => {
    render(<Checkbox label="Disabled" disabled />);
    const input = screen.getByRole('checkbox');
    expect(input).toBeDisabled();
  });

  it('shows indeterminate state (visual only)', () => {
    render(<Checkbox label="Mixed" indeterminate />);
    const input = screen.getByRole('checkbox');
    // Indeterminate is applied via ref effect; assert using property cast
    expect((input as HTMLInputElement).indeterminate).toBe(true);
  });

  it('supports size presets', () => {
    const { rerender } = render(<Checkbox size="sm" label="Small" />);
    let input = screen.getByRole('checkbox');
    expect(input.className).toMatch(/h-4/);
    rerender(<Checkbox size="md" label="Medium" />);
    input = screen.getByRole('checkbox');
    expect(input.className).toMatch(/h-5/);
    rerender(<Checkbox size="lg" label="Large" />);
    input = screen.getByRole('checkbox');
    expect(input.className).toMatch(/h-6/);
  });
});
