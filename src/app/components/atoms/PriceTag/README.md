# PriceTag

The PriceTag atom displays token or fiat price with optional previous value and directional trend indicator. It follows VDS sizing & variant patterns and supports accessible labeling.

## Features
- Value + currency token (e.g. ETH, USD)
- Optional previous value (rendered struck-through)
- Trend arrow (up/down) when previous value differs
- Size variants: `sm`, `md`, `lg`
- Color variants: `primary`, `secondary`
- Optional visible label via `showLabel` (sr-only otherwise)
- Custom format function for value strings

## Import
```tsx
import { PriceTag } from '@/app/components';
// or granular
import { PriceTag } from '@/app/components/atoms/PriceTag';
```

## Usage
```tsx
<PriceTag value={2.5} currency="ETH" />
<PriceTag value={3.1} previousValue={2.9} currency="ETH" />
<PriceTag value={1.2} previousValue={1.5} currency="ETH" />
<PriceTag value={250} currency="USD" size="lg" showLabel />
<PriceTag value={0.85} currency="ETH" variant="secondary" />
<PriceTag value={1234.56} currency="USD" format={v => Number(v).toFixed(2)} />
```

## Props
| Name            | Type                              | Default      | Description                                |
| --------------- | --------------------------------- | ------------ | ------------------------------------------ |
| `value`         | `number                           | string`      | —                                          | Current price value                          |
| `currency`      | `string`                          | `"ETH"`      | Currency or token symbol                   |
| `previousValue` | `number                           | string`      | —                                          | Previous price; shows trend + strike-through |
| `size`          | `"sm"                             | "md"         | "lg"`                                      | `"md"`                                       | Font size & spacing scale |
| `variant`       | `"primary"                        | "secondary"` | `"primary"`                                | Color context                                |
| `label`         | `string`                          | `"Price"`    | Accessible label (visible if `showLabel`)  |
| `showLabel`     | `boolean`                         | `false`      | Display label before price visibly         |
| `format`        | `(v) => string`                   | —            | Custom formatting of value & previousValue |
| `className`     | `string`                          | —            | Additional class names                     |
| `...rest`       | `HTMLAttributes<HTMLSpanElement>` | —            | Span attributes                            |

## Accessibility
- Wrapper span has `role="text"` and an `aria-label` combining current & previous values.
- Trend arrows include `aria-label` ("Increased" / "Decreased").
- Hidden label unless `showLabel` for compact UI; visible label improves context in mixed layouts.

## Styling
- Current value uses `text-[color:var(--link-color)]` for emphasis.
- Previous value: `line-through text-secondary/50`.
- Trend up arrow: `text-green-600`; down: `text-red-600`.
- Size mapping adjusts font-size and gap spacing.

## Testing Guidelines
Verify:
1. Value & currency rendered
2. Previous value struck-through
3. Up / down arrow based on numeric comparison
4. Size + variant classes applied
5. Visible label when `showLabel`

## Showcase Snippet
```tsx
<div className="space-y-4">
  <Paragraph size="sm" muted className="text-secondary">Primary variant</Paragraph>
  <div className="flex flex-col gap-2">
    <PriceTag value={2.5} currency="ETH" />
    <PriceTag value={3} previousValue={2.5} currency="ETH" />
    <PriceTag value={1.5} previousValue={2} currency="ETH" />
    <PriceTag value={250} currency="USD" size="lg" showLabel />
  </div>
  <Paragraph size="sm" muted className="text-secondary">Secondary variant</Paragraph>
  <div className="flex flex-col gap-2">
    <PriceTag variant="secondary" value={0.85} currency="ETH" />
    <PriceTag variant="secondary" value={1.2} previousValue={1.0} currency="ETH" />
    <PriceTag variant="secondary" value={0.9} previousValue={1.1} currency="ETH" />
  </div>
</div>
```

## Exports
- Re-exported from `atoms/PriceTag/index.ts`
- Added to `atoms/index.ts` and `components/index.tsx`

## Changelog
Add entries for new props or formatting behavior changes.
