import '@testing-library/jest-dom/vitest';
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RadioButton } from './RadioButton';

describe('RadioButton', () => {
	it('renders with label', () => {
		render(<RadioButton label="Option A" />);
		expect(screen.getByText('Option A')).toBeInTheDocument();
		const input = screen.getByRole('radio');
		expect(input).not.toBeChecked();
	});

	it('toggles checked within a group (same name)', () => {
		render(
			<div>
				<RadioButton name="group1" label="A" value="a" />
				<RadioButton name="group1" label="B" value="b" />
			</div>
		);
		const radios = screen.getAllByRole('radio');
		expect(radios.length).toBe(2);
		fireEvent.click(radios[0]);
		expect(radios[0]).toBeChecked();
		expect(radios[1]).not.toBeChecked();
		fireEvent.click(radios[1]);
		expect(radios[1]).toBeChecked();
		expect(radios[0]).not.toBeChecked();
	});

	it('applies invalid styling and aria attribute', () => {
		render(<RadioButton label="Invalid" invalid />);
		const input = screen.getByRole('radio');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input.className).toMatch(/border-red-500|dark:border-red-400/);
	});

	it('respects disabled state', () => {
		render(<RadioButton label="Disabled" disabled />);
		const input = screen.getByRole('radio');
		expect(input).toBeDisabled();
	});

	it('supports size presets', () => {
		const { rerender } = render(<RadioButton size="sm" label="Small" />);
		let input = screen.getByRole('radio');
		expect(input.className).toMatch(/h-4/);
		rerender(<RadioButton size="md" label="Medium" />);
		input = screen.getByRole('radio');
		expect(input.className).toMatch(/h-5/);
		rerender(<RadioButton size="lg" label="Large" />);
		input = screen.getByRole('radio');
		expect(input.className).toMatch(/h-6/);
	});
});

