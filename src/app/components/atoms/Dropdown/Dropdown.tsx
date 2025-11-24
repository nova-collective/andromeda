"use client";
import React, { forwardRef } from 'react';

export type DropdownSize = 'sm' | 'md' | 'lg';
export type DropdownVariant = 'primary' | 'secondary';

export interface DropdownOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface DropdownProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
	/** Size preset controlling padding & font size (default: md) */
	size?: DropdownSize;
	/** Visual variant for contextual color (default: primary) */
	variant?: DropdownVariant;
	/** Error state styling */
	invalid?: boolean;
	/** Options array (alternative to passing <option> children) */
	options?: DropdownOption[];
	/** Placeholder label rendered as first disabled option */
	placeholder?: string;
}

const sizeClasses: Record<DropdownSize, string> = {
	sm: 'text-sm py-2 px-3',
	md: 'text-base py-2.5 px-3.5',
	lg: 'text-base py-3 px-4',
};

/**
 * Dropdown (Select) atom
 * Theme-aware select input with size presets, variant coloring, invalid & disabled states.
 */
export const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(function Dropdown(
	{
		size = 'md',
		variant = 'primary',
		invalid = false,
		disabled = false,
		options,
		placeholder,
		className = '',
		children,
		...rest
	},
	ref,
) {
	const sizeCls = sizeClasses[size];
	const stateCls = [
		disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-color/80',
		invalid ? 'border-red-500 dark:border-red-400 focus:shadow-none' : 'focus:shadow-focus',
	].join(' ');
	const baseCls = 'w-full bg-surface text-textBase border border-color rounded-md outline-none transition duration-200 appearance-none';
	const classes = [baseCls, sizeCls, stateCls, className].filter(Boolean).join(' ');

	return (
		<div className={`relative text-${variant}`}>
			<select
				ref={ref}
				disabled={disabled}
				aria-invalid={invalid || undefined}
				className={classes}
				{...rest}
			>
				{placeholder && (
					<option value="" disabled selected={!rest.defaultValue && !rest.value}>
						{placeholder}
					</option>
				)}
				{options
					? options.map(opt => (
							<option key={opt.value} value={opt.value} disabled={opt.disabled}>
								{opt.label}
							</option>
						))
					: children}
			</select>
			<span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-textMuted">
				<svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="opacity-80">
					<path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</span>
		</div>
	);
});

export default Dropdown;

