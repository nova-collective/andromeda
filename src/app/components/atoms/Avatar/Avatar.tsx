"use client";
import React, { forwardRef, useState } from 'react';
import type { HTMLAttributes } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';
export type AvatarVariant = 'primary' | 'secondary';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
	/** Image source URL */
	src?: string;
	/** Accessible alt text (used to derive initials fallback) */
	alt?: string;
	/** Size preset controlling diameter & font size */
	size?: AvatarSize;
	/** Contextual text color wrapper */
	variant?: AvatarVariant;
	/** Rounded style (default: full circle) */
	rounded?: boolean;
	/** Optional explicit initials override for fallback */
	initials?: string;
}

const sizeMap: Record<AvatarSize, string> = {
	xs: 'h-6 w-6 text-[10px]',
	sm: 'h-8 w-8 text-xs',
	md: 'h-10 w-10 text-sm',
	lg: 'h-12 w-12 text-base',
};

function deriveInitials(alt?: string, override?: string) {
	if (override) return override.slice(0, 2).toUpperCase();
	if (!alt) return '';
	const parts = alt.trim().split(/\s+/).filter(Boolean);
	if (!parts.length) return '';
	const first = parts[0][0];
	const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
	return (first + last).toUpperCase();
}

/**
 * Avatar atom
 * Circular user representation with image or initials fallback.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
	{ src, alt, size = 'md', variant = 'primary', rounded = true, initials, className = '', ...rest },
	ref,
) {
	const [errored, setErrored] = useState(false);
	const showImage = src && !errored;
	const fallback = deriveInitials(alt, initials) || '·';

	const base = 'inline-flex items-center justify-center font-medium select-none bg-surface border border-color text-textBase overflow-hidden';
	const shape = rounded ? 'rounded-full' : 'rounded-md';
	const sizeCls = sizeMap[size];
	const variantWrapper = `text-${variant}`; // provides contextual color scope if needed
	const classes = [base, shape, sizeCls, className].filter(Boolean).join(' ');

	return (
		<span ref={ref} className={variantWrapper} {...rest}>
			{showImage ? (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={src}
					alt={alt || ''}
					className={classes}
					onError={() => setErrored(true)}
					data-testid="avatar-image"
				/>
			) : (
				<span className={classes} aria-label={alt} role={alt ? 'img' : undefined} data-testid="avatar-fallback">
					{fallback}
				</span>
			)}
		</span>
	);
});

export default Avatar;

