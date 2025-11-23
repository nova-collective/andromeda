import { describe, it, expect } from 'vitest';

import { borderRadius } from './borderRadius';

describe('tokens/borderRadius', () => {
  it('defines rounded sizes', () => {
    expect(borderRadius['2xl']).toMatch(/rem|px/);
    expect(borderRadius['3xl']).toMatch(/rem|px/);
    expect(borderRadius.pill).toMatch(/px/);
  });
});
