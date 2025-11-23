/**
 * Border radius tokens
 *
 * Rounded corners for components and surfaces.
 */
export const borderRadius = {
  '2xl': '1rem',
  '3xl': '1.5rem',
  pill: '9999px',
} as const;

export type BorderRadiusToken = keyof typeof borderRadius;
