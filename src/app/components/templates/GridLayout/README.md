# 🎯 GridLayout - Responsive Grid Template

A flexible, responsive grid layout template component that automatically adjusts columns based on screen size. Perfect for organizing card-based content like NFT galleries, product listings, dashboards, and content grids.

## 📋 Overview

**Type:** Template Component  
**Category:** Layout  
**Complexity:** Low  
**Reusability:** Very High

The GridLayout template is a layout component that:
- Provides responsive grid layout with automatic column adjustments
- Supports custom column configurations per breakpoint
- Includes smooth fade-in animation
- Works seamlessly with any child components
- Follows mobile-first responsive design
- Uses Tailwind CSS grid utilities

## 🎯 Features

- ✅ **Responsive Design**: Automatically adjusts columns for mobile, tablet, desktop, and wide screens
- ✅ **Flexible Configuration**: Customize columns per breakpoint (sm, md, lg, xl)
- ✅ **Fade-in Animation**: Smooth appearance with built-in animation
- ✅ **Gap Management**: Consistent 1.5rem (24px) gap between grid items
- ✅ **TypeScript Support**: Full type safety with exported interfaces
- ✅ **Zero Configuration**: Works great with sensible defaults (1/2/3/4 columns)
- ✅ **Component Agnostic**: Works with any child components

## 📦 Installation

This component is part of the Andromeda component library. No additional dependencies required.

## 🚀 Usage

### Basic Usage (Default Configuration)

The simplest way to use GridLayout with default responsive columns:

```tsx
import { GridLayout } from '@/app/components/templates/GridLayout';
import { Card } from '@/app/components/organisms/Card';

function Gallery() {
  const items = [
    { id: 1, title: 'NFT #1', price: 1.5 },
    { id: 2, title: 'NFT #2', price: 2.0 },
    { id: 3, title: 'NFT #3', price: 0.8 },
    { id: 4, title: 'NFT #4', price: 3.2 },
  ];

  return (
    <GridLayout>
      {items.map(item => (
        <Card key={item.id} title={item.title} price={item.price} />
      ))}
    </GridLayout>
  );
}
```

**Default Responsive Behavior:**
- Mobile (sm): 1 column
- Tablet (md): 2 columns
- Desktop (lg): 3 columns
- Wide Desktop (xl): 4 columns

### Custom Column Configuration

Override the default columns for any breakpoint:

```tsx
import { GridLayout } from '@/app/components/templates/GridLayout';

// More columns for large screens
<GridLayout cols={{ sm: 1, md: 2, lg: 4, xl: 6 }}>
  {products.map(product => (
    <ProductCard key={product.id} {...product} />
  ))}
</GridLayout>

// Consistent 2 columns across all sizes
<GridLayout cols={{ sm: 2, md: 2, lg: 2, xl: 2 }}>
  {features.map(feature => (
    <FeatureCard key={feature.id} {...feature} />
  ))}
</GridLayout>

// Single column on mobile, many on desktop
<GridLayout cols={{ sm: 1, md: 3, lg: 5, xl: 7 }}>
  {avatars.map(avatar => (
    <Avatar key={avatar.id} {...avatar} />
  ))}
</GridLayout>
```

### With Different Content Types

GridLayout works with any child components:

```tsx
// With Cards
<GridLayout>
  {nfts.map(nft => (
    <Card key={nft.id} {...nft} />
  ))}
</GridLayout>

// With Images
<GridLayout cols={{ sm: 2, md: 3, lg: 4 }}>
  {images.map(img => (
    <img key={img.id} src={img.url} alt={img.alt} className="rounded-lg" />
  ))}
</GridLayout>

// With Custom Components
<GridLayout>
  {stats.map(stat => (
    <StatWidget key={stat.id} {...stat} />
  ))}
</GridLayout>

// With Mixed Content
<GridLayout cols={{ sm: 1, md: 2, lg: 3 }}>
  <Card {...item1} />
  <AdBanner />
  <Card {...item2} />
  <FeaturedCard {...featured} />
</GridLayout>
```

### Empty State Handling

```tsx
import { GridLayout } from '@/app/components/templates/GridLayout';

function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <GridLayout>
      {products.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </GridLayout>
  );
}
```

### With Loading Skeletons

```tsx
import { GridLayout } from '@/app/components/templates/GridLayout';

function NFTGallery({ nfts, loading }) {
  if (loading) {
    return (
      <GridLayout>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </GridLayout>
    );
  }

  return (
    <GridLayout>
      {nfts.map(nft => (
        <NFTCard key={nft.id} {...nft} />
      ))}
    </GridLayout>
  );
}
```

## 🔧 API Reference

### GridLayout Props

```tsx
interface GridLayoutProps {
  children: ReactNode;     // Required: Elements to render in the grid
  cols?: {                 // Optional: Responsive column configuration
    sm?: number;          // Small screens (mobile) - default: 1
    md?: number;          // Medium screens (tablet) - default: 2
    lg?: number;          // Large screens (desktop) - default: 3
    xl?: number;          // Extra large screens (wide) - default: 4
  };
}
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | ✅ Yes | - | Child elements to render in the grid |
| `cols` | `GridColumnsConfig` | ❌ No | `{ sm: 1, md: 2, lg: 3, xl: 4 }` | Responsive column configuration |
| `cols.sm` | `number` | ❌ No | `1` | Columns on small screens (≥640px) |
| `cols.md` | `number` | ❌ No | `2` | Columns on medium screens (≥768px) |
| `cols.lg` | `number` | ❌ No | `3` | Columns on large screens (≥1024px) |
| `cols.xl` | `number` | ❌ No | `4` | Columns on extra large screens (≥1280px) |

### Breakpoint Reference

Based on Tailwind CSS default breakpoints:

| Breakpoint | Min Width | Typical Device | Default Columns |
|------------|-----------|----------------|-----------------|
| `sm` | 640px | Mobile (large) | 1 |
| `md` | 768px | Tablet | 2 |
| `lg` | 1024px | Desktop | 3 |
| `xl` | 1280px | Wide Desktop | 4 |

## 🎨 Styling

### Default Styles

GridLayout applies these styles by default:

```css
/* Grid container */
.grid {
  display: grid;
  gap: 1.5rem;  /* 24px gap between items */
}

/* Fade-in animation */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Customizing Gap

Currently, the gap is fixed at `1.5rem` (24px). To customize, you can wrap GridLayout:

```tsx
// Custom wrapper with different gap
function TightGridLayout({ children, cols }) {
  return (
    <div className="[&_.grid]:gap-3">  {/* 12px gap */}
      <GridLayout cols={cols}>{children}</GridLayout>
    </div>
  );
}

// Or extend the component
function WideGridLayout({ children, cols }) {
  return (
    <div className="[&_.grid]:gap-8">  {/* 32px gap */}
      <GridLayout cols={cols}>{children}</GridLayout>
    </div>
  );
}
```

### Additional Container Styling

Wrap GridLayout in a container for padding and constraints:

```tsx
<div className="container mx-auto px-4 py-8">
  <GridLayout>
    {items.map(item => <Card key={item.id} {...item} />)}
  </GridLayout>
</div>

<div className="max-w-7xl mx-auto p-6">
  <h1 className="text-3xl font-bold mb-6">Gallery</h1>
  <GridLayout cols={{ sm: 1, md: 2, lg: 4 }}>
    {items.map(item => <Card key={item.id} {...item} />)}
  </GridLayout>
</div>
```

## 🧪 Testing

### Test Examples

```tsx
import { render, screen } from '@testing-library/react';
import { GridLayout } from './GridLayout';

describe('GridLayout', () => {
  it('renders children correctly', () => {
    render(
      <GridLayout>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </GridLayout>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('applies default grid classes', () => {
    const { container } = render(
      <GridLayout>
        <div>Item</div>
      </GridLayout>
    );

    const gridElement = container.firstChild;
    expect(gridElement).toHaveClass('grid');
    expect(gridElement).toHaveClass('gap-6');
    expect(gridElement).toHaveClass('animate-fade-in');
  });

  it('applies custom column configuration', () => {
    const { container } = render(
      <GridLayout cols={{ sm: 2, md: 3, lg: 4, xl: 6 }}>
        <div>Item</div>
      </GridLayout>
    );

    const gridElement = container.firstChild;
    expect(gridElement).toHaveClass('grid-cols-2');
    expect(gridElement).toHaveClass('md:grid-cols-3');
    expect(gridElement).toHaveClass('lg:grid-cols-4');
    expect(gridElement).toHaveClass('xl:grid-cols-6');
  });

  it('handles empty children', () => {
    const { container } = render(<GridLayout>{null}</GridLayout>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders multiple different child types', () => {
    render(
      <GridLayout>
        <div>Text</div>
        <button>Button</button>
        <img src="test.jpg" alt="Test" />
      </GridLayout>
    );

    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
```

## 📚 Best Practices

### ✅ Do's

```tsx
// ✅ Use for consistent card layouts
<GridLayout>
  {products.map(p => <ProductCard key={p.id} {...p} />)}
</GridLayout>

// ✅ Customize columns for your content
<GridLayout cols={{ sm: 2, md: 3, lg: 4 }}>
  {avatars.map(a => <Avatar key={a.id} {...a} />)}
</GridLayout>

// ✅ Handle empty states
{items.length > 0 ? (
  <GridLayout>{/* ... */}</GridLayout>
) : (
  <EmptyState />
)}

// ✅ Use consistent item sizing
<GridLayout>
  {items.map(item => (
    <Card key={item.id} className="h-64" {...item} />
  ))}
</GridLayout>

// ✅ Combine with container for spacing
<div className="container mx-auto px-4">
  <GridLayout>{/* ... */}</GridLayout>
</div>

// ✅ Use loading skeletons
{loading ? (
  <GridLayout>
    {[...Array(8)].map((_, i) => <Skeleton key={i} />)}
  </GridLayout>
) : (
  <GridLayout>{/* real content */}</GridLayout>
)}
```

### ❌ Don'ts

```tsx
// ❌ Don't use for simple flex layouts (overkill)
<GridLayout cols={{ sm: 1, md: 1, lg: 1, xl: 1 }}>
  <SingleCard />
</GridLayout>
// Use: <div><SingleCard /></div>

// ❌ Don't nest GridLayouts unnecessarily
<GridLayout>
  <GridLayout>  {/* Nested grids - avoid */}
    <Card />
  </GridLayout>
</GridLayout>

// ❌ Don't use for vertical lists
<GridLayout cols={{ sm: 1, md: 1, lg: 1, xl: 1 }}>
  {messages.map(m => <Message key={m.id} {...m} />)}
</GridLayout>
// Use: <div className="space-y-4">{/* messages */}</div>

// ❌ Don't mix very different content sizes
<GridLayout>
  <TallCard className="h-96" />
  <ShortCard className="h-32" />  {/* Inconsistent */}
</GridLayout>

// ❌ Don't forget keys on children
<GridLayout>
  {items.map(item => <Card {...item} />)}  {/* Missing key! */}
</GridLayout>

// ❌ Don't use for complex layouts (use CSS Grid directly)
<GridLayout>  {/* GridLayout is too simple for this */}
  <Header className="col-span-2" />
  <Sidebar />
  <Main />
</GridLayout>
// Use: Custom CSS Grid or different template
```

## 🎯 Common Use Cases

### NFT Gallery

```tsx
function NFTGallery({ nfts }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore NFTs</h1>
      <GridLayout cols={{ sm: 1, md: 2, lg: 3, xl: 4 }}>
        {nfts.map(nft => (
          <Card
            key={nft.id}
            title={nft.name}
            imageUrl={nft.image}
            price={nft.price}
          />
        ))}
      </GridLayout>
    </div>
  );
}
```

### Dashboard Widgets

```tsx
function Dashboard() {
  return (
    <div className="p-6">
      <GridLayout cols={{ sm: 1, md: 2, lg: 3 }}>
        <StatsWidget title="Total Sales" value="$45,231" />
        <StatsWidget title="Active Users" value="1,234" />
        <StatsWidget title="Conversions" value="12.5%" />
        <ChartWidget title="Revenue" />
        <TableWidget title="Recent Orders" />
        <ActivityWidget title="Activity Feed" />
      </GridLayout>
    </div>
  );
}
```

### Product Catalog

```tsx
function ProductCatalog({ products, loading }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Our Products</h2>
        <p className="text-gray-600">Discover our collection</p>
      </div>

      {loading ? (
        <GridLayout>
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-64 rounded-lg animate-pulse" />
          ))}
        </GridLayout>
      ) : (
        <GridLayout cols={{ sm: 1, md: 2, lg: 3, xl: 4 }}>
          {products.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </GridLayout>
      )}
    </section>
  );
}
```

### Image Gallery

```tsx
function ImageGallery({ images }) {
  return (
    <GridLayout cols={{ sm: 2, md: 3, lg: 4, xl: 5 }}>
      {images.map(image => (
        <div key={image.id} className="relative aspect-square group">
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
            <button className="opacity-0 group-hover:opacity-100 text-white">
              View
            </button>
          </div>
        </div>
      ))}
    </GridLayout>
  );
}
```

## 🔧 Advanced Patterns

### Responsive Content

Adjust not just columns, but also content based on screen size:

```tsx
function ResponsiveGallery({ items }) {
  const [columns, setColumns] = useState({ sm: 1, md: 2, lg: 3, xl: 4 });

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1536) {
        setColumns({ sm: 1, md: 2, lg: 4, xl: 6 });
      } else {
        setColumns({ sm: 1, md: 2, lg: 3, xl: 4 });
      }
    };

    window.addEventListener('resize', updateColumns);
    updateColumns();

    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  return (
    <GridLayout cols={columns}>
      {items.map(item => <Card key={item.id} {...item} />)}
    </GridLayout>
  );
}
```

### Infinite Scroll Integration

```tsx
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

function InfiniteGallery() {
  const { items, loading, hasMore, loadMore } = useInfiniteScroll();
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <>
      <GridLayout>
        {items.map(item => <Card key={item.id} {...item} />)}
      </GridLayout>
      {hasMore && <div ref={observerRef} className="py-4 text-center">Loading...</div>}
    </>
  );
}
```

## 🐛 Troubleshooting

### Issue: Columns not responsive

**Problem:** Grid stays at one column width

**Solution:**
```tsx
// Check Tailwind config includes all breakpoints
// tailwind.config.ts
module.exports = {
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },
};
```

### Issue: Animation not working

**Problem:** Fade-in animation doesn't appear

**Solution:**
```css
/* Add to globals.css if missing */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}
```

### Issue: Inconsistent item heights

**Problem:** Grid items have different heights causing layout issues

**Solution:**
```tsx
// Add consistent height to cards
<GridLayout>
  {items.map(item => (
    <Card key={item.id} className="h-full" {...item} />
  ))}
</GridLayout>

// Or use aspect ratio
<GridLayout>
  {items.map(item => (
    <div key={item.id} className="aspect-square">
      <Card {...item} />
    </div>
  ))}
</GridLayout>
```

## 📊 Performance Considerations

- **Lightweight**: Minimal DOM overhead (single container div)
- **No JavaScript**: Pure CSS grid, no runtime calculations
- **Efficient Rendering**: React only re-renders on children change
- **Animation**: CSS animation, hardware accelerated
- **Virtualization**: For very large lists (1000+ items), consider react-window

## 🔗 Related Components

- **Card** - Perfect child component for GridLayout
- **Skeleton** - Loading state placeholder
- **EmptyState** - Display when no items available

## 📚 Further Reading

- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Tailwind CSS Grid](https://tailwindcss.com/docs/grid-template-columns)
- [Responsive Design](https://web.dev/responsive-web-design-basics/)
- [Atomic Design Templates](https://bradfrost.com/blog/post/atomic-web-design/)

## 🤝 Contributing

When modifying GridLayout:

1. ✅ Maintain backward compatibility
2. ✅ Update TypeScript types
3. ✅ Add tests for new features
4. ✅ Document changes in this README
5. ✅ Test across all breakpoints
6. ✅ Ensure accessibility
7. ✅ Check animation performance

---

**GridLayout Version:** 1.0.0  
**Last Updated:** November 2025  
**Maintained by:** Andromeda Design System Team
