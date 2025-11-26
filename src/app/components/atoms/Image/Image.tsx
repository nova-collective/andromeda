import React from 'react'

export type ImageSize = 'sm' | 'md' | 'lg'
export type ImageVariant = 'primary' | 'secondary'

export interface ImageProps {
  src: string
  alt: string
  size?: ImageSize
  variant?: ImageVariant
  rounded?: boolean
  fit?: 'cover' | 'contain'
  label?: string
  showLabel?: boolean
  className?: string
}

const sizeMap: Record<ImageSize, string> = {
  sm: 'h-24 w-24',
  md: 'h-40 w-40',
  lg: 'h-64 w-64',
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  size = 'md',
  variant = 'primary',
  rounded = true,
  fit = 'cover',
  label = 'Image',
  showLabel = false,
  className = '',
}) => {
  const wrapper = 'inline-flex flex-col items-start gap-2'
  const variantScope = `text-${variant}`
  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover'
  const frame = [
    'bg-surface border border-color overflow-hidden',
    rounded ? 'rounded-lg' : 'rounded-none',
    sizeMap[size],
    fitClass,
  ].join(' ')

  return (
    <div className={[wrapper, variantScope, className].filter(Boolean).join(' ')}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={frame} data-testid="image" />
      {label !== '' && (showLabel ? (
        <span className="text-secondary text-xs">{label}</span>
      ) : (
        <span className="sr-only">{label}</span>
      ))}
    </div>
  )
}

export default Image
