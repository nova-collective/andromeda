'use client';
import React, { useEffect, useRef, forwardRef } from 'react';

/** Size presets controlling checkbox square and label text */
export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
	/** Size preset (default: md) */
	size?: CheckboxSize;
	/** Visual label next to the checkbox */
	label?: React.ReactNode;
	/** Error state styling */
	invalid?: boolean;
	/** Indeterminate / mixed state */
	indeterminate?: boolean;
}

const boxSize: Record<CheckboxSize, string> = {
	sm: 'h-4 w-4',
	md: 'h-5 w-5',
	lg: 'h-6 w-6',
};

const labelSize: Record<CheckboxSize, string> = {
	sm: 'text-xs',
	md: 'text-sm',
	lg: 'text-base',
};

/**
 * Checkbox
 * Theme-aware checkbox atom with size presets, invalid, disabled, and indeterminate states.
 * Uses semantic tokens (bg-surface, border-color, text-textBase) and accent brand color for checked indicator.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
	{ size = 'md', label, className = '', invalid = false, disabled = false, indeterminate = false, ...rest },
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

	// Apply indeterminate visual state
	useEffect(() => {
		if (innerRef.current) {
			innerRef.current.indeterminate = indeterminate;
		}
	}, [indeterminate]);

	const sizeBoxCls = boxSize[size];
	const sizeLabelCls = labelSize[size];
	const stateBorder = invalid
		? 'border-red-500 dark:border-red-400'
		: 'border-color';
	const disabledCls = disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-color/80';
	const baseBox = 'peer appearance-none inline-flex items-center justify-center rounded-sm border transition duration-200 bg-surface focus:shadow-focus focus:outline-none';
	const checkedStyles = 'checked:bg-[color:var(--link-color)] checked:border-[color:var(--link-color)] checked:text-white dark:checked:text-black';
	const indeterminateStyles = 'indeterminate:bg-[color:var(--link-color)] indeterminate:border-[color:var(--link-color)] indeterminate:text-white';
	const boxClasses = [baseBox, sizeBoxCls, stateBorder, disabledCls, checkedStyles, indeterminateStyles, className]
		.filter(Boolean)
		.join(' ');

	return (
		<label className={`text-primary mr-2 inline-flex items-start gap-2 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`.trim()}>
			<span className="relative flex items-center">
				<input
					ref={innerRef}
					type="checkbox"
					disabled={disabled}
					aria-invalid={invalid || undefined}
					className={boxClasses}
					{...rest}
				/>
				{/* Checkmark / dash icon using generated pseudo-element */}
				<svg
					aria-hidden
					className="pointer-events-none absolute inset-0 m-auto text-white dark:text-black scale-0 peer-checked:scale-90 peer-indeterminate:scale-90 transition-transform duration-150"
					viewBox="0 0 20 20"
					fill="none"
				>
					{indeterminate ? (
						<rect x="4" y="9" width="12" height="2.5" rx="1" fill="currentColor" />
					) : (
						<path
							d="M5 10.5l3.5 3.5L15 7.5"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					)}
				</svg>
			</span>
			{label ? (
				<span className={`${sizeLabelCls} leading-snug text-textBase select-none ${disabled ? 'text-textMuted' : ''}`.trim()}>{label}</span>
			) : null}
		</label>
	);
});

export default Checkbox;

