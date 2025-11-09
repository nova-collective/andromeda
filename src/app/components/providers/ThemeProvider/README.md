# 🎨 ThemeProvider - Theme Management Provider

A robust theme management provider that handles light/dark mode switching with localStorage persistence, system preference detection, and SSR safety for Next.js applications.

## 📋 Overview

**Type:** Provider / Context  
**Category:** Application State Management  
**Complexity:** Medium  
**SSR Compatible:** ✅ Yes

The ThemeProvider is a React Context provider that:
- Manages application-wide theme state (light/dark mode)
- Persists theme preference to localStorage
- Respects system color scheme preferences
- Provides SSR-safe initialization
- Applies theme class to document root
- Safe for test environments

## 🎯 Features

- ✅ **Light/Dark Mode**: Toggle between light and dark themes
- ✅ **localStorage Persistence**: Remembers user preference across sessions
- ✅ **System Preference Detection**: Respects `prefers-color-scheme` media query
- ✅ **SSR-Safe**: Works with Next.js server-side rendering
- ✅ **Test-Safe**: Handles environments without `window.matchMedia`
- ✅ **TypeScript Support**: Fully typed with exported interfaces
- ✅ **Simple API**: Easy-to-use `useTheme()` hook
- ✅ **Performance**: Optimized with refs to avoid unnecessary re-renders

## 📦 Installation

This provider is part of the Andromeda component library. No additional dependencies required beyond React.

## 🚀 Usage

### Basic Setup

Wrap your application with the ThemeProvider at the root level:

```tsx
// app/layout.tsx
import { ThemeProvider } from '@/app/components/providers/ThemeProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

> **Note**: Use `suppressHydrationWarning` on `<html>` to avoid hydration warnings when the theme class is applied.

### Using the useTheme Hook

```tsx
'use client';
import { useTheme } from '@/app/components/providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

### Setting Specific Theme

```tsx
'use client';
import { useTheme } from '@/app/components/providers/ThemeProvider';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <button 
        onClick={() => setTheme('light')}
        disabled={theme === 'light'}
      >
        Light Mode
      </button>
      <button 
        onClick={() => setTheme('dark')}
        disabled={theme === 'dark'}
      >
        Dark Mode
      </button>
    </div>
  );
}
```

### With Icons (Lucide React)

```tsx
'use client';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/components/providers/ThemeProvider';

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon size={20} />
      ) : (
        <Sun size={20} />
      )}
    </button>
  );
}
```

### Reading Theme Without Toggle

```tsx
'use client';
import { useTheme } from '@/app/components/providers/ThemeProvider';

export function ThemedComponent() {
  const { theme } = useTheme();

  return (
    <div>
      {theme === 'dark' ? (
        <img src="/logo-dark.svg" alt="Logo" />
      ) : (
        <img src="/logo-light.svg" alt="Logo" />
      )}
    </div>
  );
}
```

## 🔧 API Reference

### ThemeProvider

The context provider component that wraps your application.

**Props:**
```tsx
interface ThemeProviderProps {
  children: React.ReactNode;  // Components to wrap with theme context
}
```

**Usage:**
```tsx
<ThemeProvider>
  <YourApp />
</ThemeProvider>
```

---

### useTheme Hook

Custom hook to access theme state and methods.

**Returns:**
```tsx
interface ThemeContextType {
  theme: 'light' | 'dark';        // Current active theme
  toggleTheme: () => void;        // Toggle between themes
  setTheme: (theme: Theme) => void; // Set specific theme
}
```

**Usage:**
```tsx
const { theme, toggleTheme, setTheme } = useTheme();
```

**Throws:**
- `Error` if used outside of ThemeProvider

---

## 🎨 Theme Initialization Logic

The ThemeProvider determines the initial theme using this priority:

1. **SSR (Server-Side)**: Always starts with `'light'` to avoid hydration mismatches
2. **localStorage**: Checks `localStorage.getItem('theme')` for saved preference
3. **System Preference**: Checks `prefers-color-scheme` media query
4. **Fallback**: Defaults to `'light'` if none of the above are available

```tsx
// Priority flow:
1. Server? → 'light'
2. localStorage? → stored theme
3. System preference? → 'dark' or 'light'
4. Fallback → 'light'
```

## 🔄 How It Works

### Theme Persistence

When you change the theme, it:
1. Updates React state
2. Saves to localStorage (`localStorage.setItem('theme', newTheme)`)
3. Applies class to `document.documentElement` (`.light` or `.dark`)

### SSR Safety

The provider is SSR-safe because:
- Uses lazy initialization with `useState(() => ...)`
- Defaults to `'light'` when `window` is undefined
- Checks for `window.matchMedia` availability before using
- Only accesses `document` in `useEffect` (client-side only)

### Test Environment Safety

Handles test environments where DOM APIs might not be available:
- Checks for `typeof window === 'undefined'`
- Checks for `typeof window.matchMedia === 'function'`
- Safely degrades to defaults

## 🎯 Integration with Tailwind CSS

The ThemeProvider works seamlessly with Tailwind CSS dark mode:

### tailwind.config.ts
```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          700: '#1f2937',
          800: '#111827',
          900: '#0f172a',
        },
      },
    },
  },
};

export default config;
```

### Using Tailwind Dark Mode Classes

```tsx
<div className="bg-white dark:bg-dark-800 text-gray-900 dark:text-white">
  <h1 className="text-gray-900 dark:text-gray-100">
    Themed Content
  </h1>
  <button className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700">
    Click Me
  </button>
</div>
```

## 🧪 Testing

### Test Setup

```tsx
// test-utils.tsx
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/app/components/providers/ThemeProvider';

export function renderWithTheme(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
}
```

### Testing Components with useTheme

```tsx
import { renderWithTheme } from './test-utils';
import { screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('toggles theme when clicked', () => {
    renderWithTheme(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('light');
    
    fireEvent.click(button);
    expect(button).toHaveTextContent('dark');
  });
});
```

### Mocking localStorage

```tsx
beforeEach(() => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  global.localStorage = localStorageMock as any;
});
```

## 📚 Best Practices

### ✅ Do's

```tsx
// ✅ Wrap at root level (layout.tsx)
<ThemeProvider>
  <App />
</ThemeProvider>

// ✅ Use hook in client components
'use client';
const { theme, toggleTheme } = useTheme();

// ✅ Add suppressHydrationWarning to html tag
<html suppressHydrationWarning>

// ✅ Provide accessible labels
<button onClick={toggleTheme} aria-label="Toggle theme">
  {/* icon */}
</button>

// ✅ Use Tailwind dark: classes
<div className="bg-white dark:bg-dark-800">

// ✅ Wrap test components with provider
renderWithTheme(<Component />);
```

### ❌ Don'ts

```tsx
// ❌ Don't use hook outside provider
function Component() {
  const { theme } = useTheme(); // Error!
}

// ❌ Don't access localStorage directly
localStorage.setItem('theme', 'dark'); // Use setTheme instead

// ❌ Don't modify document class directly
document.documentElement.classList.add('dark'); // Provider handles this

// ❌ Don't use in server components without 'use client'
// app/page.tsx (server component)
const { theme } = useTheme(); // Error!

// ❌ Don't wrap multiple times
<ThemeProvider>
  <ThemeProvider> {/* Unnecessary nesting */}
    <App />
  </ThemeProvider>
</ThemeProvider>

// ❌ Don't forget to handle SSR
if (window.matchMedia) { // Add typeof window check first!
```

## 🔄 Advanced Usage

### Syncing Theme with Backend

```tsx
'use client';
import { useEffect } from 'react';
import { useTheme } from '@/app/components/providers/ThemeProvider';

export function ThemeSyncWrapper({ children, userId }) {
  const { theme, setTheme } = useTheme();

  // Fetch user's theme preference from API
  useEffect(() => {
    fetch(`/api/users/${userId}/preferences`)
      .then(res => res.json())
      .then(data => setTheme(data.theme));
  }, [userId, setTheme]);

  // Save theme changes to API
  useEffect(() => {
    fetch(`/api/users/${userId}/preferences`, {
      method: 'PATCH',
      body: JSON.stringify({ theme }),
    });
  }, [theme, userId]);

  return <>{children}</>;
}
```

### Multiple Theme Options (Extended)

```tsx
// For more than 2 themes, you'd extend the provider:
type ExtendedTheme = 'light' | 'dark' | 'auto' | 'high-contrast';

// Then modify the provider to support additional themes
// and add corresponding CSS classes
```

### Theme Transition Animations

```tsx
// Add smooth transitions in globals.css
html {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dark {
  color-scheme: dark;
}

.light {
  color-scheme: light;
}
```

## 🐛 Troubleshooting

### Hydration Mismatch Warning

**Problem:** Warning about server/client HTML mismatch

**Solution:**
```tsx
// Add suppressHydrationWarning to html tag
<html lang="en" suppressHydrationWarning>
```

### Hook Error Outside Provider

**Problem:** "useTheme must be used within a ThemeProvider"

**Solution:**
```tsx
// Ensure component is wrapped with ThemeProvider
<ThemeProvider>
  <ComponentUsingTheme />
</ThemeProvider>
```

### localStorage Not Defined (SSR)

**Problem:** ReferenceError: localStorage is not defined

**Solution:** The provider already handles this with `typeof window` checks. Make sure you're importing from the correct path.

### Theme Not Persisting

**Problem:** Theme resets on page refresh

**Solution:** 
1. Check browser localStorage in DevTools
2. Verify `localStorage.setItem('theme', ...)` is being called
3. Check for browser extensions blocking localStorage

### Test Failures

**Problem:** Tests fail with "window is not defined"

**Solution:**
```tsx
// Use vitest environment config
// vitest.config.ts
export default {
  environment: 'jsdom',
};
```

## 📊 Performance Considerations

The ThemeProvider is optimized for performance:

- **Minimal Re-renders**: Uses `useRef` to track mounted state
- **Lazy Initialization**: Theme is determined once on mount
- **No Props Drilling**: Context provides direct access anywhere
- **Lightweight**: < 100 lines of code, no dependencies
- **Memoization**: Not needed - context value is stable

## 🔗 Related Components

- **Header** - Uses ThemeProvider for theme toggle button
- **Button** - Styled with dark mode variants
- **Card** - Responsive to theme changes

## 📚 Further Reading

- [React Context API](https://react.dev/reference/react/useContext)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Next.js SSR Patterns](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Web Accessibility and Dark Mode](https://www.w3.org/WAI/WCAG21/Understanding/)

## 🤝 Contributing

When modifying the ThemeProvider:

1. ✅ Maintain SSR safety
2. ✅ Ensure test compatibility
3. ✅ Update TypeScript types
4. ✅ Add/update tests
5. ✅ Document breaking changes
6. ✅ Test in Next.js environment
7. ✅ Verify localStorage behavior
8. ✅ Check hydration warnings

---

**ThemeProvider Version:** 1.0.0  
**Last Updated:** November 2025  
**Maintained by:** Andromeda Design System Team
