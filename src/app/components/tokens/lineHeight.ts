/**
 * Line-height tokens
 *
 * Vertical rhythm for text blocks and headings.
 */
export const lineHeight = {
  tight: '1.15',
  snug: '1.25',
} as const;

export type LineHeightToken = keyof typeof lineHeight;
