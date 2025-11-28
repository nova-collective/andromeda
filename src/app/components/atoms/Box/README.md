# Box Atom

The `Box` atom is a low-level layout primitive used for grouping content with consistent background, border, padding, and radius treatments.

## Props

- `as?` (React.ElementType, default `div`): Underlying element to render.
- `variant?` (`'plain' | 'subtle' | 'elevated'`, default `subtle`): Background and shadow treatment.
- `padding?` (`'none' | 'sm' | 'md' | 'lg'`, default `md`): Internal padding.
- `radius?` (`'none' | 'sm' | 'md' | 'lg' | 'full'`, default `md`): Corner rounding.
- `bordered?` (boolean, default `true`): Whether to render a border using `border-color`.
- All other `div`/element props are forwarded to the root.

## Usage

```tsx
import { Box, Heading, Paragraph } from '@/app/components';

<Box variant="elevated" padding="lg" radius="lg">
  <Heading level={3}>Feature</Heading>
  <Paragraph size="sm">Short supporting copy.</Paragraph>
</Box>;
```
