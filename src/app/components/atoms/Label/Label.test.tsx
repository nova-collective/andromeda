import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Label } from './Label';

describe('Label', () => {
  it('renders content inside a span by default', () => {
    render(<Label>Beta</Label>);
    const el = screen.getByText('Beta');
    expect(el.tagName).toBe('SPAN');
  });

  it('supports size variants', () => {
    render(<Label size="sm">Small</Label>);
    const el = screen.getByText('Small');
    expect(el).toHaveClass('text-xs');
  });

  it('supports pill shape', () => {
    render(<Label pill>Rounded</Label>);
    const el = screen.getByText('Rounded');
    expect(el).toHaveClass('rounded-full');
  });

  it('applies severity+variant classes', () => {
    render(<Label severity="success" variant="soft">Ok</Label>);
    const el = screen.getByText('Ok');
    expect(el.className).toMatch(/green|success|text-green|bg-green|border-green/);
  });

  it('renders left and right icons', () => {
    render(<Label leftIcon={<i>l</i>} rightIcon={<i>r</i>}>Icon</Label>);
    const root = screen.getByText('Icon');
    // icon wrappers are aria-hidden spans inside the root element
    const iconSpans = root.querySelectorAll('[aria-hidden="true"]');
    expect(iconSpans.length).toBe(2);
  });

  it('supports `as` prop override', () => {
    render(<Label as="div">Block</Label>);
    const el = screen.getByText('Block');
    expect(el.tagName).toBe('DIV');
  });
});
