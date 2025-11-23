import { describe, it, expect } from 'vitest';

import { container } from './container';

describe('tokens/container', () => {
  it('defines container config', () => {
    expect(container.center).toBe(true);
    expect(container.padding).toBeDefined();
    expect(container.screens['2xl']).toBeDefined();
  });
});
