import React, { type ComponentType, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { type User } from '@/app/lib/types';

/**
 * Props injected into a component wrapped with `withAuth`.
 */
interface WithAuthProps {
  /** Currently authenticated user (guaranteed when component renders) */
  user: User;
}

/**
 * Options for the `withAuth` HOC.
 * - `requiredGroups`: when provided the HOC will redirect users who are not
 *   members of any of the listed groups to `/unauthorized`.
 */
interface WithAuthOptions {
  requiredGroups?: string[];
}

/**
 * Higher-order component that ensures a page or component is rendered only for
 * authenticated users. It fetches the current user from `/api/auth/me` and
 * optionally enforces group membership.
 *
 * Usage:
 * ```tsx
 * export default withAuth(MyComponent, { requiredGroups: ['admin'] });
 * ```
 *
 * The wrapped component receives an additional `user` prop containing the
 * authenticated user's data.
 *
 * @param WrappedComponent - Component to wrap. It will receive the injected `user` prop.
 * @param options - Optional behavior flags (e.g. requiredGroups).
 */
export default function WithAuth<P extends object>(
  WrappedComponent: ComponentType<P & WithAuthProps>,
  options: WithAuthOptions = {}
) {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
      checkAuth();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Check authentication by calling the `/api/auth/me` endpoint. On success
     * the user is stored in state; on failure the user is redirected to
     * `/login`. If `options.requiredGroups` is specified users lacking the
     * required membership are redirected to `/unauthorized`.
     */
    const checkAuth = async (): Promise<void> => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);

          if (options.requiredGroups && options.requiredGroups.length > 0) {
            const userGroups = data.user.groups || [];
            const hasRequiredGroup = options.requiredGroups.some((group) =>
              userGroups.includes(group)
            );

            if (!hasRequiredGroup) {
              router.push('/unauthorized');
              return;
            }
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      );
    }

    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} user={user} />;
  };
}

/**
 * 
 * How to use: 
 * 
 * 1. pages under authentication: see admin page
 * 
 * 2. basic page protection:
 * 
 *  // pages/profile.tsx
    import withAuth from '../components/withAuth';

    function ProfilePage({ user }) {
      // Qualsiasi utente autenticato può vedere questa pagina
      return (
        <div>
          <h1>User Profile</h1>
          <p>Welcome, {user.username}</p>
        </div>
      );
    }

    export default withAuth(ProfilePage);
 * 
 */