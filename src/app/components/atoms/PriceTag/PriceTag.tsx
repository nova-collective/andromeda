import React from 'react';
import type { HTMLAttributes } from 'react';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export type PriceTagSize = 'sm' | 'md' | 'lg';
export type PriceTagVariant = 'primary' | 'secondary';

export interface PriceTagProps extends HTMLAttributes<HTMLSpanElement> {
  value: number | string;
  currency?: string; // e.g. 'ETH', 'USD'
  previousValue?: number | string;
  size?: PriceTagSize;
  variant?: PriceTagVariant;
  /** Accessible label. Hidden unless showLabel */
  label?: string;
  /** Show visible label before price */
  showLabel?: boolean;
  /** Format function for value */
  format?: (v: number | string) => string;
}

const sizeClasses: Record<PriceTagSize, string> = {
  sm: 'text-xs gap-1',
  md: 'text-sm gap-1.5',
  lg: 'text-base gap-2'
};

const variantClasses: Record<PriceTagVariant, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary'
};

function numeric(n: number | string | undefined): number | undefined {
  if (n === undefined) return undefined;
  const num = typeof n === 'number' ? n : parseFloat(n);
  return isNaN(num) ? undefined : num;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  value,
  currency = 'ETH',
  previousValue,
  size = 'md',
  variant = 'primary',
  label = 'Price',
  showLabel = false,
  format,
  className,
  ...rest
}) => {
  const currentNum = numeric(value);
  const previousNum = numeric(previousValue);
  const trend = previousNum !== undefined && currentNum !== undefined && currentNum !== previousNum
    ? (currentNum > previousNum ? 'up' : 'down') : null;

  const wrapperClasses = [
    'inline-flex items-baseline font-medium',
    sizeClasses[size],
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  const display = format ? format(value) : String(value);
  const displayPrev = previousValue !== undefined ? (format ? format(previousValue) : String(previousValue)) : null;

  return (
    <span
      role="text"
      aria-label={`${label}: ${display}${displayPrev ? ` (previous ${displayPrev})` : ''}`}
      data-variant={variant}
      data-size={size}
      className={wrapperClasses}
      {...rest}
    >
      {showLabel && <span className="uppercase tracking-wide text-[10px] font-semibold text-secondary/70">{label}</span>}
      <span className="flex items-center gap-1">
        <span className="text-[color:var(--link-color)]">{display}</span>
        {currency && <span className="text-secondary text-[11px] font-normal">{currency}</span>}
        {trend === 'up' && <ArrowUpRight size={14} className="text-green-600" aria-label="Increased" />}
        {trend === 'down' && <ArrowDownRight size={14} className="text-red-600" aria-label="Decreased" />}
      </span>
      {displayPrev && (
        <span className="line-through text-secondary/50 text-[11px]" aria-hidden="true">{displayPrev}</span>
      )}
    </span>
  );
};

export default PriceTag;
