import React from 'react';
import type { HTMLAttributes } from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'primary' | 'secondary';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  /** Accessible label. Defaults to "Loading" */
  label?: string;
  /** Show visible text label next to spinner instead of sr-only */
  showLabel?: boolean;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-4'
};

const variantClasses: Record<SpinnerVariant, string> = {
  primary: 'border-[color:var(--border)] border-t-[color:var(--link-color)]',
  secondary: 'border-[color:var(--border)] border-t-[color:var(--text-secondary)]'
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  label = 'Loading',
  showLabel = false,
  className,
  ...rest
}) => {
  const circleClasses = [
    'rounded-full animate-spin',
    sizeClasses[size],
    variantClasses[variant],
    'ease-linear'
  ].join(' ');

  if (showLabel) {
    return (
      <div role="status" aria-live="polite" className={['inline-flex items-center gap-2', className].filter(Boolean).join(' ')} {...rest}>
        <div className={circleClasses} />
        <span className="text-secondary text-xs">{label}</span>
      </div>
    );
  }

  const classes = [
    'inline-block',
    circleClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div role="status" aria-live="polite" className={classes} {...rest}>
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default Spinner;
