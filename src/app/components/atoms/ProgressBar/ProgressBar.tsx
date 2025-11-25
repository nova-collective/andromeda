"use client";
import React, { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

export type ProgressBarSize = 'sm' | 'md' | 'lg';
export type ProgressBarVariant = 'primary' | 'secondary';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
	/** Current progress value (0..max) */
	value?: number;
	/** Maximum value (default 100) */
	max?: number;
	/** Size preset controlling height */
	size?: ProgressBarSize;
	/** Contextual color wrapper */
	variant?: ProgressBarVariant;
	/** Show textual percentage label */
	showLabel?: boolean;
	/** Indeterminate state (ignores value and animates) */
	indeterminate?: boolean;
}

const sizeMap: Record<ProgressBarSize, string> = {
	sm: 'h-2',
	md: 'h-3',
	lg: 'h-4',
};

/**
 * ProgressBar atom
 * Displays completion percentage with accessible semantics and optional label.
 */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
	{ value = 0, max = 100, size = 'md', variant = 'primary', showLabel = false, indeterminate = false, className = '', ...rest },
	ref,
) {
	const pct = Math.min(100, Math.max(0, (value / max) * 100));
	const wrapperClasses = ['w-full', 'text-' + variant, className].filter(Boolean).join(' ');
	const trackClasses = [
		'relative w-full overflow-hidden rounded-md bg-surface border border-color',
		sizeMap[size],
	].join(' ');
	const barBase = 'absolute left-0 top-0 h-full bg-[color:var(--link-color)] transition-all duration-300';
	const barStyle = indeterminate ? { width: '50%' } : { width: pct + '%' };
	const barClasses = indeterminate
		? barBase + ' animate-pulse'
		: barBase;

	return (
		<div className={wrapperClasses} ref={ref} {...rest}>
			<div
				role="progressbar"
				aria-valuemin={indeterminate ? undefined : 0}
				aria-valuemax={indeterminate ? undefined : max}
				aria-valuenow={indeterminate ? undefined : value}
				className={trackClasses}
				data-testid="progress-track"
			>
				<div className={barClasses} style={barStyle} data-testid="progress-bar" />
			</div>
			{showLabel && !indeterminate ? (
				<div className="mt-1 text-xs font-medium text-textMuted" data-testid="progress-label">
					{Math.round(pct)}%
				</div>
			) : null}
			{showLabel && indeterminate ? (
				<div className="mt-1 text-xs font-medium text-textMuted" data-testid="progress-label">Loading…</div>
			) : null}
		</div>
	);
});

export default ProgressBar;

