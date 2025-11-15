import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Paragraph } from './Paragraph';

describe('Paragraph', () => {
  it('renders children by default as <p>', () => {
    render(<Paragraph>Content</Paragraph>);
    const el = screen.getByText('Content');
    expect(el.tagName).toBe('P');
  });

  it('applies size class', () => {
    render(<Paragraph size="xl">Big</Paragraph>);
    const el = screen.getByText('Big');
    expect(el).toHaveClass('text-xl');
  });

  it('applies muted color token', () => {
    render(<Paragraph muted>Muted Text</Paragraph>);
    const el = screen.getByText('Muted Text');
    expect(el).toHaveClass('text-textMuted');
  });

  it('applies alignment class', () => {
    render(<Paragraph align="center">Centered</Paragraph>);
    const el = screen.getByText('Centered');
    expect(el).toHaveClass('text-center');
  });

  it('merges custom className', () => {
    render(<Paragraph className="custom-class">Merged</Paragraph>);
    const el = screen.getByText('Merged');
    expect(el).toHaveClass('custom-class');
  });

  it('supports as prop for element override', () => {
    render(<Paragraph as="span">Span Text</Paragraph>);
    const el = screen.getByText('Span Text');
    expect(el.tagName).toBe('SPAN');
  });
});
