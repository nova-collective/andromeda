# SearchInput

Specialized text input optimized for search interactions within the Andromeda Visual Design System (VDS). It provides a leading search icon and optional clear button while mirroring `TextInput` sizing, variant coloring, and state behaviors.

## Features
- Size presets: `sm`, `md`, `lg`
- Variants: `primary`, `secondary` (affects contextual text color wrapper)
- States: invalid (error border + `aria-invalid`), disabled (reduced opacity + no hover)
- Clear affordance via `clearable` prop and `onClear` callback
- Accessible semantics: `type="search"` and `aria-invalid` when invalid

## Tokens & Styling
- Background: `bg-surface`
- Text: `text-textBase`, placeholder `text-textMuted/70`
- Border: `border-color`
- Focus: `focus:shadow-focus`
- Error Border: `border-red-500 dark:border-red-400`

## Props
| Name                         | Type         | Default    | Description                               |
| ---------------------------- | ------------ | ---------- | ----------------------------------------- |
| `size`                       | `sm          | md         | lg`                                       | `md`                        | Controls vertical rhythm & padding. |
| `variant`                    | `primary     | secondary` | `primary`                                 | Wrapper text color context. |
| `invalid`                    | `boolean`    | `false`    | Applies error styles & `aria-invalid`.    |
| `disabled`                   | `boolean`    | `false`    | Disables input & pointer events.          |
| `clearable`                  | `boolean`    | `false`    | Shows clear button when true.             |
| `onClear`                    | `() => void` | —          | Invoked when clear button clicked.        |
| All other native input props | —            | —          | Passed through to underlying `<input />`. |

## Usage
```tsx
import { SearchInput } from '@/app/components';

export function CatalogSearch() {
	return (
		<form role="search" className="max-w-md space-y-4">
			<SearchInput placeholder="Search titles" clearable onClear={() => console.log('clear')} />
			<SearchInput size="sm" placeholder="Small search" />
			<SearchInput size="lg" variant="secondary" placeholder="Large secondary" />
			<SearchInput invalid placeholder="Broken query" />
			<SearchInput disabled placeholder="Disabled search" />
		</form>
	);
}
```

## Accessibility Notes
- Leading icon is marked `aria-hidden` to avoid redundancy.
- Clear action button uses `aria-label="Clear search"` for screen reader clarity.
- Invalid state sets `aria-invalid="true"`.
- Recommended to wrap in a `role="search"` landmark `<form>` or container for semantic grouping.

## Testing Guidelines
Ensure tests cover:
- Rendering & placeholder presence
- Size class application (`text-sm`, `py-2.5`, `py-3`)
- Invalid state (`aria-invalid` & red border)
- Disabled state (`disabled` attribute & opacity)
- Clear button visibility & callback invocation

## Export
Available via atom & components barrels:
```ts
import { SearchInput } from '@/app/components';
```

