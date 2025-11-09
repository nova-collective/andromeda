# 🦠 Organisms - Complex UI Components

The **Organisms** layer represents complex, feature-complete UI components that combine atoms, molecules, and other organisms into distinct sections of an interface. These components often include business logic, data fetching, and state management.

## 📋 Overview

**Level:** 3 - Complex Layer  
**Complexity:** High  
**Reusability:** Medium to High  
**Business Logic:** Yes - Contains logic, state, and side effects

Organisms are sophisticated components that:
- Combine multiple atoms and molecules into cohesive units
- Can contain business logic and side effects
- Manage their own state and data fetching
- Form distinct, recognizable sections of the UI
- Represent complete, self-contained features
- May communicate with APIs and external services

## 🎯 Philosophy

> "Organisms are relatively complex UI components composed of groups of molecules and/or atoms and/or other organisms. These organisms form distinct sections of an interface."
> — Brad Frost, Atomic Design

In the Andromeda design system, organisms represent:
- **Feature Completeness**: Self-contained, working features
- **Complexity**: Can include state management, API calls, business logic
- **Composition**: Built from atoms and molecules
- **Context Awareness**: May respond to global state or routing
- **Independence**: Can function as standalone units

## 📦 Available Organisms

### 🎯 Header

The main navigation header with responsive design, theme toggle, search, and wallet connection.

**Import:**
```tsx
import { Header } from '@/app/components/organisms';
// or
import Header from '@/app/components/organisms/Header';
```

**Features:**
- ✅ Responsive navigation with mobile menu
- ✅ Theme toggle (light/dark mode)
- ✅ Search bar (desktop and mobile)
- ✅ Wallet connection button
- ✅ User profile access
- ✅ Sticky positioning with backdrop blur
- ✅ Smooth animations with Framer Motion

**Example:**
```tsx
export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
```

**Key Technologies:**
- Next.js Link for navigation
- Framer Motion for animations
- Lucide React for icons
- Theme Provider integration
- SSR-safe with 'use client'

---

### 🃏 Card

A versatile NFT/product card component with image, metadata, pricing, and interactive elements.

**Import:**
```tsx
import { Card } from '@/app/components/organisms';
// or
import Card from '@/app/components/organisms/Card';
```

**Props:**
```tsx
interface CardProps {
  title: string;              // Card title
  description?: string;       // Optional description
  imageUrl?: string;          // Image URL
  price?: number;             // Price in ETH
  likes?: number;             // Number of likes
  onLike?: () => void;       // Like callback
  onBuy?: () => void;        // Buy callback
}
```

**Example:**
```tsx
<Card
  title="Cosmic Nebula #1234"
  description="A stunning cosmic artwork from the Nebula collection"
  imageUrl="/nft/cosmic-1234.jpg"
  price={2.5}
  likes={142}
  onLike={() => handleLike('1234')}
  onBuy={() => handlePurchase('1234')}
/>
```

**Use Cases:**
- NFT marketplace listings
- Product cards
- Collection previews
- Gallery items
- Featured content

---

### 👤 UserProfile

A comprehensive user profile component that fetches and displays user data with settings management.

**Import:**
```tsx
import { UserProfile } from '@/app/components/organisms';
// or
import UserProfile from '@/app/components/organisms/UserProfile';
```

**Props:**
```tsx
interface UserProfileProps {
  walletAddress: string;  // Ethereum wallet address
}

interface UserSettings {
  theme: string;          // Theme preference
  notifications: boolean; // Notification settings
}
```

**Features:**
- ✅ Automatic user data fetching by wallet address
- ✅ Loading and error states
- ✅ User settings management (theme, notifications)
- ✅ API integration (GET/POST)
- ✅ Graceful error handling
- ✅ TypeScript support

**Example:**
```tsx
function ProfilePage() {
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    const getAddress = async () => {
      const addr = await connectWallet();
      setAddress(addr);
    };
    getAddress();
  }, []);

  return address ? (
    <UserProfile walletAddress={address} />
  ) : (
    <ConnectWalletPrompt />
  );
}
```

**API Endpoints:**
- `GET /api/users?walletAddress={address}` - Fetch user data
- `POST /api/users` - Update user settings

---

## 🎨 Design Principles

### 1. Feature Completeness
Organisms should be complete, working features that provide real value.

```tsx
// ✅ Good - Complete header with all functionality
<Header 
  navigation={navLinks}
  user={currentUser}
  onSearch={handleSearch}
  onConnect={connectWallet}
/>

// ❌ Bad - Incomplete, requires too much external logic
<Header />  // But doesn't actually handle navigation or state
```

### 2. Encapsulation
Organisms should manage their own state and behavior.

```tsx
// ✅ Good - Self-contained with internal state
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  // Manages its own state
  return (/* ... */);
}

// ❌ Bad - Too dependent on parent
function Header({ isMenuOpen, setIsMenuOpen, isSearchFocused, setIsSearchFocused }) {
  // Parent manages everything
}
```

### 3. Composability
Organisms should be built from smaller components.

```tsx
// ✅ Good - Composed from atoms and molecules
function Card() {
  return (
    <div>
      <Image />           {/* Atom */}
      <PriceDisplay />    {/* Molecule */}
      <LikeButton />      {/* Molecule */}
      <Button />          {/* Atom */}
    </div>
  );
}

// ❌ Bad - Everything inline, not composable
function Card() {
  return (
    <div>
      <img />
      <span>ETH {price}</span>
      <button onClick={onLike}>❤️ {likes}</button>
      <button onClick={onBuy}>Buy Now</button>
    </div>
  );
}
```

### 4. Reasonable Complexity
Organisms can be complex, but not overwhelming. If too complex, split into multiple organisms.

```tsx
// ✅ Good - Complex but manageable
function Header() {
  // 3-5 pieces of state
  // 5-10 functions
  // 200-400 lines of code
}

// ❌ Bad - Too complex, should be split
function MegaComponent() {
  // 15+ pieces of state
  // 30+ functions
  // 1000+ lines of code
  // Multiple distinct features
  // Should be split into multiple organisms
}
```

## 🚀 Usage Guidelines

### When to Create an Organism

Create an organism when you have:
- ✅ A distinct section of the interface (header, card, profile, sidebar)
- ✅ Multiple atoms/molecules working together
- ✅ Business logic or data fetching requirements
- ✅ State management needs
- ✅ A complete, self-contained feature
- ✅ Reusable across multiple pages

### When NOT to Create an Organism

Don't create an organism if:
- ❌ It's too simple (use an atom or molecule instead)
- ❌ It's page-specific (use a template or page component)
- ❌ It's just wrapping one component (unnecessary abstraction)
- ❌ It's too complex (split into multiple organisms)
- ❌ It's not reusable (one-off components belong in pages)

## 📐 Organism Structure

Every organism should follow this structure:

```
organisms/
  ComponentName/
    ComponentName.tsx      # Component implementation
    ComponentName.test.tsx # Unit tests
    README.md              # Component documentation
    index.ts               # Barrel export
```

### Example Organism Implementation

```tsx
// organisms/ProductCard/ProductCard.tsx
'use client';
import React, { useState } from 'react';
import { Button } from '@/app/components/atoms/Button';
import { PriceDisplay } from '@/app/components/molecules/PriceDisplay';
import { LikeButton } from '@/app/components/molecules/LikeButton';

export interface ProductCardProps {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  likes: number;
  onLike?: (id: string) => void;
  onBuy?: (id: string) => void;
}

/**
 * ProductCard Organism
 * 
 * A complete product card with image, pricing, likes, and purchase functionality.
 * Manages its own interaction state and provides callbacks for actions.
 */
export function ProductCard({
  id,
  title,
  imageUrl,
  price,
  likes,
  onLike,
  onBuy,
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(id);
  };

  const handleBuy = () => {
    onBuy?.(id);
  };

  return (
    <div
      className="rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={imageUrl} alt={title} className="w-full aspect-square object-cover" />
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        
        <div className="flex items-center justify-between mb-4">
          <PriceDisplay price={price} currency="ETH" />
          <LikeButton 
            likes={likes} 
            isLiked={isLiked} 
            onLike={handleLike} 
          />
        </div>

        <Button 
          variant="primary" 
          fullWidth 
          onClick={handleBuy}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;
```

### Barrel Export Pattern

```tsx
// organisms/ProductCard/index.ts
export { ProductCard, default } from './ProductCard';
export type { ProductCardProps } from './ProductCard';
```

## 🧪 Testing Organisms

Organisms require comprehensive integration tests:

```tsx
// ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProps = {
    id: '123',
    title: 'Test NFT',
    imageUrl: '/test.jpg',
    price: 1.5,
    likes: 42,
  };

  it('renders all components correctly', () => {
    render(<ProductCard {...mockProps} />);
    
    expect(screen.getByText('Test NFT')).toBeInTheDocument();
    expect(screen.getByAltText('Test NFT')).toBeInTheDocument();
    expect(screen.getByText(/1.5/)).toBeInTheDocument();
    expect(screen.getByText(/42/)).toBeInTheDocument();
  });

  it('calls onLike when like button is clicked', () => {
    const onLike = vi.fn();
    render(<ProductCard {...mockProps} onLike={onLike} />);
    
    fireEvent.click(screen.getByRole('button', { name: /like/i }));
    expect(onLike).toHaveBeenCalledWith('123');
  });

  it('calls onBuy when buy button is clicked', () => {
    const onBuy = vi.fn();
    render(<ProductCard {...mockProps} onBuy={onBuy} />);
    
    fireEvent.click(screen.getByRole('button', { name: /buy now/i }));
    expect(onBuy).toHaveBeenCalledWith('123');
  });

  it('toggles liked state', () => {
    render(<ProductCard {...mockProps} />);
    const likeButton = screen.getByRole('button', { name: /like/i });
    
    // Initial state
    expect(likeButton).not.toHaveClass('liked');
    
    // After click
    fireEvent.click(likeButton);
    expect(likeButton).toHaveClass('liked');
  });
});
```

**Test Coverage Goals:**
- ✅ All user interactions tested
- ✅ State changes verified
- ✅ Callback functions tested
- ✅ Loading/error states tested
- ✅ API calls mocked and tested
- ✅ Edge cases covered

## 📚 Best Practices

### ✅ Do's

```tsx
// ✅ Compose from smaller components
function Header() {
  return (
    <header>
      <Logo />
      <Navigation />
      <SearchBar />
      <UserMenu />
    </header>
  );
}

// ✅ Manage internal state
function Card() {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // ...
}

// ✅ Provide clear callback props
interface CardProps {
  onLike?: (id: string) => void;
  onBuy?: (id: string) => void;
  onShare?: (id: string) => void;
}

// ✅ Handle loading and error states
function UserProfile({ walletAddress }) {
  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage />;
  if (!user) return <NotFound />;
  return <ProfileContent user={user} />;
}

// ✅ Use TypeScript interfaces
export interface HeaderProps {
  user?: User;
  onLogout?: () => void;
}
```

### ❌ Don'ts

```tsx
// ❌ Don't make organisms too simple
function SimpleWrapper({ children }) {
  return <div className="wrapper">{children}</div>;
}
// This should be a utility or atom

// ❌ Don't make organisms too complex
function EverythingComponent() {
  // 1000+ lines
  // 20+ pieces of state
  // API calls, routing, forms, modals, etc.
  // Split this into multiple organisms!
}

// ❌ Don't couple tightly to specific data
function ProductCard() {
  const data = useContext(SpecificContext);  // Too coupled
  // Use props instead
}

// ❌ Don't duplicate logic
function Card1() {
  const handleLike = () => { /* logic */ };
  // ...
}
function Card2() {
  const handleLike = () => { /* same logic */ };
  // Extract to shared hook or utility
}

// ❌ Don't ignore accessibility
function Modal() {
  return <div onClick={onClose}>  {/* Missing keyboard support */}
    {content}
  </div>;
}
```

## 🎨 State Management

Organisms can manage state in several ways:

### 1. Local State (useState)
```tsx
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Good for UI-only state
}
```

### 2. Context (useContext)
```tsx
function Header() {
  const { theme, user } = useAppContext();
  // Good for global app state
}
```

### 3. API Calls (useEffect + fetch)
```tsx
function UserProfile({ walletAddress }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${walletAddress}`)
      .then(res => res.json())
      .then(setUser);
  }, [walletAddress]);
}
```

### 4. Custom Hooks
```tsx
function UserProfile({ walletAddress }) {
  const { user, loading, error } = useUser(walletAddress);
  // Good for reusable data fetching logic
}
```

## 🔄 Common Patterns

### Loading States
```tsx
function UserProfile({ walletAddress }) {
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return <ProfileSkeleton />;
  }
  
  return <ProfileContent />;
}
```

### Error Handling
```tsx
function DataCard() {
  const [error, setError] = useState<Error | null>(null);
  
  if (error) {
    return <ErrorBoundary error={error} retry={fetchData} />;
  }
  
  return <CardContent />;
}
```

### Optimistic Updates
```tsx
function LikeableCard() {
  const [likes, setLikes] = useState(initialLikes);
  
  const handleLike = async () => {
    setLikes(likes + 1);  // Optimistic update
    
    try {
      await api.like(id);
    } catch (error) {
      setLikes(likes);  // Rollback on error
    }
  };
}
```

## 📊 Organism Checklist

When creating or reviewing an organism, verify:

- [ ] **Composed**: Built from atoms and molecules
- [ ] **Complete**: Provides a full feature/section
- [ ] **Self-Contained**: Manages its own state and logic
- [ ] **Reusable**: Used in multiple contexts
- [ ] **Typed**: Full TypeScript support
- [ ] **Tested**: Integration tests cover main flows
- [ ] **Documented**: README with API docs and examples
- [ ] **Accessible**: WCAG 2.1 AA compliant
- [ ] **Responsive**: Works on all screen sizes
- [ ] **Loading States**: Handles async operations gracefully
- [ ] **Error Handling**: Fails gracefully with user feedback
- [ ] **Performance**: Optimized, no unnecessary re-renders

## 🔗 Related Documentation

- [Atoms](../atoms/README.md) - Basic building blocks
- [Molecules](../molecules/README.md) - Simple combinations
- [Templates](../templates/README.md) - Page layouts
- [Design Guidelines](../DESIGN_GUIDELINES.md) - Overall design system
- [Component Library](../README.md) - Full component overview

## 🤝 Contributing

When adding new organisms:

1. **Plan the Structure**: Identify atoms/molecules needed
2. **Define Props**: Clear TypeScript interfaces
3. **Implement Features**: Include loading/error states
4. **Add State Management**: Use appropriate state solution
5. **Write Tests**: Cover all user interactions and states
6. **Document Thoroughly**: README with examples and API docs
7. **Export Properly**: Named + default exports with types
8. **Update Barrel**: Add to `organisms/index.ts`
9. **Review Performance**: Optimize re-renders and data fetching

## 📚 Further Reading

- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)
- [Component Composition in React](https://reactjs.org/docs/composition-vs-inheritance.html)
- [React Hooks Best Practices](https://react.dev/reference/react)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles/)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

**Organisms Version:** 1.0.0  
**Last Updated:** November 2025  
**Maintained by:** Andromeda Design System Team
