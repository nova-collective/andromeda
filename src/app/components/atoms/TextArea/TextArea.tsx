import React, {forwardRef} from 'react';

/** Visual size presets for padding, font size, and min height */
export type TextAreaSize = 'sm' | 'md' | 'lg';

/**
 * TextArea component variants
 */
export type TextAreaVariant = 'primary' | 'secondary';

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
	/** Size preset (default: md) */
	size?: TextAreaSize;
	/** Error state: applies invalid styles and aria-invalid */
	invalid?: boolean;
	/** Show current character count (uses value length) */
	showCount?: boolean;
	/** Optional max length to display alongside count */
	maxLength?: number;
    /** Visual style variant of the textArea */
    variant?: TextAreaVariant;
}

const sizeBase: Record<TextAreaSize, string> = {
	sm: 'text-sm py-2 min-h-[6rem]',
	md: 'text-base py-2.5 min-h-[8rem]',
	lg: 'text-base py-3 min-h-[10rem]',
};

const sizePadding: Record<TextAreaSize, string> = {
	sm: 'px-3',
	md: 'px-3.5',
	lg: 'px-4',
};

/**
 * TextArea
 *
 * Theme-aware multi-line input atom following the VDS. Supports size presets, invalid/disabled states,
 * and optional character counting.
 *
 * Design tokens used:
 * - Background: bg-surface
 * - Text: text-textBase, placeholder:text-textMuted/70
 * - Border: border-color
 * - Focus: focus:shadow-focus
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
	{ size = 'md', invalid = false, disabled = false, showCount = false, maxLength, variant = 'primary', className = '', value, onChange, ...rest },
	ref,
) {
	const sizeCls = sizeBase[size];
	const paddingCls = sizePadding[size];

	const stateCls = [
		disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-color/80',
		invalid ? 'border-red-500 dark:border-red-400 focus:shadow-none' : 'focus:shadow-focus',
		showCount ? 'pb-10' : '',
	]
		.filter(Boolean)
		.join(' ');

	const baseCls = 'w-full bg-surface text-textBase placeholder:text-textMuted/70 border border-color rounded-md outline-none transition duration-200 resize-y';
	const classes = [baseCls, sizeCls, paddingCls, stateCls, className].filter(Boolean).join(' ');

	const length = typeof value === 'string' ? value.length : 0;

	return (
		<div className="relative">
			<textarea
				ref={ref}
				className={`text-${variant} ${classes}`}
				disabled={disabled}
				aria-invalid={invalid || undefined}
				value={value}
				onChange={onChange}
				maxLength={maxLength}
				{...rest}
			/>
			{showCount ? (
				<div className={`absolute bottom-1 right-2 text-[11px] font-medium text-textMuted text-${variant}`}>
					{length}
					{maxLength ? ` / ${maxLength}` : ''}
				</div>
			) : null}
		</div>
	);
});

export default TextArea;

