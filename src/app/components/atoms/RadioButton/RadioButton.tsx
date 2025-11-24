"use client";
import React, { forwardRef, useEffect, useRef } from 'react';

export type RadioButtonSize = 'sm' | 'md' | 'lg';
export type RadioButtonVariant = 'primary' | 'secondary';

export interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
	/** Size preset (default: md) */
	size?: RadioButtonSize;
	/** Visual label next to the radio */
	label?: React.ReactNode;
	/** Error state styling */
	invalid?: boolean;
	/** Visual variant */
	variant?: RadioButtonVariant;
}

const dotSize: Record<RadioButtonSize, string> = {
	sm: 'h-4 w-4',
	md: 'h-5 w-5',
	lg: 'h-6 w-6',
};

const labelTextSize: Record<RadioButtonSize, string> = {
	sm: 'text-xs',
	md: 'text-sm',
	lg: 'text-base',
};

/**
 * RadioButton
 * Theme-aware radio input atom with size presets, invalid and disabled states.
 * Mirrors Checkbox API for consistency across VDS atoms.
 */
export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(function RadioButton(
	{ size = 'md', label, className = '', invalid = false, disabled = false, variant = 'primary', ...rest },
	ref,
) {
	const innerRef = useRef<HTMLInputElement | null>(null);

	// Merge forwarded ref with internal ref
	useEffect(() => {
		if (innerRef.current && typeof ref === 'function') {
			ref(innerRef.current);
		} else if (innerRef.current && ref && 'current' in ref) {
			(ref as React.MutableRefObject<HTMLInputElement | null>).current = innerRef.current;
		}
	}, [ref]);

	const sizeCls = dotSize[size];
	const labelSizeCls = labelTextSize[size];
	const stateBorder = invalid ? 'border-red-500 dark:border-red-400' : 'border-color';
	const disabledCls = disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-color/80';
	const base = 'peer appearance-none inline-flex items-center justify-center rounded-full border transition duration-200 bg-surface focus:shadow-focus focus:outline-none';
	const checkedStyles = 'checked:border-[color:var(--link-color)]';
	const radioClasses = [base, sizeCls, stateBorder, disabledCls, checkedStyles, className].filter(Boolean).join(' ');

	return (
		<label className={`text-${variant} mr-2 inline-flex items-start gap-2 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`.trim()}>
			<span className="relative flex items-center">
				<input
					ref={innerRef}
					type="radio"
					disabled={disabled}
					aria-invalid={invalid || undefined}
					className={radioClasses}
					{...rest}
				/>
				{/* Inner dot visual when checked (wrapper must be sibling of input for peer-checked to work) */}
				<span
					aria-hidden
					className="pointer-events-none absolute inset-0 m-auto grid place-items-center scale-0 peer-checked:scale-100 transition-transform duration-150"
				>
					<span className="block rounded-full bg-[color:var(--link-color)]" style={{ width: '50%', height: '50%' }} />
				</span>
			</span>
			{label ? (
				<span className={`${labelSizeCls} leading-snug text-textBase select-none ${disabled ? 'text-textMuted' : ''}`.trim()}>{label}</span>
			) : null}
		</label>
	);
});

export default RadioButton;

