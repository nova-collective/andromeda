/**
 * Services Component Barrel Export
 * 
 * Services are utility components that provide cross-cutting functionality
 * such as authentication, authorization, data fetching wrappers, error boundaries,
 * and other application-wide behaviors. They are typically implemented as
 * Higher-Order Components (HOCs), render props, or custom hooks.
 * 
 * Examples: WithAuth, ErrorBoundary, DataProvider, AnalyticsTracker
 * 
 * Characteristics:
 * - Provide reusable functionality across the application
 * - Often wrap other components (HOCs)
 * - Handle cross-cutting concerns (auth, logging, error handling)
 * - May not render UI directly
 * - Enable separation of concerns
 * - Enhance components with additional capabilities
 * 
 * @example
 * ```tsx
 * // Import authentication service
 * import { WithAuth } from '@/app/components/services';
 * 
 * // Protect a page component
 * function AdminPage({ user }) {
 *   return <div>Admin: {user.username}</div>;
 * }
 * 
 * export default WithAuth(AdminPage, { requiredGroups: ['admin'] });
 * ```
 * 
 * @example
 * ```tsx
 * // Multiple services can be composed
 * import { WithAuth, WithErrorBoundary } from '@/app/components/services';
 * 
 * const ProtectedPage = WithAuth(
 *   WithErrorBoundary(MyComponent)
 * );
 * ```
 */

// Authentication & Authorization Service
export { WithAuth, default as WithAuthDefault } from './WithAuth';
