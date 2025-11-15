## Heading Component

Semantic, theme-aware typography primitive for consistent heading rendering (h1–h6) across the Andromeda design system.

### Why
Centralizing heading logic ensures:
- Consistent font family (`font-serif`) and responsive size scale
- Automatic use of semantic tokens (`text-textBase`, `text-textMuted`)
- Easy alignment control without repeating utility classes
- Accessible, correctly ordered heading tags

### Import
```tsx
import { Heading } from '@/app/components/atoms/Heading';
// or via barrel:
// import { Heading } from '@/app/components/atoms';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `level` | `1 | 2 | 3 | 4 | 5 | 6` | `2` | Semantic heading level; renders corresponding `<h*>` tag. |
| `muted` | `boolean` | `false` | Uses `text-textMuted` token instead of `text-textBase`. |
| `align` | `'left' | 'center' | 'right'` | `'left'` | Horizontal text alignment. |
| `className` | `string` | `''` | Additional utility classes. |
| `children` | `React.ReactNode` | – | Heading content. |
| `...rest` | HTML attributes | – | Passed through to the rendered tag. |

### Size Scale
Defined in `Heading.tsx`:
```
1 → text-3xl md:text-4xl
2 → text-2xl md:text-3xl
3 → text-xl md:text-2xl
4 → text-lg
5 → text-base
6 → text-sm uppercase tracking-wide
```

### Usage Examples
```tsx
// Basic
<Heading>Section Title</Heading>

// Explicit level
<Heading level={1}>Page Hero</Heading>

// Muted subsection
<Heading level={3} muted>Additional Details</Heading>

// Center aligned with spacing
<Heading level={2} align="center" className="mb-8">Overview</Heading>

// Accent override
<Heading level={4} className="text-accent">Highlighted</Heading>
```

### Alignment
`align` maps to Tailwind utilities (`text-left`, `text-center`, `text-right`). Prefer the prop over manual classes for clarity.

### Theming
Color class resolves to:
- `text-textBase` (default)
- `text-textMuted` (when `muted`)

These are semantic tokens tied to CSS variables for theme switching.

### Accessibility & Semantics
- Maintain a logical outline (avoid jumping from h1 to h4 without intermediate levels).
- Limit to one `h1` per page route boundary unless a nested document structure requires otherwise.
- Don’t use `Heading` for non-heading text; create a `Text` component if needed.

### Migration
Replace raw headings:
Before:
```tsx
<h2 className="text-2xl font-serif">Profile</h2>
```
After:
```tsx
<Heading level={2}>Profile</Heading>
```
Muted variant:
Before:
```tsx
<h4 className="text-lg text-secondary">Details</h4>
```
After:
```tsx
<Heading level={4} muted>Details</Heading>
```
Gradient / decorated (keep custom classes):
```tsx
<Heading level={1} className="bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">Explore</Heading>
```

### Extending
If gradient or underline styles become common patterns, introduce a `variant` prop rather than repeating long utility chains everywhere.

### Testing
See `Heading.test.tsx` for coverage:
- Tag level rendering
- Muted color token application
- Alignment class mapping
- Custom class merge

Example assertion (Vitest + Testing Library):
```tsx
render(<Heading level={3} muted align="center" data-testid="hd">Title</Heading>);
const el = screen.getByTestId('hd');
expect(el.tagName).toBe('H3');
expect(el).toHaveClass('text-textMuted');
expect(el).toHaveClass('text-center');
```

### Performance
Stateless functional component; no memoization needed. For very large lists with stable props, wrap externally in `React.memo`.

### Common Pitfalls
- Copy/paste without adjusting `level` causing outline issues.
- Layering conflicting color classes (`muted` + another text token) reducing clarity.
- Overriding size utilities inconsistently; if you need custom sizing, keep semantic `level` and override sizes consciously.

### Future Enhancements
- `variant` prop (e.g. gradient, subtle, underline)
- `as` prop to decouple semantic tag from visual scale when necessary
- Token-based dynamic scale pulled from a central typography map

### Changelog
- v1: Initial implementation and documentation.

---
For enhancements or bugs open an issue referencing `atoms/Heading` with rationale.
