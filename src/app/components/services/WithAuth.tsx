'use client';
import React, { type ComponentType, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { type User } from '@/app/lib/types';

/**
 * Props injected into a component wrapped with `withAuth`
 */
interface WithAuthProps {
  /** Currently authenticated user (guaranteed when component renders) */
  user: User;
}

/**
 * Configuration options for the `withAuth` HOC
 */
interface WithAuthOptions {
  /** 
   * Array of group names that the user must belong to.
   * If provided, users not in any of these groups will be redirected to `/unauthorized`.
   * If omitted or empty, only authentication is required.
   */
  requiredGroups?: string[];
}

/**
 * WithAuth - Higher Order Component (HOC)
 * 
 * Protects pages and components by ensuring they are only rendered for authenticated users.
 * Optionally enforces group-based authorization by checking user membership in required groups.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic authentication (any authenticated user)
 * import withAuth from '@/components/services/WithAuth';
 * 
 * function ProfilePage({ user }: { user: User }) {
 *   return <div>Welcome, {user.username}</div>;
 * }
 * 
 * export default withAuth(ProfilePage);
 * ```
 * 
 * @example
 * ```tsx
 * // With group authorization (admin only)
 * import withAuth from '@/components/services/WithAuth';
 * 
 * function AdminPanel({ user }: { user: User }) {
 *   return <div>Admin Panel - {user.username}</div>;
 * }
 * 
 * export default withAuth(AdminPanel, { requiredGroups: ['admin'] });
 * ```
 * 
 * @example
 * ```tsx
 * // Multiple allowed groups (admin or moderator)
 * export default withAuth(ModerationPage, { 
 *   requiredGroups: ['admin', 'moderator'] 
 * });
 * ```
 * 
 * Features:
 * - Automatic authentication verification via `/api/auth/me`
 * - Group-based authorization with flexible configuration
 * - Redirects unauthenticated users to `/login`
 * - Redirects unauthorized users to `/unauthorized`
 * - Loading state during authentication check
 * - Type-safe user prop injection
 * 
 * @template P - Props type of the wrapped component
 * @param WrappedComponent - Component to protect. Will receive injected `user` prop
 * @param options - Configuration options for authentication and authorization
 * @param options.requiredGroups - Optional array of group names for authorization
 * @returns Protected component that only renders for authenticated (and authorized) users
 */
export default function WithAuth<P extends object>(
  WrappedComponent: ComponentType<P & WithAuthProps>,
  options: WithAuthOptions = {}
) {
  /**
   * Authenticated Component Wrapper
   * 
   * Handles authentication state, loading states, and conditional rendering
   * based on authentication and authorization status.
   */
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
      void checkAuth();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Verifies user authentication and authorization
     * 
     * Calls `/api/auth/me` to fetch current user data. Handles three scenarios:
     * 1. User not authenticated → redirect to `/login`
     * 2. User authenticated but lacks required groups → redirect to `/unauthorized`
     * 3. User authenticated and authorized → proceed to render wrapped component
     * 
     * @async
     * @returns Promise that resolves when authentication check is complete
     */
    const checkAuth = async (): Promise<void> => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = (await response.json()) as { user?: User };
          if (data.user) {
            setUser(data.user);

            // Check group membership if requiredGroups is specified
            if (options.requiredGroups && options.requiredGroups.length > 0) {
              const userGroups = Array.isArray(data.user.groups) ? data.user.groups : [];
              const hasRequiredGroup = options.requiredGroups.some((group) =>
                userGroups.includes(group)
              );

              if (!hasRequiredGroup) {
                void router.push('/unauthorized');
                return;
              }
            }
          }
        } else {
          void router.push('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        void router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    // Show loading state while checking authentication
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      );
    }

    // Don't render anything if user is not authenticated (redirect in progress)
    if (!user) {
      return null;
    }

    // Render wrapped component with injected user prop
    return <WrappedComponent {...props} user={user} />;
  };
}