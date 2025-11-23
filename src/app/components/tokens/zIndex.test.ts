import { describe, it, expect } from 'vitest';

import { zIndex } from './zIndex';

describe('tokens/zIndex', () => {
  it('exposes layering tokens', () => {
    expect(Number.parseInt(zIndex.header)).toBeGreaterThan(0);
    expect(Number.parseInt(zIndex.modal)).toBeGreaterThan(0);
  });
});
