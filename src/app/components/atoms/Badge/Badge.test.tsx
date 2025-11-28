import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Badge } from './Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('applies tone and variant data attributes', () => {
    render(
      <Badge tone="success" variant="solid">
        Live
      </Badge>,
    )
    const el = screen.getByText('Live')
    expect(el).toHaveAttribute('data-tone', 'success')
    expect(el).toHaveAttribute('data-variant', 'solid')
  })

  it('supports pill style', () => {
    render(
      <Badge pill>
        Pill
      </Badge>,
    )
    const el = screen.getByText('Pill')
    expect(el.className).toMatch(/rounded-full/)
  })

  it('applies custom className', () => {
    render(<Badge className="tracking-wide">Wide</Badge>)
    const el = screen.getByText('Wide')
    expect(el.className).toMatch(/tracking-wide/)
  })
})
