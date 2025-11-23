import { describe, it, expect } from 'vitest';

import { keyframes } from './keyframes';

describe('tokens/keyframes', () => {
  it('includes core motion definitions', () => {
    expect(keyframes.fadeIn['0%'].opacity).toBeDefined();
    expect(keyframes.slideUp['100%'].transform).toBeDefined();
  });
});
