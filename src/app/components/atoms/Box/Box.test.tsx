import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Box } from './Box'

describe('Box', () => {
  it('renders children', () => {
    render(
      <Box>
        <p>Content</p>
      </Box>,
    )

    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies padding and radius classes', () => {
    const { container } = render(
      <Box padding="lg" radius="lg">
        <p>Content</p>
      </Box>,
    )

    const root = container.firstChild as HTMLElement
    expect(root.className).toMatch(/p-6/)
    expect(root.className).toMatch(/rounded-2xl/)
  })

  it('can render as a different element', () => {
    const { container } = render(
      <Box as="section">
        <p>Content</p>
      </Box>,
    )

    expect(container.querySelector('section')).toBeInTheDocument()
  })
})
