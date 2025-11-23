import { describe, it, expect } from 'vitest';

import { transitionDuration } from './transitionDuration';

describe('tokens/transitionDuration', () => {
  it('defines duration scale', () => {
    expect(transitionDuration.fast).toMatch(/ms/);
    expect(transitionDuration.slow).toMatch(/ms/);
  });
});
