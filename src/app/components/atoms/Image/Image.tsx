import React from 'react'

import NextImage from 'next/image'

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

const sizeMap: Record<ImageSize, { className: string; width: number; height: number }> = {
  sm: { className: 'h-24 w-24', width: 96, height: 96 },
  md: { className: 'h-40 w-40', width: 160, height: 160 },
  lg: { className: 'h-64 w-64', width: 256, height: 256 },
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
  const sizeConfig = sizeMap[size]
  const frame = [
    'bg-surface border border-color overflow-hidden',
    rounded ? 'rounded-lg' : 'rounded-none',
    sizeConfig.className,
    fitClass,
  ].join(' ')

  return (
    <div className={[wrapper, variantScope, className].filter(Boolean).join(' ')}>
      <NextImage
        src={src}
        alt={alt}
        width={sizeConfig.width}
        height={sizeConfig.height}
        className={frame}
        data-testid="image"
      />
      {label !== '' && (showLabel ? (
        <span className="text-secondary text-xs">{label}</span>
      ) : (
        <span className="sr-only">{label}</span>
      ))}
    </div>
  )
}

export default Image
