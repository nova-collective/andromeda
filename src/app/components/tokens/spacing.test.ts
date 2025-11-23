import { describe, it, expect } from 'vitest';

import { spacing } from './spacing';

describe('tokens/spacing', () => {
  it('provides core spacing tokens', () => {
    expect(spacing.section).toMatch(/rem|px/);
    expect(spacing.gutter).toMatch(/rem|px/);
    expect(spacing.component).toMatch(/rem|px/);
  });
});
