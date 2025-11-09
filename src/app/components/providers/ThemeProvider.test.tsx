import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider, useTheme } from './ThemeProvider';

// Test component that uses the theme hook
function TestComponent() {
	const { theme, toggleTheme, setTheme } = useTheme();
	
	return (
		<div>
			<div data-testid="current-theme">{theme}</div>
			<button onClick={toggleTheme} data-testid="toggle-button">
				Toggle Theme
			</button>
			<button onClick={() => setTheme('light')} data-testid="set-light">
				Set Light
			</button>
			<button onClick={() => setTheme('dark')} data-testid="set-dark">
				Set Dark
			</button>
		</div>
	);
}

describe('ThemeProvider', () => {
	let localStorageMock: { [key: string]: string };
	let setItemSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		// Mock localStorage
		localStorageMock = {};
		
		setItemSpy = vi.fn((key: string, value: string) => {
			localStorageMock[key] = value;
		});

		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: vi.fn((key: string) => localStorageMock[key] || null),
				setItem: setItemSpy,
				clear: vi.fn(() => {
					localStorageMock = {};
				}),
			},
			writable: true,
		});

		// Mock matchMedia
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: vi.fn().mockImplementation((query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: vi.fn(),
				removeListener: vi.fn(),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})),
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
		localStorageMock = {};
	});

	it('provides theme context to children', () => {
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>
		);

		expect(screen.getByTestId('current-theme')).toBeInTheDocument();
	});

	it('starts with light theme by default', () => {
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>
		);

		expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
	});

	it('toggles theme from light to dark', async () => {
		const user = userEvent.setup();
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>
		);

		expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

		await user.click(screen.getByTestId('toggle-button'));

		await waitFor(() => {
			expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
		});
	});

	it('toggles theme from dark to light', async () => {
		const user = userEvent.setup();
		
		// Start with dark theme in localStorage
		localStorageMock['theme'] = 'dark';
		
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
		});

		await user.click(screen.getByTestId('toggle-button'));

		await waitFor(() => {
			expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
		});
	});

	it('sets theme to light explicitly', async () => {
		const user = userEvent.setup();
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>
		);

		await user.click(screen.getByTestId('set-light'));

		await waitFor(() => {
			expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
		});
	});

	it('sets theme to dark explicitly', async () => {
		const user = userEvent.setup();
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>
		);

		await user.click(screen.getByTestId('set-dark'));

		await waitFor(() => {
			expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
		});
	});

	it('persists theme to localStorage when changed', async () => {
		const user = userEvent.setup();
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>
		);

		await user.click(screen.getByTestId('set-dark'));

		await waitFor(() => {
			expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark');
		});
	});

	it('loads theme from localStorage on mount', () => {
		localStorageMock['theme'] = 'dark';

		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>
		);

		expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
	});

	it('uses system preference when localStorage is empty and matchMedia is available', () => {
		// Mock matchMedia to return dark preference
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: vi.fn().mockImplementation((query: string) => ({
				matches: query === '(prefers-color-scheme: dark)',
				media: query,
				onchange: null,
				addListener: vi.fn(),
				removeListener: vi.fn(),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})),
		});

		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>
		);

		expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
	});

	it('throws error when useTheme is used outside ThemeProvider', () => {
		// Suppress console.error for this test
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		expect(() => {
			render(<TestComponent />);
		}).toThrow('useTheme must be used within a ThemeProvider');

		consoleSpy.mockRestore();
	});

	it('applies theme class to document element', async () => {
		const user = userEvent.setup();
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>
		);

		// Click to set dark theme
		await user.click(screen.getByTestId('set-dark'));

		await waitFor(() => {
			expect(document.documentElement.classList.contains('dark')).toBe(true);
		});

		// Click to set light theme
		await user.click(screen.getByTestId('set-light'));

		await waitFor(() => {
			expect(document.documentElement.classList.contains('light')).toBe(true);
			expect(document.documentElement.classList.contains('dark')).toBe(false);
		});
	});

	it('handles multiple theme toggles in sequence', async () => {
		const user = userEvent.setup();
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>
		);

		expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

		// Toggle to dark
		await user.click(screen.getByTestId('toggle-button'));
		await waitFor(() => {
			expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
		});

		// Toggle back to light
		await user.click(screen.getByTestId('toggle-button'));
		await waitFor(() => {
			expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
		});

		// Toggle to dark again
		await user.click(screen.getByTestId('toggle-button'));
		await waitFor(() => {
			expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
		});
	});

	it('renders children immediately', () => {
		render(
			<ThemeProvider>
				<div data-testid="child-element">Child Content</div>
			</ThemeProvider>
		);

		expect(screen.getByTestId('child-element')).toBeInTheDocument();
		expect(screen.getByText('Child Content')).toBeInTheDocument();
	});
});
