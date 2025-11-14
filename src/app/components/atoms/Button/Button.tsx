'use client';

import React, { forwardRef } from 'react';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Button component variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';

/**
 * Button component sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Props for the Button component
 */
export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  /** Visual style variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Whether the button should take full width of its container */
  fullWidth?: boolean;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Icon to display on the left side of the button text */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right side of the button text */
  rightIcon?: React.ReactNode;
  /** Children elements (typically text) */
  children?: React.ReactNode;
}

/**
 * Button Component
 * 
 * A highly customizable and accessible button component with multiple variants,
 * sizes, loading states, and icon support. Features smooth animations and
 * consistent styling with the application's design system.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <Button onClick={handleClick}>Click me</Button>
 * ```
 * 
 * @example
 * ```tsx
 * // Primary button with icon
 * import { Wallet } from 'lucide-react';
 * 
 * <Button variant="primary" leftIcon={<Wallet size={18} />}>
 *   Connect Wallet
 * </Button>
 * ```
 * 
 * @example
 * ```tsx
 * // Loading state
 * <Button loading disabled>
 *   Processing...
 * </Button>
 * ```
 * 
 * @example
 * ```tsx
 * // Gradient variant with custom size
 * <Button variant="gradient" size="lg" fullWidth>
 *   Get Started
 * </Button>
 * ```
 * 
 * @example
 * ```tsx
 * // Danger button for destructive actions
 * import { Trash2 } from 'lucide-react';
 * 
 * <Button variant="danger" leftIcon={<Trash2 size={16} />}>
 *   Delete Item
 * </Button>
 * ```
 * 
 * Features:
 * - Six visual variants: primary, secondary, outline, ghost, danger, gradient
 * - Four size options: sm, md, lg, xl
 * - Loading state with spinner
 * - Left and right icon support
 * - Full width option
 * - Smooth hover and tap animations
 * - Dark mode support
 * - Accessible with proper disabled states
 * 
 * @param props - Component props
 * @param props.variant - Visual style (default: 'primary')
 * @param props.size - Button size (default: 'md')
 * @param props.fullWidth - Expand to full container width
 * @param props.loading - Show loading spinner
 * @param props.leftIcon - Icon displayed before text
 * @param props.rightIcon - Icon displayed after text
 * @param props.disabled - Disable button interactions
 * @param props.children - Button content (usually text)
 * @returns Interactive button element with animations
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    /**
     * Get variant-specific CSS classes
     */
    const getVariantClasses = (): string => {
      const variants: Record<ButtonVariant, string> = {
        primary:
          'bg-[var(--text-primary)] hover:opacity-95 active:opacity-90 text-[var(--bg-primary)] border-transparent shadow-sm hover:shadow-md',
        secondary:
          'bg-secondary hover:opacity-95 text-primary border-color shadow-sm',
        outline:
          'bg-transparent hover:bg-secondary text-primary border-color',
        ghost:
          'bg-transparent hover:bg-secondary text-secondary hover:text-primary border-transparent',
        danger:
          'bg-red-600 hover:bg-red-700 text-white border-transparent shadow-sm hover:shadow-md',
        gradient:
          'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-transparent shadow-md hover:shadow-lg',
      };
      return variants[variant];
    };

    /**
     * Get size-specific CSS classes
     */
    const getSizeClasses = (): string => {
      const sizes: Record<ButtonSize, string> = {
        sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
        md: 'px-4 py-2 text-base rounded-xl gap-2',
        lg: 'px-6 py-3 text-lg rounded-xl gap-2.5',
        xl: 'px-8 py-4 text-xl rounded-2xl gap-3',
      };
      return sizes[size];
    };

    /**
     * Get icon size based on button size
     */
    const getIconSize = (): number => {
      const iconSizes: Record<ButtonSize, number> = {
        sm: 14,
        md: 18,
        lg: 20,
        xl: 24,
      };
      return iconSizes[size];
    };

    const isDisabled = disabled || loading;

    const baseClasses =
      'inline-flex items-center justify-center font-medium transition-all duration-200 border border-color focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

    const widthClass = fullWidth ? 'w-full' : '';

    const combinedClasses = `${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${widthClass} ${className}`.trim();

    return (
      <motion.button
        ref={ref}
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        transition={{ duration: 0.15 }}
        className={combinedClasses}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2 size={getIconSize()} className="animate-spin" aria-label="Loading" />
        )}
        {!loading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
        {children && <span>{children}</span>}
        {!loading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
