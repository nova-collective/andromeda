import React from 'react'

export type BadgeVariant = 'solid' | 'soft' | 'outline'
export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  tone?: BadgeTone
  size?: BadgeSize
  pill?: boolean
  className?: string
  textVariant?: 'primary' | 'secondary'
  textVariant?: 'primary' | 'secondary'
}

const sizeMap: Record<BadgeSize, string> = {
  sm: 'text-[0.65rem] px-2 py-0.5',
  md: 'text-xs px-2.5 py-0.5',
}

const base = 'inline-flex items-center gap-1 font-medium rounded border border-transparent align-middle'

const toneMap: Record<BadgeTone, { solid: string; soft: string; outline: string }> = {
  neutral: {
    solid: 'bg-surfaceAlt text-textBase border-color ',
    soft: 'bg-surface text-textBase border-color/50',
    outline: 'text-textBase border-color',
  },
  info: {
    solid: 'bg-blue-600 text-white dark:bg-blue-500 dark:text-black border-blue-700/60 dark:border-blue-400/60',
    soft: 'bg-blue-600/10 text-blue-700 dark:text-blue-300 border-blue-600/20',
    outline: 'text-blue-700 dark:text-blue-300 border-blue-600',
  },
  success: {
    solid: 'bg-green-600 text-white dark:bg-green-500 dark:text-black border-green-700/60 dark:border-green-400/60',
    soft: 'bg-green-600/10 text-green-700 dark:text-green-300 border-green-600/20',
    outline: 'text-green-700 dark:text-green-300 border-green-600',
  },
  warning: {
    solid: 'bg-amber-500 text-black dark:bg-amber-400 dark:text-black border-amber-600/60 dark:border-amber-300/60',
    soft: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25',
    outline: 'text-amber-700 dark:text-amber-300 border-amber-500',
  },
  danger: {
    solid: 'bg-red-600 text-white dark:bg-red-500 dark:text-black border-red-700/60 dark:border-red-400/60',
    soft: 'bg-red-600/10 text-red-700 dark:text-red-300 border-red-600/20',
    outline: 'text-red-700 dark:text-red-300 border-red-600',
  },
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'soft',
  tone = 'neutral',
  size = 'md',
  pill = false,
  className = '',
  textVariant = 'primary',
}) => {
  const toneClasses = toneMap[tone][variant]
  const classes = [
    base,
    sizeMap[size],
    toneClasses,
    pill ? 'rounded-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={`${classes} ${textVariant === 'primary' ? 'text-primary' : 'text-secondary'}`} data-variant={variant} data-tone={tone} data-size={size}>
      {children}
    </span>
  )
}

export default Badge
