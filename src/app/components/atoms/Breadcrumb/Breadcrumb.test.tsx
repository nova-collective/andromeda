import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Breadcrumb } from './Breadcrumb'

describe('Breadcrumb', () => {
  it('renders nothing when items are empty', () => {
    const { container } = render(<Breadcrumb items={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders items and separators', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Library', href: '/library' },
          { label: 'Details' },
        ]}
      />,
    )

    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Library')).toBeInTheDocument()
    expect(screen.getByText('Details')).toBeInTheDocument()

    const separators = screen.getAllByText('/')
    expect(separators.length).toBe(2)
  })

  it('marks last item as current page', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Section', href: '/section' },
          { label: 'Current' },
        ]}
      />,
    )

    const current = screen.getByText('Current')
    expect(current).toHaveAttribute('aria-current', 'page')
  })
})
