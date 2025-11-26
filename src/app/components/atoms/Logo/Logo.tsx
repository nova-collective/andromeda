import React from 'react'

import Image from 'next/image'

export type LogoSize = 'sm' | 'md' | 'lg'
export type LogoVariant = 'primary' | 'secondary'

export interface LogoProps {
  size?: LogoSize
  variant?: LogoVariant
  label?: string
  showLabel?: boolean
  className?: string
}

const sizeMap: Record<LogoSize, { height: number; className: string }> = {
  sm: { height: 24, className: 'h-6' },
  md: { height: 32, className: 'h-8' },
  lg: { height: 48, className: 'h-12' }
}

const variantMap: Record<LogoVariant, string> = {
  primary: 'text-[color:var(--text-primary)]',
  secondary: 'text-[color:var(--text-secondary)]'
}

/**
 * Logo atom
 * Renders the Andromeda logo as a PNG image from `/assets/logo_t.png`.
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'primary',
  label = 'Andromeda',
  showLabel = false,
  className = ''
}) => {
  const { height, className: sizeClassName } = sizeMap[size]
  const imgClasses = [sizeClassName, variantMap[variant], 'w-auto'].join(' ')
  const wrapper = ['inline-flex items-center gap-2', className].filter(Boolean).join(' ')
  const ariaLabel = label

  return (
    <span className={wrapper} data-size={size} data-variant={variant}>
      <Image
        src="/assets/logo_t.png"
        alt={ariaLabel}
        width={0}
        height={height}
        className={imgClasses}
        style={{ width: 'auto' }}
        priority
      />
      {label !== '' && (showLabel ? <span className="text-secondary text-xs">{label}</span> : <span className="sr-only">{label}</span>)}
    </span>
  )
}

export default Logo
