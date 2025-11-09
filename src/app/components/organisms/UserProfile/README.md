# 👤 UserProfile Component

A comprehensive user profile organism component that fetches and displays user information based on their Ethereum wallet address. This component manages data fetching, loading states, and user settings updates.

## 📋 Overview

**Type:** Organism  
**Category:** User Management  
**Complexity:** High (includes data fetching, state management, API integration)

The UserProfile component is classified as an **organism** because it:
- Contains business logic and side effects
- Manages its own data lifecycle with API calls
- Handles complex state management
- Provides a complete, self-contained feature
- Combines UI with data fetching and error handling

## 🎯 Features

- ✅ **User Data Fetching** - Automatically fetches user data by wallet address
- ✅ **Loading States** - Displays loading indicator during data fetch
- ✅ **Error Handling** - Gracefully handles API errors and missing users
- ✅ **Settings Management** - Allows updating user preferences (theme, notifications)
- ✅ **TypeScript Support** - Fully typed props and interfaces
- ✅ **Client-Side Rendering** - Uses 'use client' for React hooks

## 📦 Installation

This component is part of the Andromeda component library and requires the following:

```bash
# Ensure you have the required dependencies
npm install react react-dom
```

## 🚀 Usage

### Basic Usage

```tsx
import { UserProfile } from '@/app/components/organisms/UserProfile';

function ProfilePage() {
  return (
    <UserProfile walletAddress="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" />
  );
}
```

### With TypeScript

```tsx
import { UserProfile, type UserProfileProps } from '@/app/components/organisms/UserProfile';

const profileProps: UserProfileProps = {
  walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
};

<UserProfile {...profileProps} />
```

### In a Page Layout

```tsx
'use client';
import { useState } from 'react';
import { UserProfile } from '@/app/components/organisms/UserProfile';

export default function UserDashboard() {
  const [walletAddress, setWalletAddress] = useState<string>('');

  const handleConnect = async () => {
    // Connect wallet logic
    const address = await connectWallet();
    setWalletAddress(address);
  };

  return (
    <div>
      {walletAddress ? (
        <UserProfile walletAddress={walletAddress} />
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}
    </div>
  );
}
```

## 📐 Props

### UserProfileProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `walletAddress` | `string` | ✅ Yes | - | Ethereum wallet address to fetch user data for |

### UserSettings Interface

The component uses a `UserSettings` interface for managing user preferences:

```tsx
interface UserSettings {
  theme: string;           // Theme preference (e.g., 'light', 'dark')
  notifications: boolean;  // Whether notifications are enabled
}
```

## 🎨 Component States

### Loading State
Displayed while fetching user data from the API.

```tsx
<UserProfile walletAddress="0x..." />
// Renders: <div>Loading...</div>
```

### Error State
Displayed when user is not found or fetch fails.

```tsx
<UserProfile walletAddress="invalid-address" />
// Renders: <div>User not found</div>
```

### Success State
Displays user information with interactive settings controls.

```tsx
// Renders user profile with:
// - User wallet address
// - Current theme setting
// - "Switch to Dark Mode" button
```

## 🔧 API Integration

### Expected API Endpoints

#### GET `/api/users?walletAddress={address}`
Fetches user data by wallet address.

**Response:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "settings": {
    "theme": "light",
    "notifications": true
  }
}
```

#### POST `/api/users`
Updates user settings.

**Request Body:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "settings": {
    "theme": "dark",
    "notifications": true
  }
}
```

**Response:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "settings": {
    "theme": "dark",
    "notifications": true
  }
}
```

## 🧪 Testing

The component includes comprehensive tests in `UserProfile.test.tsx`:

```bash
# Run tests
npm test UserProfile.test.tsx

# Run with coverage
npm test -- --coverage UserProfile.test.tsx
```

### Test Coverage

- ✅ Renders loading state initially
- ✅ Fetches and displays user data
- ✅ Handles fetch errors gracefully
- ✅ Updates user settings via API
- ✅ Displays "User not found" for invalid addresses

## 🎯 Best Practices

### ✅ Do's

```tsx
// ✅ Always provide a valid wallet address
<UserProfile walletAddress="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" />

// ✅ Wrap in error boundary for production
<ErrorBoundary>
  <UserProfile walletAddress={address} />
</ErrorBoundary>

// ✅ Use loading skeleton while fetching
{isConnecting ? <Skeleton /> : <UserProfile walletAddress={address} />}
```

### ❌ Don'ts

```tsx
// ❌ Don't pass empty or undefined wallet address
<UserProfile walletAddress="" />

// ❌ Don't use without proper error handling
<UserProfile walletAddress={maybeAddress} /> // could be undefined

// ❌ Don't render multiple instances with same address unnecessarily
<UserProfile walletAddress={address} />
<UserProfile walletAddress={address} /> // duplicate API calls
```

## 🔄 Future Improvements

Potential enhancements for better atomic design:

### Refactor to Pure UI + Data Container

```tsx
// 1. Create pure UI molecule: ProfileCard
// molecules/ProfileCard/ProfileCard.tsx
export function ProfileCard({ user, onUpdateSettings }) {
  return (
    <div>
      <h2>User Profile</h2>
      <p>Wallet: {user.walletAddress}</p>
      <p>Theme: {user.settings?.theme}</p>
      <button onClick={onUpdateSettings}>Switch to Dark Mode</button>
    </div>
  );
}

// 2. Keep data logic in organism: UserProfile
// organisms/UserProfile/UserProfile.tsx
export function UserProfile({ walletAddress }) {
  const { user, loading, updateSettings } = useUserData(walletAddress);
  
  if (loading) return <Skeleton />;
  if (!user) return <EmptyState />;
  
  return <ProfileCard user={user} onUpdateSettings={updateSettings} />;
}
```

### Benefits of Refactoring
- **Testability**: Pure UI components easier to test
- **Reusability**: ProfileCard can be used with different data sources
- **Separation of Concerns**: Data logic separated from presentation
- **Storybook Ready**: UI components can be documented in isolation

## 🔗 Related Components

- **Header** - Main navigation with wallet connection
- **WalletConnect** - Molecule for connecting Ethereum wallets
- **Avatar** - Atom for displaying user avatars
- **Badge** - Atom for displaying user status/roles

## 📚 References

- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)

## 🤝 Contributing

When modifying this component:

1. ✅ Export both named and default exports
2. ✅ Export TypeScript interfaces/types
3. ✅ Update tests for new functionality
4. ✅ Add JSDoc comments for new props
5. ✅ Update this README with examples
6. ✅ Follow atomic design principles
7. ✅ Ensure SSR compatibility ('use client' directive)

---

**Component Version:** 1.0.0  
**Last Updated:** November 2025  
**Maintained by:** Andromeda Team
