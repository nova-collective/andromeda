## Label Component

A compact, theme-aware status/tag element for surfacing metadata, states, and categories across the UI.

### Features
- Severity levels: `neutral`, `info`, `success`, `warning`, `danger`
- Variants: `solid`, `soft`, `outline`, `ghost`
- Sizes: `sm`, `md`, `lg`
- Optional `pill` shape, `leftIcon`, `rightIcon`, and `as` element override
- Uses semantic tokens where available and light/dark-aware color utilities

### Import
```tsx
import { Label } from '@/app/components/atoms/Label';
// or via component barrel
// import { Label } from '@/app/components/atoms';
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `severity` | 'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger' | `neutral` | Visual tone of the label. |
| `variant` | 'solid' \| 'soft' \| 'outline' \| 'ghost' | `soft` | Presentation style. |
| `size` | 'sm' \| 'md' \| 'lg' | `md` | Visual size. |
| `pill` | boolean | `false` | Fully rounded shape. |
| `leftIcon` | ReactNode | – | Optional leading icon. |
| `rightIcon` | ReactNode | – | Optional trailing icon. |
| `as` | React.ElementType | `'span'` | Underlying element to render. |
| `className` | string | – | Additional classes. |
| `children` | ReactNode | – | Content. |

### Usage
```tsx
<Label>Default</Label>
<Label severity="info">Info</Label>
<Label severity="success" variant="soft">Success</Label>
<Label severity="warning" variant="outline">Warning</Label>
<Label severity="danger" variant="solid" pill>Critical</Label>
<Label severity="info" size="sm" leftIcon={<IconInfo size={12} />}>Hint</Label>
```

### Theming
- Neutral styles rely on semantic tokens (`bg-surface`, `bg-surfaceAlt`, `text-textBase`, `text-textMuted`, `border-color`).
- Severity styles use light/dark color utilities for now; when severity tokens are introduced, map them in `bySeverityAndVariant`.

### Accessibility
- `Label` renders inline by default. For larger touch targets or interactive badges, prefer a Button variant instead.
- Avoid using `Label` to convey critical information without accompanying text.

### Testing
Unit tests cover size, pill, severity/variant classes, icon slots, and `as` override. See `Label.test.tsx`.

### Migration tips
- Replace ad-hoc `<span className="...">` tags used for badges with `<Label/>` to centralize styles.
- Prefer `variant="soft"` for subtle UI surfaces; reserve `solid` for emphasis.
