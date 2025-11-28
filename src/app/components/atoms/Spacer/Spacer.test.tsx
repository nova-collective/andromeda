import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Spacer } from './Spacer'

describe('Spacer', () => {
  it('renders a vertical spacer by default', () => {
    const { container } = render(<Spacer />)
    const spacer = container.firstChild as HTMLElement
    expect(spacer).toBeInTheDocument()
    expect(spacer.dataset.axis).toBe('vertical')
    expect(spacer.dataset.size).toBe('md')
  })

  it('supports horizontal axis', () => {
    const { container } = render(<Spacer axis="horizontal" size="lg" />)
    const spacer = container.firstChild as HTMLElement
    expect(spacer.dataset.axis).toBe('horizontal')
    expect(spacer.dataset.size).toBe('lg')
  })

  it('applies custom className', () => {
    const { container } = render(<Spacer className="bg-red-500" />)
    const spacer = container.firstChild as HTMLElement
    expect(spacer.className).toMatch(/bg-red-500/)
  })
})
