# RadioButton

Theme-aware radio input atom following the VDS. Mirrors `Checkbox` API with size presets, variant coloring, and invalid/disabled states.

## Props

- `size`: sm | md | lg (default: md)
- `label`: ReactNode – optional label rendered to the right
- `invalid`: boolean – red border + `aria-invalid`
- `disabled`: boolean – disabled styles and attribute
- `variant`: primary | secondary (default: primary)
- All native `<input type="radio" />` props (except `size`)

## Usage

```tsx
import { RadioButton } from '@/app/components';

// Basic
<RadioButton name="plan" value="basic" label="Basic" />

// Group
<div>
	<RadioButton name="color" value="red" label="Red" />
	<RadioButton name="color" value="blue" label="Blue" />
	<RadioButton name="color" value="green" label="Green" disabled />
	<RadioButton name="color" value="purple" label="Purple" invalid />
  
	{/* Sizes */}
	<RadioButton size="sm" name="s" value="s1" label="Small" />
	<RadioButton size="md" name="s" value="s2" label="Medium" />
	<RadioButton size="lg" name="s" value="s3" label="Large" />
}

// Variant
<RadioButton variant="secondary" label="Secondary context" />
```

## Accessibility
- Uses native radio semantics.
- Applies `aria-invalid` when `invalid`.
- Label click toggles the input.

## Design Tokens
- Background: `bg-surface`
- Text: `text-textBase`
- Border: `border-color`
- Checked/Accent: `--link-color`
