# Button Component

A highly customizable and accessible button component with multiple variants, sizes, loading states, and icon support. Features smooth animations and consistent styling with the application's design system.

## Features

- 🎨 **Six Visual Variants**: primary, secondary, outline, ghost, danger, gradient
- 📏 **Four Size Options**: sm, md, lg, xl
- ⏳ **Loading State**: Built-in loading spinner
- 🎯 **Icon Support**: Left and right icon positioning
- 📱 **Full Width Option**: Expand to fill container
- ✨ **Smooth Animations**: Hover and tap effects with Framer Motion
- 🌙 **Dark Mode**: Fully supports dark theme
- ♿ **Accessible**: WCAG compliant with proper ARIA attributes

## Installation

```tsx
import { Button } from '@/app/components/ui/Button';
// or
import Button from '@/app/components/ui/Button';
```

## Basic Usage

```tsx
<Button onClick={handleClick}>Click me</Button>
```

## Variants

### Primary (Default)
```tsx
<Button variant="primary">Primary Button</Button>
```

### Secondary
```tsx
<Button variant="secondary">Secondary Button</Button>
```

### Outline
```tsx
<Button variant="outline">Outline Button</Button>
```

### Ghost
```tsx
<Button variant="ghost">Ghost Button</Button>
```

### Danger
```tsx
<Button variant="danger">Delete</Button>
```

### Gradient
```tsx
<Button variant="gradient">Get Started</Button>
```

## Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium (Default)</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

## With Icons

```tsx
import { Wallet, ArrowRight, Trash2 } from 'lucide-react';

// Left icon
<Button leftIcon={<Wallet size={18} />}>
  Connect Wallet
</Button>

// Right icon
<Button rightIcon={<ArrowRight size={18} />}>
  Continue
</Button>

// Both icons
<Button
  leftIcon={<Wallet size={18} />}
  rightIcon={<ArrowRight size={18} />}
>
  Connect & Continue
</Button>

// Icon only
<Button leftIcon={<Trash2 size={18} />} />
```

## Loading State

```tsx
<Button loading disabled>
  Processing...
</Button>

// With custom loading text
<Button loading>
  Saving changes...
</Button>
```

## Full Width

```tsx
<Button fullWidth>
  Full Width Button
</Button>
```

## Disabled State

```tsx
<Button disabled>
  Disabled Button
</Button>
```

## Advanced Examples

### Form Submit Button
```tsx
<Button
  type="submit"
  variant="primary"
  size="lg"
  fullWidth
  loading={isSubmitting}
  disabled={!isValid}
>
  Submit Form
</Button>
```

### Wallet Connection
```tsx
import { Wallet } from 'lucide-react';

<Button
  variant="gradient"
  size="lg"
  leftIcon={<Wallet size={20} />}
  onClick={connectWallet}
>
  Connect Wallet
</Button>
```

### Delete Action
```tsx
import { Trash2 } from 'lucide-react';

<Button
  variant="danger"
  size="sm"
  leftIcon={<Trash2 size={16} />}
  onClick={handleDelete}
>
  Delete Item
</Button>
```

### Navigation Button
```tsx
import { ArrowRight } from 'lucide-react';

<Button
  variant="outline"
  rightIcon={<ArrowRight size={18} />}
  onClick={() => router.push('/next-page')}
>
  Continue
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger' \| 'gradient'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Button size |
| `fullWidth` | `boolean` | `false` | Expand to full container width |
| `loading` | `boolean` | `false` | Show loading spinner |
| `leftIcon` | `ReactNode` | - | Icon displayed before text |
| `rightIcon` | `ReactNode` | - | Icon displayed after text |
| `disabled` | `boolean` | `false` | Disable button interactions |
| `className` | `string` | - | Additional CSS classes |
| `onClick` | `(e: MouseEvent) => void` | - | Click event handler |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `children` | `ReactNode` | - | Button content |

All standard HTML button attributes are also supported.

## Accessibility

The Button component follows WCAG 2.1 guidelines:

- ✅ Keyboard navigable with proper focus states
- ✅ Screen reader friendly with ARIA labels
- ✅ Sufficient color contrast ratios
- ✅ Clear disabled states
- ✅ Loading state feedback
- ✅ Focus ring indicators

### Example with ARIA
```tsx
<Button
  aria-label="Delete user profile"
  aria-describedby="delete-warning"
  onClick={handleDelete}
>
  Delete
</Button>
```

## Styling

The component uses Tailwind CSS classes and can be customized through:

1. **className prop**: Add custom classes
2. **Tailwind config**: Modify theme colors
3. **CSS variables**: Override in globals.css

```tsx
// Custom styling
<Button className="shadow-2xl hover:shadow-3xl">
  Custom Style
</Button>
```

## Testing

The component includes comprehensive unit tests covering:

- All variants and sizes
- Loading and disabled states
- Icon rendering
- User interactions
- Accessibility features
- Edge cases

Run tests with:
```bash
npm test Button.test.tsx
```

## Design Guidelines

### When to Use Each Variant

- **Primary**: Main call-to-action (CTA) buttons
- **Secondary**: Less prominent actions
- **Outline**: Alternative actions, filters
- **Ghost**: Tertiary actions, subtle interactions
- **Danger**: Destructive actions (delete, remove)
- **Gradient**: Hero CTAs, special promotions

### Size Guidelines

- **sm**: Dense UIs, table actions, compact spaces
- **md**: General use, forms, cards (default)
- **lg**: Primary CTAs, hero sections
- **xl**: Landing pages, major actions

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- React 19+
- Framer Motion (animations)
- Lucide React (icons)
- Tailwind CSS 4+
