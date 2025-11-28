# Toast Atom

The `Toast` atom provides inline, transient feedback messages such as success, warning, or error notifications. It follows the same tone and severity patterns as status atoms like `Badge` and `Label`.

## Props

- `title?` (string): Short heading for the toast.
- `description?` (string): Supporting copy shown under the title.
- `tone?` (`'neutral' | 'info' | 'success' | 'warning' | 'danger'`, default `neutral`): Visual tone of the toast.
- `variant?` (`'solid' | 'soft'`, default `soft`): Background style.
- `size?` (`'sm' | 'md'`, default `md`): Controls padding and text size.
- `icon?` (ReactNode): Optional leading icon.
- `onDismiss?` (() => void): When provided, renders a dismiss button and calls this handler when clicked.
- `dismissLabel?` (string): Accessible label for the dismiss button, default `"Dismiss notification"`.
- All other `div` props are forwarded to the root element.

## Usage

```tsx
import { Toast } from '@/app/components';

<Toast
  tone="success"
  title="Saved"
  description="Your changes have been saved."
  onDismiss={() => setOpen(false)}
/>;
```
