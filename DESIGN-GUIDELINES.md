# 🎨 Andromeda Design System

**Version:** 1.0.0  
**Last Updated:** November 2025

---

## Table of Contents

- [Overview](#overview)
- [Design Philosophy](#design-philosophy)
- [Color System](#color-system)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Components](#components)
- [Animations & Transitions](#animations--transitions)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)
- [Best Practices](#best-practices)

---

## Overview

Andromeda's design system is built to create a modern, clean, and accessible Web3 publishing platform. Our design language emphasizes clarity, sophistication, and seamless user experience across light and dark themes.

### Key Principles

- **Clean & Modern:** Minimalist aesthetic with purposeful visual hierarchy
- **Accessible First:** WCAG AA compliant with inclusive design patterns
- **Theme Flexibility:** Seamless dark/light mode with optimal contrast
- **Performance:** Optimized animations and efficient rendering
- **Scalable:** Component-based architecture for consistent UI

---

## Design Philosophy

### Visual Hierarchy

1. **Primary Actions:** High contrast, prominent placement (CTAs, important buttons)
2. **Secondary Actions:** Subtle but discoverable (filters, settings)
3. **Tertiary Actions:** Minimal visual weight (less frequent actions)

### Content Strategy

- **Scannable:** Users should grasp key information in 3-5 seconds
- **Progressive Disclosure:** Show essential info upfront, details on demand
- **Visual Feedback:** Immediate response to all user interactions

### User Experience Goals

- **Intuitive Navigation:** Clear mental model of information architecture
- **Reduced Friction:** Minimize steps to complete key tasks
- **Trust Building:** Professional appearance with secure interactions
- **Delightful Details:** Thoughtful micro-interactions enhance engagement

---

## Color System

### Brand Colors

#### Primary Palette

```css
/* Ocean Blue - Primary Brand Color */
--primary-50:  #f0f9ff;
--primary-100: #e0f2fe;
--primary-200: #bae6fd;
--primary-300: #7dd3fc;
--primary-400: #38bdf8;
--primary-500: #2081e2; /* Main brand color */
--primary-600: #1a6bc4;
--primary-700: #1554a3;
--primary-800: #134482;
--primary-900: #0f3660;
```

**Usage:**
- `primary-500`: CTAs, links, active states, brand elements
- `primary-400`: Hover states, highlights
- `primary-600`: Pressed states, dark mode adjustments

#### Dark Theme Colors

```css
/* Background & Surface Colors */
--dark-50:  #f8fafc;
--dark-100: #f1f5f9;
--dark-200: #e2e8f0;
--dark-300: #cbd5e1;
--dark-400: #94a3b8;
--dark-500: #64748b;
--dark-600: #475569;
--dark-700: #353840; /* Main dark background */
--dark-800: #262b2f; /* Card background */
--dark-900: #1a1d1f; /* Deepest background */
```

**Usage:**
- `dark-900`: Page background (dark mode)
- `dark-800`: Card/elevated surface background
- `dark-700`: Hover states, secondary surfaces
- `dark-600`: Borders, dividers
- `dark-400`: Disabled text, placeholders

#### Semantic Colors

```css
/* Success */
--success-500: #10b981; /* Green */
--success-600: #059669;

/* Warning */
--warning-500: #f59e0b; /* Amber */
--warning-600: #d97706;

/* Error */
--error-500: #ef4444; /* Red */
--error-600: #dc2626;

/* Info */
--info-500: #3b82f6; /* Blue */
--info-600: #2563eb;
```

#### Neutral Colors

```css
/* Light Theme */
--gray-50:  #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb; /* Borders */
--gray-300: #d1d5db;
--gray-400: #9ca3af; /* Muted text */
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827; /* Body text */
```

### Color Usage Guidelines

#### Light Mode
- **Background:** `#ffffff` or `gray-50`
- **Surface (Cards):** `#ffffff` with subtle border
- **Text Primary:** `gray-900`
- **Text Secondary:** `gray-600`
- **Borders:** `gray-200`

#### Dark Mode
- **Background:** `dark-900`
- **Surface (Cards):** `dark-800`
- **Text Primary:** `#ffffff` or `gray-50`
- **Text Secondary:** `gray-300`
- **Borders:** `dark-600`

#### Accessibility Requirements
- **Text on Light BG:** Minimum contrast ratio 4.5:1
- **Text on Dark BG:** Minimum contrast ratio 4.5:1
- **Large Text (≥24px):** Minimum contrast ratio 3:1
- **Interactive Elements:** Minimum 3:1 against background

---

## Typography

### Font Family

**Primary:** Inter (Variable font for optimal performance)

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 
             'Droid Sans', 'Helvetica Neue', sans-serif;
```

**Loading:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Type Scale

| Element | Size | Weight | Line Height | Use Case |
|---------|------|--------|-------------|----------|
| **Display Large** | 4rem (64px) | 800 Bold | 1.1 | Hero headlines |
| **Display** | 3rem (48px) | 700 Bold | 1.2 | Page titles |
| **H1** | 2.5rem (40px) | 700 Bold | 1.2 | Section headings |
| **H2** | 2rem (32px) | 700 Bold | 1.3 | Subsection headings |
| **H3** | 1.5rem (24px) | 600 Semibold | 1.4 | Card titles |
| **H4** | 1.25rem (20px) | 600 Semibold | 1.4 | Small headings |
| **Body Large** | 1.125rem (18px) | 400 Regular | 1.6 | Intro text |
| **Body** | 1rem (16px) | 400 Regular | 1.6 | Body text |
| **Body Small** | 0.875rem (14px) | 400 Regular | 1.5 | Secondary text |
| **Caption** | 0.75rem (12px) | 500 Medium | 1.4 | Labels, metadata |
| **Tiny** | 0.625rem (10px) | 600 Semibold | 1.3 | Badges, tags |

### Font Weights

- **400 Regular:** Body text, paragraphs
- **500 Medium:** Emphasized text, labels
- **600 Semibold:** Subheadings, button text
- **700 Bold:** Headings, important callouts
- **800 Extrabold:** Display text, hero headlines

### Text Styling

```css
/* Smooth font rendering */
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;

/* Gradient text effect */
.text-gradient {
  background: linear-gradient(135deg, #2081e2 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Spacing & Layout

### Spacing Scale

Based on 4px increments (Tailwind default):

| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|--------|
| **xs** | 4px | `p-1` | Tight spacing |
| **sm** | 8px | `p-2` | Compact elements |
| **md** | 12px | `p-3` | Default spacing |
| **lg** | 16px | `p-4` | Card padding |
| **xl** | 24px | `p-6` | Section padding |
| **2xl** | 32px | `p-8` | Large sections |
| **3xl** | 48px | `p-12` | Hero sections |
| **4xl** | 64px | `p-16` | Major sections |

### Layout Grid

```css
/* Container */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container { padding: 0 1.5rem; }
}

@media (min-width: 1024px) {
  .container { padding: 0 2rem; }
}
```

### Card Spacing

```css
/* Card internal spacing */
.card-padding {
  padding: 1rem; /* 16px */
}

/* Card gaps in grid */
.card-gap {
  gap: 1.5rem; /* 24px */
}
```

### Section Spacing

```css
/* Between major sections */
.section-spacing {
  margin-bottom: 3rem; /* 48px mobile */
}

@media (min-width: 768px) {
  .section-spacing {
    margin-bottom: 4rem; /* 64px tablet */
  }
}

@media (min-width: 1024px) {
  .section-spacing {
    margin-bottom: 5rem; /* 80px desktop */
  }
}
```

---

## Components

### Buttons

#### Primary Button

```css
/* Base styles */
.btn-primary {
  padding: 0.75rem 1.5rem; /* 12px 24px */
  border-radius: 0.75rem; /* 12px */
  font-weight: 600;
  font-size: 1rem;
  background: #2081e2;
  color: white;
  transition: all 200ms ease;
}

.btn-primary:hover {
  background: #1a6bc4;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(32, 129, 226, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### Secondary Button

```css
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  border: 1.5px solid #e5e7eb;
  background: transparent;
  color: #374151;
  transition: all 200ms ease;
}

.btn-secondary:hover {
  border-color: #2081e2;
  color: #2081e2;
  background: rgba(32, 129, 226, 0.05);
}
```

#### Button Sizes

| Size | Padding | Font Size | Use Case |
|------|---------|-----------|----------|
| **Small** | `0.5rem 1rem` | `0.875rem` | Inline actions |
| **Medium** | `0.75rem 1.5rem` | `1rem` | Default buttons |
| **Large** | `1rem 2rem` | `1.125rem` | CTAs, hero |

### Cards

#### Base Card

```css
.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem; /* 16px */
  overflow: hidden;
  transition: all 300ms ease;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 
              0 4px 8px rgba(0,0,0,0.1);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 
              0 8px 16px rgba(0,0,0,0.15);
}

/* Dark mode */
.dark .card {
  background: #262b2f;
  border-color: #475569;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.05), 
              0 4px 8px rgba(0,0,0,0.3);
}

.dark .card:hover {
  box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 
              0 8px 16px rgba(0,0,0,0.4);
}
```

#### Card Anatomy

```
┌─────────────────────────┐
│   Image (aspect-square) │  ← Hover: scale 110%
├─────────────────────────┤
│ Collection Name         │  ← Primary-500 color
│ Item Title              │  ← H3, truncated
│                         │
│ Current Price  Last Sale│  ← Grid layout
│ 2.5 ETH       2.1 ETH  │
└─────────────────────────┘
```

### Input Fields

```css
.input {
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-size: 1rem;
  transition: all 200ms ease;
}

.input:focus {
  outline: none;
  border-color: #2081e2;
  background: white;
  box-shadow: 0 0 0 3px rgba(32, 129, 226, 0.1);
}

/* Dark mode */
.dark .input {
  background: #353840;
  border-color: #475569;
  color: white;
}

.dark .input:focus {
  border-color: #38bdf8;
  background: #262b2f;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
}
```

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px; /* Full rounded */
  font-size: 0.75rem;
  font-weight: 600;
}

/* Variants */
.badge-primary {
  background: rgba(32, 129, 226, 0.1);
  color: #2081e2;
}

.badge-success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.badge-warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}
```

### Modal/Dialog

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 50;
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 1.5rem;
  max-width: 32rem;
  margin: 2rem auto;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.dark .modal-content {
  background: #262b2f;
  border: 1px solid #475569;
}
```

---

## Animations & Transitions

### Timing Functions

```css
/* Standard easing */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Bouncy effect */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Common Animations

#### Fade In

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 300ms ease-out;
}
```

#### Slide Up

```css
@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slideUp 300ms ease-out;
}
```

#### Scale In

```css
@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scaleIn 200ms ease-out;
}
```

### Hover Effects

```css
/* Card hover */
.card-hover {
  transition: transform 200ms ease, box-shadow 300ms ease;
}

.card-hover:hover {
  transform: translateY(-4px);
}

/* Image zoom */
.image-zoom {
  transition: transform 500ms ease;
}

.image-zoom:hover {
  transform: scale(1.1);
}

/* Button lift */
.button-lift {
  transition: all 200ms ease;
}

.button-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.button-lift:active {
  transform: translateY(0);
}
```

### Loading States

```css
/* Pulse animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Spin animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

---

## Responsive Design

### Breakpoint System

```css
/* Mobile First Approach */

/* Small devices (phones) */
@media (min-width: 640px) {
  /* Tablet adjustments */
}

/* Medium devices (tablets) */
@media (min-width: 768px) {
  /* Larger tablets */
}

/* Large devices (desktops) */
@media (min-width: 1024px) {
  /* Desktop layout */
}

/* Extra large devices */
@media (min-width: 1280px) {
  /* Wide screens */
}
```

### Grid Layouts

```css
/* Responsive grid */
.grid-responsive {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 640px) {
  .grid-responsive {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .grid-responsive {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
```

### Typography Scaling

```css
/* Fluid typography */
.fluid-text {
  font-size: clamp(1rem, 0.9rem + 0.5vw, 1.5rem);
}

.fluid-heading {
  font-size: clamp(2rem, 1.5rem + 2vw, 4rem);
}
```

---

## Accessibility

### WCAG Compliance

#### Contrast Ratios
- **Normal Text:** Minimum 4.5:1
- **Large Text (≥18pt/24px):** Minimum 3:1
- **UI Components:** Minimum 3:1
- **Graphical Objects:** Minimum 3:1

#### Focus Indicators

```css
/* Visible focus ring */
*:focus-visible {
  outline: 2px solid #2081e2;
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* Custom focus styles */
.focus-ring {
  transition: box-shadow 200ms ease;
}

.focus-ring:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(32, 129, 226, 0.5);
}
```

### Keyboard Navigation

```css
/* Skip to content link */
.skip-to-content {
  position: absolute;
  top: -100%;
  left: 0;
  background: #2081e2;
  color: white;
  padding: 1rem 2rem;
  z-index: 100;
  transition: top 200ms ease;
}

.skip-to-content:focus {
  top: 0;
}
```

### Screen Reader Support

```html
<!-- Use semantic HTML -->
<header role="banner">
<nav role="navigation" aria-label="Main">
<main role="main" id="main-content">
<button aria-label="Close dialog" aria-pressed="false">

<!-- Hide decorative elements -->
<div aria-hidden="true">...</div>

<!-- Image alt text -->
<img src="..." alt="Descriptive text" />
```

### Motion Preferences

```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Best Practices

### Performance

1. **Optimize Images**
   - Use Next.js Image component
   - WebP format with fallbacks
   - Lazy load below-the-fold content
   - Provide width/height to prevent layout shift

2. **Minimize Bundle Size**
   - Tree-shake unused CSS/JS
   - Code split by route
   - Lazy load heavy components
   - Use dynamic imports

3. **Efficient Animations**
   - Prefer `transform` and `opacity`
   - Avoid animating `width`, `height`, `margin`
   - Use `will-change` sparingly
   - Remove animations on low-end devices

### Code Quality

```tsx
// ✅ Good: Semantic component names
<PrimaryButton />
<NavigationHeader />
<ProductCard />

// ❌ Bad: Generic names
<Div />
<Component1 />
<Box />
```

```tsx
// ✅ Good: Descriptive props
<Button variant="primary" size="large" disabled={isLoading} />

// ❌ Bad: Unclear props
<Button type={1} big={true} off={loading} />
```

### Consistency Checklist

- [ ] Use design tokens (colors, spacing) from Tailwind config
- [ ] Follow naming conventions (BEM or utility-first)
- [ ] Maintain consistent spacing (4px increments)
- [ ] Use consistent border radius across similar components
- [ ] Apply same hover/focus states to similar elements
- [ ] Ensure dark mode styles for all components
- [ ] Test keyboard navigation
- [ ] Verify color contrast ratios
- [ ] Add loading states for async actions
- [ ] Include error states and validation feedback

### Component Checklist

When creating new components:

- [ ] **Responsive:** Works on mobile, tablet, desktop
- [ ] **Accessible:** Keyboard navigable, screen reader friendly
- [ ] **Themed:** Light and dark mode variants
- [ ] **Interactive:** Hover, focus, active states
- [ ] **Documented:** Props documented, usage examples
- [ ] **Tested:** Unit tests, visual regression tests
- [ ] **Performant:** No unnecessary re-renders
- [ ] **Reusable:** Generic enough for multiple use cases

---

## Resources

### Tools
- **Figma:** Design prototypes and mockups
- **Tailwind Play:** Quick prototyping
- **ColorBox:** Color palette generation
- **Contrast Checker:** WCAG compliance testing
- **Lighthouse:** Performance auditing

### References
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://material.io/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/)

### Community
- [GitHub Discussions](https://github.com/nova-collective/andromeda/discussions)
- [Design System Slack](#)
- [Component Library](#)

---

**Maintained by:** Andromeda Design Team  
**Questions?** Open an issue or reach out to `nova.web3.collective@gmail.com`