import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Spinner } from './Spinner';

describe('Spinner', () => {

	it('renders with default props', () => {
		render(<Spinner />);
		const spinner = screen.getByRole('status');
		expect(spinner).toBeInTheDocument();
		expect(spinner).toHaveClass('h-6', 'w-6'); // md size
	});

	it('applies size variants', () => {
		render(<Spinner size="sm" data-testid="sm" />);
		render(<Spinner size="lg" data-testid="lg" />);
		expect(screen.getByTestId('sm')).toHaveClass('h-4', 'w-4');
		expect(screen.getByTestId('lg')).toHaveClass('h-8', 'w-8');
	});

	it('applies variant classes', () => {
		render(<Spinner variant="secondary" data-testid="variant" />);
		// Direct class token assertion for top border color in secondary variant
		expect(screen.getByTestId('variant')).toHaveClass('border-t-[color:var(--text-secondary)]');
	});

	it('renders visible label when showLabel is true', () => {
		render(<Spinner showLabel label="Loading books" />);
		const container = screen.getByRole('status');
		expect(container).toHaveTextContent('Loading books');
		// Should not have sr-only inside when visible
		const srOnly = container.querySelector('.sr-only');
		expect(srOnly).toBeNull();
	});

	it('renders accessible label (sr-only)', () => {
		render(<Spinner label="Fetching data" />);
		const srOnly = screen.getByText('Fetching data');
		expect(srOnly).toBeInTheDocument();
		expect(srOnly).toHaveClass('sr-only');
	});

	it('merges custom className', () => {
		render(<Spinner className="custom" />);
		expect(screen.getByRole('status')).toHaveClass('custom');
	});
});
