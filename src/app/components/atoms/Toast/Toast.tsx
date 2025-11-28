import React from 'react'

export type ToastTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'
export type ToastVariant = 'solid' | 'soft'
export type ToastSize = 'sm' | 'md'

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  tone?: ToastTone
  variant?: ToastVariant
  size?: ToastSize
  icon?: React.ReactNode
  onDismiss?: () => void
  dismissLabel?: string
}

const sizeMap: Record<ToastSize, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-3 text-sm',
}

const base = 'relative w-full rounded-lg border flex items-start gap-3 shadow-sm bg-surface text-textBase'

const toneMap: Record<ToastTone, { solid: string; soft: string }> = {
  neutral: {
    solid: 'bg-surfaceAlt border-color',
    soft: 'bg-surface border-color/60',
  },
  info: {
    solid: 'bg-blue-600 text-white dark:bg-blue-500 dark:text-black border-blue-700/60 dark:border-blue-400/60',
    soft: 'bg-blue-600/10 text-blue-700 dark:text-blue-300 border-blue-600/30',
  },
  success: {
    solid: 'bg-green-600 text-white dark:bg-green-500 dark:text-black border-green-700/60 dark:border-green-400/60',
    soft: 'bg-green-600/10 text-green-700 dark:text-green-300 border-green-600/30',
  },
  warning: {
    solid: 'bg-amber-500 text-black dark:bg-amber-400 dark:text-black border-amber-600/60 dark:border-amber-300/60',
    soft: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  danger: {
    solid: 'bg-red-600 text-white dark:bg-red-500 dark:text-black border-red-700/60 dark:border-red-400/60',
    soft: 'bg-red-600/10 text-red-700 dark:text-red-300 border-red-600/30',
  },
}

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  icon,
  onDismiss,
  dismissLabel = 'Dismiss notification',
  className = '',
  ...rest
}) => {
  const toneClasses = toneMap[tone][variant]
  const sizeClasses = sizeMap[size]

  const classes = [
    base,
    sizeClasses,
    toneClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const hasTitle = Boolean(title)
  const hasDescription = Boolean(description)

  return (
    <div
      role="status"
      aria-live={tone === 'danger' || tone === 'warning' ? 'assertive' : 'polite'}
      className={classes}
      data-tone={tone}
      data-variant={variant}
      data-size={size}
      {...rest}
    >
      {icon ? (
        <span className="mt-0.5 shrink-0" aria-hidden>
          {icon}
        </span>
      ) : null}
      <div className="flex-1 min-w-0 space-y-0.5">
        {hasTitle ? (
          <div className="font-medium truncate">{title}</div>
        ) : null}
        {hasDescription ? (
          <div className="text-xs text-secondary leading-snug break-words">
            {description}
          </div>
        ) : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-2 shrink-0 rounded-md p-1 text-secondary hover:text-textBase hover:bg-surfaceAlt focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--link-color)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color:var(--bg-primary)]"
          aria-label={dismissLabel}
        >
          <span aria-hidden>×</span>
        </button>
      ) : null}
    </div>
  )
}

export default Toast
