# Avatar

Circular (or optionally rounded) user representation component with image display and automatic initials fallback following Andromeda VDS patterns.

## Features
- Size presets: `xs`, `sm`, `md`, `lg`
- Variants: `primary`, `secondary` (contextual wrapper for color scope)
- Fallback initials derived from `alt` text or `initials` override
- Graceful error handling: on image load error, show fallback
- Accessible labeling via `alt` (image) or `aria-label` (fallback)

## Props
| Name        | Type      | Default    | Description                                |
| ----------- | --------- | ---------- | ------------------------------------------ |
| `src`       | `string`  | —          | Image URL source.                          |
| `alt`       | `string`  | —          | Accessible label; used to derive initials. |
| `size`      | `xs       | sm         | md                                         | lg`                         | `md` | Controls diameter & font size. |
| `variant`   | `primary  | secondary` | `primary`                                  | Text color context wrapper. |
| `rounded`   | `boolean` | `true`     | Full circle or slightly rounded square.    |
| `initials`  | `string`  | —          | Override derived initials fallback.        |
| `className` | `string`  | —          | Extra Tailwind utility classes.            |

## Design Tokens
- Background: `bg-surface`
- Border: `border-color`
- Text: `text-textBase`
- Wrapper variant: `text-primary` / `text-secondary`

## Usage
```tsx
import { Avatar } from '@/app/components';

export function Example() {
	return (
		<div className="flex items-center gap-4">
			<Avatar src="/user/alice.jpg" alt="Alice Doe" />
			<Avatar alt="Bob Stone" />
			<Avatar size="sm" alt="Carla Green" />
			<Avatar size="lg" alt="Dana Fox" initials="DF" />
			<Avatar variant="secondary" alt="Evan Lund" />
		</div>
	);
}
```

## Fallback Logic
1. If `src` loads successfully → show image.
2. If `src` missing or image errors → derive initials from `alt`. Uses first & last word first letters.
3. If no `alt` or empty → shows a middle dot (`·`).
4. If `initials` provided → uses that (first two characters, uppercased) regardless of `alt`.

## Accessibility
- Image avatar: `alt` text is required for non-decorative usage.
- Fallback avatar: `role="img"` + `aria-label` (the `alt` text) ensures screen readers announce it.
- Provide meaningful `alt` like "Alice Doe" not just "avatar".

## Testing Guidelines
- Render with image: expect `data-testid="avatar-image"`.
- Render without image: expect fallback and initials.
- Override initials: ensure override used.
- Size presets: assert class names `h-6`, `h-8`, `h-10`, `h-12`.

## Export
Available via both atoms and components barrels:
```ts
import { Avatar } from '@/app/components';
```

