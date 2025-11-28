import React from 'react'

export type SpacerAxis = 'horizontal' | 'vertical'
export type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface SpacerProps {
  axis?: SpacerAxis
  size?: SpacerSize
  className?: string
}

const sizeMap: Record<SpacerSize, string> = {
  xs: '1', // 0.25rem
  sm: '2', // 0.5rem
  md: '4', // 1rem
  lg: '6', // 1.5rem
  xl: '8', // 2rem
}

export const Spacer: React.FC<SpacerProps> = ({
  axis = 'vertical',
  size = 'md',
  className = '',
}) => {
  const token = sizeMap[size]
  const base = axis === 'vertical' ? `h-${token} w-px` : `w-${token} h-px`

  return (
    <div
      aria-hidden="true"
      className={[
        'shrink-0 bg-transparent',
        base,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-axis={axis}
      data-size={size}
    />
  )
}

export default Spacer
