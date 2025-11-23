import { describe, it, expect } from 'vitest';

import { colors } from './colors';

describe('tokens/colors', () => {
  it('exports semantic aliases and palettes', () => {
    expect(colors.surface).toBeDefined();
    expect(colors.textBase).toBeDefined();
    expect(colors.primary[500]).toMatch(/^#/);
    expect(colors.secondary[500]).toMatch(/^#/);
    expect(colors.accent[500]).toMatch(/^#/);
  });
});
