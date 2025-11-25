"use client";
import React, { forwardRef } from 'react';

import { Search as SearchIcon, X as ClearIcon } from 'lucide-react';

export type SearchInputSize = 'sm' | 'md' | 'lg';
export type SearchInputVariant = 'primary' | 'secondary';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
	/** Size preset controlling height & spacing (default: md) */
	size?: SearchInputSize;
	/** Visual variant for contextual color (default: primary) */
	variant?: SearchInputVariant;
	/** Invalid state: applies error styles & aria-invalid */
	invalid?: boolean;
	/** Disabled state styling */
	disabled?: boolean;
	/** Shows a clear button when true */
	clearable?: boolean;
	/** Callback when clear button is clicked */
	onClear?: () => void;
}

const sizeBase: Record<SearchInputSize, string> = {
	sm: 'text-sm py-2',
	md: 'text-base py-2.5',
	lg: 'text-base py-3',
};

const sizePadding: Record<SearchInputSize, { leftOnly: string; both: string }> = {
	sm: { leftOnly: 'pl-9 pr-3', both: 'pl-9 pr-9' },
	md: { leftOnly: 'pl-10 pr-3.5', both: 'pl-10 pr-10' },
	lg: { leftOnly: 'pl-11 pr-4', both: 'pl-11 pr-11' },
};

/**
 * SearchInput
 * Specialized input for search with leading icon & optional clear affordance.
 * Mirrors TextInput styling semantics for consistency.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
	{
		size = 'md',
		variant = 'primary',
		invalid = false,
		disabled = false,
		clearable = false,
		onClear,
		className = '',
		type = 'search',
		...rest
	},
	ref,
) {
	const sizeCls = sizeBase[size];
	const paddingCls = clearable ? sizePadding[size].both : sizePadding[size].leftOnly;
	const stateCls = [
		disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-color/80',
		invalid ? 'border-red-500 dark:border-red-400 focus:shadow-none' : 'focus:shadow-focus',
	].join(' ');
	const baseCls = 'w-full bg-surface text-textBase placeholder:text-textMuted/70 border border-color rounded-md outline-none transition duration-200';
	const classes = [baseCls, sizeCls, paddingCls, stateCls, className].filter(Boolean).join(' ');

	return (
		<div className={`relative ${variant === 'primary' ? 'text-primary' : 'text-secondary'}`}>
			<span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-textMuted">
				<SearchIcon size={16} />
			</span>
			<input
				ref={ref}
				type={type}
				className={classes}
				disabled={disabled}
				aria-invalid={invalid || undefined}
				{...rest}
			/>
			{clearable && !disabled ? (
				<button
					type="button"
					aria-label="Clear search"
						onClick={onClear}
					className="absolute inset-y-0 right-0 flex items-center pr-3 text-textMuted hover:text-textBase transition"
				>
					<ClearIcon size={16} />
				</button>
			) : null}
		</div>
	);
});

export default SearchInput;

