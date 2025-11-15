# Link

Theme-aware inline link atom with accessible underline behavior and contrast handling.

## Features
- Brand color token: `text-link` (violet) for default links
- Semantic muted token: `text-textMuted` when `muted` prop is true
- Contrast for colored backgrounds: `contrast="onPrimary"` applies `text-white dark:text-black`
- Underline options: `hover` (default), `always`, `none` with `underline-offset-4` and `decoration-current`
- Accessible focus ring with theme-aware offset
- Optional `leftIcon` and `rightIcon`
- External links automatically get `target="_blank" rel="noopener noreferrer"` (can be forced via `external`)
- `as` prop to render a different element (e.g., integrate with Next.js `<Link>` wrappers)

## Usage
```tsx
import { Link } from '@/app/components';

export default function Example() {
  return (
    <p className="text-textBase">
      Browse our <Link href="/catalog">catalog</Link> or visit the
      {' '}<Link href="https://andromeda.example" contrast="onPrimary" className="px-1 rounded bg-[var(--text-primary)]">site</Link>.
    </p>
  );
}
```

### With Next.js Link
```tsx
import NextLink from 'next/link';
import { Link } from '@/app/components';

<NextLink href="/about" passHref legacyBehavior>
  <Link underline="always">About us</Link>
</NextLink>
```

## Props
- `underline`: `'hover' | 'always' | 'none'` – underline behavior (default: `hover`)
- `muted`: `boolean` – use `text-textMuted` color (default: `false`); otherwise brand `text-link`
- `contrast`: `'default' | 'onPrimary'` – colored background readability (default: `default`)
- `size`: `'sm' | 'base' | 'lg'` – font size utility (default: `base`)
- `leftIcon`, `rightIcon`: `React.ReactNode` – optional icons
- `external`: `boolean` – force external link behavior (default: auto-detect by href)
- `as`: `React.ElementType` – element override (default: `'a'`)

## Accessibility
- Uses an accessible focus ring (`focus-visible:ring`) that offsets relative to the page background token.
- Ensure link text is descriptive and not duplicated adjacent to a button for the same action.
