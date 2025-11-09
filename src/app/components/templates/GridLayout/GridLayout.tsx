'use client';

import React from 'react';
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
 * Mapping object for grid column classes to ensure Tailwind JIT compiler
 * can detect and generate the necessary CSS classes at build time
 */
const gridColsMap: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
};

const mdGridColsMap: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  7: 'md:grid-cols-7',
  8: 'md:grid-cols-8',
  9: 'md:grid-cols-9',
  10: 'md:grid-cols-10',
  11: 'md:grid-cols-11',
  12: 'md:grid-cols-12',
};

const lgGridColsMap: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  7: 'lg:grid-cols-7',
  8: 'lg:grid-cols-8',
  9: 'lg:grid-cols-9',
  10: 'lg:grid-cols-10',
  11: 'lg:grid-cols-11',
  12: 'lg:grid-cols-12',
};

const xlGridColsMap: Record<number, string> = {
  1: 'xl:grid-cols-1',
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
  6: 'xl:grid-cols-6',
  7: 'xl:grid-cols-7',
  8: 'xl:grid-cols-8',
  9: 'xl:grid-cols-9',
  10: 'xl:grid-cols-10',
  11: 'xl:grid-cols-11',
  12: 'xl:grid-cols-12',
};

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
  const smCols = cols.sm || 1;
  const mdCols = cols.md || 2;
  const lgCols = cols.lg || 3;
  const xlCols = cols.xl || 4;

  const gridClasses = [
    gridColsMap[smCols],
    mdGridColsMap[mdCols],
    lgGridColsMap[lgCols],
    xlGridColsMap[xlCols],
  ].filter(Boolean).join(' ');
  
  return (
    <div className={`grid ${gridClasses} gap-6 animate-fade-in`}>
      {children}
    </div>
  );
}

export default GridLayout;