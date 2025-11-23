import { describe, it, expect } from 'vitest';

import { animation } from './animation';

describe('tokens/animation', () => {
  it('defines named animations', () => {
    expect(animation['fade-in']).toContain('fadeIn 0.3s ease-in-out');
  });
});
