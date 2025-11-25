import React, { type HTMLAttributes } from 'react';

/**
 * Heading
 *
 * Semantic, theme-aware heading atom that renders h1–h6 with consistent typography.
 *
 * Design system notes:
 * - Uses `font-serif` per VDS for display headings
 * - Color via semantic tokens: `text-textBase` by default, `text-textMuted` when `muted`
 * - Size scale is mapped by level and can be overridden via className for special cases (e.g., hero)
 *
 * Accessibility:
 * - Always choose the correct semantic `level` for document outline
 * - Prefer one h1 per route boundary; use lower levels for section titles
 */

/** Horizontal text alignment */
export type HeadingAlign = 'left' | 'center' | 'right';
/** Semantic heading level (controls tag h1..h6 and default sizing) */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
/** Heading component variants */
export type variant = 'primary' | 'secondary';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Semantic heading level (1..6). Default: 2 */
  level?: HeadingLevel;
  /** Use `text-textMuted` for a subdued appearance. Default: false */
  muted?: boolean;
  /** Horizontal alignment. Default: left */
  align?: HeadingAlign;
  /** Heading content */
  children?: React.ReactNode;
  /** Heading variant */
  variant?: variant;
}

/** Maps heading level to responsive size utilities */
const levelClassMap: Record<HeadingLevel, string> = {
  1: 'text-3xl md:text-4xl',
  2: 'text-2xl md:text-3xl',
  3: 'text-xl md:text-2xl',
  4: 'text-lg',
  5: 'text-base',
  6: 'text-sm uppercase tracking-wide',
};

/** Maps alignment to Tailwind text alignment utilities */
const alignClassMap: Record<HeadingAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/**
 * Heading component.
 *
 * Contract
 * - Inputs: level, muted, align, className, children
 * - Output: `<h{level}>` element with DS-consistent typography and colors
 * - Error modes: none (presentational); spreads remaining props to the tag
 */
export const Heading: React.FC<HeadingProps> = ({
  level = 2,
  muted = false,
  align = 'left',
  variant = 'primary',
  className = '',
  children,
  ...rest
}) => {
  const Tag = (`h${level}` as React.ElementType);
  const colorClass = muted ? 'text-textMuted' : 'text-textBase';
  const sizeClass = levelClassMap[level];
  const alignClass = alignClassMap[align];

  const classes = `font-serif ${colorClass} ${sizeClass} ${alignClass} ${className}`.trim();

  return (
    <Tag className={`text-${variant} ${classes}`} {...rest}>
      {children}
    </Tag>
  );
};

export default Heading;
