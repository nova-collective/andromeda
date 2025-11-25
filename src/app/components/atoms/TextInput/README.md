# TextInput

Theme-aware text input atom following the Visual Design System. Supports size presets, icons, and invalid/disabled states.

## Props
- size: `sm | md | lg` — size preset (default `md`)
- invalid: boolean — marks the input invalid and sets `aria-invalid`
- disabled: boolean — disables the input and applies reduced opacity/cursor
- leftIcon: ReactNode — optional leading icon
- rightIcon: ReactNode — optional trailing icon
- ...native input props

## Usage
```tsx
import { TextInput } from '@/app/components';

export default function Example() {
  return (
    <div className="space-y-4">
      <TextInput placeholder="Search books…" />
      <TextInput size="sm" placeholder="Small" />
      <TextInput size="lg" placeholder="Large" />
      <TextInput invalid placeholder="Invalid state" />
      <TextInput disabled placeholder="Disabled" />
    </div>
  );
}
```

## Theming
Uses semantic tokens for background, text, and border (`bg-surface`, `text-textBase`, `placeholder:text-textMuted/70`, `border-color`) and `focus:shadow-focus` for focus indication. Reacts automatically to light/dark themes via CSS variables.