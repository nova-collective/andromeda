import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { PriceTag } from './PriceTag';

describe('PriceTag', () => {
  it('renders value and currency', () => {
    render(<PriceTag value={2.5} currency="ETH" />);
    expect(screen.getByText('2.5')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();
  });

  it('renders previous value struck through', () => {
    render(<PriceTag value={3} previousValue={2.5} />);
    const prev = screen.getByText('2.5');
    expect(prev).toHaveClass('line-through');
  });

  it('shows up arrow when value increases', () => {
    render(<PriceTag value={3} previousValue={2} />);
    expect(screen.getByLabelText('Increased')).toBeInTheDocument();
  });

  it('shows down arrow when value decreases', () => {
    render(<PriceTag value={1.5} previousValue={2} />);
    expect(screen.getByLabelText('Decreased')).toBeInTheDocument();
  });

  it('applies size class', () => {
    render(<PriceTag value={1} size="lg" data-testid="price" />);
    expect(screen.getByTestId('price').className).toMatch(/text-base/);
  });

  it('applies variant class', () => {
    render(<PriceTag value={1} variant="secondary" data-testid="variant" />);
    expect(screen.getByTestId('variant').className).toMatch(/text-secondary/);
  });

  it('renders visible label when showLabel is true', () => {
    render(<PriceTag value={1} showLabel label="Current Price" />);
    expect(screen.getByText('Current Price')).toBeInTheDocument();
  });
});
