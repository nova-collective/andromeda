import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));

vi.mock('next/router', () => ({
	__esModule: true,
	useRouter: () => ({ push: pushMock }),
}));

const mockFetchResponse = (userGroups: string[]) => ({
	ok: true,
	json: () => Promise.resolve({ user: { username: 'Admin', groups: userGroups } }),
});

describe('Admin page', () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		pushMock.mockReset();
		fetchMock.mockReset();
		vi.stubGlobal('fetch', fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('renders dashboard content for admin users', async () => {
		fetchMock.mockResolvedValueOnce(mockFetchResponse(['admin']));

		const AdminPage = (await import('./admin')).default;
		render(<AdminPage />);

		await waitFor(() => {
			expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
			expect(screen.getByText('Welcome, Admin (Admin)')).toBeInTheDocument();
		});
		expect(pushMock).not.toHaveBeenCalled();
	});

	it('redirects non-admin users to unauthorized', async () => {
		fetchMock.mockResolvedValueOnce(mockFetchResponse(['member']));

		const AdminPage = (await import('./admin')).default;
		render(<AdminPage />);

		await waitFor(() => {
			expect(pushMock).toHaveBeenCalledWith('/unauthorized');
		});
	});
});
