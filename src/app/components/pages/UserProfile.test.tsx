import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import UserProfile from '../organisms/UserProfile';

type MockUserSettings = { theme: string; notifications: boolean };
type MockUser = { walletAddress: string; settings: MockUserSettings };
type MockFetchResponse<T> = { json: () => Promise<T> };

const createFetchResponse = <T,>(data: T): MockFetchResponse<T> => ({
	json: () => Promise.resolve(data),
});

describe('UserProfile component', () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		vi.stubGlobal('fetch', fetchMock);
		fetchMock.mockReset();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('loads user data and renders profile details', async () => {
		const walletAddress = '0xabc123';
		const mockUser: MockUser = {
			walletAddress,
			settings: { theme: 'light', notifications: false },
		};

		fetchMock.mockResolvedValueOnce(createFetchResponse(mockUser));

		render(<UserProfile walletAddress={walletAddress} />);

		expect(screen.getByText('Loading...')).toBeInTheDocument();

		await screen.findByText(`Wallet: ${walletAddress}`);

		expect(fetchMock).toHaveBeenCalledWith(`/api/users?walletAddress=${walletAddress}`);
		expect(screen.getByText('User Profile')).toBeInTheDocument();
		expect(screen.getByText('Theme: light')).toBeInTheDocument();
	});

	it('shows fallback when user data is missing', async () => {
		const walletAddress = '0xdef456';

		fetchMock.mockResolvedValueOnce(createFetchResponse(null));

		render(<UserProfile walletAddress={walletAddress} />);

		await screen.findByText('User not found');
	});

	it('updates user settings after clicking the action button', async () => {
		const walletAddress = '0xfeed1234';
		const initialUser: MockUser = {
			walletAddress,
			settings: { theme: 'light', notifications: false },
		};
		const updatedUser: MockUser = {
			walletAddress,
			settings: { theme: 'dark', notifications: true },
		};

		fetchMock
			.mockResolvedValueOnce(createFetchResponse(initialUser))
			.mockResolvedValueOnce(createFetchResponse(updatedUser));

		render(<UserProfile walletAddress={walletAddress} />);

		await screen.findByText('Theme: light');

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'Switch to Dark Mode' }));

		expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/users', expect.objectContaining({
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				walletAddress,
				settings: { theme: 'dark', notifications: true },
			}),
		}));

		await waitFor(() => {
			expect(screen.getByText('Theme: dark')).toBeInTheDocument();
		});
	});

	it('handles fetch errors gracefully', async () => {
		const walletAddress = '0xerror123';
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		fetchMock.mockRejectedValueOnce(new Error('Network error'));

		render(<UserProfile walletAddress={walletAddress} />);

		await waitFor(() => {
			expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
		});

		consoleSpy.mockRestore();
	});

	it('renders with different wallet addresses', async () => {
		const addresses = ['0xaaa', '0xbbb', '0xccc'];

		for (const address of addresses) {
			const mockUser: MockUser = {
				walletAddress: address,
				settings: { theme: 'light', notifications: true },
			};

			fetchMock.mockResolvedValueOnce(createFetchResponse(mockUser));

			const { unmount } = render(<UserProfile walletAddress={address} />);

			await screen.findByText(`Wallet: ${address}`);

			expect(fetchMock).toHaveBeenCalledWith(`/api/users?walletAddress=${address}`);

			unmount();
			fetchMock.mockClear();
		}
	});

	it('shows loading state initially', () => {
		fetchMock.mockImplementationOnce(() => new Promise(() => {})); // Never resolves

		render(<UserProfile walletAddress="0xloading" />);

		expect(screen.getByText('Loading...')).toBeInTheDocument();
		expect(screen.queryByText('User Profile')).not.toBeInTheDocument();
	});

	it('displays user settings correctly', async () => {
		const mockUser: MockUser = {
			walletAddress: '0xtest',
			settings: { theme: 'dark', notifications: true },
		};

		fetchMock.mockResolvedValueOnce(createFetchResponse(mockUser));

		render(<UserProfile walletAddress="0xtest" />);

		await screen.findByText('Theme: dark');
		expect(screen.getByText('User Profile')).toBeInTheDocument();
		expect(screen.getByText('Wallet: 0xtest')).toBeInTheDocument();
	});

	it('makes correct API call with wallet address parameter', async () => {
		const walletAddress = '0x123456789abcdef';
		const mockUser: MockUser = {
			walletAddress,
			settings: { theme: 'light', notifications: true },
		};

		fetchMock.mockResolvedValueOnce(createFetchResponse(mockUser));

		render(<UserProfile walletAddress={walletAddress} />);

		await waitFor(() => {
			expect(fetchMock).toHaveBeenCalledTimes(1);
		});

		const callUrl = fetchMock.mock.calls[0][0] as string;
		expect(callUrl).toContain(walletAddress);
		expect(callUrl).toContain('/api/users');
		expect(callUrl).toContain('walletAddress=');
	});
});
