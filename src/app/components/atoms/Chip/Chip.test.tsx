import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Chip } from './Chip'

describe('Chip', () => {
  it('renders label', () => {
    render(<Chip label="Sci-Fi" />)
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument()
  })

  it('applies tone and variant data attributes', () => {
    render(<Chip label="Live" tone="success" variant="solid" />)
    const el = screen.getByText('Live').parentElement as HTMLElement
    expect(el).toHaveAttribute('data-tone', 'success')
    expect(el).toHaveAttribute('data-variant', 'solid')
  })

  it('renders remove button and calls onRemove', () => {
    const onRemove = vi.fn()
    render(<Chip label="Filter" onRemove={onRemove} />)
    const btn = screen.getByRole('button', { name: /remove filter/i })
    fireEvent.click(btn)
    expect(onRemove).toHaveBeenCalledTimes(1)
  })
})
