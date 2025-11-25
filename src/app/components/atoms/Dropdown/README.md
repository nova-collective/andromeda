# Dropdown

Theme-aware select input atom for choosing a single value from a list. Mirrors patterns used by `TextInput`, `Checkbox`, and `RadioButton` atoms (size presets, variant coloring, invalid & disabled states).

## Props

- `size`: `sm | md | lg` (default: `md`) – controls padding & font size
- `variant`: `primary | secondary` (default: `primary`) – contextual color wrapper (`text-${variant}`)
- `invalid`: `boolean` – applies red border & `aria-invalid="true"`
- `disabled`: `boolean` – disables interactions & reduces opacity
- `options`: `DropdownOption[]` – alternative to passing `<option>` children
- `placeholder`: `string` – disabled first option prompting selection
- All native `<select />` props except `size` (renamed to avoid collision)

### `DropdownOption`
```ts
interface DropdownOption {
	value: string;
	label: string;
	disabled?: boolean;
}
```

## Usage

```tsx
import { Dropdown } from '@/app/components';

// Basic
<Dropdown options={[{ value: 'basic', label: 'Basic' }, { value: 'pro', label: 'Pro' }]} />

// With placeholder
<Dropdown placeholder="Select plan" options={[
	{ value: 'basic', label: 'Basic' },
	{ value: 'pro', label: 'Pro' },
	{ value: 'enterprise', label: 'Enterprise', disabled: true }
]} />

// Sizes
<Dropdown size="sm" options={[{ value: 'a', label: 'Alpha' }]} />
<Dropdown size="md" options={[{ value: 'b', label: 'Beta' }]} />
<Dropdown size="lg" options={[{ value: 'c', label: 'Gamma' }]} />

// Invalid & Disabled
<Dropdown invalid options={[{ value: 'err', label: 'Error state only' }]} />
<Dropdown disabled options={[{ value: 'off', label: 'Disabled state' }]} />

// Secondary variant
<Dropdown variant="secondary" options={[{ value: 'x', label: 'X' }, { value: 'y', label: 'Y' }]} />

// Children instead of options prop
<Dropdown>
	<option value="one">One</option>
	<option value="two">Two</option>
</Dropdown>
```

## Accessibility
- Native `<select>` semantics preserved.
- `aria-invalid` added when `invalid`.
- Disabled state uses `disabled` attribute.
- Placeholder rendered as first disabled option (not focusable/selectable).

## Design Tokens
- Background: `bg-surface`
- Text: `text-textBase` (wrapped with `text-${variant}` on container)
- Border: `border-color`
- Focus: `focus:shadow-focus`
- Invalid border: `border-red-500 dark:border-red-400`

## Notes
- Use `options` for convenience or children for full control.
- For multi-select needs, implement a separate component (this atom is single-value only).
- Appearance is minimal; customize further via `className` if required while keeping semantic styling intact.
