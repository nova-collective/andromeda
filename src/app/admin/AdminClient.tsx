"use client";
import React from 'react';

import { WithAuth } from '@/app/components/services';
import { type User } from '@/app/lib/types';

/**
 * Client component wrapper for the Admin dashboard.
 * Applies the WithAuth HOC on the client to avoid SSR/router issues.
 */
function AdminView({ user }: { user: User }) {
  return (
    <main className="min-h-screen bg-surfaceAlt px-gutter py-section">
      <div className="max-w-4xl mx-auto space-y-component">
        <h1 className="text-3xl font-bold text-textBase">Admin Dashboard</h1>
        <p className="text-textMuted">Welcome, {user.username} (Admin)</p>
      </div>
    </main>
  );
}

export default WithAuth(AdminView, { requiredGroups: ['admin'] });
