import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { MenuItem } from './MenuItem'

describe('MenuItem', () => {
  it('renders label and optional description', () => {
    render(<MenuItem label="Profile" description="View and edit your profile" />)

    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('View and edit your profile')).toBeInTheDocument()
  })

  it('applies size and active data attribute', () => {
    render(<MenuItem label="Settings" size="sm" active />)
    const button = screen.getByRole('button', { name: 'Settings' })

    expect(button).toHaveAttribute('data-active', 'true')
    expect(button.className).toMatch(/text-xs/)
  })

  it('fires onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<MenuItem label="Logout" onClick={handleClick} />)

    const button = screen.getByRole('button', { name: 'Logout' })
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<MenuItem label="Disabled" disabled onClick={handleClick} />)

    const button = screen.getByRole('button', { name: 'Disabled' })
    fireEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })
})
