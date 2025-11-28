import React from 'react'

export type ChipVariant = 'solid' | 'soft' | 'outline'
export type ChipTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'
export type ChipSize = 'sm' | 'md'

export interface ChipProps {
  label: string
  variant?: ChipVariant
  tone?: ChipTone
  size?: ChipSize
  pill?: boolean
  leadingIcon?: React.ReactNode
  onRemove?: () => void
  className?: string
  textVariant?: 'primary' | 'secondary'
}

const sizeMap: Record<ChipSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
}

const base = 'inline-flex items-center gap-1 font-medium rounded border border-transparent align-middle'

const toneMap: Record<ChipTone, { solid: string; soft: string; outline: string }> = {
  neutral: {
    solid: 'bg-surfaceAlt text-textBase border-color',
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

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'soft',
  tone = 'neutral',
  size = 'md',
  pill = true,
  leadingIcon,
  onRemove,
  className = '',
  textVariant = 'primary',
}) => {
  const toneClasses = toneMap[tone][variant]
  const classes = [
    base,
    sizeMap[size],
    toneClasses,
    pill ? 'rounded-full' : 'rounded-md',
    onRemove ? 'pr-2' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={`${classes} ${textVariant === 'primary' ? 'text-primary' : 'text-secondary'}`} data-variant={variant} data-tone={tone} data-size={size}>
      {leadingIcon ? <span aria-hidden className="inline-flex items-center">{leadingIcon}</span> : null}
      <span>{label}</span>
      {onRemove ? (
        <button
          type="button"
          aria-label={`Remove ${label}`}
          onClick={onRemove}
          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-black/10 text-[0.65rem] hover:bg-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--link-color)]"
        >
          ×
        </button>
      ) : null}
    </span>
  )
}

export default Chip
