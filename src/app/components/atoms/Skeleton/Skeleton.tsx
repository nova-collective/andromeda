import React from 'react';
import type { HTMLAttributes } from 'react';

export type SkeletonShape = 'text' | 'circle' | 'rect';
export type SkeletonSize = 'sm' | 'md' | 'lg';
export type SkeletonVariant = 'primary' | 'secondary';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
	shape?: SkeletonShape;
	size?: SkeletonSize;
	variant?: SkeletonVariant;
	/** Optional accessible label (sr-only). Leave undefined for default "Loading". Set empty string to suppress. */
	label?: string;
	/** Enable/disable pulse animation. Defaults to true. */
	animated?: boolean;
	/** Show visible text label next to skeleton instead of sr-only */
	showLabel?: boolean;
}

const sizeMap: Record<SkeletonShape, Record<SkeletonSize, string>> = {
	text: {
		sm: 'h-3 w-full',
		md: 'h-4 w-full',
		lg: 'h-5 w-full'
	},
	circle: {
		sm: 'h-6 w-6',
		md: 'h-8 w-8',
		lg: 'h-12 w-12'
	},
	rect: {
		sm: 'h-4 w-16',
		md: 'h-6 w-24',
		lg: 'h-8 w-32'
	}
};

const variantClasses: Record<SkeletonVariant, string> = {
	primary: 'bg-[color:var(--border)]',
	secondary: 'bg-[color:var(--text-secondary)]/20'
};

export const Skeleton: React.FC<SkeletonProps> = ({
	shape = 'text',
	size = 'md',
	variant = 'primary',
	label = 'Loading',
	animated = true,
	showLabel = false,
	className,
	...rest
}) => {
	const blockClasses = [
		'rounded-md',
		shape === 'circle' && 'rounded-full',
		shape === 'text' && 'rounded',
		sizeMap[shape][size],
		variantClasses[variant],
		animated && 'animate-pulse'
	].filter(Boolean).join(' ');

	if (showLabel) {
		return (
			<div role="status" aria-live="polite" className={['inline-flex items-center gap-2', className].filter(Boolean).join(' ')} data-shape={shape} data-size={size} {...rest}>
				<div className={blockClasses} />
				{label !== '' && <span className="text-secondary text-xs">{label}</span>}
			</div>
		);
	}

	return (
		<div
			role="status"
			aria-live="polite"
			data-shape={shape}
			data-size={size}
			className={[blockClasses, className].filter(Boolean).join(' ')}
			{...rest}
		>
			{label !== '' && <span className="sr-only">{label}</span>}
		</div>
	);
};

export default Skeleton;
