import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Heading } from './Heading';

describe('Heading atom', () => {
	it('renders correct semantic tags for each level', () => {
		const { container } = render(
			<div>
				<Heading level={1}>H1 Title</Heading>
				<Heading level={2}>H2 Title</Heading>
				<Heading level={3}>H3 Title</Heading>
				<Heading level={4}>H4 Title</Heading>
				<Heading level={5}>H5 Title</Heading>
				<Heading level={6}>H6 Title</Heading>
			</div>
		);

		expect(container.querySelector('h1')).toHaveTextContent('H1 Title');
		expect(container.querySelector('h2')).toHaveTextContent('H2 Title');
		expect(container.querySelector('h3')).toHaveTextContent('H3 Title');
		expect(container.querySelector('h4')).toHaveTextContent('H4 Title');
		expect(container.querySelector('h5')).toHaveTextContent('H5 Title');
		expect(container.querySelector('h6')).toHaveTextContent('H6 Title');
	});

	it('applies font, size and color classes based on level and muted', () => {
		render(
			<div>
				<Heading level={1}>Big</Heading>
				<Heading level={6} muted>
					Small Muted
				</Heading>
			</div>
		);

		const h1 = screen.getByRole('heading', { level: 1 });
		expect(h1).toHaveClass('font-serif');
		expect(h1.className).toMatch(/text-3xl|md:text-4xl/);
		expect(h1).toHaveClass('text-textBase');

		const h6 = screen.getByRole('heading', { level: 6 });
		expect(h6).toHaveClass('uppercase');
		expect(h6).toHaveClass('text-textMuted');
	});

	it('supports text alignment', () => {
		const { rerender } = render(<Heading level={2}>Aligned</Heading>);
		const heading = screen.getByRole('heading', { level: 2 });
		expect(heading).toHaveClass('text-left');

		rerender(
			<Heading level={2} align="center">
				Aligned
			</Heading>
		);
		expect(screen.getByRole('heading', { level: 2 })).toHaveClass('text-center');
	});

	it('merges custom className', () => {
		render(
			<Heading level={3} className="mb-2 tracking-tight">
				Custom
			</Heading>
		);
		const h3 = screen.getByRole('heading', { level: 3 });
		expect(h3).toHaveClass('mb-2');
		expect(h3).toHaveClass('tracking-tight');
	});
});

