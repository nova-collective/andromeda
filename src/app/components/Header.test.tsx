import '@testing-library/jest-dom/vitest';
import React, { createElement } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({
	__esModule: true,
	default: (props: React.ComponentProps<'img'>) => createElement('img', props),
}));

import Header from './Header';

describe('Header component', () => {
	beforeEach(() => {
		vi.spyOn(console, 'log').mockImplementation(() => undefined);
	});
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders logo, menu items, and action buttons', () => {
		render(<Header />);

		expect(screen.getByAltText('Andromeda')).toBeInTheDocument();
		['Item1', 'Item2', 'Item3', 'Item4'].forEach(item => {
			expect(screen.getAllByRole('link', { name: item })[0]).toBeInTheDocument();
		});
		expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: '🦊 Connect Wallet' })).toBeInTheDocument();
	});

	it('opens and closes the login modal through user interactions', async () => {
		const user = userEvent.setup();
		render(<Header />);

		await user.click(screen.getByRole('button', { name: 'Login' }));
		expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Sign In' }));

		await waitFor(() => {
			expect(screen.queryByRole('heading', { name: 'Login' })).not.toBeInTheDocument();
		});
	});

	it('opens wallet modal and closes it after choosing a provider', async () => {
		const user = userEvent.setup();
		render(<Header />);

		await user.click(screen.getByRole('button', { name: '🦊 Connect Wallet' }));
		const modalHeading = screen.getByRole('heading', { name: 'Connect Wallet' });
		expect(modalHeading).toBeInTheDocument();
		const providerButton = screen.getAllByRole('button', { name: /MetaMask/ })[0];
		await user.click(providerButton);

		await waitFor(() => {
			expect(screen.queryByRole('heading', { name: 'Connect Wallet' })).not.toBeInTheDocument();
		});
	});

	it('toggles the mobile menu when the menu button is pressed', async () => {
		const user = userEvent.setup();
		render(<Header />);

		expect(screen.getAllByText('Item1')).toHaveLength(1);

		const toggleButton = screen.getByRole('button', { name: '' });
		await user.click(toggleButton);
		expect(screen.getAllByText('Item1')).toHaveLength(2);

		await user.click(toggleButton);
		expect(screen.getAllByText('Item1')).toHaveLength(1);
	});
});
