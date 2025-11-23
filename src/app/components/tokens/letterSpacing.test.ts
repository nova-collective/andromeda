import { describe, it, expect } from 'vitest';

import { letterSpacing } from './letterSpacing';

describe('tokens/letterSpacing', () => {
  it('defines tracking presets', () => {
    expect(letterSpacing.tighter).toMatch(/-?\d*\.\d+em|px/);
    expect(letterSpacing.wide).toMatch(/\d*\.\d+em|px/);
  });
});
