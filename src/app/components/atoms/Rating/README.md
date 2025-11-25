# Rating

Displays a visual star rating based on a numeric value. Follows VDS patterns for sizes, variants, and accessible labels.

## Props

- **value**: number — current rating value (clamped to `[0..max]`).
- **max**: number (default `5`) — total number of stars.
- **size**: `sm | md | lg` (default `md`) — star size.
- **variant**: `primary | secondary` (default `primary`) — color tone.
- **label**: string (default `"Rating"`) — accessible label base.
- **showLabel**: boolean (default `false`) — show visible label (`"Rating: X of Y"`) next to stars.
- **className**: string — optional container classes.

## Accessibility

- Uses `role="img"` with a descriptive `aria-label` combining the label and value: `Rating: 3 of 5`.
- Hidden sr-only label is rendered when `showLabel` is `false`; visible text is shown when `true`.

## Usage

```tsx
import { Rating } from '@/app/components/atoms'

export function Example() {
  return (
    <div className="space-y-4">
      <Rating value={3} />
      <Rating value={4} max={5} size="lg" variant="secondary" />
      <Rating value={5} label="User Rating" showLabel />
    </div>
  )
}
```

## Notes

- The value is integer-clamped; partial stars are not displayed in this atom.
- Colors are driven by VDS tokens (`--link-color`, `--text-secondary`).
