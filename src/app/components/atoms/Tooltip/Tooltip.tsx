'use client'
import React, { useState, useId } from 'react'

export type TooltipPlacement = 'top' | 'bottom'
export type TooltipVariant = 'primary' | 'secondary'

export interface TooltipProps {
  label: string
  children: React.ReactElement
  placement?: TooltipPlacement
  variant?: TooltipVariant
}

export const Tooltip: React.FC<TooltipProps> = ({
  label,
  children,
  placement = 'top',
  variant = 'primary',
}) => {
  const [open, setOpen] = useState(false)
  const id = useId()

  const triggerProps = {
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
    'aria-describedby': open ? id : undefined,
  }

  const trigger = React.cloneElement(children, triggerProps)

  const base = 'pointer-events-none absolute z-20 whitespace-nowrap rounded-md px-2 py-1 text-[0.7rem] shadow-md border'
  const variantClasses =
    variant === 'primary'
      ? 'bg-surfaceAlt text-primary border-color'
      : 'bg-surface text-secondary border-color/60'

  const placementClasses =
    placement === 'top'
      ? 'bottom-full mb-1 left-1/2 -translate-x-1/2'
      : 'top-full mt-1 left-1/2 -translate-x-1/2'

  return (
    <span className="relative inline-flex">
      {trigger}
      {open && (
        <span
          role="tooltip"
          id={id}
          className={[base, variantClasses, placementClasses].join(' ')}
          data-variant={variant}
          data-placement={placement}
        >
          {label}
        </span>
      )}
    </span>
  )
}

export default Tooltip
