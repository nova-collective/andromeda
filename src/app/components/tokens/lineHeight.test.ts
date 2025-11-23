import { describe, it, expect } from 'vitest';

import { lineHeight } from './lineHeight';

describe('tokens/lineHeight', () => {
  it('provides tight and snug line heights', () => {
    expect(Number.parseFloat(lineHeight.tight)).toBeGreaterThan(1);
    expect(Number.parseFloat(lineHeight.snug)).toBeGreaterThan(1);
  });
});
