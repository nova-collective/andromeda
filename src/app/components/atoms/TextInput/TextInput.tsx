import React, {forwardRef } from 'react';

/** Visual size presets for padding and font sizing */
export type TextInputSize = 'sm' | 'md' | 'lg';
/** Input component variants */
export type InputVariant = 'primary' | 'secondary';

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
	/** Size preset (default: md) */
	size?: TextInputSize;
	/** Error state: applies invalid styles and aria-invalid */
	invalid?: boolean;
	/** Optional leading icon node */
	leftIcon?: React.ReactNode;
	/** Optional trailing icon node */
	rightIcon?: React.ReactNode;
	/** Input variant (default: primary) */
	variant?: InputVariant;
}

const sizeBase: Record<TextInputSize, string> = {
	sm: 'text-sm py-2',
	md: 'text-base py-2.5',
	lg: 'text-base py-3',
};

const sizePadding: Record<TextInputSize, { base: string; withLeft: string; withRight: string; withBoth: string }> = {
	sm: { base: 'px-3', withLeft: 'pl-9 pr-3', withRight: 'pl-3 pr-9', withBoth: 'pl-9 pr-9' },
	md: { base: 'px-3.5', withLeft: 'pl-10 pr-3.5', withRight: 'pl-3.5 pr-10', withBoth: 'pl-10 pr-10' },
	lg: { base: 'px-4', withLeft: 'pl-11 pr-4', withRight: 'pl-4 pr-11', withBoth: 'pl-11 pr-11' },
};

/**
 * TextInput
 *
 * Theme-aware text input atom following the VDS. Supports size presets, icons, and invalid/disabled states.
 *
 * Design tokens used:
 * - Background: bg-surface
 * - Text: text-textBase, placeholder:text-textMuted/70
 * - Border: border-color
 * - Focus: focus:shadow-focus
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
	{ size = 'md', invalid = false, disabled = false, leftIcon, rightIcon, variant = 'primary', className = '', ...rest },
	ref,
) {
	const sizeCls = sizeBase[size];

	const paddingCls = leftIcon && rightIcon
		? sizePadding[size].withBoth
		: leftIcon
			? sizePadding[size].withLeft
			: rightIcon
				? sizePadding[size].withRight
				: sizePadding[size].base;

	const stateCls = [
		disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-color/80',
		invalid ? 'border-red-500 dark:border-red-400 focus:shadow-none' : 'focus:shadow-focus',
	]
		.filter(Boolean)
		.join(' ');

	const baseCls = 'w-full bg-surface text-textBase placeholder:text-textMuted/70 border border-color rounded-md outline-none transition duration-200';
	const classes = [baseCls, sizeCls, paddingCls, stateCls, className].filter(Boolean).join(' ');

	return (
		<div className={`relative text-${variant}`}>
			{leftIcon ? (
				<span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-textMuted">
					{leftIcon}
				</span>
			) : null}
			<input
				ref={ref}
				className={classes}
				disabled={disabled}
				aria-invalid={invalid || undefined}
				{...rest}
			/>
			{rightIcon ? (
				<span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-textMuted">
					{rightIcon}
				</span>
			) : null}
		</div>
	);
});

export default TextInput;

