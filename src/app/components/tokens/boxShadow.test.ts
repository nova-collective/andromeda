import { describe, it, expect } from 'vitest';

import { boxShadow } from './boxShadow';

describe('tokens/boxShadow', () => {
  it('exposes elevation shadows', () => {
    expect(boxShadow.card).toMatch(/rgba?\(/);
    expect(boxShadow['dark-card']).toMatch(/rgba?\(/);
    expect(boxShadow.focus).toContain('inset');
  });
});
