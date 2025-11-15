import React, { type HTMLAttributes } from 'react';

/**
 * Label
 *
 * A compact, theme-aware tag/badge atom for surfacing metadata, categories, and state.
 *
 * Design system notes:
 * - Neutral styles favor semantic tokens (bg-surface, bg-surfaceAlt, text-textBase, text-textMuted, border-color)
 * - Severity styles (info/success/warning/danger) currently use stable Tailwind palette utilities for light/dark
 *   until dedicated severity tokens are introduced
 * - Inline by default, suitable for chips, counts, and contextual hints
 *
 * Accessibility:
 * - Non-interactive by default (span). Use `as` to render a semantic element when needed (e.g., <div>, <a>)
 * - Do not rely on color alone to convey critical information
 */

/** Distinct tone conveying meaning or state */
export type LabelSeverity = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
/** Presentation style balancing emphasis and subtlety */
export type LabelVariant = 'solid' | 'soft' | 'outline' | 'ghost';
/** Visual size presets (controls padding + font-size) */
export type LabelSize = 'sm' | 'md' | 'lg';

export interface LabelProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual tone (default: neutral) */
  severity?: LabelSeverity;
  /** Style variant (default: soft) */
  variant?: LabelVariant;
  /** Size preset (default: md) */
  size?: LabelSize;
  /** Rounded capsule shape when true */
  pill?: boolean;
  /** Optional leading icon node */
  leftIcon?: React.ReactNode;
  /** Optional trailing icon node */
  rightIcon?: React.ReactNode;
  /** Underlying element to render (default: span) */
  as?: React.ElementType;
  /** Label content */
  children?: React.ReactNode;
}

/** Maps size to font sizing and paddings */
const sizeClasses: Record<LabelSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

/**
 * Base structural classes per variant.
 * Note: we compose with severity styles below to produce final color combinations.
 */
const baseByVariant: Record<LabelVariant, string> = {
  solid: 'border',
  soft: 'border',
  outline: 'border bg-transparent',
  ghost: 'bg-transparent border-transparent',
};

/**
 * Color system per severity and variant.
 * Neutral relies on semantic tokens; other severities use Tailwind palette with dark variants for now.
 */
const bySeverityAndVariant: Record<LabelSeverity, Record<LabelVariant, string>> = {
  neutral: {
    solid: 'bg-surfaceAlt text-textBase border-color',
    soft: 'bg-surface text-textBase border-color/50',
    outline: 'text-textBase border-color',
    ghost: 'text-textMuted hover:text-textBase',
  },
  info: {
    solid: 'bg-blue-600 text-white dark:bg-blue-500 dark:text-black border-blue-700/60 dark:border-blue-400/60',
    soft: 'bg-blue-600/10 text-blue-700 dark:text-blue-300 border-blue-600/20',
    outline: 'text-blue-700 dark:text-blue-300 border-blue-600',
    ghost: 'text-blue-700 dark:text-blue-300',
  },
  success: {
    solid: 'bg-green-600 text-white dark:bg-green-500 dark:text-black border-green-700/60 dark:border-green-400/60',
    soft: 'bg-green-600/10 text-green-700 dark:text-green-300 border-green-600/20',
    outline: 'text-green-700 dark:text-green-300 border-green-600',
    ghost: 'text-green-700 dark:text-green-300',
  },
  warning: {
    solid: 'bg-amber-500 text-black dark:bg-amber-400 dark:text-black border-amber-600/60 dark:border-amber-300/60',
    soft: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25',
    outline: 'text-amber-700 dark:text-amber-300 border-amber-500',
    ghost: 'text-amber-700 dark:text-amber-300',
  },
  danger: {
    solid: 'bg-red-600 text-white dark:bg-red-500 dark:text-black border-red-700/60 dark:border-red-400/60',
    soft: 'bg-red-600/10 text-red-700 dark:text-red-300 border-red-600/20',
    outline: 'text-red-700 dark:text-red-300 border-red-600',
    ghost: 'text-red-700 dark:text-red-300',
  },
};

/**
 * Label component.
 *
 * Contract
 * - Inputs: severity, variant, size, pill, leftIcon, rightIcon, className, as, children
 * - Output: an inline tag element with correct colors, spacing, and shape
 * - Error modes: none (pure presentational); unknown props are passed to the underlying element
 *
 * Example
 * <Label severity="warning" variant="outline" pill>Beta</Label>
 */
export const Label: React.FC<LabelProps> = ({
  severity = 'neutral',
  variant = 'soft',
  size = 'md',
  pill = false,
  leftIcon,
  rightIcon,
  as: Component = 'span',
  className = '',
  children,
  ...rest
}) => {
  const sizeCls = sizeClasses[size];
  const shapeCls = pill ? 'rounded-full' : 'rounded-md';
  const colorCls = [baseByVariant[variant], bySeverityAndVariant[severity][variant]]
    .filter(Boolean)
    .join(' ');

  const classes = `inline-flex items-center gap-1 font-medium ${sizeCls} ${shapeCls} ${colorCls} ${className}`.trim();

  return (
    <Component className={classes} {...rest}>
      {leftIcon ? <span aria-hidden className="-ml-0.5 inline-flex items-center">{leftIcon}</span> : null}
      {children}
      {rightIcon ? <span aria-hidden className="-mr-0.5 inline-flex items-center">{rightIcon}</span> : null}
    </Component>
  );
};

export default Label;
