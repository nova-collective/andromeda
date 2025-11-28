# Spacer

The `Spacer` atom provides consistent empty space between elements using the
spacing scale from the Andromeda VDS.

Unlike `Divider`, which renders a visible line, `Spacer` is purely structural
and renders no visible decoration by default.

## Props

- `axis`: `'horizontal' | 'vertical'` (default: `vertical`)
- `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl'` (default: `md`)
- `className`: optional additional class names

## Accessibility

- Marked with `aria-hidden="true"` because it is purely presentational.

## Usage

```tsx
import { Spacer } from '@/app/components';

function Example() {
  return (
    <div className="flex flex-col">
      <span>Item A</span>
      <Spacer size="lg" />
      <span>Item B</span>
    </div>
  );
}
```