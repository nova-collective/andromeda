/**
 * Letter-spacing tokens
 *
 * Controls tracking for different text contexts.
 */
export const letterSpacing = {
  tighter: '-0.01em',
  wide: '0.04em',
  wider: '0.08em',
} as const;

export type LetterSpacingToken = keyof typeof letterSpacing;
