import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Container } from './Container'

describe('Container', () => {
  it('renders children', () => {
    render(
      <Container>
        <p>Content</p>
      </Container>,
    )

    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies width and padding classes', () => {
    const { container } = render(
      <Container width="sm" padding="lg">
        <p>Content</p>
      </Container>,
    )

    const root = container.firstChild as HTMLElement
    expect(root.className).toMatch(/max-w-xl/)
    expect(root.className).toMatch(/px-8/)
  })

  it('can render as a different element', () => {
    const { container } = render(
      <Container as="section">
        <p>Content</p>
      </Container>,
    )

    expect(container.querySelector('section')).toBeInTheDocument()
  })
})
