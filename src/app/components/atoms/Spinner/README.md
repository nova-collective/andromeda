# Spinner

The Spinner atom provides a lightweight, animated indicator for ongoing background activity such as data fetching or processing. It follows the Andromeda VDS sizing + variant patterns and is accessible by default.

## Features
- Size variants: `sm`, `md` (default), `lg`
- Color variants: `primary`, `secondary`
- Accessible `role="status"` + screen reader label
- Tailwind utility classes only; no external dependencies
- Composable: accepts additional `className` and HTML div attributes

## Import
```tsx
import { Spinner } from '@/app/components';
// or granular
import { Spinner } from '@/app/components/atoms/Spinner';
```

## Usage
```tsx
<Spinner />
<Spinner size="sm" />
<Spinner size="lg" />
<Spinner variant="secondary" />
<Spinner label="Loading profile" />
```

### Inline with content
```tsx
<Button leftIcon={<Spinner size="sm" aria-label="Loading" />}>Submitting…</Button>
```

## Props
| Name        | Type                             | Default      | Description                                    |
| ----------- | -------------------------------- | ------------ | ---------------------------------------------- |
| `size`      | `"sm"                            | "md"         | "lg"`                                          | `"md"`                            | Visual diameter and border thickness |
| `variant`   | `"primary"                       | "secondary"` | `"primary"`                                    | Color scheme alignment with theme |
| `label`     | `string`                         | `"Loading"`  | Accessible label rendered in an `sr-only` span |
| `className` | `string`                         | —            | Additional class names appended                |
| `...rest`   | `HTMLAttributes<HTMLDivElement>` | —            | Standard div attributes                        |

## Accessibility
- Uses `role="status"` and `aria-live="polite"` to announce updates in assistive tech subtly.
- The `label` prop (default "Loading") is rendered inside a visually hidden `<span class="sr-only">`.
- Keep labels concise; e.g. `"Loading data"` or `"Submitting"`.
- If spinner is purely decorative (e.g. part of a button already labeled), you can set `label=""` to suppress additional text.

## Styling & Tokens
- Animation: `animate-spin ease-linear`
- Structure: Circular border with contrasting top segment
- Primary: top border uses `var(--link-color)`
- Secondary: top border uses `var(--text-secondary)`

## Testing Guidelines
Tests should cover:
1. Render and `role="status"` presence
2. Size class application (`h-4 w-4`, `h-6 w-6`, `h-8 w-8`)
3. Variant border color class (top border color difference)
4. Accessible label in `sr-only` span
5. `className` merging

## Example Card Snippet (Showcase)
```tsx
<div className="space-y-2">
  <Paragraph size="sm" muted className="text-secondary">Primary variant</Paragraph>
  <div className="flex items-center gap-4">
    <Spinner size="sm" />
    <Spinner />
    <Spinner size="lg" />
  </div>
  <Paragraph size="sm" muted className="text-secondary">Secondary variant</Paragraph>
  <div className="flex items-center gap-4">
    <Spinner variant="secondary" size="sm" />
    <Spinner variant="secondary" />
    <Spinner variant="secondary" size="lg" />
  </div>
</div>
```

## Export
- Re-exported via `atoms/Spinner/index.ts`
- Added to `atoms/index.ts` and global `components/index.tsx`

## Semver & Changelog
Add an entry in the project CHANGELOG when introducing new public props or behavior.
