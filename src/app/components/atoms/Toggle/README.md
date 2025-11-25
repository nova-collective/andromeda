# Toggle

Boolean switch atom for enabling/disabling a setting. Implements the same core patterns as other form atoms (size presets, variant wrapper, invalid & disabled states).

## Props

- `size`: `sm | md | lg` (default: `md`)
- `label`: `ReactNode` – optional label rendered to the right
- `invalid`: `boolean` – adds error ring & `aria-invalid="true"`
- `disabled`: `boolean` – disables interactions & dims control
- `variant`: `primary | secondary` (default: `primary`) – color context wrapper
- Other native `<input type="checkbox" />` props (except `type`) spread onto the hidden checkbox

## Usage

```tsx
import { Toggle } from '@/app/components';

<Toggle label="Enable dark mode" />
<Toggle defaultChecked label="Notifications" />
<Toggle size="sm" label="Small toggle" />
<Toggle size="lg" label="Large toggle" />
<Toggle invalid label="Require confirmation" />
<Toggle disabled label="Disabled setting" />
<Toggle variant="secondary" label="Secondary context" />
```

## Accessibility
- Underlying control is a native checkbox with `role="switch"`.
- `aria-invalid` applied when `invalid`.
- Focus styles via `peer-focus:shadow-focus`.
- Label is clickable; do not nest interactive elements inside the label content.

## Design Tokens
- Track background: `bg-surface`
- Track border: `border-color`
- Checked accent: `--link-color`
- Knob background: `bg-white dark:bg-black`
- Focus: `shadow-focus`
- Invalid: `ring-red-500 dark:ring-red-400`

## Notes
- Size preset changes track width/height and knob size & translation.
- For deterministic knob translation on larger sizes, inline style ensures consistent distance.
- Use external state management (e.g. `onChange`) for controlled usage.
