/**
 * Box shadow tokens
 *
 * Elevation levels for surfaces and interactive elements.
 */
export const boxShadow = {
  card: '0 0 0 1px rgba(0,0,0,.05), 0 4px 8px rgba(0,0,0,.1)',
  'card-hover': '0 0 0 1px rgba(0,0,0,.05), 0 8px 16px rgba(0,0,0,.15)',
  'dark-card': '0 0 0 1px rgba(255,255,255,.05), 0 4px 8px rgba(0,0,0,.3)',
  'dark-card-hover': '0 0 0 1px rgba(255,255,255,.08), 0 8px 16px rgba(0,0,0,.4)',
  focus: '0 0 0 2px var(--text-primary) inset',
  elevated: '0 6px 20px -2px rgba(0,0,0,0.18)',
} as const;

export type BoxShadowToken = keyof typeof boxShadow;
