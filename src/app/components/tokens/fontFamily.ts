/**
 * Font family tokens
 *
 * Defines primary typefaces used across the design system.
 * These map directly to Tailwind's `theme.extend.fontFamily`.
 */
export const fontFamily = {
	/** UI copy, body text, and controls */
	sans: ['Inter', 'system-ui', 'sans-serif'],
	/** Display, headings, and titles */
	serif: ['Merriweather', 'Georgia', 'serif'],
} as const;

export type FontFamilyToken = keyof typeof fontFamily;

