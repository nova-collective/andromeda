import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { GridLayout } from './GridLayout';

describe('GridLayout component', () => {
	it('renders children correctly', () => {
		render(
			<GridLayout>
				<div data-testid="child-1">Child 1</div>
				<div data-testid="child-2">Child 2</div>
				<div data-testid="child-3">Child 3</div>
			</GridLayout>
		);

		expect(screen.getByTestId('child-1')).toBeInTheDocument();
		expect(screen.getByTestId('child-2')).toBeInTheDocument();
		expect(screen.getByTestId('child-3')).toBeInTheDocument();
		expect(screen.getByText('Child 1')).toBeInTheDocument();
	});

	it('applies default grid columns when no cols prop is provided', () => {
		const { container } = render(
			<GridLayout>
				<div>Item</div>
			</GridLayout>
		);

		const gridContainer = container.firstChild as HTMLElement;
		expect(gridContainer).toHaveClass('grid');
		expect(gridContainer).toHaveClass('gap-6');
		expect(gridContainer).toHaveClass('animate-fade-in');
		expect(gridContainer.className).toContain('grid-cols-1');
		expect(gridContainer.className).toContain('md:grid-cols-2');
		expect(gridContainer.className).toContain('lg:grid-cols-3');
		expect(gridContainer.className).toContain('xl:grid-cols-4');
	});

	it('applies custom grid columns when cols prop is provided', () => {
		const { container } = render(
			<GridLayout cols={{ sm: 2, md: 3, lg: 4, xl: 6 }}>
				<div>Item</div>
			</GridLayout>
		);

		const gridContainer = container.firstChild as HTMLElement;
		expect(gridContainer.className).toContain('grid-cols-2');
		expect(gridContainer.className).toContain('md:grid-cols-3');
		expect(gridContainer.className).toContain('lg:grid-cols-4');
		expect(gridContainer.className).toContain('xl:grid-cols-6');
	});

	it('applies partial custom columns and uses defaults for missing values', () => {
		const { container } = render(
			<GridLayout cols={{ sm: 1, lg: 5 }}>
				<div>Item</div>
			</GridLayout>
		);

		const gridContainer = container.firstChild as HTMLElement;
		expect(gridContainer.className).toContain('grid-cols-1');
		expect(gridContainer.className).toContain('md:grid-cols-2');
		expect(gridContainer.className).toContain('lg:grid-cols-5');
		expect(gridContainer.className).toContain('xl:grid-cols-4');
	});

	it('renders with single child', () => {
		render(
			<GridLayout>
				<div data-testid="single-child">Only Child</div>
			</GridLayout>
		);

		expect(screen.getByTestId('single-child')).toBeInTheDocument();
		expect(screen.getByText('Only Child')).toBeInTheDocument();
	});

	it('renders with many children', () => {
		const items = Array.from({ length: 12 }, (_, i) => (
			<div key={i} data-testid={`item-${i}`}>
				Item {i}
			</div>
		));

		render(<GridLayout>{items}</GridLayout>);

		items.forEach((_, i) => {
			expect(screen.getByTestId(`item-${i}`)).toBeInTheDocument();
		});
	});

	it('renders with complex children components', () => {
		const ComplexChild = ({ title }: { title: string }) => (
			<div>
				<h3>{title}</h3>
				<p>Content</p>
			</div>
		);

		render(
			<GridLayout>
				<ComplexChild title="Card 1" />
				<ComplexChild title="Card 2" />
			</GridLayout>
		);

		expect(screen.getByText('Card 1')).toBeInTheDocument();
		expect(screen.getByText('Card 2')).toBeInTheDocument();
		expect(screen.getAllByText('Content')).toHaveLength(2);
	});

	it('handles empty children gracefully', () => {
		const { container } = render(<GridLayout>{null}</GridLayout>);

		const gridContainer = container.firstChild as HTMLElement;
		expect(gridContainer).toBeInTheDocument();
		expect(gridContainer).toHaveClass('grid');
		expect(gridContainer.children).toHaveLength(0);
	});

	it('applies all expected CSS classes', () => {
		const { container } = render(
			<GridLayout>
				<div>Item</div>
			</GridLayout>
		);

		const gridContainer = container.firstChild as HTMLElement;
		expect(gridContainer.tagName).toBe('DIV');
		expect(gridContainer).toHaveClass('grid');
		expect(gridContainer).toHaveClass('gap-6');
		expect(gridContainer).toHaveClass('animate-fade-in');
	});
});
