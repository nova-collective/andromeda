/**
 * Animation tokens
 *
 * Named animations used across the system.
 */
export const animation = {
  'fade-in': 'fadeIn 0.3s ease-in-out',
  'slide-up': 'slideUp 0.3s ease-out',
  'scale-in': 'scaleIn 0.2s ease-out',
  shimmer: 'shimmer 2s linear infinite',
  pulseSoft: 'pulseSoft 3s ease-in-out infinite',
} as const;

export type AnimationToken = keyof typeof animation;
