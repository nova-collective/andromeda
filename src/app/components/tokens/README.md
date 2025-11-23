# Design Tokens

Central source of truth for the design system’s primitives used across components and Tailwind configuration.

Contents
- Colors: semantic aliases + palettes.
- Spacing: layout rhythm for sections, gutters, components.
- Container: layout container configuration.
- Font Family: primary font stacks.
- Letter Spacing: tracking presets.
- Line Height: vertical rhythm for text.
- Border Radius: rounding scales including `pill`.
- Box Shadow: elevation levels.
- Animation: named animation shorthand.
- Keyframes: motion definitions referenced by animations.
- Transition Timing Function: easing curves.
- Transition Duration: standardized durations.
- Z-Index: layering order.

Usage
- Import tokens from `src/app/components/tokens` in Tailwind config and components.
- Prefer semantic tokens (e.g., `colors.surface`, `colors.textBase`) for theme-aware UI.

Testing
- Each token file includes a lightweight unit test validating shape and representative values.
