import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders default text skeleton', () => {
    render(<Skeleton />);
    const skel = screen.getByRole('status');
    expect(skel).toHaveAttribute('data-shape', 'text');
    expect(skel.className).toMatch(/h-4/);
  });

  it('applies shape and size combinations', () => {
    render(<Skeleton shape="circle" size="sm" data-testid="circle-sm" />);
    render(<Skeleton shape="circle" size="lg" data-testid="circle-lg" />);
    render(<Skeleton shape="rect" size="sm" data-testid="rect-sm" />);
    render(<Skeleton shape="rect" size="lg" data-testid="rect-lg" />);
    expect(screen.getByTestId('circle-sm').className).toMatch(/h-6/);
    expect(screen.getByTestId('circle-lg').className).toMatch(/h-12/);
    expect(screen.getByTestId('rect-sm').className).toMatch(/h-4/);
    expect(screen.getByTestId('rect-lg').className).toMatch(/h-8/);
  });

  it('applies secondary variant', () => {
    render(<Skeleton variant="secondary" data-testid="variant" />);
    expect(screen.getByTestId('variant').className).toMatch(/bg-\[color:var\(--text-secondary\)\]\/20/);
  });

  it('renders sr-only label by default', () => {
    render(<Skeleton />);
    const label = screen.getByText('Loading');
    expect(label).toHaveClass('sr-only');
  });

  it('renders visible label when showLabel is true', () => {
    render(<Skeleton showLabel label="Loading data" />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Loading data');
    const hidden = status.querySelector('.sr-only');
    expect(hidden).toBeNull();
  });

  it('suppresses label when empty string provided', () => {
    render(<Skeleton label="" />);
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
  });

  it('disables animation when animated=false', () => {
    render(<Skeleton animated={false} data-testid="no-anim" />);
    expect(screen.getByTestId('no-anim').className).not.toMatch(/animate-pulse/);
  });
});
