# Badge

The `Badge` atom is a compact status or metadata label, used to highlight
state, type, or counts in the Andromeda VDS.

It builds on the same token system as `Label`, but is more compact and
intended to sit inline with text or icons.

## Props

- `children`: content of the badge (required)
- `variant`: `'solid' | 'soft' | 'outline'` (default: `soft`)
- `tone`: `'neutral' | 'info' | 'success' | 'warning' | 'danger'` (default: `neutral`)
- `size`: `'sm' | 'md'` (default: `md`)
- `pill`: `boolean` for fully rounded pill style (default: `false`)
- `className`: optional additional class names

## Accessibility

- Renders as a semantic `span` suitable for inline usage.
- Inherits surrounding semantics; wrap in elements with ARIA roles when needed.

## Usage

```tsx
import { Badge } from '@/app/components';

function Example() {
  return (
    <div className="flex flex-col gap-2">
      <Badge>Default</Badge>
      <Badge tone="info">Info</Badge>
      <Badge tone="success" variant="solid" pill>
        Live
      </Badge>
    </div>
  );
}
```