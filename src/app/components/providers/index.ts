/**
 * Providers Barrel Export
 * 
 * Providers are React Context providers that manage application-wide state,
 * configuration, and cross-cutting concerns. They wrap the application (or parts of it)
 * to provide shared functionality to all child components.
 * 
 * Examples: ThemeProvider, AuthProvider, I18nProvider, QueryClientProvider
 * 
 * Characteristics:
 * - Provide global state and functionality
 * - Use React Context API
 * - Wrap application or features
 * - Include custom hooks for consumption
 * - Handle cross-cutting concerns
 * 
 * @example
 * ```tsx
 * // Import providers
 * import { ThemeProvider, useTheme } from '@/app/components/providers';
 * 
 * // Wrap your application
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

// Theme Provider
export { ThemeProvider, useTheme } from './ThemeProvider';
