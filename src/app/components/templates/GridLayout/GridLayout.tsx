'use client';

import React from 'react'
import type { ReactNode } from 'react';

/**
 * Props for the GridLayout component
 */
export interface GridLayoutProps {
  /** Child elements to be rendered within the grid */
  children: ReactNode;
  /** Responsive grid column configuration for different breakpoints */
  cols?: {
    /** Number of columns on small screens (mobile) */
    sm?: number;
    /** Number of columns on medium screens (tablet) */
    md?: number;
    /** Number of columns on large screens (desktop) */
    lg?: number;
    /** Number of columns on extra large screens (wide desktop) */
    xl?: number;
  };
}

/**
 * GridLayout Component
 * 
 * A responsive grid layout container that automatically adjusts the number of columns
 * based on screen size. Ideal for displaying card-based content like NFTs, products, or articles.
 * 
 * @component
 * @example
 * ```tsx
 * // Default responsive grid (1/2/3/4 columns)
 * <GridLayout>
 *   <Card {...item1} />
 *   <Card {...item2} />
 *   <Card {...item3} />
 * </GridLayout>
 * 
 * // Custom column configuration
 * <GridLayout cols={{ sm: 1, md: 2, lg: 4, xl: 6 }}>
 *   <Card {...item1} />
 *   <Card {...item2} />
 * </GridLayout>
 * ```
 * 
 * @param props - Component props
 * @param props.children - Child elements to render in the grid
 * @param props.cols - Responsive column configuration (defaults to 1/2/3/4 for sm/md/lg/xl)
 * @returns A responsive grid container with fade-in animation
 */
export function GridLayout({ 
  children, 
  cols = { sm: 1, md: 2, lg: 3, xl: 4 } 
}: GridLayoutProps) {
  const gridCols = `grid-cols-${cols.sm || 1} md:grid-cols-${cols.md || 2} lg:grid-cols-${cols.lg || 3} xl:grid-cols-${cols.xl || 4}`;
  
  return (
    <div className={`grid ${gridCols} gap-6 animate-fade-in`}>
      {children}
    </div>
  );
}

export default GridLayout;