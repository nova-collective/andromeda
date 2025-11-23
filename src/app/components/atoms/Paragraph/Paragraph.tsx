import React, { type HTMLAttributes } from 'react';

/**
 * Paragraph
 *
 * Theme-aware body text atom with semantic tokens and simple variants.
 *
 * Design system notes:
 * - Uses font-sans and `leading-relaxed` by default for readability
 * - Color is driven by semantic tokens: `text-textBase` or `text-textMuted` (when `muted`)
 * - Exposes size and alignment presets; heavy custom sizes should be applied via className while
 *   keeping semantic responsibility intact
 *
 * Accessibility:
 * - Renders a `<p>` by default; use `as` to change the element (e.g., `span`, `div`) if semantics require it
 * - Do not use Paragraph to render headings—use the Heading atom
 */

/** Visual size presets */
export type ParagraphSize = 'sm' | 'base' | 'lg' | 'xl';
/** Horizontal text alignment */
export type ParagraphAlign = 'left' | 'center' | 'right';
/** Text color variant */
export type ParagraphVariant = 'primary' | 'secondary';

export interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Visual size variant (default: base) */
  size?: ParagraphSize;
  /** Deprecated: prefer `variant="secondary"` */
  muted?: boolean;
  /** Horizontal alignment (default: left) */
  align?: ParagraphAlign;
  /** Text color variant mapped to `text-${variant}` (default: primary) */
  variant?: ParagraphVariant;
  /** Underlying element to render (default: 'p') */
  as?: React.ElementType;
  /** Content */
  children?: React.ReactNode;
}

/** Maps size preset to responsive font-size utilities */
const sizeClassMap: Record<ParagraphSize, string> = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl md:text-2xl',
};

/** Maps alignment to Tailwind text alignment utilities */
const alignClassMap: Record<ParagraphAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/**
 * Paragraph component.
 *
 * Contract
 * - Inputs: size, muted, align, as, className, children
 * - Output: semantic text element with DS-consistent typography and colors
 * - Error modes: none (presentational); unknown props spread to underlying element
 */
export const Paragraph: React.FC<ParagraphProps> = ({
  size = 'base',
  align = 'left',
  muted = false,
  variant,
  as: Component = 'p',
  className = '',
  children,
  ...rest
}) => {
  const computedVariant: ParagraphVariant =
    variant ?? (muted ? 'secondary' : 'primary');
  const colorClass = `text-${computedVariant}`;
  const sizeClass = sizeClassMap[size];
  const alignClass = alignClassMap[align];
  const classes = `font-sans leading-relaxed ${colorClass} ${sizeClass} ${alignClass} ${className}`.trim();

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};

export default Paragraph;
