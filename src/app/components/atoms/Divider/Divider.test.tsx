import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Divider } from './Divider'

describe('Divider', () => {
  it('renders a horizontal separator by default', () => {
    render(<Divider />)
    const separator = screen.getByRole('separator')
    expect(separator).toBeInTheDocument()
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('supports vertical orientation', () => {
    render(<Divider orientation="vertical" />)
    const separator = screen.getByRole('separator')
    expect(separator).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('renders label when provided', () => {
    render(<Divider label="or" />)
    expect(screen.getByText('or')).toBeInTheDocument()
    const separator = screen.getByRole('separator')
    expect(separator).toHaveAttribute('aria-label', 'or')
  })

  it('applies custom className', () => {
    render(<Divider className="mt-4" />)
    const separator = screen.getByRole('separator')
    expect(separator.className).toMatch(/mt-4/)
  })
})
