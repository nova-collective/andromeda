# MenuItem Atom

The `MenuItem` atom represents a single option inside menus, dropdowns, and command palettes. It follows the same tone and size conventions as other VDS atoms like `Badge` and `Label`.

## Props

- `label` (string, required): Main text for the item.
- `description` (string, optional): Supporting text shown below the label.
- `icon` (ReactNode, optional): Leading icon.
- `shortcut` (string, optional): Right-aligned keyboard shortcut hint (e.g. `⌘K`).
- `active` (boolean, optional): Highlights the item as the current selection.
- `disabled` (boolean, optional): Disables interaction and dims the item.
- `variant` (`'default' | 'danger'`): Visual intent (e.g. destructive actions).
- `tone` (`'neutral' | 'info' | 'success' | 'warning' | 'danger'`): Color tone, aligned with other status atoms.
- `size` (`'sm' | 'md'`): Controls padding and font size.
- All standard `button` props are forwarded to the underlying element.

## Usage

```tsx
import { MenuItem } from '@/app/components';

<MenuItem
  label="Profile"
  description="View and edit your profile"
  shortcut="P"
  active
/>
```
