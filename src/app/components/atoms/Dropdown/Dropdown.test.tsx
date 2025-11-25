import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
	it('renders with options prop', () => {
		render(<Dropdown options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]} />);
		expect(screen.getByRole('combobox')).toBeInTheDocument();
		expect(screen.getByText('Alpha')).toBeInTheDocument();
		expect(screen.getByText('Beta')).toBeInTheDocument();
	});

	it('renders children options', () => {
		render(
			<Dropdown>
				<option value="x">X</option>
				<option value="y">Y</option>
			</Dropdown>
		);
		expect(screen.getByText('X')).toBeInTheDocument();
		expect(screen.getByText('Y')).toBeInTheDocument();
	});

	it('changes value when selecting option', () => {
		render(<Dropdown data-testid="select" options={[{ value: '1', label: 'One' }, { value: '2', label: 'Two' }]} />);
		const select = screen.getByTestId('select');
		fireEvent.change(select, { target: { value: '2' } });
		if (select instanceof HTMLSelectElement) {
			expect(select.value).toBe('2');
		} else {
			throw new Error('Element is not a select');
		}
	});

	it('applies invalid styling and aria attribute', () => {
		render(<Dropdown invalid options={[{ value: 'a', label: 'A' }]} />);
		const select = screen.getByRole('combobox');
		expect(select).toHaveAttribute('aria-invalid', 'true');
		expect(select.className).toMatch(/border-red-500|dark:border-red-400/);
	});

	it('respects disabled state', () => {
		render(<Dropdown disabled options={[{ value: 'a', label: 'A' }]} />);
		const select = screen.getByRole('combobox');
		expect(select).toBeDisabled();
	});

	it('supports size presets', () => {
		const { rerender } = render(<Dropdown size="sm" options={[{ value: 'a', label: 'A' }]} />);
		let select = screen.getByRole('combobox');
		expect(select.className).toMatch(/text-sm/);
		rerender(<Dropdown size="md" options={[{ value: 'a', label: 'A' }]} />);
		select = screen.getByRole('combobox');
		expect(select.className).toMatch(/text-base/);
		rerender(<Dropdown size="lg" options={[{ value: 'a', label: 'A' }]} />);
		select = screen.getByRole('combobox');
		expect(select.className).toMatch(/py-3/);
	});
});

