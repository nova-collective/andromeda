import React, { type AnchorHTMLAttributes } from 'react';

/**
 * Link
 *
 * Theme-aware inline link atom with simple underline variants and contrast handling.
 * Mirrors VDS conventions from other atoms (Heading, Paragraph, Caption):
 * - semantic color tokens for default cases (text-textBase / text-textMuted)
 * - optional contrast mode for colored backgrounds (onPrimary)
 * - underline behavior (hover | always | none)
 * - accessible focus ring
 */

export type LinkUnderline = 'hover' | 'always' | 'none';
export type LinkContrast = 'default' | 'onPrimary';
export type LinkSize = 'sm' | 'base' | 'lg';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Visual emphasis via underline behavior (default: 'hover') */
  underline?: LinkUnderline;
  /** Secondary tone using text-textMuted (default: false) */
  muted?: boolean;
  /** Contrast context for colored backgrounds (default: 'default') */
  contrast?: LinkContrast;
  /** Optional size utility to match surrounding text context (default: 'base') */
  size?: LinkSize;
  /** Optional leading icon node */
  leftIcon?: React.ReactNode;
  /** Optional trailing icon node */
  rightIcon?: React.ReactNode;
  /** Force external behavior (target _blank + rel) regardless of href shape */
  external?: boolean;
  /** Underlying element to render (default: 'a') */
  as?: React.ElementType;
}

const underlineClassMap: Record<LinkUnderline, string> = {
  hover: 'hover:underline underline-offset-4 decoration-current',
  always: 'underline underline-offset-4 decoration-current',
  none: 'no-underline',
};

const sizeClassMap: Record<LinkSize, string> = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
};

export const Link: React.FC<LinkProps> = ({
  underline = 'hover',
  muted = false,
  contrast = 'default',
  size = 'base',
  leftIcon,
  rightIcon,
  external,
  as: Component = 'a',
  className = '',
  href,
  children,
  ...rest
}) => {
  // Color precedence:
  // 1. contrast onPrimary -> forced readable colors
  // 2. muted -> semantic muted token
  // 3. default -> brand link color token
  const colorClass = contrast === 'onPrimary'
    ? 'text-white dark:text-black'
    : (muted ? 'text-textMuted' : 'text-link');

  const underlineCls = underlineClassMap[underline];
  const sizeCls = sizeClassMap[size];
  const baseFocus = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]';

  const isExternalAuto = typeof href === 'string' && /^(https?:)?\/\//.test(href) && !href.startsWith('/');
  const isExternal = external ?? isExternalAuto;

  const rel = isExternal ? ['noopener', 'noreferrer', rest.rel].filter(Boolean).join(' ') : rest.rel;
  const target = isExternal ? '_blank' : rest.target;

  const classes = `inline-flex items-center gap-1 ${colorClass} ${underlineCls} ${sizeCls} ${baseFocus} ${className}`.trim();

  const { rel: _relIgnored, target: _targetIgnored, ...elementProps } = rest;

  return (
    <Component href={href} rel={rel} target={target} className={classes} {...elementProps}>
      {leftIcon ? <span aria-hidden className="-ml-0.5 inline-flex items-center">{leftIcon}</span> : null}
      {children}
      {rightIcon ? <span aria-hidden className="-mr-0.5 inline-flex items-center">{rightIcon}</span> : null}
    </Component>
  );
};

export default Link;
