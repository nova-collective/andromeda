# ProgressBar

Visual indicator of task or process completion following Andromeda VDS conventions. Supports determinate (value/max) and indeterminate states, size presets, contextual variants, and optional percentage label.

## Features
- Sizes: `sm` (h-2), `md` (h-3), `lg` (h-4)
- Variants: `primary`, `secondary` (wrapper text context)
- Determinate: width reflects `value / max`
- Indeterminate: pulsing bar (no numeric value)
- Optional label: percentage or loading text
- Accessible via `role="progressbar"` + ARIA value attributes

## Props
| Name            | Type      | Default    | Description                                               |
| --------------- | --------- | ---------- | --------------------------------------------------------- |
| `value`         | `number`  | `0`        | Current progress value. Clamped to `[0, max]`.            |
| `max`           | `number`  | `100`      | Maximum value.                                            |
| `size`          | `sm       | md         | lg`                                                       | `md`                      | Height preset. |
| `variant`       | `primary  | secondary` | `primary`                                                 | Contextual color wrapper. |
| `showLabel`     | `boolean` | `false`    | Displays percentage or loading text.                      |
| `indeterminate` | `boolean` | `false`    | Shows animated placeholder bar; hides numeric ARIA attrs. |
| `className`     | `string`  | —          | Extra utilities.                                          |

## Design Tokens
- Track: `bg-surface` + `border border-color`
- Fill: `bg-[color:var(--link-color)]`
- Text (label): `text-textMuted`
- Wrapper: `text-primary` / `text-secondary`

## Accessibility
Determinate:
```html
role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="60"
```
Indeterminate: omit `aria-valuenow/aria-valuemax/aria-valuemin` per WAI guidance.

Include nearby context (label element or descriptive text) describing what is progressing (e.g., "Uploading file" above the component).

## Usage
```tsx
import { ProgressBar } from '@/app/components';

export function UploadStatus({ uploaded, total }: { uploaded: number; total: number }) {
	return (
		<div className="space-y-2 max-w-sm">
			<Paragraph size="sm" muted>Uploading file…</Paragraph>
			<ProgressBar value={uploaded} max={total} showLabel />
		</div>
	);
}

export function LoadingExample() {
	return <ProgressBar indeterminate size="sm" showLabel />;
}
```

## Testing Guidelines
- Verify ARIA attributes when determinate.
- Ensure indeterminate omits `aria-valuenow`.
- Size classes present for each preset.
- Label shows rounded percentage or "Loading…".
- Width clamped at 0–100%.

## Export
Available via both atoms and components barrels:
```ts
import { ProgressBar } from '@/app/components';
```

