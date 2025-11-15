import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Link } from './Link';

describe('Link', () => {
  it('renders an anchor by default', () => {
    render(<Link href="#">Hello</Link>);
    const el = screen.getByText('Hello');
    expect(el.tagName).toBe('A');
  });

  it('applies hover underline by default', () => {
    render(<Link href="#">Hover me</Link>);
    const el = screen.getByText('Hover me');
    expect(el.className).toMatch(/hover:underline/);
    // Should use brand link color class by default
    expect(el).toHaveClass('text-link');
  });

  it('supports always underline', () => {
    render(<Link href="#" underline="always">Always</Link>);
    const el = screen.getByText('Always');
    expect(el.className).toMatch(/\bunderline\b/);
  });

  it('supports muted color', () => {
    render(<Link href="#" muted>Muted</Link>);
    const el = screen.getByText('Muted');
    expect(el).toHaveClass('text-textMuted');
    expect(el).not.toHaveClass('text-link');
  });

  it('supports onPrimary contrast', () => {
    render(<Link href="#" contrast="onPrimary">Contrast</Link>);
    const el = screen.getByText('Contrast');
    expect(el).toHaveClass('text-white');
    expect(el.className).toMatch(/dark:text-black/);
  });

  it('sets rel and target for external links automatically', () => {
    render(<Link href="https://example.com">External</Link>);
    const el = screen.getByText('External');
    expect(el).toHaveAttribute('target', '_blank');
    expect(el.getAttribute('rel')).toMatch(/noopener/);
    expect(el.getAttribute('rel')).toMatch(/noreferrer/);
  });

  it('respects as prop override', () => {
    render(<Link as="button">Button-ish</Link>);
    const el = screen.getByText('Button-ish');
    expect(el.tagName).toBe('BUTTON');
  });
});
