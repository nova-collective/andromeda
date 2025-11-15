import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Caption } from './Caption';

describe('Caption', () => {
	it('renders children by default as <p>', () => {
		render(<Caption>Photo by Andromeda</Caption>);
		const el = screen.getByText('Photo by Andromeda');
		expect(el.tagName).toBe('P');
	});

	it('is muted by default', () => {
		render(<Caption>Muted by default</Caption>);
		const el = screen.getByText('Muted by default');
		expect(el).toHaveClass('text-textMuted');
	});

	it('applies size class', () => {
		render(<Caption size="xs">Tiny</Caption>);
		const el = screen.getByText('Tiny');
		expect(el).toHaveClass('text-xs');
	});

	it('applies alignment class', () => {
		render(<Caption align="center">Centered caption</Caption>);
		const el = screen.getByText('Centered caption');
		expect(el).toHaveClass('text-center');
	});

	it('merges custom className', () => {
		render(<Caption className="custom-class">Custom</Caption>);
		const el = screen.getByText('Custom');
		expect(el).toHaveClass('custom-class');
	});

	it('supports as prop for element override', () => {
		render(<Caption as="figcaption">Figure caption</Caption>);
		const el = screen.getByText('Figure caption');
		expect(el.tagName).toBe('FIGCAPTION');
	});

	it('supports onPrimary contrast for readability over colored backgrounds', () => {
		render(<Caption contrast="onPrimary">On primary</Caption>);
		const el = screen.getByText('On primary');
		expect(el).toHaveClass('text-white');
		expect(el.className).toMatch(/dark:text-black/);
	});
});

