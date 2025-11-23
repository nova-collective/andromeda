import { describe, it, expect } from 'vitest';

import { transitionTimingFunction } from './transitionTimingFunction';

describe('tokens/transitionTimingFunction', () => {
  it('provides easing curves', () => {
    expect(transitionTimingFunction.soft).toContain('cubic-bezier(0.4,0,0.2,1)');
  });
});
