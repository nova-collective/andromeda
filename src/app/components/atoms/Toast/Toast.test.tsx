import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Toast } from './Toast'

describe('Toast', () => {
  it('renders title and description', () => {
    render(<Toast title="Saved" description="Your changes have been saved." />)

    expect(screen.getByText('Saved')).toBeInTheDocument()
    expect(screen.getByText('Your changes have been saved.')).toBeInTheDocument()
  })

  it('applies tone and variant data attributes', () => {
    render(<Toast title="Error" tone="danger" variant="solid" />)
    const toast = screen.getByRole('status')

    expect(toast).toHaveAttribute('data-tone', 'danger')
    expect(toast).toHaveAttribute('data-variant', 'solid')
  })

  it('calls onDismiss when dismiss button is clicked', () => {
    const handleDismiss = vi.fn()
    render(<Toast title="Info" onDismiss={handleDismiss} />)

    const button = screen.getByRole('button', { name: /dismiss notification/i })
    fireEvent.click(button)

    expect(handleDismiss).toHaveBeenCalledTimes(1)
  })
})
