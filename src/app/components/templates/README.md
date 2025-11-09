# 📐 Templates - Page Layout Components

The **Templates** layer provides page-level layout components that define the overall structure of pages. Templates combine organisms, molecules, and atoms to create complete, reusable page layouts with defined content areas. They focus on structure and composition rather than specific content.

## 📋 Overview

**Level:** 4 - Layout Layer  
**Category:** Page Structure  
**Complexity:** Medium  
**Reusability:** High

Templates are structural components that:
- Define overall page layout and structure
- Combine multiple organisms and smaller components
- Are content-agnostic (accept children, slots, or props)
- Establish responsive breakpoints and behavior
- Provide consistent page experiences across the app
- Bridge the gap between organisms and actual pages
- Focus on "where" things go, not "what" they are

## 🎯 Philosophy

> "Templates consist mostly of groups of organisms stitched together to form pages. It's here where we start to see the design coming together and start seeing things like layout in action."
> — Brad Frost, Atomic Design

In the Andromeda design system, templates represent:
- **Structure Over Content**: Define layout, not what fills it
- **Reusability**: Same template, different content
- **Consistency**: Standardized page structures
- **Flexibility**: Accept various content through props/children
- **Responsive**: Handle layout changes across breakpoints

## 📦 Available Templates

### 🎯 GridLayout

Responsive grid layout for organizing card-based content.

**Import:**
```tsx
import { GridLayout } from '@/app/components/templates';
// or
import GridLayout from '@/app/components/templates/GridLayout';
```

**Purpose:**
- Display items in responsive grid
- Automatically adjust columns per breakpoint
- Perfect for galleries, catalogs, dashboards

**Features:**
- ✅ Responsive columns (1/2/3/4 default for sm/md/lg/xl)
- ✅ Custom column configuration per breakpoint
- ✅ Consistent gap spacing (24px)
- ✅ Fade-in animation
- ✅ Works with any child components
- ✅ Zero configuration defaults

**Basic Usage:**
```tsx
import { GridLayout } from '@/app/components/templates';

function NFTGallery({ nfts }) {
  return (
    <GridLayout>
      {nfts.map(nft => (
        <Card key={nft.id} {...nft} />
      ))}
    </GridLayout>
  );
}
```

**Custom Columns:**
```tsx
// 6 columns on extra large screens
<GridLayout cols={{ sm: 1, md: 2, lg: 4, xl: 6 }}>
  {products.map(product => (
    <ProductCard key={product.id} {...product} />
  ))}
</GridLayout>
```

**Props:**
```tsx
interface GridLayoutProps {
  children: ReactNode;     // Content to display in grid
  cols?: {                 // Responsive column config
    sm?: number;          // Small screens (default: 1)
    md?: number;          // Medium screens (default: 2)
    lg?: number;          // Large screens (default: 3)
    xl?: number;          // Extra large screens (default: 4)
  };
}
```

**See Also:** [GridLayout README](./GridLayout/README.md)

---

## 🎨 Template Patterns

### Content Container Pattern

Templates that wrap content with structure:

```tsx
// Template provides structure
export function ContentLayout({ children, sidebar }) {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-3">
          {sidebar}
        </aside>
        <main className="col-span-9">
          {children}
        </main>
      </div>
    </div>
  );
}

// Page provides content
function BlogPage() {
  return (
    <ContentLayout sidebar={<BlogSidebar />}>
      <BlogPost />
    </ContentLayout>
  );
}
```

### Slot-Based Pattern

Templates with named slots for different areas:

```tsx
// Template with multiple slots
interface DashboardLayoutProps {
  header: ReactNode;
  sidebar: ReactNode;
  main: ReactNode;
  footer?: ReactNode;
}

export function DashboardLayout({ header, sidebar, main, footer }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50">
        {header}
      </header>
      <div className="flex-1 flex">
        <aside className="w-64">
          {sidebar}
        </aside>
        <main className="flex-1">
          {main}
        </main>
      </div>
      {footer && (
        <footer>
          {footer}
        </footer>
      )}
    </div>
  );
}

// Usage with specific content
function AdminDashboard() {
  return (
    <DashboardLayout
      header={<AdminHeader />}
      sidebar={<AdminSidebar />}
      main={<AdminContent />}
      footer={<AdminFooter />}
    />
  );
}
```

### Render Props Pattern

Templates that provide layout control through render props:

```tsx
// Template with render props
export function SplitLayout({ renderLeft, renderRight, leftWidth = '50%' }) {
  return (
    <div className="flex">
      <div style={{ width: leftWidth }}>
        {renderLeft()}
      </div>
      <div style={{ width: `calc(100% - ${leftWidth})` }}>
        {renderRight()}
      </div>
    </div>
  );
}

// Usage
<SplitLayout
  leftWidth="40%"
  renderLeft={() => <ImageGallery />}
  renderRight={() => <ProductDetails />}
/>
```

## 🚀 Usage Guidelines

### When to Create a Template

Create a template when you need:
- ✅ Reusable page layout structure used across multiple pages
- ✅ Consistent layout patterns (grid, sidebar, dashboard, auth)
- ✅ Responsive layout management at the page level
- ✅ To separate structure from content
- ✅ Multiple pages sharing the same layout skeleton
- ✅ Complex layouts with multiple defined areas

### When NOT to Create a Template

Don't create a template if:
- ❌ Layout is used only once (just create it in the page)
- ❌ It's too simple (just a wrapper div - use utility classes)
- ❌ It's too specific to content (becomes a page component)
- ❌ You're just grouping unrelated components
- ❌ A simple flex or grid utility would suffice

## 📐 Template Structure

Every template should follow this structure:

```
templates/
  TemplateName/
    TemplateName.tsx      # Template implementation
    TemplateName.test.tsx # Unit tests
    README.md             # Template documentation
    index.ts              # Barrel export
```

### Example Template Implementation

```tsx
// templates/MarketplaceLayout/MarketplaceLayout.tsx
'use client';
import React, { ReactNode } from 'react';

export interface MarketplaceLayoutProps {
  /** Header content (typically navigation) */
  header?: ReactNode;
  /** Filter sidebar content */
  filters?: ReactNode;
  /** Main content area */
  children: ReactNode;
  /** Right sidebar (optional, for ads or featured) */
  sidebar?: ReactNode;
  /** Show/hide filters on mobile */
  showFilters?: boolean;
}

/**
 * MarketplaceLayout Template
 * 
 * Page layout for marketplace/catalog pages with header, filters,
 * main content area, and optional sidebar.
 * 
 * @example
 * ```tsx
 * <MarketplaceLayout
 *   header={<Header />}
 *   filters={<ProductFilters />}
 *   sidebar={<FeaturedProducts />}
 * >
 *   <GridLayout>
 *     {products.map(p => <ProductCard key={p.id} {...p} />)}
 *   </GridLayout>
 * </MarketplaceLayout>
 * ```
 */
export function MarketplaceLayout({
  header,
  filters,
  children,
  sidebar,
  showFilters = true,
}: MarketplaceLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {header && (
        <header className="sticky top-0 z-50">
          {header}
        </header>
      )}

      {/* Main Content Area */}
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Filters Sidebar */}
          {showFilters && filters && (
            <aside className="col-span-12 lg:col-span-3">
              <div className="sticky top-24">
                {filters}
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className={`col-span-12 ${showFilters ? 'lg:col-span-6' : 'lg:col-span-9'} ${sidebar ? 'xl:col-span-6' : 'xl:col-span-9'}`}>
            {children}
          </main>

          {/* Right Sidebar */}
          {sidebar && (
            <aside className="hidden xl:block xl:col-span-3">
              <div className="sticky top-24">
                {sidebar}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarketplaceLayout;
```

### Barrel Export

```tsx
// templates/MarketplaceLayout/index.ts
export { MarketplaceLayout, default } from './MarketplaceLayout';
export type { MarketplaceLayoutProps } from './MarketplaceLayout';
```

## 🧪 Testing Templates

Templates should be tested for layout structure:

```tsx
// MarketplaceLayout.test.tsx
import { render, screen } from '@testing-library/react';
import { MarketplaceLayout } from './MarketplaceLayout';

describe('MarketplaceLayout', () => {
  it('renders all layout sections when provided', () => {
    render(
      <MarketplaceLayout
        header={<div>Header</div>}
        filters={<div>Filters</div>}
        sidebar={<div>Sidebar</div>}
      >
        <div>Main Content</div>
      </MarketplaceLayout>
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
    expect(screen.getByText('Sidebar')).toBeInTheDocument();
  });

  it('hides filters when showFilters is false', () => {
    render(
      <MarketplaceLayout
        filters={<div>Filters</div>}
        showFilters={false}
      >
        <div>Main Content</div>
      </MarketplaceLayout>
    );

    expect(screen.queryByText('Filters')).not.toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('adjusts layout when sidebar is not provided', () => {
    const { container } = render(
      <MarketplaceLayout>
        <div>Main Content</div>
      </MarketplaceLayout>
    );

    const main = container.querySelector('main');
    expect(main).toHaveClass('lg:col-span-9');
  });

  it('renders without optional sections', () => {
    render(
      <MarketplaceLayout>
        <div>Main Content Only</div>
      </MarketplaceLayout>
    );

    expect(screen.getByText('Main Content Only')).toBeInTheDocument();
  });
});
```

**Test Coverage Goals:**
- ✅ All slots/sections render correctly
- ✅ Conditional rendering works (show/hide sections)
- ✅ Layout adjusts based on props
- ✅ Responsive classes applied correctly
- ✅ Sticky positioning and z-index work
- ✅ Edge cases (no content, all content, etc.)

## 📚 Best Practices

### ✅ Do's

```tsx
// ✅ Keep templates content-agnostic
<GridLayout>
  {items.map(item => <Card key={item.id} {...item} />)}
</GridLayout>

// ✅ Accept children or slots for flexibility
interface LayoutProps {
  header: ReactNode;
  children: ReactNode;
  sidebar?: ReactNode;
}

// ✅ Provide sensible defaults
function GridLayout({ cols = { sm: 1, md: 2, lg: 3, xl: 4 }, children }) {
  // ...
}

// ✅ Make templates responsive
<div className="col-span-12 md:col-span-8 lg:col-span-6">
  {children}
</div>

// ✅ Use semantic HTML
<header>{headerContent}</header>
<main>{mainContent}</main>
<aside>{sidebarContent}</aside>
<footer>{footerContent}</footer>

// ✅ Document expected content types
/**
 * @param header - Header component (typically <Header />)
 * @param children - Main content (typically <GridLayout> with cards)
 */

// ✅ Export TypeScript interfaces
export interface DashboardLayoutProps { }
```

### ❌ Don'ts

```tsx
// ❌ Don't put business logic in templates
function GridLayout({ children, onItemClick }) {
  // Fetching data, handling clicks - NO!
  const data = useFetch('/api/data');
  return <div onClick={onItemClick}>{children}</div>;
}

// ❌ Don't make templates too specific
function NFTGalleryOnlyLayout({ nfts }) {
  return <div>{nfts.map(nft => <NFTCard {...nft} />)}</div>;
}
// This is a page component, not a template!

// ❌ Don't hardcode content
function LayoutWithHardcodedHeader() {
  return (
    <div>
      <header>My Hardcoded Header</header>  {/* NO! */}
      {children}
    </div>
  );
}

// ❌ Don't use too many props (slots are better)
function ComplexLayout({
  header, subheader, nav, sidebar, main, footer,
  rightSidebar, topBar, bottomBar, modal  // Too many!
}) { }

// ❌ Don't include state management
function StatefulLayout() {
  const [data, setData] = useState();  // Templates shouldn't manage state
  // ...
}

// ❌ Don't over-engineer simple layouts
// If all you need is a container with padding:
<div className="container mx-auto px-4">{children}</div>
// Don't create a template for this!
```

## 🔄 Common Template Patterns

### Authentication Layout

```tsx
export function AuthLayout({ children, illustration }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Form Side */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      
      {/* Illustration Side */}
      <div className="hidden md:block bg-gradient-to-br from-primary-500 to-purple-600">
        <div className="h-full flex items-center justify-center p-12">
          {illustration}
        </div>
      </div>
    </div>
  );
}

// Usage
<AuthLayout illustration={<LoginIllustration />}>
  <LoginForm />
</AuthLayout>
```

### Dashboard Layout

```tsx
export function DashboardLayout({ sidebar, header, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-dark-800 z-50
        transform transition-transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {sidebar}
      </aside>

      {/* Main Area */}
      <div className="md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-dark-800 border-b">
          <div className="flex items-center justify-between p-4">
            <button 
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu />
            </button>
            {header}
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Two-Column Layout

```tsx
export function TwoColumnLayout({ 
  left, 
  right, 
  leftWidth = 'lg:w-1/2',
  sticky = false 
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className={leftWidth}>
          {left}
        </div>

        {/* Right Column */}
        <div className={sticky ? 'lg:sticky lg:top-24 lg:self-start' : ''}>
          {right}
        </div>
      </div>
    </div>
  );
}

// Usage
<TwoColumnLayout
  left={<ImageGallery />}
  right={<ProductDetails />}
  sticky
/>
```

## 🎯 Future Templates (Roadmap)

Potential templates to add:

### DashboardLayout
```tsx
// Full dashboard with sidebar, header, breadcrumbs
<DashboardLayout
  sidebar={<AdminSidebar />}
  header={<DashboardHeader />}
  breadcrumbs={<Breadcrumbs />}
>
  <DashboardContent />
</DashboardLayout>
```

### AuthLayout
```tsx
// Split screen auth layout
<AuthLayout illustration={<LoginArt />}>
  <LoginForm />
</AuthLayout>
```

### MarketplaceLayout
```tsx
// Filters + content + sidebar
<MarketplaceLayout
  filters={<ProductFilters />}
  sidebar={<FeaturedItems />}
>
  <ProductGrid />
</MarketplaceLayout>
```

### BlogLayout
```tsx
// Article layout with sidebar
<BlogLayout
  header={<BlogHeader />}
  sidebar={<RecentPosts />}
  author={<AuthorCard />}
>
  <ArticleContent />
</BlogLayout>
```

### ProfileLayout
```tsx
// User profile with tabs
<ProfileLayout
  cover={<CoverImage />}
  avatar={<ProfileAvatar />}
  tabs={<ProfileTabs />}
>
  <ProfileContent />
</ProfileLayout>
```

## 📊 Template Checklist

When creating or reviewing a template, verify:

- [ ] **Content-Agnostic**: Doesn't depend on specific content
- [ ] **Reusable**: Used across multiple pages
- [ ] **Responsive**: Works on all screen sizes
- [ ] **Flexible**: Accepts various content through props/children
- [ ] **Semantic HTML**: Uses appropriate HTML elements
- [ ] **Typed**: Full TypeScript support
- [ ] **Tested**: Layout structure is tested
- [ ] **Documented**: README with usage examples
- [ ] **Accessible**: Proper heading hierarchy, landmarks
- [ ] **Performant**: No unnecessary re-renders
- [ ] **Composable**: Works with organisms and molecules
- [ ] **Consistent**: Follows design system patterns

## 🔗 Related Documentation

- [Atoms](../atoms/README.md) - Basic building blocks
- [Molecules](../molecules/README.md) - Simple combinations
- [Organisms](../organisms/README.md) - Complex components
- [Pages](../../pages/README.md) - Actual pages using templates
- [Design Guidelines](../DESIGN_GUIDELINES.md) - Overall design system
- [Component Library](../README.md) - Full component overview

## 🤝 Contributing

When adding new templates:

1. **Identify Pattern**: Find common layout patterns across pages
2. **Define Structure**: Plan layout areas and slots
3. **Choose Pattern**: Children, slots, or render props
4. **Make Responsive**: Handle all breakpoints
5. **Add Flexibility**: Optional sections, configurable widths
6. **Type Everything**: Complete TypeScript interfaces
7. **Write Tests**: Test layout structure and variations
8. **Document Thoroughly**: README with examples
9. **Export Properly**: Named + default exports with types
10. **Update Barrel**: Add to `templates/index.ts`

## 📚 Further Reading

- [Atomic Design Templates](https://bradfrost.com/blog/post/atomic-web-design/)
- [React Composition Patterns](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)
- [Layout Components in React](https://www.patterns.dev/posts/layout-pattern)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Responsive Web Design](https://web.dev/responsive-web-design-basics/)

---

**Templates Version:** 1.0.0  
**Last Updated:** November 2025  
**Maintained by:** Andromeda Design System Team
