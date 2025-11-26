import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Logo } from './Logo'

describe('Logo', () => {
  it('renders with default size and sr-only label', () => {
    render(<Logo />)
    const svg = screen.getByRole('img', { name: 'Andromeda' })
    expect(svg).toBeInTheDocument()
    // container has data attributes
    const wrapper = svg.parentElement as HTMLElement
    expect(wrapper).toHaveAttribute('data-size', 'md')
    expect(wrapper.querySelector('.sr-only')).toBeTruthy()
  })

  it('applies size and variant classes', () => {
    render(<Logo size="lg" variant="secondary" />)
    const svg = screen.getByRole('img', { name: 'Andromeda' })
    const cls = svg.getAttribute('class') || ''
    expect(cls).toMatch(/h-12/)
    expect(cls).toMatch(/text-\[color:var\(--text-secondary\)\]/)
  })

  it('shows visible label when showLabel is true', () => {
    render(<Logo showLabel label="Site Logo" />)
    expect(screen.getByText('Site Logo')).toBeInTheDocument()
    expect(screen.queryByText('Andromeda')).toBeNull()
  })

  it('suppresses label when empty string provided', () => {
    render(<Logo label="" />)
    const svg = screen.getByRole('img')
    // no sr-only span
    const wrapper = svg.parentElement as HTMLElement
    expect(wrapper.querySelector('.sr-only')).toBeNull()
  })
})
