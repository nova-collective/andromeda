import React, { type HTMLAttributes } from 'react';

export type ParagraphSize = 'sm' | 'base' | 'lg' | 'xl';
export type ParagraphAlign = 'left' | 'center' | 'right';

export interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Visual size variant */
  size?: ParagraphSize;
  /** Muted text style using semantic token */
  muted?: boolean;
  /** Text alignment */
  align?: ParagraphAlign;
  /** Optional to render a different element (e.g. span, div) while keeping paragraph styling */
  as?: React.ElementType;
  children?: React.ReactNode;
}

const sizeClassMap: Record<ParagraphSize, string> = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl md:text-2xl',
};

const alignClassMap: Record<ParagraphAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const Paragraph: React.FC<ParagraphProps> = ({
  size = 'base',
  muted = false,
  align = 'left',
  as: Component = 'p',
  className = '',
  children,
  ...rest
}) => {
  const colorClass = muted ? 'text-textMuted' : 'text-textBase';
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
