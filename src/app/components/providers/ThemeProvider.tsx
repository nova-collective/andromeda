'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

/** Supported theme modes */
type Theme = 'light' | 'dark';

/**
 * Context value shape for theme management
 */
interface ThemeContextType {
  /** Current active theme */
  theme: Theme;
  /** Toggle between light and dark themes */
  toggleTheme: () => void;
  /** Set a specific theme */
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider Component
 * 
 * Provides theme management functionality throughout the application.
 * Handles light/dark mode switching with persistence to localStorage
 * and respects system preferences. Safe for SSR environments.
 * 
 * @component
 * @example
 * ```tsx
 * // Wrap your app with ThemeProvider
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 * 
 * Features:
 * - SSR-safe initialization
 * - Persists theme preference to localStorage
 * - Respects system color scheme preference
 * - Applies theme class to document root
 * - Safe for test environments
 * 
 * @param props - Component props
 * @param props.children - Child components to wrap with theme context
 * @returns Theme context provider wrapping children
 */
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

  /**
   * Sets a specific theme and persists to localStorage
   * @param newTheme - The theme to apply ('light' or 'dark')
   */
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-undef
      localStorage.setItem('theme', newTheme);
    }
  };

  /**
   * Toggles between light and dark themes
   */
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 * 
 * Custom hook to access theme context values and methods.
 * Must be used within a ThemeProvider component.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, toggleTheme, setTheme } = useTheme();
 *   
 *   return (
 *     <button onClick={toggleTheme}>
 *       Current theme: {theme}
 *     </button>
 *   );
 * }
 * ```
 * 
 * @throws {Error} If used outside of ThemeProvider
 * @returns Theme context containing current theme and methods to update it
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}