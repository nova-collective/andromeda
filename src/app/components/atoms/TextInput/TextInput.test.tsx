import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { TextInput } from './TextInput';

describe('TextInput', () => {
	it('renders an input with placeholder', () => {
		render(<TextInput placeholder="Your name" />);
		const input = screen.getByPlaceholderText('Your name');
		expect(input).toBeInTheDocument();
	});

	it('applies theme-aware classes', () => {
		render(<TextInput placeholder="t" />);
		const input = screen.getByPlaceholderText('t');
		expect(input).toHaveClass('bg-surface');
		expect(input).toHaveClass('text-textBase');
		expect(input).toHaveClass('border-color');
	});

	it('supports sizes', () => {
		const { rerender } = render(<TextInput placeholder="t" size="sm" />);
		let input = screen.getByPlaceholderText('t');
		expect(input.className).toMatch(/text-sm/);
		rerender(<TextInput placeholder="t" size="md" />);
		input = screen.getByPlaceholderText('t');
		expect(input.className).toMatch(/text-base/);
		rerender(<TextInput placeholder="t" size="lg" />);
		input = screen.getByPlaceholderText('t');
		expect(input.className).toMatch(/py-3/);
	});

	it('flags invalid state', () => {
		render(<TextInput placeholder="t" invalid />);
		const input = screen.getByPlaceholderText('t');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input.className).toMatch(/border-red-500|dark:border-red-400/);
	});

	it('handles disabled state', () => {
		render(<TextInput placeholder="t" disabled />);
		const input = screen.getByPlaceholderText('t');
		expect(input).toBeDisabled();
		expect(input.className).toMatch(/cursor-not-allowed/);
	});

	it('renders left and right icons and adjusts padding', () => {
		render(
			<TextInput
				placeholder="t"
				leftIcon={<svg data-testid="left" />}
				rightIcon={<svg data-testid="right" />}
			/>,
		);
		expect(screen.getByTestId('left')).toBeInTheDocument();
		expect(screen.getByTestId('right')).toBeInTheDocument();
		const input = screen.getByPlaceholderText('t');
		expect(input.className).toMatch(/pl-\d/);
		expect(input.className).toMatch(/pr-\d/);
	});
});

