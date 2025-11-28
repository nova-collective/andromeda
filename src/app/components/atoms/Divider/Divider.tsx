import React from 'react'

export type DividerOrientation = 'horizontal' | 'vertical'
export type DividerVariant = 'primary' | 'secondary' | 'subtle'
export type DividerWeight = 'thin' | 'normal' | 'bold'
export type DividerLabelAlign = 'start' | 'center' | 'end'

export interface DividerProps {
  orientation?: DividerOrientation
  variant?: DividerVariant
  weight?: DividerWeight
  label?: string
  align?: DividerLabelAlign
  className?: string
}

const orientationMap: Record<DividerOrientation, string> = {
  horizontal: 'w-full h-px',
  vertical: 'h-full w-px',
}

const variantMap: Record<DividerVariant, string> = {
  primary: 'bg-[color:var(--border-color)]',
  secondary: 'bg-[color:var(--border-strong)]',
  subtle: 'bg-[color:var(--border-soft)]',
}

const weightMap: Record<DividerWeight, string> = {
  thin: 'opacity-70',
  normal: 'opacity-100',
  bold: 'opacity-100 shadow-[0_0_0_1px_rgba(0,0,0,0.1)]',
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'primary',
  weight = 'normal',
  label,
  align = 'center',
  className = '',
}) => {
  const base = 'flex items-center gap-3 text-xs text-[color:var(--text-secondary)]'
  const line = [
    'shrink-0 rounded-full',
    orientationMap[orientation],
    variantMap[variant],
    weightMap[weight],
  ].join(' ')

  if (!label) {
    return <div className={[orientation === 'horizontal' ? 'w-full' : 'h-full', line, className].filter(Boolean).join(' ')} role="separator" aria-orientation={orientation} />
  }

  const before = ['flex-1', line].join(' ')
  const after = ['flex-1', line].join(' ')

  const content = (
    <span className="px-2 tracking-wide uppercase text-[0.65rem] text-[color:var(--text-secondary)]">
      {label}
    </span>
  )

  return (
    <div
      className={[base, orientation === 'horizontal' ? 'w-full' : 'h-full flex-col', className]
        .filter(Boolean)
        .join(' ')}
      role="separator"
      aria-orientation={orientation}
      aria-label={label}
    >
      {(align === 'center' || align === 'end') && <div className={before} />}
      {content}
      {(align === 'center' || align === 'start') && <div className={after} />}
    </div>
  )
}

export default Divider
