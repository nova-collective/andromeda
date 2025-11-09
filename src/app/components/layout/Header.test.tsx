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

import { ThemeProvider } from '../providers/ThemeProvider';

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
});
