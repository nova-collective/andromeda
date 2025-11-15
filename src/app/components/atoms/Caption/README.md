# Caption

Theme-aware small text atom for image or component captions. Follows the VDS conventions used by other typography atoms (Heading, Paragraph).

## Features
- Semantic color tokens: `text-textMuted` (default) or `text-textBase`
- Contrast control for colored backgrounds: `contrast="onPrimary"` applies `text-white dark:text-black`
- Sizes: `xs`, `sm` (default: `sm`)
- Alignment: `left` (default), `center`, `right`
- `as` prop to change the underlying element (`p` by default) – e.g. `figcaption`

## Usage
```tsx
import { Caption } from '@/app/components';

export default function Example() {
  return (
    <figure className="space-y-2">
      <img src="/placeholder-1.jpg" alt="Cosmic Explorer" />
      <Caption as="figcaption" align="center">Cosmic Explorer — photo by Andromeda</Caption>
    </figure>
  );
}
```

## Props
- `size`: `'xs' | 'sm'` – visual size (default: `sm`)
- `muted`: `boolean` – uses `text-textMuted` when true (default: true)
- `align`: `'left' | 'center' | 'right'` – text alignment (default: `left`)
- `contrast`: `'default' | 'onPrimary'` – readability over colored backgrounds (default: `default`)
- `as`: `React.ElementType` – element override (default: `'p'`)

## Accessibility
- Use `as="figcaption"` when the Caption is a direct child of a `<figure>` element.
- Keep captions concise; avoid using them for long-form content.
