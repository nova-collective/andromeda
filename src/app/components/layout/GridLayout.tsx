'use client';

import React from 'react'
import type { ReactNode } from 'react';

interface GridLayoutProps {
  children: ReactNode;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export default function GridLayout({ 
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