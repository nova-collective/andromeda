/**
 * ThemeProvider Barrel Export
 * 
 * Exports the theme management provider and custom hook for application-wide
 * theme control. Provides light/dark mode switching with persistence.
 * 
 * @example
 * ```tsx
 * // Import provider and hook
 * import { ThemeProvider, useTheme } from '@/app/components/providers/ThemeProvider';
 * 
 * // Wrap your app
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * 
 * // Use in components
 * function MyComponent() {
 *   const { theme, toggleTheme } = useTheme();
 *   return <button onClick={toggleTheme}>{theme}</button>;
 * }
 * ```
 */

export { ThemeProvider, useTheme } from './ThemeProvider';