import React from 'react'

import NextLink from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  if (!items || items.length === 0) return null

  const lastIndex = items.length - 1

  return (
    <nav aria-label="Breadcrumb" className={['flex items-center text-xs text-[color:var(--text-secondary)]', className].filter(Boolean).join(' ')}>
      <ol className="inline-flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === lastIndex
          const content = item.href && !isLast ? (
            <NextLink
              href={item.href}
              className="hover:text-[color:var(--text-primary)] transition-colors cursor-pointer"
            >
              {item.label}
            </NextLink>
          ) : (
            <span
              aria-current={isLast ? 'page' : undefined}
              className={isLast ? 'text-[color:var(--text-primary)] font-medium' : ''}
            >
              {item.label}
            </span>
          )

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
              {index > 0 && (
                <span aria-hidden className="text-[color:var(--text-secondary)] opacity-70 px-0.5">
                  /
                </span>
              )}
              {content}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
