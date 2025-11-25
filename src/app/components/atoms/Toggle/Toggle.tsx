"use client";
import React, { forwardRef } from 'react';

export type ToggleSize = 'sm' | 'md' | 'lg';
export type ToggleVariant = 'primary' | 'secondary';

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
	/** Size preset (default: md) */
	size?: ToggleSize;
	/** Visual label next to the toggle */
	label?: React.ReactNode;
	/** Error state styling */
	invalid?: boolean;
	/** Visual variant */
	variant?: ToggleVariant;
}

interface SizeConfig { track: string; knob: string; translate: string; }
const sizeMap: Record<ToggleSize, SizeConfig> = {
	sm: { track: 'w-9 h-5', knob: 'h-4 w-4', translate: 'peer-checked:translate-x-4' },
	md: { track: 'w-11 h-6', knob: 'h-5 w-5', translate: 'peer-checked:translate-x-5' },
	// 26px approx => 1.625rem
	lg: { track: 'w-14 h-8', knob: 'h-7 w-7', translate: 'peer-checked:translate-x-[1.625rem]' },
};

/**
 * Toggle (Switch) atom
 * Theme-aware boolean control. Uses a hidden checkbox with a styled track & knob.
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
	{ size = 'md', label, invalid = false, disabled = false, variant = 'primary', ...rest },
	ref,
) {
	const cfg = sizeMap[size];
	const invalidCls = invalid ? 'ring-1 ring-red-500 dark:ring-red-400' : '';
	const disabledCls = disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';

	return (
		<label className={`mr-2 inline-flex items-center gap-2 ${disabledCls} ${variant === 'primary' ? 'text-primary' : 'text-secondary'}`.trim()}>
			<span className={`relative ${disabled ? 'pointer-events-none' : ''}`}>
				<input
					ref={ref}
					type="checkbox"
					role="switch"
					disabled={disabled}
					aria-invalid={invalid || undefined}
					className="peer sr-only"
					{...rest}
				/>
				<span
					className={`block ${cfg.track} rounded-full bg-surface border border-color transition-colors duration-200 peer-focus:shadow-focus ${invalidCls} peer-checked:bg-[color:var(--link-color)]`}
				/>
				<span
					className={`absolute inset-0 flex items-center px-0.5 transition-transform duration-200 ${cfg.translate}`}
				>
					<span
						className={`block ${cfg.knob} rounded-full bg-white dark:bg-black shadow-sm transition-transform duration-200`}
					/>
				</span>
			</span>
			{label ? (
				<span className={`select-none text-textBase text-sm leading-snug ${disabled ? 'text-textMuted' : ''}`}>{label}</span>
			) : null}
		</label>
	);
});

export default Toggle;

