# Breadcrumb

The `Breadcrumb` atom displays the current page's location within a
navigation hierarchy using a horizontal trail of links.

It follows the Andromeda VDS typography and color tokens and is intended
for use near page headers or within navigation bars.

## Props

- `items`: array of `{ label, href? }` objects.
  - All items except the last are rendered as links when `href` is provided.
  - The last item is treated as the current page and gets `aria-current="page"`.
- `className`: optional additional class names for the root `nav`.

## Accessibility

- Uses `nav` with `aria-label="Breadcrumb"`.
- The current page item is marked with `aria-current="page"`.

## Usage

```tsx
import { Breadcrumb } from '@/app/components';

function Example() {
  return (
    <Breadcrumb
      items={[
        { label: 'Home', href: '/' },
        { label: 'Library', href: '/library' },
        { label: 'Book', href: '/library/book' },
        { label: 'Details' },
      ]}
    />
  );
}
```