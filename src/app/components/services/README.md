# 🛠️ Services - Cross-Cutting Functionality Components

The **Services** layer provides reusable utility components that handle cross-cutting concerns across the application. Services are typically implemented as Higher-Order Components (HOCs), render props, or custom hooks that enhance components with additional capabilities without modifying their core functionality.

## 📋 Overview

**Type:** Utility Layer  
**Category:** Cross-Cutting Concerns  
**Complexity:** Medium to High  
**Reusability:** Very High

Services are utility components that:
- Handle authentication and authorization
- Provide error boundaries and error handling
- Manage data fetching and caching
- Track analytics and user behavior
- Handle logging and monitoring
- Wrap components with additional functionality
- Enable separation of concerns
- Don't typically render UI themselves

## 🎯 Philosophy

> "Services handle the 'how' rather than the 'what'. They provide reusable functionality that enhances components with capabilities like authentication, error handling, and data management."

In the Andromeda design system, services represent:
- **Cross-Cutting Concerns**: Functionality needed across many components
- **Separation of Concerns**: Keep business logic separate from UI
- **Reusability**: Write once, use everywhere
- **Composability**: Services can be combined and nested
- **Maintainability**: Centralize common functionality

## 📦 Available Services

### 🔐 WithAuth

Higher-Order Component for authentication and authorization.

**Import:**
```tsx
import { WithAuth } from '@/app/components/services';
// or
import WithAuth from '@/app/components/services/WithAuth';
```

**Purpose:**
- Protects pages and components from unauthenticated access
- Enforces group-based authorization (roles/permissions)
- Handles automatic redirects for auth failures
- Injects authenticated user as prop

**Features:**
- ✅ Authentication verification via API
- ✅ Group-based authorization (admin, moderator, etc.)
- ✅ Automatic redirects to `/login` or `/unauthorized`
- ✅ Loading states during auth check
- ✅ Type-safe user prop injection
- ✅ Error handling for API failures

**Basic Usage:**
```tsx
'use client';
import WithAuth from '@/app/components/services/WithAuth';

function ProfilePage({ user }) {
  return <div>Welcome, {user.username}!</div>;
}

export default WithAuth(ProfilePage);
```

**With Authorization:**
```tsx
'use client';
import WithAuth from '@/app/components/services/WithAuth';

function AdminDashboard({ user }) {
  return <div>Admin Panel - {user.username}</div>;
}

// Only users in 'admin' group can access
export default WithAuth(AdminDashboard, { requiredGroups: ['admin'] });
```

**Multiple Groups:**
```tsx
// Allow multiple groups (any match grants access)
export default WithAuth(ModerationPanel, {
  requiredGroups: ['admin', 'moderator', 'support']
});
```

**API Requirements:**
- Expects `GET /api/auth/me` endpoint
- Returns `{ user: User }` for authenticated users
- Returns 401 for unauthenticated users

**See Also:** [WithAuth README](./WithAuth/README.md)

---

## 🎨 Service Patterns

### Higher-Order Component (HOC)

The most common pattern for services. Wraps a component to add functionality.

```tsx
// Service definition
function WithFeature(Component) {
  return function EnhancedComponent(props) {
    // Add functionality here
    const feature = useFeature();
    
    return <Component {...props} feature={feature} />;
  };
}

// Usage
const EnhancedPage = WithFeature(MyPage);
```

**Pros:**
- Easy to compose multiple services
- Clear separation of concerns
- Can be applied to any component
- TypeScript-friendly with proper typing

**Cons:**
- Can create "wrapper hell" if overused
- Slightly harder to debug (extra component layers)

### Render Props

Alternative pattern where service provides functionality via children function.

```tsx
// Service with render props
function FeatureService({ children }) {
  const feature = useFeature();
  return children(feature);
}

// Usage
<FeatureService>
  {(feature) => (
    <MyComponent feature={feature} />
  )}
</FeatureService>
```

**Pros:**
- More flexible composition
- Easier to see data flow
- No wrapper components in tree

**Cons:**
- More verbose syntax
- Harder to compose multiple services

### Custom Hooks

Modern React pattern for sharing logic without component wrappers.

```tsx
// Service as custom hook
function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch user...
  }, []);
  
  return { user, loading };
}

// Usage
function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <Loading />;
  if (!user) return <Login />;
  
  return <div>Welcome {user.username}</div>;
}
```

**Pros:**
- No wrapper components
- Cleaner component tree
- Most idiomatic React pattern
- Easy to test

**Cons:**
- Can't protect at page level as easily
- Logic must be in component body

## 🚀 Usage Guidelines

### When to Create a Service

Create a service when you need:
- ✅ Functionality used across many components (auth, error handling, logging)
- ✅ To separate concerns (UI vs. business logic)
- ✅ To wrap components with additional capabilities
- ✅ Cross-cutting concerns (analytics, monitoring, caching)
- ✅ Reusable data fetching patterns
- ✅ Error boundaries and fallback UI

### When NOT to Create a Service

Don't create a service if:
- ❌ Functionality is specific to one component (keep it local)
- ❌ It's simple UI logic (use atoms/molecules instead)
- ❌ A custom hook would be simpler and clearer
- ❌ You're just wrapping one component unnecessarily
- ❌ The logic doesn't enhance or protect components

## 📐 Service Structure

Every service should follow this structure:

```
services/
  ServiceName/
    ServiceName.tsx      # Service implementation (HOC/hook/component)
    ServiceName.test.tsx # Unit tests
    README.md            # Service documentation
    index.ts             # Barrel export
```

### Example Service Implementation

```tsx
// services/WithErrorBoundary/WithErrorBoundary.tsx
'use client';
import React, { Component, ErrorInfo } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface WithErrorBoundaryOptions {
  fallback?: React.ComponentType<{ error: Error }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * WithErrorBoundary Service
 * 
 * Wraps components with error boundary to catch and handle errors gracefully.
 */
export default function WithErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
) {
  return class ErrorBoundary extends Component<P, ErrorBoundaryState> {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error('Error caught by boundary:', error, errorInfo);
      options.onError?.(error, errorInfo);
    }

    render() {
      if (this.state.hasError && this.state.error) {
        if (options.fallback) {
          const FallbackComponent = options.fallback;
          return <FallbackComponent error={this.state.error} />;
        }
        
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            <h2 className="text-red-800 font-bold">Something went wrong</h2>
            <p className="text-red-600">{this.state.error.message}</p>
          </div>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
}
```

### Barrel Export

```tsx
// services/WithErrorBoundary/index.ts
export { default as WithErrorBoundary } from './WithErrorBoundary';
export { default } from './WithErrorBoundary';
export type { WithErrorBoundaryOptions } from './WithErrorBoundary';
```

## 🧪 Testing Services

Services require thorough testing since they affect many components:

```tsx
// WithErrorBoundary.test.tsx
import { render, screen } from '@testing-library/react';
import WithErrorBoundary from './WithErrorBoundary';

describe('WithErrorBoundary', () => {
  // Suppress console.error for error boundary tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('renders component normally when no error', () => {
    const TestComponent = () => <div>Working</div>;
    const Protected = WithErrorBoundary(TestComponent);
    
    render(<Protected />);
    expect(screen.getByText('Working')).toBeInTheDocument();
  });

  it('renders fallback UI when error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };
    const Protected = WithErrorBoundary(ThrowError);
    
    render(<Protected />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn();
    const ThrowError = () => {
      throw new Error('Test error');
    };
    const Protected = WithErrorBoundary(ThrowError, { onError });
    
    render(<Protected />);
    expect(onError).toHaveBeenCalled();
  });

  it('uses custom fallback component', () => {
    const CustomFallback = ({ error }) => <div>Custom: {error.message}</div>;
    const ThrowError = () => {
      throw new Error('Custom error');
    };
    const Protected = WithErrorBoundary(ThrowError, {
      fallback: CustomFallback,
    });
    
    render(<Protected />);
    expect(screen.getByText('Custom: Custom error')).toBeInTheDocument();
  });
});
```

**Test Coverage Goals:**
- ✅ Normal operation (no errors)
- ✅ Error handling and fallback UI
- ✅ Callback functions invoked correctly
- ✅ Custom options respected
- ✅ Props passed through correctly
- ✅ Edge cases and error scenarios

## 📚 Best Practices

### ✅ Do's

```tsx
// ✅ Keep services focused on one concern
WithAuth  // Authentication only
WithErrorBoundary  // Error handling only

// ✅ Make services composable
const ProtectedPage = WithAuth(
  WithErrorBoundary(
    WithAnalytics(MyPage)
  )
);

// ✅ Provide clear TypeScript types
export interface WithAuthProps {
  user: User;
}

// ✅ Document with JSDoc
/**
 * WithAuth HOC
 * @param Component - Component to protect
 * @param options - Configuration options
 */

// ✅ Handle loading and error states
if (loading) return <Loading />;
if (error) return <Error />;

// ✅ Make options optional with defaults
export default function WithFeature(
  Component,
  options: Options = {}
) { }

// ✅ Use constants for configuration
const AUTH_CONFIG = {
  LOGIN_PATH: '/login',
  UNAUTHORIZED_PATH: '/unauthorized',
} as const;
```

### ❌ Don'ts

```tsx
// ❌ Don't create "god services" that do everything
function WithEverything(Component) {
  // Handles auth, errors, analytics, caching, etc.
  // Too much responsibility!
}

// ❌ Don't deeply nest HOCs (hard to debug)
WithA(WithB(WithC(WithD(WithE(Component)))))  // Too deep!

// ❌ Don't mutate props
function WithBadService(Component) {
  return (props) => {
    props.newProp = 'value';  // Mutation!
    return <Component {...props} />;
  };
}

// ❌ Don't use services for simple utilities
function WithClassName(Component, className) {
  return (props) => <Component {...props} className={className} />;
}
// Just pass className as a prop!

// ❌ Don't forget to forward refs when needed
function WithService(Component) {
  return (props) => <Component {...props} />;
  // Missing: React.forwardRef if Component uses refs
}

// ❌ Don't ignore TypeScript types
function WithUntyped(Component: any, options?: any) {
  // Add proper types!
}
```

## 🔄 Common Service Patterns

### Composing Multiple Services

```tsx
// Method 1: Nested HOCs
const EnhancedPage = WithAuth(
  WithErrorBoundary(
    WithAnalytics(ProfilePage)
  )
);

// Method 2: Compose utility
function compose(...fns) {
  return fns.reduce((a, b) => (...args) => a(b(...args)));
}

const enhance = compose(
  WithAuth,
  WithErrorBoundary,
  WithAnalytics
);

const EnhancedPage = enhance(ProfilePage);

// Method 3: Custom composer
function withServices(Component, services) {
  return services.reduceRight(
    (Comp, service) => service(Comp),
    Component
  );
}

const EnhancedPage = withServices(ProfilePage, [
  WithAuth,
  WithErrorBoundary,
  WithAnalytics,
]);
```

### Conditional Service Application

```tsx
// Apply service only in certain conditions
function conditionalAuth(Component, shouldProtect = true) {
  if (shouldProtect) {
    return WithAuth(Component);
  }
  return Component;
}

// Development vs. Production
const enhance = process.env.NODE_ENV === 'production'
  ? WithAnalytics
  : (Component) => Component;  // No-op in dev

export default enhance(MyPage);
```

### Service Configuration

```tsx
// Create configured service variants
const withAdminAuth = (Component) => 
  WithAuth(Component, { requiredGroups: ['admin'] });

const withModeratorAuth = (Component) => 
  WithAuth(Component, { requiredGroups: ['admin', 'moderator'] });

// Use pre-configured services
export default withAdminAuth(AdminPanel);
export default withModeratorAuth(ModerationPanel);
```

## 🎯 Future Services (Roadmap)

Potential services to add to the library:

### WithErrorBoundary
```tsx
// Error boundary service
export default WithErrorBoundary(Component, {
  fallback: ErrorFallback,
  onError: logError,
});
```

### WithAnalytics
```tsx
// Track page views and events
export default WithAnalytics(Component, {
  trackPageView: true,
  eventPrefix: 'admin',
});
```

### WithPermissions
```tsx
// Fine-grained permission checking
export default WithPermissions(Component, {
  permissions: ['user:read', 'user:write'],
  mode: 'all',  // 'all' or 'any'
});
```

### WithDataFetching
```tsx
// Automatic data fetching with loading/error states
export default WithDataFetching(Component, {
  fetchData: fetchUserData,
  loadingComponent: Skeleton,
});
```

### WithLogger
```tsx
// Automatic logging of component lifecycle
export default WithLogger(Component, {
  logMount: true,
  logProps: true,
});
```

## 📊 Service Checklist

When creating or reviewing a service, verify:

- [ ] **Single Responsibility**: Handles one concern well
- [ ] **Reusable**: Can be applied to many components
- [ ] **Composable**: Works with other services
- [ ] **Typed**: Full TypeScript support
- [ ] **Tested**: Comprehensive test coverage
- [ ] **Documented**: README with examples and API docs
- [ ] **Configurable**: Options for customization
- [ ] **Error Handling**: Graceful degradation
- [ ] **Performance**: No unnecessary re-renders
- [ ] **Accessible**: Doesn't break accessibility
- [ ] **SSR Compatible**: Works with Next.js SSR (if applicable)
- [ ] **Maintainable**: Clear code and patterns

## 🔗 Related Documentation

- [Atoms](../atoms/README.md) - Basic building blocks
- [Organisms](../organisms/README.md) - Complex components
- [Providers](../providers/README.md) - Context providers
- [Design Guidelines](../DESIGN_GUIDELINES.md) - Overall design system
- [Component Library](../README.md) - Full component overview

## 🤝 Contributing

When adding new services:

1. **Identify the Need**: Ensure it's truly cross-cutting
2. **Choose Pattern**: HOC, render props, or custom hook
3. **Define API**: Clear options and injected props
4. **Implement**: Follow service structure pattern
5. **Add Types**: Full TypeScript support
6. **Write Tests**: Cover all scenarios
7. **Document**: Create comprehensive README
8. **Export**: Add to `services/index.ts`
9. **Examples**: Provide usage examples
10. **Review**: Get team feedback on API design

## 📚 Further Reading

- [React Higher-Order Components](https://react.dev/reference/react/Component#composition)
- [Render Props Pattern](https://react.dev/reference/react/cloneElement#passing-data-with-a-render-prop)
- [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Composition vs Inheritance](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)

---

**Services Version:** 1.0.0  
**Last Updated:** November 2025  
**Maintained by:** Andromeda Design System Team
