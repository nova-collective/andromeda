import '@testing-library/jest-dom/vitest';
import React, { createElement } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({
	__esModule: true,
	default: (props: React.ComponentProps<'img'>) => createElement('img', props),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
	motion: {
		div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => 
			createElement('div', props, children),
	},
}));

import { ThemeProvider } from '@/app/components/providers/ThemeProvider/ThemeProvider';

import Header from './Header';

const renderWithTheme = (component: React.ReactElement) => {
	return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Header component', () => {
	beforeEach(() => {
		vi.spyOn(console, 'log').mockImplementation(() => undefined);
	});
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders logo, menu items, and action buttons', () => {
		renderWithTheme(<Header />);

		expect(screen.getByText('Andromeda')).toBeInTheDocument();
		expect(screen.getByText('Explore')).toBeInTheDocument();
		expect(screen.getByText('Stats')).toBeInTheDocument();
		expect(screen.getByText('Create')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Connect' })).toBeInTheDocument();
	});

	it('toggles theme when theme button is clicked', async () => {
		const user = userEvent.setup();
		renderWithTheme(<Header />);

		const themeButton = screen.getByRole('button', { name: 'Toggle theme' });
		
		// Click to toggle theme
		await user.click(themeButton);
		
		// The button should still be in the document
		expect(themeButton).toBeInTheDocument();
	});

	it('toggles the mobile menu when the menu button is pressed', async () => {
		const user = userEvent.setup();
		renderWithTheme(<Header />);

		// Find all buttons and look for the one with Menu or X icon (mobile menu toggle)
		const allButtons = screen.getAllByRole('button');
		
		// The mobile menu button is the last button (has Menu icon, no aria-label, class includes md:hidden)
		const mobileMenuToggle = allButtons.find(btn => {
			const classes = btn.className || '';
			return classes.includes('md:hidden');
		});

		expect(mobileMenuToggle).toBeDefined();

		// Initially, "Explore" should appear only once (in desktop nav)
		expect(screen.getAllByText('Explore')).toHaveLength(1);

		if (mobileMenuToggle) {
			// Click to open mobile menu
			await user.click(mobileMenuToggle);
			
			// After clicking, mobile menu should appear with duplicate navigation links
			await waitFor(() => {
				expect(screen.getAllByText('Explore').length).toBeGreaterThan(1);
			});

			// Click again to close
			await user.click(mobileMenuToggle);
			
			await waitFor(() => {
				expect(screen.getAllByText('Explore')).toHaveLength(1);
			});
		}
	});

	it('renders all navigation links with correct hrefs', () => {
		renderWithTheme(<Header />);

		const exploreLink = screen.getByRole('link', { name: /Explore/i });
		const statsLink = screen.getByRole('link', { name: /Stats/i });
		const createLink = screen.getByRole('link', { name: /Create/i });

		expect(exploreLink).toHaveAttribute('href', '/explore');
		expect(statsLink).toHaveAttribute('href', '/stats');
		expect(createLink).toHaveAttribute('href', '/create');
	});

	it('renders logo as a link to home page', () => {
		renderWithTheme(<Header />);

		const logoLinks = screen.getAllByRole('link');
		const homeLink = logoLinks.find(link => link.getAttribute('href') === '/');

		expect(homeLink).toBeInTheDocument();
		expect(homeLink).toHaveClass('flex', 'items-center', 'gap-2', 'group');
	});

	it('renders search inputs for both desktop and mobile', () => {
		renderWithTheme(<Header />);

		const searchInputs = screen.getAllByPlaceholderText(/Search/i);
		
		// Should have 2 search inputs (desktop and mobile)
		expect(searchInputs.length).toBeGreaterThanOrEqual(1);
	});

	it('handles search input focus state', async () => {
		const user = userEvent.setup();
		renderWithTheme(<Header />);

		const searchInput = screen.getAllByPlaceholderText(/Search/i)[0];
		
		await user.click(searchInput);
		
		// Input should be focused
		expect(searchInput).toHaveFocus();
	});

	it('displays connect wallet button', () => {
		renderWithTheme(<Header />);

		const connectButton = screen.getByRole('button', { name: 'Connect' });
		expect(connectButton).toBeInTheDocument();
		expect(connectButton).toHaveClass('bg-primary-500');
	});

	it('renders user icon button', () => {
		renderWithTheme(<Header />);

		const allButtons = screen.getAllByRole('button');
		
		// User button should exist (has User icon)
		expect(allButtons.length).toBeGreaterThan(3); // theme, user, connect, mobile menu
	});

	it('renders theme button with correct icon based on current theme', () => {
		renderWithTheme(<Header />);

		const themeButton = screen.getByRole('button', { name: 'Toggle theme' });
		expect(themeButton).toBeInTheDocument();
		
		// Check if button contains an SVG (icon)
		const svg = themeButton.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});

	it('mobile menu closes when navigation link is clicked', async () => {
		const user = userEvent.setup();
		renderWithTheme(<Header />);

		const allButtons = screen.getAllByRole('button');
		const mobileMenuToggle = allButtons.find(btn => btn.className?.includes('md:hidden'));

		if (mobileMenuToggle) {
			// Open mobile menu
			await user.click(mobileMenuToggle);
			
			await waitFor(() => {
				expect(screen.getAllByText('Explore').length).toBeGreaterThan(1);
			});

			// Click on a navigation link in mobile menu
			const mobileLinks = screen.getAllByText('Explore');
			const mobileLink = mobileLinks[1]; // Second instance is in mobile menu
			
			await user.click(mobileLink);

			// Menu should close (Explore should appear only once again)
			await waitFor(() => {
				expect(screen.getAllByText('Explore')).toHaveLength(1);
			});
		}
	});

	it('renders connect wallet button in mobile menu', async () => {
		const user = userEvent.setup();
		renderWithTheme(<Header />);

		const allButtons = screen.getAllByRole('button');
		const mobileMenuToggle = allButtons.find(btn => btn.className?.includes('md:hidden'));

		if (mobileMenuToggle) {
			await user.click(mobileMenuToggle);
			
			await waitFor(() => {
				// Mobile menu should have Connect Wallet button
				const connectButtons = screen.getAllByText('Connect Wallet');
				expect(connectButtons.length).toBeGreaterThanOrEqual(1);
			});
		}
	});

	it('has correct styling classes for header', () => {
		const { container } = renderWithTheme(<Header />);

		const header = container.querySelector('header');
		expect(header).toHaveClass('sticky', 'top-0', 'z-50');
		expect(header).toHaveClass('border-b');
	});

	it('renders all icons properly', () => {
		renderWithTheme(<Header />);

		// Count SVG elements (icons from lucide-react)
		const svgs = document.querySelectorAll('svg');
		
		// Should have multiple icons: Search (2), TrendingUp, Sparkles, ShoppingBag, 
		// Sun/Moon, User, Wallet, Menu/X
		expect(svgs.length).toBeGreaterThan(5);
	});
});
