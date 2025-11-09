# ⚛️ Atoms - Fundamental Building Blocks

The **Atoms** layer represents the most fundamental building blocks of the Andromeda design system. These are the smallest, indivisible components that form the foundation of all other components.

## 📋 Overview

**Level:** 1 - Base Layer  
**Complexity:** Low  
**Reusability:** Very High  
**Business Logic:** None

Atoms are pure UI components that:
- Cannot be broken down further without losing their meaning
- Have a single, well-defined responsibility
- Contain no business logic or side effects
- Are highly reusable across the entire application
- Follow the design system guidelines strictly
- Are the building blocks for molecules and organisms

## 🎯 Philosophy

> "Atoms are the basic building blocks of matter. Applied to web interfaces, atoms are our HTML tags, such as a form label, an input, or a button."
> — Brad Frost, Atomic Design

In the Andromeda design system, atoms represent:
- **Consistency**: Every button, input, and badge looks and behaves the same
- **Reusability**: Used hundreds of times across the application
- **Maintainability**: Update once, change everywhere
- **Accessibility**: WCAG compliance built in from the ground up
- **Type Safety**: Full TypeScript support with exported interfaces

## 📦 Available Atoms

### 🔘 Button

The foundational interactive element for user actions.

**Import:**
```tsx
import { Button, type ButtonProps } from '@/app/components/atoms';
```

**Features:**
- 6 variants: `primary`, `secondary`, `outline`, `ghost`, `danger`, `gradient`
- 4 sizes: `sm`, `md`, `lg`, `xl`
- Loading state with spinner
- Icon support (left/right)
- Full width option
- Disabled state
- Hover/focus animations

**Example:**
```tsx
<Button variant="primary" size="md">
  Click Me
</Button>

<Button variant="outline" size="lg" leftIcon={<Icon name="heart" />}>
  Like
</Button>

<Button variant="gradient" loading>
  Processing...
</Button>
```

**Props:**
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}
```

## 🎨 Design Principles

### 1. Single Responsibility
Each atom does one thing and does it well.

```tsx
// ✅ Good - Single purpose
<Button onClick={handleClick}>Submit</Button>

// ❌ Bad - Multiple concerns
<Button onClick={handleClick} fetchData={fetchData} validateForm={validateForm}>
  Submit
</Button>
```

### 2. No Business Logic
Atoms are pure UI components with no side effects.

```tsx
// ✅ Good - Pure UI
<Button onClick={onSubmit}>Submit</Button>

// ❌ Bad - Contains business logic
<Button onClick={() => {
  fetch('/api/data');
  validateForm();
  updateState();
}}>
  Submit
</Button>
```

### 3. Composition Over Configuration
Keep props simple and composable.

```tsx
// ✅ Good - Simple, composable
<Button variant="primary" size="lg">Save</Button>

// ❌ Bad - Too many configuration props
<Button 
  color="blue" 
  bgColor="lightblue" 
  borderColor="darkblue"
  hoverColor="mediumblue"
  padding="large"
  borderRadius="medium"
>
  Save
</Button>
```

### 4. Accessibility First
All atoms include proper ARIA attributes and keyboard navigation.

```tsx
// Button includes:
// - aria-label support
// - keyboard focus styles
// - disabled state handling
// - loading state announcements
<Button aria-label="Add to cart" loading>
  Add to Cart
</Button>
```

## 🚀 Usage Guidelines

### When to Create a New Atom

Create a new atom when you have a component that:
- ✅ Represents a fundamental UI element
- ✅ Will be used frequently across the application
- ✅ Has no business logic or side effects
- ✅ Can be fully styled with design system tokens
- ✅ Is independent and self-contained

### When NOT to Create an Atom

Don't create an atom if:
- ❌ The component contains business logic
- ❌ It's specific to one page or feature
- ❌ It combines multiple other components (that's a molecule)
- ❌ It fetches data or manages complex state
- ❌ It's too specific to be reused

## 📐 Atom Structure

Every atom should follow this structure:

```
atoms/
  ComponentName/
    ComponentName.tsx      # Component implementation
    ComponentName.test.tsx # Unit tests (100% coverage goal)
    README.md              # Component documentation
    index.ts               # Barrel export
```

### Example Atom Implementation

```tsx
// atoms/Badge/Badge.tsx
'use client';
import React from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

/**
 * Badge Component
 * 
 * A small label used to highlight status, count, or category.
 */
export function Badge({ variant = 'default', children }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

export default Badge;
```

### Barrel Export Pattern

```tsx
// atoms/Badge/index.ts
export { Badge, default } from './Badge';
export type { BadgeProps, BadgeVariant } from './Badge';
```

## 🧪 Testing Atoms

Atoms require comprehensive unit tests:

```tsx
// Badge.test.tsx
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { container } = render(<Badge variant="success">Active</Badge>);
    expect(container.firstChild).toHaveClass('bg-green-100');
  });

  it('uses default variant when not specified', () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstChild).toHaveClass('bg-gray-100');
  });
});
```

**Test Coverage Goals:**
- ✅ 100% line coverage
- ✅ All variants tested
- ✅ All sizes tested
- ✅ All states tested
- ✅ Accessibility tested
- ✅ Edge cases covered

## 📚 Best Practices

### ✅ Do's

```tsx
// ✅ Use design system tokens
<Button variant="primary" size="md">Submit</Button>

// ✅ Export TypeScript types
export type { ButtonProps, ButtonVariant };

// ✅ Include comprehensive JSDoc
/**
 * Button component for user interactions
 * @param variant - Visual style variant
 * @param size - Size of the button
 */

// ✅ Make components composable
<Button leftIcon={<Icon />} rightIcon={<Icon />}>
  Save
</Button>

// ✅ Support all standard HTML props
<Button onClick={handleClick} disabled aria-label="Save">
  Save
</Button>
```

### ❌ Don'ts

```tsx
// ❌ Don't add business logic
<Button onClick={() => {
  validateForm();
  sendToAPI();
}}>Submit</Button>

// ❌ Don't fetch data in atoms
useEffect(() => {
  fetch('/api/data');
}, []);

// ❌ Don't use hard-coded values
<button className="bg-[#3b82f6] px-[14px]">  // Use tokens!

// ❌ Don't make atoms too specific
<LoginButton />  // Too specific, just use Button

// ❌ Don't combine multiple concerns
<ButtonWithModal />  // Should be separate components
```

## 🎨 Design System Integration

Atoms are the foundation of the design system and must adhere to:

### Color Tokens
```tsx
// Use Tailwind config colors
primary-500, primary-600  // Primary actions
gray-100, gray-900        // Neutral elements
red-500, red-600          // Error/danger states
green-500                 // Success states
```

### Spacing Tokens
```tsx
// Consistent spacing
sm: 'px-3 py-1.5'    // Small
md: 'px-4 py-2'      // Medium (default)
lg: 'px-6 py-3'      // Large
xl: 'px-8 py-4'      // Extra large
```

### Typography Tokens
```tsx
// Consistent text styles
text-sm    // Small text
text-base  // Body text
text-lg    // Large text
font-medium, font-semibold, font-bold
```

## 🔄 Migration Path

When migrating existing components to atoms:

1. **Identify candidates**: Find frequently-used, simple UI components
2. **Extract pure UI**: Remove business logic, move to parent components
3. **Standardize props**: Use design system variants instead of custom props
4. **Add TypeScript**: Ensure full type safety
5. **Write tests**: Achieve 100% coverage
6. **Document**: Create README with examples
7. **Update imports**: Replace old imports throughout codebase

### Example Migration

**Before:**
```tsx
// Old component with mixed concerns
function SubmitButton({ label, onSubmit, validate }) {
  return (
    <button 
      onClick={() => {
        if (validate()) {
          onSubmit();
        }
      }}
      style={{ backgroundColor: '#3b82f6', padding: '8px 16px' }}
    >
      {label}
    </button>
  );
}
```

**After:**
```tsx
// Pure UI atom
export function Button({ variant = 'primary', size = 'md', onClick, children }: ButtonProps) {
  return (
    <button 
      className={`${variants[variant]} ${sizes[size]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Business logic in parent
function ParentComponent() {
  const handleSubmit = () => {
    if (validate()) {
      onSubmit();
    }
  };
  
  return <Button variant="primary" onClick={handleSubmit}>Submit</Button>;
}
```

## 📊 Atom Checklist

When creating or reviewing an atom, verify:

- [ ] **Single Responsibility**: Does one thing well
- [ ] **No Business Logic**: Pure UI, no side effects
- [ ] **Reusable**: Can be used in multiple contexts
- [ ] **Typed**: Full TypeScript support with exported types
- [ ] **Tested**: 100% unit test coverage
- [ ] **Documented**: README with examples and API docs
- [ ] **Accessible**: WCAG 2.1 AA compliant
- [ ] **Responsive**: Works on all screen sizes
- [ ] **Design System**: Uses tokens, not hard-coded values
- [ ] **Composable**: Works well with other components
- [ ] **SSR Compatible**: No client-only dependencies (unless 'use client')
- [ ] **Performant**: Optimized, no unnecessary re-renders

## 🔗 Related Documentation

- [Molecules](../molecules/README.md) - Combinations of atoms
- [Organisms](../organisms/README.md) - Complex, feature-complete components
- [Design Guidelines](../DESIGN_GUIDELINES.md) - Overall design system
- [Component Library](../README.md) - Full component overview

## 🤝 Contributing

When adding new atoms:

1. **Propose First**: Discuss in team meeting or PR
2. **Follow Structure**: Use the standard atom folder structure
3. **Write Tests**: Achieve 100% coverage
4. **Document Thoroughly**: Include README with examples
5. **Export Properly**: Named + default exports with types
6. **Update Barrel**: Add to `atoms/index.ts`
7. **Add to Storybook**: Create stories for all variants

## 📚 Further Reading

- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/) by Brad Frost
- [Component Driven Development](https://www.componentdriven.org/)
- [Design Systems Handbook](https://www.designbetter.co/design-systems-handbook)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

**Atoms Version:** 1.0.0  
**Last Updated:** November 2025  
**Maintained by:** Andromeda Design System Team

