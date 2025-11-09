import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import UserProfile from './UserProfile';

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
});
