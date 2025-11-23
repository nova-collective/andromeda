import { describe, it, expect } from 'vitest';

import { fontFamily } from './fontFamily';

describe('tokens/fontFamily', () => {
  it('exports sans and serif stacks', () => {
    expect(Array.isArray(fontFamily.sans)).toBe(true);
    expect(Array.isArray(fontFamily.serif)).toBe(true);
    expect(fontFamily.sans[0]).toBeDefined();
  });
});
