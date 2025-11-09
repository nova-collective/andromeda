/**
 * WithAuth HOC Barrel Export
 * 
 * Exports the authentication and authorization Higher-Order Component (HOC)
 * for protecting pages and components. Ensures only authenticated users with
 * proper group permissions can access wrapped components.
 * 
 * @example
 * ```tsx
 * // Basic authentication protection
 * import WithAuth from '@/app/components/services/WithAuth';
 * 
 * function ProfilePage({ user }) {
 *   return <div>Welcome, {user.username}</div>;
 * }
 * 
 * export default WithAuth(ProfilePage);
 * ```
 * 
 * @example
 * ```tsx
 * // With group-based authorization
 * import WithAuth from '@/app/components/services/WithAuth';
 * 
 * const AdminPage = WithAuth(AdminPanel, { requiredGroups: ['admin'] });
 * export default AdminPage;
 * ```
 */

export { default as WithAuth } from './WithAuth';
export { default } from './WithAuth';
