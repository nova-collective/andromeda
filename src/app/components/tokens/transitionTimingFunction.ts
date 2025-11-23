/**
 * Transition timing function tokens
 *
 * Easing curves for transitions and animations.
 */
export const transitionTimingFunction = {
  soft: 'cubic-bezier(0.4,0,0.2,1)',
  emphasized: 'cubic-bezier(.2,.8,.2,1)',
  bounceSoft: 'cubic-bezier(.34,1.56,.64,1)',
} as const;

export type TransitionTimingFunctionToken = keyof typeof transitionTimingFunction;
