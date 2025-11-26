import '@testing-library/jest-dom/vitest';
import React, { createElement } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => createElement('img', props),
}));

import { Image } from './Image'

describe('Image', () => {
  it('renders an image with alt text', () => {
    render(<Image src="/placeholder-1.jpg" alt="Sample" />)
    const img = screen.getByTestId('image')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('alt', 'Sample')
  })

  it('applies default md size classes', () => {
    render(<Image src="/placeholder-1.jpg" alt="Sample" />)
    const img = screen.getByTestId('image')
    expect(img.className).toMatch(/h-40/)
    expect(img.className).toMatch(/w-40/)
  })

  it('applies size and fit options', () => {
    render(<Image src="/placeholder-1.jpg" alt="Sample" size="lg" className="case-lg" />)
    const img = screen.getByTestId('image')
    expect(img.className).toMatch(/h-64/)
    expect(img.className).toMatch(/w-64/)
  })

  it('applies object-cover by default', () => {
    render(<Image src="/placeholder-1.jpg" alt="Sample" />)
    const img = screen.getByTestId('image')
    expect(img.className).toMatch(/object-cover/)
  })

  it('applies object-contain when fit="contain"', () => {
    render(<Image src="/placeholder-1.jpg" alt="Sample" fit="contain" />)
    const img = screen.getByTestId('image')
    expect(img.className).toMatch(/object-contain/)
  })

  it('supports variant scope and label visibility', () => {
    render(<Image src="/placeholder-1.jpg" alt="Sample" variant="secondary" showLabel label="Cover" />)
    expect(screen.getByText('Cover')).toBeInTheDocument()
  })

  it('hides label by default using sr-only', () => {
    render(<Image src="/placeholder-1.jpg" alt="Sample" />)
    const hidden = screen.getByText('Image')
    expect(hidden).toHaveClass('sr-only')
  })
})
