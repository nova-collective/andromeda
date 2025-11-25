import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Toggle } from './Toggle';

describe('Toggle', () => {
	it('renders with label', () => {
		render(<Toggle label="Enable dark mode" />);
		expect(screen.getByText('Enable dark mode')).toBeInTheDocument();
		const input = screen.getByRole('switch');
		expect(input).not.toBeChecked();
	});

	it('toggles checked state on click', () => {
		render(<Toggle label="Feature flag" />);
		const input = screen.getByRole('switch');
		fireEvent.click(input);
		expect(input).toBeChecked();
		fireEvent.click(input);
		expect(input).not.toBeChecked();
	});

	it('applies invalid styling and aria attribute', () => {
		render(<Toggle label="Terms" invalid />);
		const input = screen.getByRole('switch');
		expect(input).toHaveAttribute('aria-invalid', 'true');
	});

	it('respects disabled state', () => {
		render(<Toggle label="Disabled" disabled />);
		const input = screen.getByRole('switch');
		expect(input).toBeDisabled();
	});

	it('supports size presets', () => {
		const { rerender } = render(<Toggle size="sm" label="Small" />);
		let input = screen.getByRole('switch');
		let track = input.parentElement?.querySelector('span.block');
		expect(track?.className).toMatch(/w-9/);
		rerender(<Toggle size="md" label="Medium" />);
		input = screen.getByRole('switch');
		track = input.parentElement?.querySelector('span.block');
		expect(track?.className).toMatch(/w-11/);
		rerender(<Toggle size="lg" label="Large" />);
		input = screen.getByRole('switch');
		track = input.parentElement?.querySelector('span.block');
		expect(track?.className).toMatch(/w-14/);
	});
});

