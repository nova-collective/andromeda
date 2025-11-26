# Image

Displays an image with consistent VDS framing (border, surface, rounded corners), size presets, and optional visible label.

## Props

- **src**: string — image source URL.
- **alt**: string — accessible description of the image.
- **size**: `sm | md | lg` (default `md`) — frame size.
- **variant**: `primary | secondary` (default `primary`) — contextual text scope for surrounding content.
- **rounded**: boolean (default `true`) — enable rounded corners on the frame.
- **fit**: `cover | contain` (default `cover`) — object fit strategy.
- **label**: string (default `"Image"`) — accessible label text.
- **showLabel**: boolean (default `false`) — render visible label below the image instead of sr-only.
- **className**: string — optional extra classes for the outer wrapper.

## Accessibility

- Uses standard `<img>` with required `alt` text.
- Adds an accessible label string that is visually hidden unless `showLabel` is enabled.

## Usage

```tsx
import { Image } from '@/app/components/atoms';

export function Example() {
  return (
    <div className="flex gap-4 items-start">
      <Image src="/placeholder-1.jpg" alt="Cover art sample" size="sm" />
      <Image src="/placeholder-1.jpg" alt="Cover art sample" size="md" rounded={false} />
      <Image src="/placeholder-1.jpg" alt="Cover art sample" size="lg" variant="secondary" showLabel label="Sample image" />
    </div>
  );
}
```

## Notes

- Frame uses VDS tokens: `bg-surface` + `border border-color` for consistent contrast.
- Prefer descriptive `alt` text; keep `label` concise if shown.