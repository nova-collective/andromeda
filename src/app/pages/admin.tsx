import React from 'react';

import WithAuth from '../components/WithAuth';
import { type User } from '../lib/types';

/**
 * Admin dashboard page.
 *
 * This page is protected by the `withAuth` HOC and will redirect users who
 * are not authenticated or who lack membership in the `admin` group.
 *
 * The wrapped component receives a `user` prop injected by the HOC.
 */
function AdminPage({ user }: { user: User }) {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.username} (Admin)</p>
    </div>
  );
}

export default WithAuth(AdminPage, { requiredGroups: ['admin'] });