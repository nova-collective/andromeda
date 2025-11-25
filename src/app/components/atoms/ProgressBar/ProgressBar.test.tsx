import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
	it('renders with given value and max', () => {
		render(<ProgressBar value={30} max={60} showLabel />);
		const track = screen.getByTestId('progress-track');
		expect(track).toHaveAttribute('role', 'progressbar');
		expect(track).toHaveAttribute('aria-valuenow', '30');
		expect(track).toHaveAttribute('aria-valuemax', '60');
		expect(screen.getByTestId('progress-label')).toHaveTextContent('50%');
	});

	it('clamps value within range', () => {
		render(<ProgressBar value={150} max={100} showLabel />);
		expect(screen.getByTestId('progress-label')).toHaveTextContent('100%');
	});

	it('indeterminate omits aria-valuenow and shows loading label', () => {
		render(<ProgressBar indeterminate showLabel />);
		const track = screen.getByRole('progressbar');
		expect(track).not.toHaveAttribute('aria-valuenow');
		expect(screen.getByTestId('progress-label')).toHaveTextContent(/loading/i);
	});

	it('applies size classes', () => {
		const { rerender } = render(<ProgressBar size="sm" />);
		let track = screen.getByTestId('progress-track');
		expect(track.className).toMatch(/h-2/);
		rerender(<ProgressBar size="md" />);
		track = screen.getByTestId('progress-track');
		expect(track.className).toMatch(/h-3/);
		rerender(<ProgressBar size="lg" />);
		track = screen.getByTestId('progress-track');
		expect(track.className).toMatch(/h-4/);
	});
});

