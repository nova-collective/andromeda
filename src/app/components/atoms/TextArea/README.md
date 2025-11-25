# TextArea

Theme-aware multi-line input atom. Supports size presets, invalid/disabled states, and optional character counting.

## Props
- size: `sm | md | lg` — size preset (default `md`)
- invalid: boolean — marks the textarea invalid and sets `aria-invalid`
- disabled: boolean — disables the textarea and applies reduced opacity/cursor
- showCount: boolean — shows current character count in the bottom-right
- maxLength: number — optional maximum length displayed with count
- value / onChange — controlled usage for count updates
- ...native textarea props

## Usage
```tsx
import { TextArea } from '@/app/components';

export default function Example() {
  const [bio, setBio] = useState('');
  return (
    <div className="space-y-4">
      <TextArea placeholder="Your bio" value={bio} onChange={(e) => setBio(e.target.value)} showCount maxLength={160} />
      <TextArea size="sm" placeholder="Small notes" />
      <TextArea size="lg" placeholder="Extended description" />
      <TextArea invalid placeholder="Invalid state" />
      <TextArea disabled placeholder="Disabled" />
    </div>
  );
}
```

## Theming
Uses semantic tokens for background, text, and border (`bg-surface`, `text-textBase`, `placeholder:text-textMuted/70`, `border-color`) and `focus:shadow-focus` for focus indication. Automatically adapts to light/dark themes through CSS variables. Character count uses `text-textMuted`.
