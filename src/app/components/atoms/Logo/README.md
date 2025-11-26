# Logo

Brand mark atom for Andromeda rendered as an accessible inline SVG. Supports size presets, variant coloring, and optional visible label.

## Props

| Prop        | Type      | Default       | Description                                        |
| ----------- | --------- | ------------- | -------------------------------------------------- |
| `size`      | `sm       | md            | lg`                                                | `md`                                           | Controls logo height. Width scales automatically. |
| `variant`   | `primary  | secondary`    | `primary`                                          | Applies contextual color (currentColor usage). |
| `label`     | `string`  | `"Andromeda"` | Accessible label text. Empty string suppresses it. |
| `showLabel` | `boolean` | `false`       | Show visible text label instead of sr-only.        |
| `className` | `string`  | `''`          | Optional wrapper classes.                          |

## Accessibility

- The SVG has `role="img"` and `aria-label` set to the provided `label`.
- A visually hidden label `<span class="sr-only">` is rendered unless `showLabel` is enabled.
- Provide a contextual `label` when the logo’s purpose differs (e.g., "Andromeda Home").

## Usage

```tsx
import { Logo } from '@/app/components/atoms';

export function HeaderBrand() {
  return (
    <div className="flex items-center gap-4">
      <Logo size="sm" />
      <Logo />
      <Logo size="lg" variant="secondary" showLabel label="Andromeda" />
    </div>
  );
}
```

## Notes

- The SVG depicts an open book with a rising planet/star, symbolizing the "Andromeda" NFT bookstore.
- Colors are inherited via `currentColor`; variant sets a text color scope using design tokens.
- Extend with a clickable wrapper (e.g., `<Link>` or `<a>`) for navigation use.
