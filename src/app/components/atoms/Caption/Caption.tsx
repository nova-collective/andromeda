import React, { type HTMLAttributes } from 'react';

/**
 * Caption
 *
 * Theme-aware small text atom intended for image or component captions.
 * Follows the VDS conventions used by other typography atoms (Heading, Paragraph):
 * - font-sans with relaxed leading for readability
 * - semantic tokens for color: `text-textMuted` (default) or `text-textBase`
 * - simple size and alignment presets
 * - `as` prop to change the underlying element
 *
 * Accessibility:
 * - Renders a `<p>` by default; for true figure captions, consider `as="figcaption"`
 */

/** Visual size presets for captions */
export type CaptionSize = 'xs' | 'sm';
/** Horizontal text alignment */
export type CaptionAlign = 'left' | 'center' | 'right';
/** Contrast context for themed backgrounds */
export type CaptionContrast = 'default' | 'onPrimary';
/** Caption component variants */
export type CaptionVariant = 'primary' | 'secondary';

export interface CaptionProps extends HTMLAttributes<HTMLParagraphElement> {
	/** Visual size variant (default: sm) */
	size?: CaptionSize;
	/** Use `text-textMuted` for secondary tone (default: true) */
	muted?: boolean;
	/** Horizontal alignment (default: left) */
	align?: CaptionAlign;
	/** Contrast context for colored backgrounds (default: 'default') */
	contrast?: CaptionContrast;
	/** Text color variant mapped to `text-${variant}` (default: primary) */
	variant?: CaptionVariant;
	/** Underlying element to render (default: 'p') */
	as?: React.ElementType;
	/** Content */
	children?: React.ReactNode;
}

/** Maps size preset to font-size utilities */
const sizeClassMap: Record<CaptionSize, string> = {
	xs: 'text-xs',
	sm: 'text-sm',
};

/** Maps alignment to Tailwind text alignment utilities */
const alignClassMap: Record<CaptionAlign, string> = {
	left: 'text-left',
	center: 'text-center',
	right: 'text-right',
};

/**
 * Caption component.
 *
 * Contract
 * - Inputs: size, muted, align, as, className, children
 * - Output: theme-aware, small typography element for captions
 * - Error modes: none (presentational); unknown props spread to element
 */
export const Caption: React.FC<CaptionProps> = ({
	size = 'sm',
	muted = true,
	align = 'left',
	contrast = 'default',
	as: Component = 'p',
	className = '',
	variant = 'primary',
	children,
	...rest
}) => {
	// Choose color based on contrast context and muted flag.
	// - default: use semantic text tokens that adapt with theme
	// - onPrimary: ensure readable text over brand/primary surfaces in both themes
	const colorClass = contrast === 'onPrimary'
		? 'text-white dark:text-black'
		: (muted ? 'text-textMuted' : 'text-textBase');
	const sizeClass = sizeClassMap[size];
	const alignClass = alignClassMap[align];
	const classes = `font-sans leading-relaxed ${colorClass} ${sizeClass} ${alignClass} ${className}`.trim();

	return (
		<Component className={`text-${variant} ${classes}`} {...rest}>
			{children}
		</Component>
	);
};

export default Caption;

