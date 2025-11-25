import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Avatar } from './Avatar';

describe('Avatar', () => {
	it('renders image when src provided', () => {
		render(<Avatar src="/test.jpg" alt="Alice Doe" />);
		expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
		expect(screen.queryByTestId('avatar-fallback')).not.toBeInTheDocument();
	});

	it('falls back to initials without src', () => {
		render(<Avatar alt="Alice Doe" />);
		const fb = screen.getByTestId('avatar-fallback');
		expect(fb).toHaveTextContent('AD');
	});

	it('uses override initials prop', () => {
		render(<Avatar alt="Alice Doe" initials="XZ" />);
		expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('XZ');
	});

	it('applies size classes', () => {
		const { rerender } = render(<Avatar size="xs" alt="A" />);
		let fb = screen.getByTestId('avatar-fallback');
		expect(fb.className).toMatch(/h-6/);
		rerender(<Avatar size="sm" alt="A" />);
		fb = screen.getByTestId('avatar-fallback');
		expect(fb.className).toMatch(/h-8/);
		rerender(<Avatar size="md" alt="A" />);
		fb = screen.getByTestId('avatar-fallback');
		expect(fb.className).toMatch(/h-10/);
		rerender(<Avatar size="lg" alt="A" />);
		fb = screen.getByTestId('avatar-fallback');
		expect(fb.className).toMatch(/h-12/);
	});
});

