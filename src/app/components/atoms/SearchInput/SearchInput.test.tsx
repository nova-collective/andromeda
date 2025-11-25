import '@testing-library/jest-dom/vitest';
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
	it('renders a search input with placeholder', () => {
		render(<SearchInput placeholder="Search books" />);
		const input = screen.getByPlaceholderText('Search books');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'search');
	});

	it('applies size classes', () => {
		const { rerender } = render(<SearchInput size="sm" placeholder="q" />);
		let input = screen.getByPlaceholderText('q');
		expect(input.className).toMatch(/text-sm/);
		rerender(<SearchInput size="md" placeholder="q" />);
		input = screen.getByPlaceholderText('q');
		expect(input.className).toMatch(/py-2\.5/);
		rerender(<SearchInput size="lg" placeholder="q" />);
		input = screen.getByPlaceholderText('q');
		expect(input.className).toMatch(/py-3/);
	});

	it('shows invalid state', () => {
		render(<SearchInput invalid placeholder="x" />);
		const input = screen.getByPlaceholderText('x');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input.className).toMatch(/border-red-500|dark:border-red-400/);
	});

	it('disables input', () => {
		render(<SearchInput disabled placeholder="disabled" />);
		const input = screen.getByPlaceholderText('disabled');
		expect(input).toBeDisabled();
	});

	it('renders clear button when clearable', () => {
		const handleClear = vi.fn();
		render(<SearchInput clearable defaultValue="abc" onClear={handleClear} />);
		const btn = screen.getByRole('button', { name: /clear search/i });
		expect(btn).toBeInTheDocument();
		fireEvent.click(btn);
		expect(handleClear).toHaveBeenCalledTimes(1);
	});
});

