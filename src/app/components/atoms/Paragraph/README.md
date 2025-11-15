## Paragraph Component

Theme-aware body text primitive for consistent paragraph rendering across the Andromeda design system.

### Why
- Centralizes font, size scale, color tokens, alignment
- Encourages semantic clarity (default `<p>` tag)
- Simplifies migration from ad hoc `<p>` usage to design tokens

### Import
```tsx
import { Paragraph } from '@/app/components/atoms/Paragraph';
// or via barrel
import { Paragraph } from '@/app/components/atoms';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' | 'base' | 'lg' | 'xl'` | `base` | Visual size variant. |
| `muted` | `boolean` | `false` | Uses `text-textMuted` token instead of `text-textBase`. |
| `align` | `'left' | 'center' | 'right'` | `left` | Text alignment utility. |
| `as` | `React.ElementType` | `p` | Render a different element while keeping paragraph styles. |
| `className` | `string` | `''` | Additional classes merged last. |
| `children` | `React.ReactNode` | – | Paragraph content. |

### Size Map
```
sm   → text-sm
base → text-base
lg   → text-lg
xl   → text-xl md:text-2xl
```

### Usage Examples
```tsx
<Paragraph>Standard body copy.</Paragraph>
<Paragraph size="lg">Large lead paragraph.</Paragraph>
<Paragraph size="sm" muted>Secondary metadata text.</Paragraph>
<Paragraph align="center" size="xl">Centered hero blurb.</Paragraph>
<Paragraph as="span" size="sm">Inline note</Paragraph>
```

### Muted vs Base
- Default: `text-textBase`
- Muted: `text-textMuted` for de-emphasized UI text (helper labels, meta info).

### Alignment
Handled by `align` prop mapping to Tailwind utilities: `text-left`, `text-center`, `text-right`.

### Theming
Relies entirely on semantic tokens so dark/light mode swaps automatically via global CSS variables.

### Migration
Before:
```tsx
<p className="text-secondary text-sm mt-2">Building the future...</p>
```
After:
```tsx
<Paragraph size="sm" muted className="mt-2">Building the future...</Paragraph>
```

### Extending
If additional density or contrast variants are needed, introduce a `variant` prop (e.g. `variant="highlight"`). Keep variants minimal & token-driven.

### Testing Strategy
Unit tests cover:
- Default tag rendering
- Size and alignment classes
- Muted color token
- Custom class merge
- `as` prop element override

### Accessibility Notes
- Use paragraphs for blocks of text, not headings or labels.
- Don’t chain multiple empty paragraphs for spacing—prefer margin utilities or layout components.

### Future Ideas
- Add `leading` prop (tight, relaxed) with tokens (`leading-snug`, etc.)
- Introduce semantic variants (caption, meta, code) as composition not bloat.

### Changelog
- v1: Initial implementation.

---
For updates, open an issue referencing `atoms/Paragraph` and provide rationale.
