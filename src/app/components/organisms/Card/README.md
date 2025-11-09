# Card Component

A feature-rich, interactive card component for displaying NFT/marketplace items. Includes image preview, pricing information, like functionality, and hover effects. Inspired by OpenSea's card design with smooth animations and dark mode support.

## Features

- 🖼️ **Image Preview**: Responsive image with zoom effect on hover
- ❤️ **Like Functionality**: Interactive like button with counter
- 💰 **Price Display**: Current price and optional last sale price
- 🏷️ **Collection Tag**: Optional collection name display
- ✨ **Smooth Animations**: Hover effects and transitions with Framer Motion
- 🌙 **Dark Mode**: Fully supports dark theme
- 📱 **Responsive**: Adapts to different screen sizes
- ♿ **Accessible**: Semantic HTML with proper link structure

## Installation

```tsx
import { Card } from '@/app/components/ui/Card';
// or
import Card from '@/app/components/ui/Card';
```

## Basic Usage

```tsx
<Card
  image="/nft-image.jpg"
  title="Cosmic Explorer #1234"
  price="2.5 ETH"
/>
```

## Full Example

```tsx
<Card
  image="/nft-image.jpg"
  title="Cosmic Explorer #1234"
  price="2.5 ETH"
  lastPrice="2.1 ETH"
  collection="Cosmic Collection"
  likes={142}
  href="/item/1234"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `image` | `string` | *required* | URL of the card image/thumbnail |
| `title` | `string` | *required* | Title/name of the item |
| `price` | `string` | *required* | Current price display (e.g., "2.5 ETH") |
| `lastPrice` | `string` | - | Optional last sale price for comparison |
| `collection` | `string` | - | Optional collection name |
| `likes` | `number` | `0` | Initial like count |
| `href` | `string` | `'#'` | Link destination when card is clicked |

## Examples

### Minimal Card
```tsx
<Card
  image="/book-cover.jpg"
  title="The Great Novel"
  price="0.5 ETH"
/>
```

### With Collection
```tsx
<Card
  image="/artwork.jpg"
  title="Digital Art #42"
  price="1.2 ETH"
  collection="Abstract Collection"
/>
```

### With Price Comparison
```tsx
<Card
  image="/nft.jpg"
  title="Rare NFT #999"
  price="5.0 ETH"
  lastPrice="3.5 ETH"
/>
```

### With Likes
```tsx
<Card
  image="/item.jpg"
  title="Popular Item"
  price="0.8 ETH"
  likes={523}
/>
```

### Complete Card
```tsx
<Card
  image="/assets/featured-nft.jpg"
  title="Featured Collection #1"
  price="10.0 ETH"
  lastPrice="8.5 ETH"
  collection="Premium Collection"
  likes={1042}
  href="/items/featured-1"
/>
```

### Grid Layout
```tsx
import { GridLayout } from '@/app/components/layout/GridLayout';
import { Card } from '@/app/components/ui/Card';

const items = [
  { id: 1, image: '/img1.jpg', title: 'Item 1', price: '1.5 ETH' },
  { id: 2, image: '/img2.jpg', title: 'Item 2', price: '2.0 ETH' },
  { id: 3, image: '/img3.jpg', title: 'Item 3', price: '1.8 ETH' },
];

<GridLayout>
  {items.map((item) => (
    <Card
      key={item.id}
      image={item.image}
      title={item.title}
      price={item.price}
    />
  ))}
</GridLayout>
```

## Features in Detail

### Image Hover Effect
The card image scales up slightly on hover, creating an engaging zoom effect:
- Smooth transition with `duration-500`
- Scale factor of `1.1` on hover
- Gradient overlay appears on hover

### Like Functionality
Interactive like button with state management:
- Click to like/unlike
- Animated heart icon (filled when liked)
- Live counter updates
- Prevents link navigation when clicking like button

### Price Display
Flexible price information display:
- Current price always shown (bold, prominent)
- Optional last sale price for comparison
- Labeled clearly ("Current Price" / "Last Sale")

### Action Buttons
Hover-activated action buttons:
- Like button (heart icon)
- More options button (three dots)
- Fade in on card hover
- Backdrop blur effect

### Collection Badge
Optional collection name display:
- Displayed at top of card content
- Primary color theme
- Medium font weight for emphasis

## Styling

The component uses Tailwind CSS classes and follows the application's design system:

### Colors
- Primary: `primary-500` / `primary-400` (dark mode)
- Backgrounds: `white` / `dark-800`
- Borders: `gray-200` / `dark-600`
- Text: `gray-900` / `white`

### Border Radius
- Card: `rounded-2xl`
- Buttons: `rounded-lg`

### Shadows
- Default: `shadow-card`
- Hover: `shadow-card-hover`
- Dark mode variants included

### Transitions
- Image scale: `duration-500`
- Card elevation: `duration-300`
- Button opacity: `duration-300`

## Animations

Powered by Framer Motion:

### Card Animation
```tsx
whileHover={{ y: -4 }}
transition={{ duration: 0.2 }}
```
Card lifts up 4px on hover with smooth transition.

### Button Animation
```tsx
whileTap={{ scale: 0.9 }}
```
Like button scales down when clicked for tactile feedback.

## Accessibility

- ✅ Semantic HTML with proper `<a>` link structure
- ✅ Alt text for images via Next.js Image component
- ✅ Keyboard navigable
- ✅ Clear visual feedback on interactions
- ✅ Sufficient color contrast ratios
- ✅ Screen reader friendly structure

## Interaction Behavior

### Click Events
- **Card Click**: Navigates to `href` URL
- **Like Button**: Prevents navigation, toggles like state
- **More Options**: Prevents navigation (ready for dropdown menu)

### Hover States
- Card lifts up slightly
- Image scales up
- Dark overlay appears on image
- Action buttons fade in
- Shadow becomes more prominent

## Performance

- Uses Next.js `Image` component for optimized images
- Lazy loading support
- Efficient re-renders with React state
- Smooth 60fps animations with Framer Motion

## Testing

The component includes comprehensive unit tests:
- Rendering with required props
- Optional props handling
- Like functionality
- Interaction events
- Accessibility features
- Edge cases

Run tests with:
```bash
npm test Card.test.tsx
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Common Use Cases

### NFT Marketplace
```tsx
<Card
  image={nft.imageUrl}
  title={nft.name}
  price={`${nft.price} ETH`}
  collection={nft.collectionName}
  likes={nft.likeCount}
  href={`/nft/${nft.id}`}
/>
```

### Book Store
```tsx
<Card
  image={book.coverUrl}
  title={book.title}
  price={`${book.price} USD`}
  collection={book.author}
  href={`/books/${book.isbn}`}
/>
```

### Product Catalog
```tsx
<Card
  image={product.thumbnail}
  title={product.name}
  price={`$${product.price}`}
  lastPrice={product.wasPrice ? `$${product.wasPrice}` : undefined}
  likes={product.favorites}
  href={`/products/${product.slug}`}
/>
```

## Design Guidelines

### When to Use
- Displaying marketplace items
- Product grids
- NFT collections
- Book listings
- Gallery views

### Best Practices
- Use high-quality images (minimum 400x400px)
- Keep titles concise (truncated automatically)
- Use consistent price format across cards
- Provide meaningful collection names
- Ensure href leads to valid detail page

### Image Guidelines
- **Aspect Ratio**: Square (1:1) for consistent grid
- **Resolution**: At least 800x800px recommended
- **Format**: WebP preferred, JPG/PNG acceptable
- **Size**: Optimize for web (< 200KB)

## Customization

### Custom Styling
Add custom classes to the wrapper:
```tsx
<div className="custom-wrapper">
  <Card {...props} />
</div>
```

### Theme Colors
Modify in Tailwind config or use CSS variables:
```css
--color-primary-500: your-color;
```

## Dependencies

- React 19+
- Next.js 15+ (for Image component)
- Framer Motion (animations)
- Lucide React (icons)
- Tailwind CSS 4+

## Related Components

- **GridLayout**: For displaying cards in responsive grid
- **Button**: For action buttons within cards
- **Header**: For navigation context
- **ThemeProvider**: For dark mode support

## Migration Guide

If you're migrating from the old Card component:

### Old Usage
```tsx
import Card from '@/components/ui/Card';
```

### New Usage
```tsx
// Named import (recommended)
import { Card } from '@/app/components/ui/Card';

// Or default import
import Card from '@/app/components/ui/Card';
```

Both work identically, choose based on your preference!
