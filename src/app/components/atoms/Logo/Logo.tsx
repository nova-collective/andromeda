import React from 'react'

export type LogoSize = 'sm' | 'md' | 'lg'
export type LogoVariant = 'primary' | 'secondary'

export interface LogoProps {
  size?: LogoSize
  variant?: LogoVariant
  label?: string
  showLabel?: boolean
  className?: string
}

const sizeMap: Record<LogoSize, string> = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-12'
}

/**
 * Logo atom
 * Renders the Andromeda logo image from `/assets/logo.png`.
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'primary',
  label = 'Andromeda',
  showLabel = false,
  className = ''
}) => {
  const imgClasses = [sizeMap[size], 'w-auto'].join(' ')
  const wrapper = ['inline-flex items-center gap-2', className].filter(Boolean).join(' ')
  const ariaLabel = label

  return (
    <span className={wrapper} data-size={size} data-variant={variant}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logo_t.png"
        alt={ariaLabel}
        className={imgClasses}
      />
      {label !== '' && (showLabel ? <span className="text-secondary text-xs">{label}</span> : <span className="sr-only">{label}</span>)}
    </span>
  )
}

export default Logo
