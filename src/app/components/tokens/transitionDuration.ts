/**
 * Transition duration tokens
 *
 * Standardized durations for UI transitions.
 */
export const transitionDuration = {
  fast: '120ms',
  normal: '200ms',
  slow: '320ms',
} as const;

export type TransitionDurationToken = keyof typeof transitionDuration;
