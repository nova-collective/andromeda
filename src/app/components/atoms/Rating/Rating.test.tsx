import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Rating } from './Rating'

describe('Rating', () => {
  it('renders the correct number of stars', () => {
    render(<Rating value={3} max={5} />)
    const container = screen.getByRole('img')
    expect(container).toBeInTheDocument()
    // 5 stars (3 filled, 2 empty) — we just count svgs
    expect(container.querySelectorAll('svg')).toHaveLength(5)
  })

  it('clamps value within range', () => {
    render(<Rating value={10} max={5} />)
    const container = screen.getByRole('img')
    expect(container).toHaveAttribute('aria-label', 'Rating: 5 of 5')
  })

  it('applies size and variant classes', () => {
    render(<Rating value={2} size="lg" variant="secondary" />)
    const container = screen.getByRole('img')
    const stars = container.querySelectorAll('svg')
    expect(stars.length).toBeGreaterThan(0)
    // size lg maps to h-5 w-5
    expect(stars[0]).toHaveClass('h-5', 'w-5')
    // secondary variant applies text-[var(--text-secondary)]
    expect(stars[0]).toHaveClass('text-[var(--text-secondary)]')
  })

  it('shows visible label when showLabel is true', () => {
    render(<Rating value={4} max={5} showLabel />)
    expect(screen.getByText('Rating: 4 of 5')).toBeInTheDocument()
  })
})
