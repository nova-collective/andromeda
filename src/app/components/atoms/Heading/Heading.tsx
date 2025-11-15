import React, { type HTMLAttributes } from 'react';

export type HeadingAlign = 'left' | 'center' | 'right';
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Semantic heading level (1..6) */
  level?: HeadingLevel;
  /** Muted text style using theme token */
  muted?: boolean;
  /** Text alignment */
  align?: HeadingAlign;
  /** Heading content */
  children?: React.ReactNode;
}

const levelClassMap: Record<HeadingLevel, string> = {
  1: 'text-3xl md:text-4xl',
  2: 'text-2xl md:text-3xl',
  3: 'text-xl md:text-2xl',
  4: 'text-lg',
  5: 'text-base',
  6: 'text-sm uppercase tracking-wide',
};

const alignClassMap: Record<HeadingAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const Heading: React.FC<HeadingProps> = ({
  level = 2,
  muted = false,
  align = 'left',
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
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
};

export default Heading;
