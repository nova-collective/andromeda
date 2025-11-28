import React from 'react'

export type MenuItemVariant = 'default' | 'danger'
export type MenuItemTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'
export type MenuItemSize = 'sm' | 'md'

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  description?: string
  icon?: React.ReactNode
  shortcut?: string
  active?: boolean
  disabled?: boolean
  variant?: MenuItemVariant
  tone?: MenuItemTone
  size?: MenuItemSize
  textVariant?: 'primary' | 'secondary'
}

const sizeMap: Record<MenuItemSize, string> = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-3 py-2 text-sm',
}

const base = 'w-full inline-flex items-center justify-between gap-3 rounded-md text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--link-color)] focus-visible:ring-offset-1 focus-visible:ring-offset-[color:var(--bg-primary)]'

const toneMap: Record<MenuItemTone, string> = {
  neutral: 'text-textBase hover:bg-surfaceAlt data-[active=true]:bg-surfaceAlt',
  info: 'text-blue-700 dark:text-blue-300 hover:bg-blue-600/10 data-[active=true]:bg-blue-600/10',
  success: 'text-green-700 dark:text-green-300 hover:bg-green-600/10 data-[active=true]:bg-green-600/10',
  warning: 'text-amber-700 dark:text-amber-300 hover:bg-amber-500/15 data-[active=true]:bg-amber-500/15',
  danger: 'text-red-700 dark:text-red-300 hover:bg-red-600/10 data-[active=true]:bg-red-600/10',
}

const variantMap: Record<MenuItemVariant, string> = {
  default: '',
  danger: 'text-red-600 dark:text-red-300 hover:bg-red-600/10 data-[active=true]:bg-red-600/15',
}

export const MenuItem: React.FC<MenuItemProps> = ({
  label,
  description,
  icon,
  shortcut,
  active = false,
  disabled = false,
  variant = 'default',
  tone = 'neutral',
  size = 'md',
  textVariant = 'primary',
  className = '',
  ...rest
}) => {
  const toneClasses = toneMap[tone]
  const variantClasses = variantMap[variant]
  const sizeClasses = sizeMap[size]

  const textVariantClasses =
    tone === 'neutral'
      ? textVariant === 'primary'
        ? 'text-primary'
        : 'text-secondary'
      : ''

  const classes = [
    base,
    sizeClasses,
    toneClasses,
    variantClasses,
    textVariantClasses,
    disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classes}
      data-active={active ? 'true' : 'false'}
      disabled={disabled}
      {...rest}
    >
      <span className="flex items-center gap-2 min-w-0">
        {icon ? <span className="shrink-0" aria-hidden>{icon}</span> : null}
        <span className="flex flex-col min-w-0">
          <span className="truncate">{label}</span>
          {description ? (
            <span className="text-[0.7rem] text-secondary truncate">
              {description}
            </span>
          ) : null}
        </span>
      </span>
      {shortcut ? (
        <span className="ml-3 text-[0.7rem] text-secondary font-mono">
          {shortcut}
        </span>
      ) : null}
    </button>
  )
}

export default MenuItem
