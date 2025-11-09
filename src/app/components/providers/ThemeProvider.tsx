'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize theme state with SSR-safe lazy initialization
  const [theme, setThemeState] = useState<Theme>(() => {
    // SSR-safe: default to light theme on server
    if (typeof window === 'undefined') return 'light';
    
    // Client-side: get from localStorage or system preference
    // eslint-disable-next-line no-undef
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) return storedTheme;
    
    // Check if matchMedia is available (not available in test environments)
    // eslint-disable-next-line no-undef
    if (typeof window.matchMedia === 'function') {
      // eslint-disable-next-line no-undef
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      return systemTheme;
    }
    
    return 'light';
  });
  
  // Use ref to track if component is mounted (avoids setState in effect warning)
  const mountedRef = useRef(false);

  // Apply theme class whenever theme changes
  useEffect(() => {
    mountedRef.current = true;
    
    if (typeof document !== 'undefined') {
      // eslint-disable-next-line no-undef
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-undef
      localStorage.setItem('theme', newTheme);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}