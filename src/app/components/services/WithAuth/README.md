# 🔐 WithAuth - Authentication & Authorization HOC

A powerful Higher-Order Component (HOC) that protects pages and components by enforcing authentication and optional group-based authorization. Automatically handles redirects for unauthenticated and unauthorized users.

## 📋 Overview

**Type:** Higher-Order Component (HOC)  
**Category:** Authentication Service  
**Complexity:** Medium  
**SSR Compatible:** ⚠️ Client-side only ('use client')

The WithAuth HOC is a service component that:
- Wraps components to require authentication
- Verifies user authentication via API
- Enforces group-based authorization (optional)
- Handles loading states during auth checks
- Redirects unauthenticated users to `/login`
- Redirects unauthorized users to `/unauthorized`
- Injects authenticated `user` object as a prop

## 🎯 Features

- ✅ **Authentication Protection**: Ensures only logged-in users access protected content
- ✅ **Group-Based Authorization**: Optional role/group checking (admin, moderator, etc.)
- ✅ **Automatic Redirects**: Handles routing for unauthenticated/unauthorized users
- ✅ **Type-Safe**: Full TypeScript support with prop injection
- ✅ **Loading States**: Shows loading UI during authentication verification
- ✅ **Flexible Configuration**: Simple auth or complex authorization rules
- ✅ **API Integration**: Uses `/api/auth/me` endpoint for verification
- ✅ **Error Handling**: Gracefully handles API failures

## 📦 Installation

This component is part of the Andromeda component library. Requires:
- React 18+
- Next.js (with App Router or Pages Router)
- Authentication API endpoint at `/api/auth/me`

## 🚀 Usage

### Basic Authentication (Any Logged-In User)

Protect a page so only authenticated users can access it:

```tsx
// pages/profile.tsx or app/profile/page.tsx
'use client';
import WithAuth from '@/app/components/services/WithAuth';
import { User } from '@/app/lib/types';

interface ProfilePageProps {
  user: User;  // Injected by WithAuth
}

function ProfilePage({ user }: ProfilePageProps) {
  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default WithAuth(ProfilePage);
```

### With Group Authorization (Admin Only)

Restrict access to users in specific groups:

```tsx
// pages/admin/dashboard.tsx
'use client';
import WithAuth from '@/app/components/services/WithAuth';
import { User } from '@/app/lib/types';

interface AdminDashboardProps {
  user: User;
}

function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, admin {user.username}</p>
    </div>
  );
}

// Only users in the 'admin' group can access
export default WithAuth(AdminDashboard, { requiredGroups: ['admin'] });
```

### Multiple Allowed Groups

Allow access to users in any of several groups:

```tsx
// pages/moderation.tsx
'use client';
import WithAuth from '@/app/components/services/WithAuth';

function ModerationPanel({ user }) {
  return (
    <div>
      <h1>Moderation Panel</h1>
      <p>Role: {user.groups?.join(', ')}</p>
    </div>
  );
}

// Allow both admins and moderators
export default WithAuth(ModerationPanel, { 
  requiredGroups: ['admin', 'moderator'] 
});
```

### Inline HOC Pattern

Alternative syntax for component wrapping:

```tsx
'use client';
import WithAuth from '@/app/components/services/WithAuth';

const SettingsPage = WithAuth(
  function Settings({ user }) {
    return (
      <div>
        <h1>Settings</h1>
        <p>User: {user.username}</p>
      </div>
    );
  },
  { requiredGroups: ['premium', 'admin'] }
);

export default SettingsPage;
```

### With TypeScript Generics

Properly typed component with additional props:

```tsx
'use client';
import WithAuth from '@/app/components/services/WithAuth';
import { User } from '@/app/lib/types';

interface DashboardProps {
  initialData: string;
  user: User;  // Injected by WithAuth
}

function Dashboard({ initialData, user }: DashboardProps) {
  return (
    <div>
      <h1>{user.username}'s Dashboard</h1>
      <p>Data: {initialData}</p>
    </div>
  );
}

const ProtectedDashboard = WithAuth<{ initialData: string }>(Dashboard);

export default ProtectedDashboard;

// Usage:
// <ProtectedDashboard initialData="example" />
```

## 🔧 API Reference

### WithAuth HOC

```tsx
function WithAuth<P extends object>(
  WrappedComponent: ComponentType<P & WithAuthProps>,
  options?: WithAuthOptions
): ComponentType<P>
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `WrappedComponent` | `ComponentType<P & WithAuthProps>` | ✅ Yes | Component to protect. Will receive `user` prop |
| `options` | `WithAuthOptions` | ❌ No | Configuration for authentication and authorization |

**Options:**

```tsx
interface WithAuthOptions {
  requiredGroups?: string[];  // Groups user must belong to
}
```

**Injected Props:**

```tsx
interface WithAuthProps {
  user: User;  // Authenticated user object
}
```

**Returns:**
- Wrapped component that handles authentication/authorization

---

## 🔄 Authentication Flow

### 1. Component Mounts
```
User visits protected page
         ↓
WithAuth HOC executes
         ↓
Shows loading state
```

### 2. Authentication Check
```
Calls GET /api/auth/me
         ↓
   ┌─────┴─────┐
   ↓           ↓
Success      Failure
   ↓           ↓
Parse user   Redirect to /login
```

### 3. Authorization Check (if requiredGroups specified)
```
User authenticated
         ↓
Check user.groups array
         ↓
   ┌─────┴─────┐
   ↓           ↓
Has group   No group
   ↓           ↓
Render    Redirect to /unauthorized
```

### 4. Render Protected Component
```
All checks passed
         ↓
Inject user prop
         ↓
Render wrapped component
```

## 🎨 Expected API Structure

### GET `/api/auth/me`

Returns the currently authenticated user.

**Response (Success - 200):**
```json
{
  "user": {
    "id": "user-123",
    "username": "johndoe",
    "email": "john@example.com",
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "groups": ["user", "premium"],
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

**Response (Unauthenticated - 401):**
```json
{
  "error": "Not authenticated"
}
```

### User Type Structure

```tsx
interface User {
  id: string;
  username: string;
  email: string;
  walletAddress?: string;
  groups?: string[];
  createdAt: string;
  settings?: Record<string, any>;
}
```

## 🎭 States & Behaviors

### Loading State

While authentication is being verified:

```tsx
// Default loading UI (can be customized)
<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
  <div className="text-white text-xl">Loading...</div>
</div>
```

### Unauthenticated State

User is not logged in:
- **Behavior**: Redirect to `/login`
- **Return**: `null` (prevents flash of content)

### Unauthorized State

User is authenticated but lacks required group:
- **Behavior**: Redirect to `/unauthorized`
- **Return**: `null` (prevents flash of content)

### Authenticated State

User passes all checks:
- **Behavior**: Render wrapped component
- **Props**: Injected `user` prop available

## 🧪 Testing

### Test Setup

```tsx
// test-utils.tsx
import { render } from '@testing-library/react';
import { useRouter } from 'next/router';

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: vi.fn(),
}));

export function setupRouterMock() {
  const push = vi.fn();
  (useRouter as any).mockReturnValue({ push });
  return { push };
}
```

### Testing Authenticated Access

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import WithAuth from './WithAuth';

describe('WithAuth HOC', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('renders component for authenticated user', async () => {
    const mockUser = {
      id: '123',
      username: 'testuser',
      email: 'test@example.com',
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser }),
    });

    const TestComponent = ({ user }) => <div>Hello {user.username}</div>;
    const ProtectedComponent = WithAuth(TestComponent);

    render(<ProtectedComponent />);

    await waitFor(() => {
      expect(screen.getByText('Hello testuser')).toBeInTheDocument();
    });
  });

  it('redirects unauthenticated users to login', async () => {
    const { push } = setupRouterMock();

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
    });

    const TestComponent = ({ user }) => <div>{user.username}</div>;
    const ProtectedComponent = WithAuth(TestComponent);

    render(<ProtectedComponent />);

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/login');
    });
  });

  it('redirects unauthorized users without required group', async () => {
    const { push } = setupRouterMock();

    const mockUser = {
      id: '123',
      username: 'testuser',
      groups: ['user'],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser }),
    });

    const TestComponent = ({ user }) => <div>{user.username}</div>;
    const ProtectedComponent = WithAuth(TestComponent, {
      requiredGroups: ['admin'],
    });

    render(<ProtectedComponent />);

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/unauthorized');
    });
  });
});
```

## 📚 Best Practices

### ✅ Do's

```tsx
// ✅ Use for page-level protection
export default WithAuth(ProfilePage);

// ✅ Type the user prop properly
interface PageProps {
  user: User;
}
function Page({ user }: PageProps) { }

// ✅ Use group-based auth for sensitive areas
export default WithAuth(AdminPanel, { requiredGroups: ['admin'] });

// ✅ Handle multiple allowed roles
export default WithAuth(ModerationPanel, { 
  requiredGroups: ['admin', 'moderator', 'support'] 
});

// ✅ Keep options configuration separate
const authOptions = { requiredGroups: ['premium'] };
export default WithAuth(PremiumFeature, authOptions);

// ✅ Add 'use client' directive
'use client';
import WithAuth from '@/components/services/WithAuth';
```

### ❌ Don'ts

```tsx
// ❌ Don't wrap the entire app (use layout/middleware instead)
function App() {
  return <WithAuth(EntireApp)>  // Too broad
}

// ❌ Don't use for public pages
export default WithAuth(HomePage);  // Home should be public

// ❌ Don't nest WithAuth HOCs
export default WithAuth(WithAuth(Component));  // Redundant

// ❌ Don't check authentication again inside
function Page({ user }) {
  if (!user) return null;  // WithAuth already handles this
  // ...
}

// ❌ Don't use in server components
// app/page.tsx (server component by default)
export default WithAuth(ServerPage);  // Won't work, add 'use client'

// ❌ Don't hardcode group names everywhere
// Instead, use constants:
const GROUPS = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const;
export default WithAuth(Page, { requiredGroups: [GROUPS.ADMIN] });
```

## 🔧 Customization

### Custom Loading Component

To customize the loading state, modify the HOC:

```tsx
// CustomWithAuth.tsx
import WithAuth from '@/app/components/services/WithAuth';

// Wrapper that provides custom loading
export function withCustomAuth(Component, options) {
  const ProtectedComponent = WithAuth(Component, options);
  
  return function CustomLoadingWrapper(props) {
    return (
      <Suspense fallback={<CustomSpinner />}>
        <ProtectedComponent {...props} />
      </Suspense>
    );
  };
}
```

### Different Redirect Routes

Create variants with different redirect paths:

```tsx
// withAuthCustomRedirect.tsx
export function withAuthCustomRedirect(
  Component,
  options: { loginPath?: string; unauthorizedPath?: string }
) {
  // Modify WithAuth to use custom paths
  // Implementation would involve creating a variant of WithAuth
}
```

## 🎯 Common Patterns

### Admin-Only Page

```tsx
// pages/admin/users.tsx
'use client';
import WithAuth from '@/app/components/services/WithAuth';

function UsersManagement({ user }) {
  return <div>Manage Users - Admin: {user.username}</div>;
}

export default WithAuth(UsersManagement, { requiredGroups: ['admin'] });
```

### Premium Feature Gate

```tsx
// pages/premium/feature.tsx
'use client';
import WithAuth from '@/app/components/services/WithAuth';

function PremiumFeature({ user }) {
  return (
    <div>
      <h1>Premium Feature</h1>
      <p>Welcome, {user.username}!</p>
    </div>
  );
}

export default WithAuth(PremiumFeature, { 
  requiredGroups: ['premium', 'lifetime'] 
});
```

### Multi-Tier Access

```tsx
// Different components for different tiers
const BasicDashboard = WithAuth(BasicView);
const PremiumDashboard = WithAuth(PremiumView, { 
  requiredGroups: ['premium'] 
});
const AdminDashboard = WithAuth(AdminView, { 
  requiredGroups: ['admin'] 
});

// Route based on user's groups
function DashboardRouter({ user }) {
  if (user.groups?.includes('admin')) return <AdminDashboard />;
  if (user.groups?.includes('premium')) return <PremiumDashboard />;
  return <BasicDashboard />;
}
```

## 🐛 Troubleshooting

### "useRouter must be used within RouterContext"

**Problem:** Error when running tests

**Solution:**
```tsx
// vitest.setup.ts or test file
vi.mock('next/router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    pathname: '/',
    query: {},
  })),
}));
```

### Infinite Redirect Loop

**Problem:** Page keeps redirecting to /login

**Solution:**
- Verify `/api/auth/me` returns 200 status
- Check response includes `user` object
- Ensure cookies/tokens are being sent with request

### User Prop Not Available

**Problem:** Component doesn't receive `user` prop

**Solution:**
```tsx
// Make sure to type props correctly
interface MyPageProps {
  user: User;  // Must include this
}

function MyPage({ user }: MyPageProps) {
  // Now user is available
}
```

### Authorization Not Working

**Problem:** Users without required group can still access

**Solution:**
- Verify `user.groups` is an array in API response
- Check group names match exactly (case-sensitive)
- Ensure `requiredGroups` is passed to WithAuth

## 📊 Performance Considerations

- **Single Auth Check**: Only checks authentication once on mount
- **No Re-checks**: Doesn't re-verify on navigation (use middleware for that)
- **Minimal Re-renders**: Uses useState efficiently
- **Redirect Optimization**: Returns `null` during redirect to prevent rendering

## 🔗 Related Components

- **ThemeProvider** - Application-wide theme management
- **Header** - Includes user authentication UI
- **UserProfile** - Displays authenticated user data

## 📚 Further Reading

- [React Higher-Order Components](https://react.dev/reference/react/Component#composition)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [Role-Based Access Control (RBAC)](https://en.wikipedia.org/wiki/Role-based_access_control)
- [JWT Authentication Best Practices](https://jwt.io/introduction)

## 🤝 Contributing

When modifying WithAuth:

1. ✅ Maintain backward compatibility
2. ✅ Update TypeScript types
3. ✅ Add tests for new scenarios
4. ✅ Document new options
5. ✅ Consider security implications
6. ✅ Test redirect logic thoroughly
7. ✅ Update this README

---

**WithAuth Version:** 1.0.0  
**Last Updated:** November 2025  
**Maintained by:** Andromeda Security Team
