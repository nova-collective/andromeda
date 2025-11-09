## Component Hierarchy

### **⚛️ Atoms** (`components/atoms/`)
The foundational building blocks of the UI. These are the smallest functional units that can't be broken down further without losing meaning.

**Examples:**
- `Button.tsx` - Basic button with variants (primary, secondary, ghost)
- `Input.tsx` - Text input field
- `Icon.tsx` - Wrapper for Lucide icons
- `Badge.tsx` - Label/tag component
- `Avatar.tsx` - User profile image
- `Spinner.tsx` - Loading indicator

```tsx
# 🧬 Andromeda Components - Atomic Design Architecture

This document describes the component architecture based on **Atomic Design methodology** by Brad Frost.

---

## 📚 Table of Contents

1. [Component Hierarchy](#component-hierarchy)
2. [Atomic Design Structure](#atomic-design-structure)
3. [Benefits](#benefits-of-atomic-design)
4. [Best Practices](#best-practices)
5. [Component Checklist](#component-checklist)
6. [Quick Start](#quick-start)
7. [Contributing](#contributing)

---

## Component Hierarchy

### ⚛️ **Atoms** (`components/atoms/`)

The foundational building blocks of the UI. These are the smallest functional units that can't be broken down further without losing meaning.

**Examples:**
- `Button.tsx` - Basic button with variants (primary, secondary, ghost)
- `Input.tsx` - Text input field
- `Icon.tsx` - Wrapper for Lucide icons
- `Badge.tsx` - Label/tag component
- `Avatar.tsx` - User profile image
- `Spinner.tsx` - Loading indicator

**Usage Example:**
```tsx
import { Button } from '@/components/atoms';

<Button variant="primary" size="lg">
  Connect Wallet
</Button>
```

**Characteristics:**
- ✅ Single responsibility
- ✅ Highly reusable
- ✅ No business logic
- ✅ Accept props for variants and states

---

### 🧪 **Molecules** (`components/molecules/`)

Simple component groups formed by combining atoms. They serve a single purpose and work together as a unit.

**Examples:**
- `SearchBar.tsx` - Input + Icon + Button
- `PriceDisplay.tsx` - Label + Price + Currency Icon
- `LikeButton.tsx` - Icon + Counter
- `CollectionBadge.tsx` - Avatar + Collection Name
- `WalletConnect.tsx` - Wallet Icon + Address + Disconnect Button

**Usage Example:**
```tsx
import { SearchBar } from '@/components/molecules';

<SearchBar 
  placeholder="Search items, collections..."
  onSearch={handleSearch}
/>
```

**Characteristics:**
- ✅ Combine 2-5 atoms
- ✅ Handle simple interactions
- ✅ Reusable across contexts
- ✅ May include local state

---

### 🦠 **Organisms** (`components/organisms/`)

Complex UI components that form distinct sections of the interface. They combine molecules and atoms to create meaningful sections.

**Examples:**
- `Header.tsx` - Logo + Navigation + SearchBar + ThemeToggle + WalletConnect
- `Card.tsx` - Image + Title + PriceDisplay + LikeButton + Actions
- `FilterPanel.tsx` - Multiple filter molecules organized together
- `CollectionHero.tsx` - Banner + Collection info + Stats
- `ItemGrid.tsx` - Grid layout with multiple Cards

**Usage Example:**
```tsx
import { Header } from '@/components/organisms';

<Header 
  navLinks={navigationLinks}
  user={currentUser}
/>
```

**Characteristics:**
- ✅ Compose multiple molecules/atoms
- ✅ Handle complex interactions
- ✅ May connect to context/state
- ✅ Represent standalone sections

---

### 📋 **Templates** (`components/templates/`)

Page-level layouts that define structure without specific content. They establish the arrangement of organisms and provide the wireframe for pages.

**Examples:**
- `MarketplaceTemplate.tsx` - Header + FilterPanel + ItemGrid + Footer
- `ItemDetailTemplate.tsx` - Header + Hero + Details + RelatedItems
- `ProfileTemplate.tsx` - Header + ProfileHeader + Tabs + Content
- `DashboardTemplate.tsx` - Sidebar + Main Content + Activity Feed

**Usage Example:**
```tsx
import { MarketplaceTemplate } from '@/components/templates';

<MarketplaceTemplate
  filters={<FilterPanel />}
  content={<ItemGrid items={items} />}
/>
```

**Characteristics:**
- ✅ Define page structure
- ✅ No hardcoded content
- ✅ Accept organisms as props
- ✅ Responsive layout logic

---

### 📱 **Pages** (`app/` or `pages/`)

Specific instances of templates populated with real content and data. These are the actual routes users navigate to.

**Examples:**
- `app/page.tsx` - Homepage with trending items
- `app/explore/page.tsx` - Browse all collections
- `app/item/[id]/page.tsx` - Individual item detail
- `app/profile/[address]/page.tsx` - User profile

**Usage Example:**
```tsx
export default function HomePage() {
  const trendingItems = useTrendingItems();
  
  return (
    <MarketplaceTemplate
      filters={<HomeFilters />}
      content={<ItemGrid items={trendingItems} />}
    />
  );
}
```

---

## Atomic Design Structure

```
components/
│
├── atoms/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Icon.tsx
│   ├── Badge.tsx
│   ├── Avatar.tsx
│   ├── Spinner.tsx
│   └── index.ts
│
├── molecules/
│   ├── SearchBar.tsx
│   ├── PriceDisplay.tsx
│   ├── LikeButton.tsx
│   ├── CollectionBadge.tsx
│   ├── WalletConnect.tsx
│   ├── ThemeToggle.tsx
│   └── index.ts
│
├── organisms/
│   ├── Header.tsx
│   ├── Card.tsx
│   ├── FilterPanel.tsx
│   ├── CollectionHero.tsx
│   ├── ItemGrid.tsx
│   ├── Footer.tsx
│   └── index.ts
│
├── templates/
│   ├── MarketplaceTemplate.tsx
│   ├── ItemDetailTemplate.tsx
│   ├── ProfileTemplate.tsx
│   └── index.ts
│
├── providers/
│   ├── ThemeProvider.tsx
│   ├── WalletProvider.tsx
│   └── DataProvider.tsx
│
└── index.ts (Barrel export)
```

---

## Benefits of Atomic Design

### 1. 🎯 **Consistency**
Reusing the same atoms ensures visual and functional consistency across the entire application.

### 2. 📈 **Scalability**
New features are built by composing existing components, reducing development time.

### 3. 🔧 **Maintainability**
Changes to atoms automatically propagate to all molecules and organisms that use them.

### 4. ✅ **Testing**
Test atoms independently, then test how they compose into larger structures.

### 5. 📖 **Documentation**
Clear hierarchy makes it easy to document and onboard new developers.

### 6. 🤝 **Collaboration**
Designers and developers speak the same language when discussing UI components.

---

## Best Practices

### 1. Single Responsibility

Each component should do one thing well.

```tsx
// ❌ Bad: Button with built-in loading state and icon
<ButtonWithLoadingAndIcon />

// ✅ Good: Composable pieces
<Button disabled={isLoading}>
  {isLoading ? <Spinner /> : <Icon name="wallet" />}
  Connect
</Button>
```

### 2. Prop Drilling Prevention

Use Context API for deeply nested props.

```tsx
// Use ThemeProvider instead of passing theme prop everywhere
const { theme, toggleTheme } = useTheme();
```

### 3. Composition Over Configuration

Prefer children/render props over large prop objects.

```tsx
// ✅ Good: Flexible composition
<Card>
  <CardImage src="..." />
  <CardContent>
    <CardTitle>Item Name</CardTitle>
    <CardPrice>2.5 ETH</CardPrice>
  </CardContent>
</Card>
```

### 4. TypeScript for Type Safety

Define clear interfaces for all component props.

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

---

## Component Checklist

Before marking a component as complete:

- [ ] Placed in correct atomic level folder
- [ ] TypeScript props interface defined
- [ ] Responsive design implemented
- [ ] Dark mode support added
- [ ] Accessibility attributes included (ARIA labels, keyboard nav)
- [ ] Hover/focus states styled
- [ ] Loading states handled (if applicable)
- [ ] Error states handled (if applicable)
- [ ] Usage example documented
- [ ] Exported from barrel file (`index.ts`)

---

## Design System Integration

Our atomic components implement the **OpenSea-inspired design system**:

- **Color Palette**: Primary blue (#2081e2), dark theme backgrounds
- **Typography**: Inter font family
- **Spacing**: Tailwind's 4px increment system
- **Shadows**: Subtle in light mode, pronounced in dark mode
- **Animations**: Smooth 200-300ms transitions
- **Border Radius**: 12-16px for modern, rounded aesthetic

See the [Design Guidelines](../../docs/DESIGN_GUIDELINES.md) for complete specifications.

---

## Quick Start

### Import Components

```tsx
import { Button, Input } from '@/components/atoms';
import { SearchBar, WalletConnect } from '@/components/molecules';
import { Header, Card } from '@/components/organisms';
import { MarketplaceTemplate } from '@/components/templates';
```

### Build a Page

```tsx
export default function MyPage() {
  return (
    <MarketplaceTemplate>
      <Header />
      <main>
        <SearchBar placeholder="Search items..." />
        <div className="grid grid-cols-3 gap-6">
          <Card title="Item 1" price="2.5 ETH" />
          <Card title="Item 2" price="1.8 ETH" />
          <Card title="Item 3" price="3.2 ETH" />
        </div>
      </main>
    </MarketplaceTemplate>
  );
}
```

---

## Contributing

When contributing new components:

1. **Identify the appropriate atomic level**
2. **Check if a similar component exists** (reuse when possible)
3. **Follow naming conventions**: `PascalCase.tsx`
4. **Add TypeScript interfaces** for all props
5. **Include usage examples** in comments
6. **Update this documentation** if adding new patterns

---

## Further Reading

- [Atomic Design by Brad Frost](https://bradfrost.com/blog/post/atomic-web-design/)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [Component-Driven Development](https://www.componentdriven.org/)
- [Design Systems Handbook](https://www.designbetter.co/design-systems-handbook)

---

## Support

For questions about component architecture or atomic design implementation:

- 📝 Open an issue with the `component-structure` label
- 💬 Join our Discord community
- 📚 Check the [Component Documentation](../../docs/components.md)

---

<p align="center">Made with ❤️ following Atomic Design principles</p>

🧪 Molecules (components/molecules/)
Simple component groups formed by combining atoms. They serve a single purpose and work together as a unit.

Examples:

SearchBar.tsx - Input + Icon + Button
PriceDisplay.tsx - Label + Price + Currency Icon
LikeButton.tsx - Icon + Counter
CollectionBadge.tsx - Avatar + Collection Name
WalletConnect.tsx - Wallet Icon + Address + Disconnect Button

// Example: SearchBar Molecule
<SearchBar 
  placeholder="Search items, collections..."
  onSearch={handleSearch}
/>

Characteristics:

Combine 2-5 atoms
Handle simple interactions
Reusable across contexts
May include local state

 Organisms (components/organisms/)
Complex UI components that form distinct sections of the interface. They combine molecules and atoms to create meaningful sections.

Examples:

Header.tsx - Logo + Navigation + SearchBar + ThemeToggle + WalletConnect
Card.tsx - Image + Title + PriceDisplay + LikeButton + Actions
FilterPanel.tsx - Multiple filter molecules organized together
CollectionHero.tsx - Banner + Collection info + Stats
ItemGrid.tsx - Grid layout with multiple Cards

// Example: Header Organism
<Header 
  navLinks={navigationLinks}
  user={currentUser}
/>

Characteristics:

Compose multiple molecules/atoms
Handle complex interactions
May connect to context/state
Represent standalone sections

📋 Templates (components/templates/)
Page-level layouts that define structure without specific content. They establish the arrangement of organisms and provide the wireframe for pages.

Examples:

MarketplaceTemplate.tsx - Header + FilterPanel + ItemGrid + Footer
ItemDetailTemplate.tsx - Header + Hero + Details + RelatedItems
ProfileTemplate.tsx - Header + ProfileHeader + Tabs + Content
DashboardTemplate.tsx - Sidebar + Main Content + Activity Feed

// Example: Marketplace Template<MarketplaceTemplate  filters={<FilterPanel />}  content={<ItemGrid items={items} />}/>

// Example: Marketplace Template
<MarketplaceTemplate
  filters={<FilterPanel />}
  content={<ItemGrid items={items} />}
/>

Characteristics:

Define page structure
No hardcoded content
Accept organisms as props
Responsive layout logic

Pages (app/ or pages/)
Specific instances of templates populated with real content and data. These are the actual routes users navigate to.

Examples:

app/page.tsx - Homepage with trending items
app/explore/page.tsx - Browse all collections
app/item/[id]/page.tsx - Individual item detail
app/profile/[address]/page.tsx - User profile

// Example: Home Page
export default function HomePage() {
  const trendingItems = useTrendingItems();
  
  return (
    <MarketplaceTemplate
      filters={<HomeFilters />}
      content={<ItemGrid items={trendingItems} />}
    />
  );
}

components/
│
├── atoms/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Icon.tsx
│   ├── Badge.tsx
│   ├── Avatar.tsx
│   ├── Spinner.tsx
│   └── Image.tsx
│
├── molecules/
│   ├── SearchBar.tsx
│   ├── PriceDisplay.tsx
│   ├── LikeButton.tsx
│   ├── CollectionBadge.tsx
│   ├── WalletConnect.tsx
│   ├── ThemeToggle.tsx
│   └── ActionButtons.tsx
│
├── organisms/
│   ├── Header.tsx
│   ├── Card.tsx
│   ├── FilterPanel.tsx
│   ├── CollectionHero.tsx
│   ├── ItemGrid.tsx
│   ├── Footer.tsx
│   └── ActivityFeed.tsx
│
├── templates/
│   ├── MarketplaceTemplate.tsx
│   ├── ItemDetailTemplate.tsx
│   ├── ProfileTemplate.tsx
│   └── DashboardTemplate.tsx
│
└── providers/
    ├── ThemeProvider.tsx
    ├── WalletProvider.tsx
    └── DataProvider.tsx

    Benefits of Atomic Design
1. Consistency
Reusing the same atoms ensures visual and functional consistency across the entire application.

2. Scalability
New features are built by composing existing components, reducing development time.

3. Maintainability
Changes to atoms automatically propagate to all molecules and organisms that use them.

4. Testing
Test atoms independently, then test how they compose into larger structures.

5. Documentation
Clear hierarchy makes it easy to document and onboard new developers.

6. Collaboration
Designers and developers speak the same language when discussing UI components.

Best Practices
1. Single Responsibility
Each component should do one thing well.

// ❌ Bad: Button with built-in loading state and icon
<ButtonWithLoadingAndIcon />

// ✅ Good: Composable pieces
<Button disabled={isLoading}>
  {isLoading ? <Spinner /> : <Icon name="wallet" />}
  Connect
</Button>

Prop Drilling Prevention
Use Context API for deeply nested props.

// Use ThemeProvider instead of passing theme prop everywhere
const { theme, toggleTheme } = useTheme();

 Composition Over Configuration
Prefer children/render props over large prop objects.

/ ✅ Good: Flexible composition
<Card>
  <CardImage src="..." />
  <CardContent>
    <CardTitle>Item Name</CardTitle>
    <CardPrice>2.5 ETH</CardPrice>
  </CardContent>
</Card>

TypeScript for Type Safety
Define clear interfaces for all component props.

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

Further Reading
Atomic Design by Brad Frost
Atomic Design Methodology
Component-Driven Development
Design Systems Handbook

Contributing
When contributing new components:

Identify the appropriate atomic level
Check if a similar component exists (reuse when possible)
Follow naming conventions: PascalCase.tsx
Add TypeScript interfaces for all props
Include usage examples in comments
Update this documentation if adding new patterns
📝 Component Checklist
Before marking a component as complete:

 Placed in correct atomic level folder
 TypeScript props interface defined
 Responsive design implemented
 Dark mode support added
 Accessibility attributes included (ARIA labels, keyboard nav)
 Hover/focus states styled
 Loading states handled (if applicable)
 Error states handled (if applicable)
 Usage example documented
 Exported from barrel file (index.ts)
🎨 Design System Integration
Our atomic components implement the OpenSea-inspired design system:

Color Palette: Primary blue (#2081e2), dark theme backgrounds
Typography: Inter font family
Spacing: Tailwind's 4px increment system
Shadows: Subtle in light mode, pronounced in dark mode
Animations: Smooth 200-300ms transitions
Border Radius: 12-16px for modern, rounded aesthetic
See the Design Guidelines section for complete specifications.

🚀 Quick Start with Atomic Components


import { Button, Input } from '@/components/atoms';
import { SearchBar, WalletConnect } from '@/components/molecules';
import { Header, Card } from '@/components/organisms';
import { MarketplaceTemplate } from '@/components/templates';

export default function MyPage() {
  return (
    <MarketplaceTemplate>
      <Header />
      <main>
        <SearchBar placeholder="Search items..." />
        <div className="grid grid-cols-3 gap-6">
          <Card title="Item 1" price="2.5 ETH" />
          <Card title="Item 2" price="1.8 ETH" />
          <Card title="Item 3" price="3.2 ETH" />
        </div>
      </main>
    </MarketplaceTemplate>
  );
}

Support
For questions about component architecture or atomic design implementation, please:

Open an issue with the component-structure label
Join our Discord community
Check the Component Documentation


---

## 🎯 Additional Files to Create

### **1. Component Documentation** (`docs/components.md`)

```markdown
# Component Documentation

Detailed API documentation for each atomic level.

## Atoms

### Button
Versatile button component with multiple variants.

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `onClick`: () => void

**Usage:**
\`\`\`tsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>
\`\`\`

---

[Continue for each component...]