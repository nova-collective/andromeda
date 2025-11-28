import React from 'react'

export type BoxVariant = 'plain' | 'subtle' | 'elevated'
export type BoxPadding = 'none' | 'sm' | 'md' | 'lg'
export type BoxRadius = 'none' | 'sm' | 'md' | 'lg' | 'full'

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  variant?: BoxVariant
  padding?: BoxPadding
  radius?: BoxRadius
  bordered?: boolean
}

const paddingMap: Record<BoxPadding, string> = {
  none: 'p-0',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
}

const radiusMap: Record<BoxRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-md',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
}

const variantMap: Record<BoxVariant, string> = {
  plain: 'bg-transparent',
  subtle: 'bg-primary',
  elevated: 'bg-primary shadow-card',
}

export const Box: React.FC<BoxProps> = ({
  as: Component = 'div',
  variant = 'subtle',
  padding = 'md',
  radius = 'md',
  bordered = true,
  className = '',
  children,
  ...rest
}) => {
  const paddingClasses = paddingMap[padding]
  const radiusClasses = radiusMap[radius]
  const variantClasses = variantMap[variant]

  const classes = [
    'w-full',
    variantClasses,
    bordered ? 'border border-color' : '',
    radiusClasses,
    paddingClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  )
}

export default Box
