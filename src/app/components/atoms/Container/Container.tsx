import React from 'react'

export type ContainerWidth = 'sm' | 'md' | 'lg' | 'xl'
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  width?: ContainerWidth
  padding?: ContainerPadding
  center?: boolean
  bordered?: boolean
}

const widthMap: Record<ContainerWidth, string> = {
  sm: 'max-w-xl',
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
}

const paddingMap: Record<ContainerPadding, string> = {
  none: 'px-0',
  sm: 'px-4',
  md: 'px-6',
  lg: 'px-8',
}

export const Container: React.FC<ContainerProps> = ({
  as: Component = 'div',
  width = 'lg',
  padding = 'md',
  center = true,
  bordered = false,
  className = '',
  children,
  ...rest
}) => {
  const widthClasses = widthMap[width]
  const paddingClasses = paddingMap[padding]

  const classes = [
    center ? 'mx-auto' : '',
    'w-full',
    widthClasses,
    paddingClasses,
    bordered ? 'border border-color rounded-2xl bg-primary shadow-card' : '',
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

export default Container
