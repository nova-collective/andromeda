/**
 * Z-index tokens
 *
 * Layering order for overlays, modals, and helpers.
 */
export const zIndex = {
  header: '50',
  overlay: '60',
  modal: '70',
  popover: '80',
} as const;

export type ZIndexToken = keyof typeof zIndex;
