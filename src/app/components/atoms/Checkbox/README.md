# Checkbox

Theme-aware checkbox atom supporting size presets, invalid/disabled, and indeterminate states. Uses semantic tokens and brand accent color.

## Props
- size: `sm | md | lg` (default `md`) – controls square size and label text scale.
- label: `ReactNode` – optional label rendered to the right.
- invalid: `boolean` – sets error border color and `aria-invalid`.
- disabled: `boolean` – reduces opacity and disables interactions.
- indeterminate: `boolean` – shows mixed state (visual only until all selected).
- ...native input props (`checked`, `onChange`, etc.).

## Usage
```tsx
import { Checkbox } from '@/app/components';

export function Preferences() {
	return (
		<div className="space-y-3">
			<Checkbox label="Enable notifications" />
			<Checkbox defaultChecked label="Subscribe to newsletter" />
			<Checkbox indeterminate label="Partial selection" />
			<Checkbox invalid label="Invalid selection" />
			<Checkbox disabled label="Disabled option" />
		</div>
	);
}
```

## Theming
Semantic tokens ensure light/dark readiness:
- Background: `bg-surface`
- Border: `border-color` (or error red when `invalid`)
- Text: `text-textBase` / `text-textMuted`
- Accent (checked/indeterminate): `var(--link-color)` for brand consistency.

Focus ring leverages `focus:shadow-focus` from the design system conventions.

## Accessibility
- Uses a `<label>` wrapper so clicking text toggles the input.
- `aria-invalid` set when `invalid` is true.
- Indeterminate state applied via DOM property; supply a descriptive label indicating partial selection.

