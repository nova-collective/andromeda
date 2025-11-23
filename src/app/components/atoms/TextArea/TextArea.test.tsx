import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { TextArea } from './TextArea';

describe('TextArea', () => {
  it('renders a textarea with placeholder', () => {
    render(<TextArea placeholder="Write here" />);
    const el = screen.getByPlaceholderText('Write here');
    expect(el).toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { rerender } = render(<TextArea placeholder="t" size="sm" />);
    let el = screen.getByPlaceholderText('t');
    expect(el.className).toMatch(/text-sm/);
    rerender(<TextArea placeholder="t" size="md" />);
    el = screen.getByPlaceholderText('t');
    expect(el.className).toMatch(/min-h-\[8rem\]/);
    rerender(<TextArea placeholder="t" size="lg" />);
    el = screen.getByPlaceholderText('t');
    expect(el.className).toMatch(/min-h-\[10rem\]/);
  });

  it('flags invalid state', () => {
    render(<TextArea placeholder="t" invalid />);
    const el = screen.getByPlaceholderText('t');
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el.className).toMatch(/border-red-500|dark:border-red-400/);
  });

  it('handles disabled state', () => {
    render(<TextArea placeholder="t" disabled />);
    const el = screen.getByPlaceholderText('t');
    expect(el).toBeDisabled();
  });

  it('shows character count when enabled', () => {
    const { rerender } = render(<TextArea placeholder="t" showCount value="Hello" />);
    expect(screen.getByText('5')).toBeInTheDocument();
    rerender(<TextArea placeholder="t" showCount value="Hello" maxLength={20} />);
    expect(screen.getByText('5 / 20')).toBeInTheDocument();
  });

  it('updates count on change', () => {
    const Wrapper: React.FC = () => {
      const [val, setVal] = React.useState('');
      return <TextArea placeholder="t" showCount value={val} onChange={(e) => setVal(e.target.value)} />;
    };
    render(<Wrapper />);
    const el = screen.getByPlaceholderText('t');
    fireEvent.change(el, { target: { value: 'abc' } });
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
