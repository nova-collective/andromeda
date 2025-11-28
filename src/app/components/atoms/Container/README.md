# Container Atom

The `Container` atom provides a layout wrapper for constraining content width and padding while respecting the design system’s page gutters and card treatments.

## Props

- `as?` (React.ElementType, default `div`): Underlying element to render.
- `width?` (`'sm' | 'md' | 'lg' | 'xl'`, default `lg`): Max-width breakpoints.
- `padding?` (`'none' | 'sm' | 'md' | 'lg'`, default `md`): Horizontal padding.
- `center?` (boolean, default `true`): Centers the container with `mx-auto` when true.
- `bordered?` (boolean, default `false`): Enables a bordered, card-like treatment.
- All other `div`/element props are forwarded.

## Usage

```tsx
import { Container, Heading, Paragraph } from '@/app/components';

<Container width="lg" padding="md">
  <Heading level={2}>Section title</Heading>
  <Paragraph>Section body content lives here.</Paragraph>
</Container>;
```
