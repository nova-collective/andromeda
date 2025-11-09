# Header Component

A comprehensive navigation header component for the Andromeda NFT marketplace. The Header provides responsive navigation, search functionality, theme toggling, wallet connection, and user profile access with a modern, polished design inspired by OpenSea.

## Overview

The Header is an **organism-level** component in our atomic design system, combining multiple atoms and molecules to create a complex, self-contained navigation interface. It serves as the primary navigation element across the entire application.

## Features

- 🎨 **Theme Toggle** - Seamless light/dark mode switching with icon transitions
- 🔍 **Dual Search Bars** - Desktop (expandable) and mobile versions with focus effects
- 📱 **Responsive Design** - Adaptive layout with mobile hamburger menu
- 🎭 **Smooth Animations** - Framer Motion powered transitions
- 🔗 **Wallet Integration** - Connect wallet button with prominent placement
- 👤 **User Profile Access** - Quick access to user account
- 🏠 **Logo Link** - Branded logo with hover effects linking to home
- 📍 **Sticky Navigation** - Persistent header with backdrop blur effect
- ♿ **Accessible** - ARIA labels and keyboard navigation support

## Installation

The Header component is part of the organisms layer and comes pre-installed with the component library.

```tsx
import Header from '@/app/components/organisms/Header';
// or
import { Header } from '@/app/components/organisms';
```

## Dependencies

### Required
- `next/link` - Next.js navigation
- `framer-motion` - Animation library
- `lucide-react` - Icon library
- `@/app/components/providers/ThemeProvider` - Theme context

### Peer Dependencies
- `react` ^19.0.0
- `next` ^15.0.0

## Usage

### Basic Usage

```tsx
import Header from '@/app/components/organisms/Header';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
```

### With Theme Provider

The Header requires the ThemeProvider to be wrapped around it:

```tsx
import { ThemeProvider } from '@/app/components/providers/ThemeProvider';
import Header from '@/app/components/organisms/Header';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### In App Router Layout

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { ThemeProvider } from '@/app/components/providers/ThemeProvider';
import Header from '@/app/components/organisms/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Andromeda - NFT Marketplace',
  description: 'Discover, collect, and sell extraordinary NFTs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Component Structure

### Props

The Header component currently doesn't accept any props and manages all state internally.

```typescript
// No props required
<Header />
```

### Internal State

```typescript
const [isMenuOpen, setIsMenuOpen] = useState(false);       // Mobile menu state
const [isSearchFocused, setIsSearchFocused] = useState(false);  // Search focus state
const { theme, toggleTheme } = useTheme();                 // Theme context
```

### Navigation Links

The Header includes three main navigation items:

```typescript
const navLinks = [
  { name: 'Explore', href: '/explore', icon: TrendingUp },
  { name: 'Stats', href: '/stats', icon: Sparkles },
  { name: 'Create', href: '/create', icon: ShoppingBag },
];
```

## Styling

### Tailwind Classes

The Header uses Tailwind CSS with the following key classes:

```tsx
// Main header
"sticky top-0 z-50 w-full border-b border-gray-200 dark:border-dark-700 
 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl"

// Logo container
"w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 
 flex items-center justify-center group-hover:scale-105 transition-transform"

// Navigation links
"px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 
 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"

// Search input
"w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-600 
 bg-gray-50 dark:bg-dark-700 focus:ring-2 focus:ring-primary-500"

// Connect wallet button
"px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white"
```

### Custom Styling

To customize the Header appearance, you can:

1. **Override Tailwind classes** in your theme configuration
2. **Modify the component** directly for project-specific needs
3. **Use CSS custom properties** for color overrides

```css
/* globals.css */
:root {
  --color-primary-500: #your-color;
  --color-dark-800: #your-dark-bg;
}
```

## Responsive Behavior

### Desktop (≥768px)
- Full navigation links visible
- Expanded search bar in center
- User icon and connect wallet button
- No hamburger menu

### Tablet (≥640px < 768px)
- Navigation links hidden
- Mobile search visible
- Connect wallet button visible
- Hamburger menu appears

### Mobile (<640px)
- Compact logo (icon only)
- Mobile search bar
- Connect wallet hidden (moved to menu)
- Hamburger menu for navigation

### Breakpoints

```tsx
// Hidden on mobile, visible on desktop
className="hidden md:flex"

// Hidden on desktop, visible on mobile
className="md:hidden"

// Hidden below large screens
className="hidden lg:flex"

// Hidden on small screens
className="hidden sm:block"
```

## Features in Detail

### 1. Theme Toggle

```tsx
<button
  onClick={toggleTheme}
  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
  aria-label="Toggle theme"
>
  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
</button>
```

**Behavior:**
- Toggles between light and dark themes
- Icon changes based on current theme
- Uses ThemeProvider context
- Persists to localStorage

### 2. Search Functionality

**Desktop Search:**
```tsx
<input
  type="text"
  placeholder="Search items, collections, and accounts"
  onFocus={() => setIsSearchFocused(true)}
  onBlur={() => setIsSearchFocused(false)}
  className={`transition-all ${isSearchFocused ? 'scale-105' : ''}`}
/>
```

**Features:**
- Expands slightly on focus (scale-105)
- Icon indicator (Search icon)
- Full-width search bar on large screens
- Compact version on mobile

### 3. Mobile Menu

```tsx
{isMenuOpen && (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    {/* Navigation links */}
  </motion.div>
)}
```

**Behavior:**
- Toggles with hamburger icon (Menu/X)
- Smooth animation with Framer Motion
- Contains all navigation links
- Includes mobile-specific Connect Wallet button
- Auto-closes when link is clicked

### 4. Wallet Connection

```tsx
<button className="flex items-center gap-2 px-4 py-2 rounded-xl 
                   bg-primary-500 hover:bg-primary-600 text-white">
  <Wallet size={18} />
  <span>Connect</span>
</button>
```

**Placement:**
- Desktop: Top right corner
- Mobile: Inside hamburger menu

**Future Enhancement:**
- Currently static, ready for Web3 integration
- Can be connected to wallet providers (MetaMask, WalletConnect, etc.)

### 5. Logo

```tsx
<Link href="/" className="flex items-center gap-2 group">
  <div className="w-10 h-10 rounded-xl bg-gradient-to-br 
                  from-primary-500 to-purple-600 
                  group-hover:scale-105 transition-transform">
    <span className="text-white font-bold text-xl">A</span>
  </div>
  <span className="text-xl font-bold hidden sm:block">Andromeda</span>
</Link>
```

**Features:**
- Gradient background with hover scale effect
- Text label hidden on mobile
- Links to home page (/)

## Accessibility

### ARIA Labels

```tsx
<button aria-label="Toggle theme">
  {/* Theme icon */}
</button>
```

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Tab navigation follows logical order
- Enter/Space activate buttons and links
- Escape key could close mobile menu (future enhancement)

### Screen Reader Support

- Semantic HTML (`<header>`, `<nav>`, `<button>`)
- Descriptive link text
- Icon-only buttons have aria-labels
- Proper heading hierarchy

### Focus Management

```tsx
className="focus:outline-none focus:ring-2 focus:ring-primary-500"
```

All interactive elements have visible focus indicators.

## Testing

### Test Coverage

The Header component has 14 comprehensive tests covering:

✅ Rendering of all UI elements  
✅ Theme toggle functionality  
✅ Mobile menu open/close  
✅ Navigation link hrefs  
✅ Logo link to home  
✅ Search input functionality  
✅ Connect wallet button  
✅ User icon button  
✅ Theme-based icon rendering  
✅ Mobile menu auto-close on link click  
✅ Wallet button in mobile menu  
✅ Correct CSS classes  
✅ Icon rendering  

### Running Tests

```bash
# Run Header tests
npm test -- Header.test.tsx

# Run with coverage
npm test -- Header.test.tsx --coverage

# Watch mode
npm test -- Header.test.tsx --watch
```

### Example Test

```tsx
it('toggles the mobile menu when the menu button is pressed', async () => {
  const user = userEvent.setup();
  renderWithTheme(<Header />);

  const mobileMenuToggle = screen.getByRole('button', { 
    name: /menu/i 
  });

  // Initially, nav links appear once
  expect(screen.getAllByText('Explore')).toHaveLength(1);

  // Click to open menu
  await user.click(mobileMenuToggle);
  
  // Nav links appear twice (desktop + mobile)
  await waitFor(() => {
    expect(screen.getAllByText('Explore').length).toBeGreaterThan(1);
  });
});
```

### Testing with Theme Provider

Always wrap Header in ThemeProvider for tests:

```tsx
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

renderWithTheme(<Header />);
```

## Performance

### Optimization Strategies

1. **Client Component** - Uses 'use client' directive for interactivity
2. **Lazy Icons** - Lucide React icons are tree-shakeable
3. **Conditional Rendering** - Mobile menu only renders when open
4. **Minimal Re-renders** - Local state management
5. **CSS Transitions** - Hardware-accelerated transforms

### Bundle Size Impact

- Component: ~4KB (minified)
- Framer Motion: ~28KB (shared across app)
- Lucide Icons: ~2KB (only imported icons)

### Best Practices

```tsx
// ✅ Good: Component is memoizable if needed
const MemoizedHeader = React.memo(Header);

// ✅ Good: Icons are imported individually
import { Search, Menu, X } from 'lucide-react';

// ❌ Avoid: Importing entire icon library
import * as Icons from 'lucide-react';
```

## Customization

### Adding New Navigation Links

```tsx
const navLinks = [
  { name: 'Explore', href: '/explore', icon: TrendingUp },
  { name: 'Stats', href: '/stats', icon: Sparkles },
  { name: 'Create', href: '/create', icon: ShoppingBag },
  // Add your link here
  { name: 'Community', href: '/community', icon: Users },
];
```

### Changing Logo

Replace the logo section:

```tsx
<Link href="/" className="flex items-center gap-2 group">
  <Image 
    src="/your-logo.png" 
    alt="Your Logo" 
    width={40} 
    height={40} 
  />
  <span className="text-xl font-bold">Your Brand</span>
</Link>
```

### Customizing Search Placeholder

```tsx
<input
  type="text"
  placeholder="Your custom search text..."
  // ...
/>
```

### Wallet Connection Handler

Add your wallet connection logic:

```tsx
const handleWalletConnect = async () => {
  try {
    // Your Web3 connection logic
    await connectWallet();
  } catch (error) {
    console.error('Wallet connection failed:', error);
  }
};

<button onClick={handleWalletConnect}>
  <Wallet size={18} />
  <span>Connect</span>
</button>
```

## Common Issues

### Issue: Theme toggle not working

**Problem:** Theme button doesn't change theme

**Solution:** Ensure ThemeProvider wraps the Header:

```tsx
<ThemeProvider>
  <Header />
</ThemeProvider>
```

### Issue: Mobile menu animation not working

**Problem:** Menu appears/disappears instantly

**Solution:** Ensure Framer Motion is installed:

```bash
npm install framer-motion
```

### Issue: Icons not displaying

**Problem:** Icon placeholders or missing icons

**Solution:** Install lucide-react:

```bash
npm install lucide-react
```

### Issue: Search input not styled correctly

**Problem:** Search bar looks broken or unstyled

**Solution:** Ensure Tailwind CSS is configured with dark mode:

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
};
```

## Integration Examples

### With Authentication

```tsx
import { useSession } from 'next-auth/react';

function Header() {
  const { data: session } = useSession();
  
  return (
    <header>
      {/* ... */}
      {session ? (
        <UserMenu user={session.user} />
      ) : (
        <button>Connect Wallet</button>
      )}
    </header>
  );
}
```

### With Wallet Provider

```tsx
import { useWallet } from '@/hooks/useWallet';

function Header() {
  const { address, connect, disconnect } = useWallet();
  
  return (
    <header>
      {/* ... */}
      {address ? (
        <button onClick={disconnect}>
          {address.slice(0, 6)}...{address.slice(-4)}
        </button>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </header>
  );
}
```

### With Search Functionality

```tsx
const [searchQuery, setSearchQuery] = useState('');
const router = useRouter();

const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
};

<form onSubmit={handleSearch}>
  <input
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search..."
  />
</form>
```

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Required Features
- CSS Grid
- CSS Custom Properties
- Flexbox
- backdrop-filter (for blur effect)

## Future Enhancements

### Planned Features
- [ ] User dropdown menu with profile options
- [ ] Notifications bell with badge
- [ ] Shopping cart indicator
- [ ] Multi-chain wallet support
- [ ] Search suggestions/autocomplete
- [ ] Recently viewed items
- [ ] Internationalization (i18n)
- [ ] Command palette (⌘K)

### Possible Improvements
- [ ] Sticky header on scroll up only
- [ ] Search history
- [ ] Keyboard shortcuts
- [ ] Voice search
- [ ] QR code wallet connection
- [ ] Network switcher
- [ ] Gas price indicator

## API Reference

### Component API

```typescript
/**
 * Header Component
 * 
 * @returns {JSX.Element} The rendered header component
 */
export default function Header(): JSX.Element
```

### Exports

```typescript
// Named export
export { Header } from '@/app/components/organisms/Header';

// Default export
export { default } from '@/app/components/organisms/Header';
```

## Related Components

- **ThemeProvider** - Provides theme context (`@/app/components/providers/ThemeProvider`)
- **Button** - Used for actions (`@/app/components/atoms/Button`)
- **Link** - Next.js navigation (`next/link`)

## Resources

### Internal Documentation
- [Atomic Design Principles](../../README.md)
- [Theme Provider Documentation](../../providers/ThemeProvider/README.md)
- [Button Component](../../atoms/Button/README.md)

### External References
- [Next.js Link Component](https://nextjs.org/docs/app/api-reference/components/link)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Contributing

When modifying the Header component:

1. ✅ Maintain responsive behavior
2. ✅ Update tests for new features
3. ✅ Preserve accessibility features
4. ✅ Update this README
5. ✅ Test on multiple devices
6. ✅ Check dark mode appearance
7. ✅ Verify keyboard navigation

## Version History

- **1.0.0** (2025-11-10) - Initial Header component with full features
  - Responsive navigation
  - Theme toggle
  - Search functionality
  - Mobile menu
  - Wallet connection button

---

**Component Type**: Organism  
**Category**: Navigation  
**Status**: Production Ready ✅  
**Last Updated**: November 10, 2025  
**Maintainer**: Andromeda Development Team
