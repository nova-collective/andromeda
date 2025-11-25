# Skeleton

The Skeleton atom displays lightweight placeholder shapes that mimic content layout while data loads. It follows Andromeda VDS patterns (size, variant, accessibility) similar to Spinner and ProgressBar.

## Features
- Shapes: `text`, `circle`, `rect`
- Sizes: `sm`, `md`, `lg`
- Variants: `primary`, `secondary`
- Optional pulse animation (disable via `animated={false}`)
- Accessible status with screen-reader label (sr-only)
- Pure Tailwind utility classes

## Import
```tsx
import { Skeleton } from '@/app/components';
// or granular
import { Skeleton } from '@/app/components/atoms/Skeleton';
```

## Usage
```tsx
<Skeleton />                      // text md primary
<Skeleton size="lg" />            // larger text bar
<Skeleton shape="circle" />       // circular avatar placeholder
<Skeleton shape="rect" size="sm" /> // small rectangular block
<Skeleton variant="secondary" />  // secondary color
<Skeleton animated={false} />      // static placeholder
<Skeleton label="Loading profile" /> // custom accessible label (sr-only)
<Skeleton showLabel /> // visible default label
<Skeleton showLabel label="Fetching details" /> // visible custom label
```

## Props
| Name        | Type                             | Default      | Description                                                        |
| ----------- | -------------------------------- | ------------ | ------------------------------------------------------------------ |
| `shape`     | `"text"                          | "circle"     | "rect"`                                                            | `"text"`               | Placeholder geometry          |
| `size`      | `"sm"                            | "md"         | "lg"`                                                              | `"md"`                 | Relative dimensions per shape |
| `variant`   | `"primary"                       | "secondary"` | `"primary"`                                                        | Color scheme alignment |
| `label`     | `string`                         | `"Loading"`  | Accessible label (hidden unless `showLabel`; set `""` to suppress) |
| `showLabel` | `boolean`                        | `false`      | Displays visible text label next to skeleton                       |
| `animated`  | `boolean`                        | `true`       | Enables pulse animation                                            |
| `className` | `string`                         | —            | Additional classes appended                                        |
| `...rest`   | `HTMLAttributes<HTMLDivElement>` | —            | Standard div attributes                                            |

## Accessibility
- Uses `role="status"` with `aria-live="polite"` to subtly announce loading state.
- Screen reader label defaults to "Loading"; override with `label` or suppress with empty string. Use `showLabel` to display it visually.
- For complex pages, pair Skeleton with a visible loading heading or progress region for context.

## Styling
- Base color: `bg-[color:var(--border)]` (primary) or `bg-[color:var(--text-secondary)]/20` (secondary)
- Animation: `animate-pulse` (disabled when `animated={false}`)
- Shapes apply appropriate rounding (`rounded`, `rounded-md`, `rounded-full`).

## Testing Guidelines
Include tests for:
1. Default render (shape, size)
2. Size + shape combinations
3. Variant class assignment
4. Label presence/suppression
5. Animation toggle

## Showcase Snippet
```tsx
<div className="space-y-4">
  <Paragraph size="sm" muted className="text-secondary">Primary variant</Paragraph>
  <div className="flex items-center gap-4">
    <Skeleton size="sm" />
    <Skeleton />
    <Skeleton size="lg" />
    <Skeleton shape="circle" />
    <Skeleton shape="rect" />
  </div>
  <Paragraph size="sm" muted className="text-secondary">Secondary variant</Paragraph>
  <div className="flex items-center gap-4">
    <Skeleton variant="secondary" size="sm" />
    <Skeleton variant="secondary" />
    <Skeleton variant="secondary" size="lg" />
    <Skeleton variant="secondary" shape="circle" />
    <Skeleton variant="secondary" shape="rect" />
  </div>
</div>
```

## Exports
- Re-exported from `atoms/Skeleton/index.ts`
- Added to `atoms/index.ts` and top-level `components/index.tsx`

## Changelog
Add an entry when introducing new shapes or prop behaviors.
