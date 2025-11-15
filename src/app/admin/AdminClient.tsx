"use client";
import React from 'react';

import { Heading, Paragraph } from '@/app/components';
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
        <Heading level={1} className="text-3xl font-bold text-textBase">Admin Dashboard</Heading>
        <Paragraph muted>Welcome, {user.username} (Admin)</Paragraph>
      </div>
    </main>
  );
}

export default WithAuth(AdminView, { requiredGroups: ['admin'] });
