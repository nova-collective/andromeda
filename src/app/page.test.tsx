import '@testing-library/jest-dom/vitest';
import React, { createElement } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({
	__esModule: true,
	default: (props: React.ComponentProps<'img'>) => createElement('img', props),
}));

vi.mock('./components/organisms/Header', () => ({
	__esModule: true,
	default: () => createElement('div', { 'data-testid': 'mock-header' }, 'Header'),
}));

vi.mock('./components/organisms/UserProfile', () => ({
	__esModule: true,
	default: ({ walletAddress }: { walletAddress: string }) =>
		createElement('div', { 'data-testid': 'mock-user-profile' }, walletAddress),
}));

vi.mock('./components/atoms/Button', () => ({
	Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) =>
		createElement('button', { ...props, tabIndex: 0 }, children),
}));

vi.mock('./components/organisms/Card', () => ({
	Card: (props: Record<string, unknown>) => 
		createElement('div', { 'data-testid': 'mock-card' }, JSON.stringify(props)),
	__esModule: true,
	default: (props: Record<string, unknown>) => 
		createElement('div', { 'data-testid': 'mock-card' }, JSON.stringify(props)),
}));

vi.mock('./components/templates/GridLayout', () => ({
	GridLayout: ({ children }: { children: React.ReactNode }) => 
		createElement('div', { 'data-testid': 'mock-grid-layout' }, children),
	__esModule: true,
	default: ({ children }: { children: React.ReactNode }) => 
		createElement('div', { 'data-testid': 'mock-grid-layout' }, children),
}));

import Home from './page';

describe('Home page (updated layout)', () => {
	it('renders header, hero content, secondary hero, and footer', () => {
		render(<Home />);
		expect(screen.getByTestId('mock-header')).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 1, name: /welcome to andromeda/i })).toBeInTheDocument();
		expect(screen.getByText('A Web3 bookstore, from authors to readers')).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 2, name: /discover, collect, and sell/i })).toBeInTheDocument();
		expect(screen.getByText(/building the future of reading, one block at a time/i)).toBeInTheDocument();
	});

	it('renders coming soon banner', () => {
		render(<Home />);
		expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
		expect(screen.getByText(/coming soon/i)).toHaveClass('animate-pulse');
	});

	it('renders work in progress image', () => {
		render(<Home />);
		const wipImage = screen.getByAltText('Work in Progress');
		expect(wipImage).toBeInTheDocument();
		expect(wipImage).toHaveAttribute('src', '/assets/wip.png');
	});

	it('renders footer with copyright', () => {
		render(<Home />);
		const currentYear = new Date().getFullYear();
		expect(screen.getByText(new RegExp(`${currentYear}.*Andromeda`))).toBeInTheDocument();
		expect(screen.getByText(/building the future of reading, one block at a time/i)).toBeInTheDocument();
	});

	it('applies themed page container classes', () => {
		const { container } = render(<Home />);
		const mainDiv = container.querySelector('.min-h-screen');
		expect(mainDiv).toBeInTheDocument();
		expect(mainDiv).toHaveClass('bg-secondary');
	});

	it('has at least one primary hero h1 heading', () => {
		render(<Home />);
		const h1Elements = screen.getAllByRole('heading', { level: 1 });
		expect(h1Elements.length).toBeGreaterThanOrEqual(1);
	});

	it('renders coming soon banner', () => {
		render(<Home />);

		expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
		expect(screen.getByText(/coming soon/i)).toHaveClass('animate-pulse');
	});

	it('renders work in progress image', () => {
		render(<Home />);

		const wipImage = screen.getByAltText('Work in Progress');
		expect(wipImage).toBeInTheDocument();
		expect(wipImage).toHaveAttribute('src', '/assets/wip.png');
	});

	it('renders Andromeda logo', () => {
		render(<Home />);

		const logo = screen.getByAltText('Andromeda');
		expect(logo).toBeInTheDocument();
		expect(logo).toHaveAttribute('src', '/assets/andromeda-logo.png');
	});

	it('displays test area section', () => {
		render(<Home />);

		expect(screen.getByText('🧪 Test Area')).toBeInTheDocument();
		expect(screen.getByText('Testing db connection')).toBeInTheDocument();
	});

	it('renders hero section with proper headings', () => {
		render(<Home />);

		expect(screen.getByText('Discover, Collect, and Sell')).toBeInTheDocument();
		expect(screen.getByText("Explore the world's leading NFT marketplace")).toBeInTheDocument();
	});

	it('renders trending items section', () => {
		render(<Home />);

		expect(screen.getByText('Trending Items')).toBeInTheDocument();
	});

	it('renders footer with copyright', () => {
		render(<Home />);

		const currentYear = new Date().getFullYear();
		expect(screen.getByText(new RegExp(`${currentYear}.*Andromeda`))).toBeInTheDocument();
		expect(screen.getByText(/building the future of reading, one block at a time/i)).toBeInTheDocument();
	});

	it('applies correct background gradient classes', () => {
		const { container } = render(<Home />);

		const mainDiv = container.querySelector('.bg-gradient-to-br');
		expect(mainDiv).toBeInTheDocument();
		expect(mainDiv).toHaveClass('from-gray-900', 'to-gray-800');
	});

	it('renders with proper semantic HTML structure', () => {
		render(<Home />);

		// Should have proper heading hierarchy
		const h1Elements = screen.getAllByRole('heading', { level: 1 });
		expect(h1Elements.length).toBeGreaterThan(0);

		const h2Elements = screen.getAllByRole('heading', { level: 2 });
		expect(h2Elements.length).toBeGreaterThan(0);
	});
});
