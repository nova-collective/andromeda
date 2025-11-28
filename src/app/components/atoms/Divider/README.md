# Divider

The `Divider` atom renders a visual separator between sections of content.
It follows the Andromeda VDS guidelines and supports variants, weights, and
optional labels.

## Props

- `orientation`: `'horizontal' | 'vertical'` (default: `horizontal`)
- `variant`: `'primary' | 'secondary' | 'subtle'` (default: `primary`)
- `weight`: `'thin' | 'normal' | 'bold'` (default: `normal`)
- `label`: optional string rendered inline between lines
- `align`: `'start' | 'center' | 'end'` (default: `center`)
- `className`: optional additional class names

## Accessibility

- Uses `role="separator"` with `aria-orientation`.
- When `label` is provided, it is exposed via `aria-label`.

## Usage

```tsx
import { Divider } from '@/app/components';

function Example() {
  return (
    <div className="space-y-6">
      <Divider />
      <Divider label="or" />
      <Divider variant="secondary" weight="bold" label="Books" align="start" />
    </div>
  );
}
```