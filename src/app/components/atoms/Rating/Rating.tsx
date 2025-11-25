import React from 'react'

type RatingSize = 'sm' | 'md' | 'lg'
type RatingVariant = 'primary' | 'secondary'

export interface RatingProps {
  value: number
  max?: number
  size?: RatingSize
  variant?: RatingVariant
  label?: string
  showLabel?: boolean
  className?: string
}

const sizeMap: Record<RatingSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

const gapMap: Record<RatingSize, string> = {
  sm: 'gap-1',
  md: 'gap-1.5',
  lg: 'gap-2',
}

const variantMap: Record<RatingVariant, string> = {
  primary: 'text-[var(--link-color)]',
  secondary: 'text-[var(--text-secondary)]',
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function Star({ filled, size, variant }: { filled: boolean; size: RatingSize; variant: RatingVariant }) {
  const base = `${sizeMap[size]} inline-block` // keep layout consistent
  const color = variantMap[variant]
  const fill = filled ? 'currentColor' : 'none'
  const stroke = 'currentColor'
  return (
    <svg aria-hidden="true" className={`${base} ${color}`} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  )
}

export function Rating({
  value,
  max = 5,
  size = 'md',
  variant = 'primary',
  label = 'Rating',
  showLabel = false,
  className = '',
}: RatingProps) {
  const safeMax = Math.max(1, Math.floor(max))
  const safeValue = clamp(Math.floor(value), 0, safeMax)
  const stars = Array.from({ length: safeMax }, (_, i) => i < safeValue)

  const containerClasses = `flex items-center ${gapMap[size]} ${className}`
  const ariaLabel = `${label}: ${safeValue} of ${safeMax}`

  return (
    <div role="img" aria-label={ariaLabel} className={containerClasses}>
      {stars.map((filled, idx) => (
        <Star key={idx} filled={filled} size={size} variant={variant} />
      ))}
      {showLabel ? <span className="ml-2 text-sm text-[var(--text-secondary)]">{ariaLabel}</span> : <span className="sr-only">{ariaLabel}</span>}
    </div>
  )
}

export default Rating
