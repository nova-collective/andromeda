# Chip

The `Chip` atom is an interactive, compact pill used for filters,
tokens, and selections in the Andromeda VDS.

It builds on the same tone/variant system as `Badge`, but adds optional
leading icons and a removal affordance.

## Props

- `label`: text label for the chip (required)
- `variant`: `'solid' | 'soft' | 'outline'` (default: `soft`)
- `tone`: `'neutral' | 'info' | 'success' | 'warning' | 'danger'` (default: `neutral`)
- `size`: `'sm' | 'md'` (default: `md`)
- `pill`: `boolean` for fully rounded pill style (default: `true`)
- `leadingIcon`: optional React node rendered before the label
- `onRemove`: optional callback; when provided, a remove button is shown
- `className`: optional additional class names

## Accessibility

- Uses `aria-label` on the remove button: `"Remove <label>"`.
- The remove button is keyboard focusable and uses focus ring tokens.

## Usage

```tsx
import { Chip } from '@/app/components';

function Example() {
  return (
    <div className="flex flex-wrap gap-2">
      <Chip label="Sci-Fi" />
      <Chip label="On Sale" tone="success" />
      <Chip label="Rare" tone="info" variant="solid" />
    </div>
  );
}
```