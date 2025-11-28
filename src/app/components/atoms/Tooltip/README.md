# Tooltip Atom

The `Tooltip` atom provides lightweight, accessible text hints for interactive controls. It follows the same visual language as other atoms, using surface and text tokens for theme-awareness.

## Props

- `label` (string, required): Text shown inside the tooltip.
- `children` (ReactElement, required): The trigger element; mouse and focus events are attached to it.
- `placement?` (`'top' | 'bottom'`, default `top`): Where the tooltip appears relative to the trigger.
- `variant?` (`'primary' | 'secondary'`, default `primary`): Controls the color treatment.

## Accessibility

- Uses `role="tooltip"` and `aria-describedby` on the trigger while visible.
- Opens on hover and keyboard focus, closes on mouse leave and blur.

## Usage

```tsx
import { Tooltip, Button } from '@/app/components';

<Tooltip label="Connect your wallet">
  <Button variant="primary" size="sm">Connect</Button>
</Tooltip>;
```
