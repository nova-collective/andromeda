import '@testing-library/jest-dom/vitest';
import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));

vi.mock('next/router', () => ({
	__esModule: true,
	useRouter: () => ({ push: pushMock }),
}));

import WithAuth from './WithAuth';

type TestUser = { username: string; groups?: string[] };
type AuthResponse = { user: TestUser };
type FetchResponse = { ok: boolean; json?: () => Promise<AuthResponse> };

const TestComponent = ({ user }: { user: TestUser }) => <div>Welcome {user.username}</div>;

const flushMicrotasks = () => new Promise(resolve => setTimeout(resolve, 0));

describe('WithAuth HOC', () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		vi.stubGlobal('fetch', fetchMock);
		fetchMock.mockReset();
		pushMock.mockReset();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	const renderWithAuth = async (options?: Parameters<typeof WithAuth>[1], responseOverride?: FetchResponse) => {
		const Wrapped = WithAuth(TestComponent, options) as React.ComponentType<Record<string, unknown>>;
		const response: FetchResponse = responseOverride ?? {
			ok: true,
			json: () => Promise.resolve({ user: { username: 'Alice', groups: ['admin'] } }),
		};
		fetchMock.mockResolvedValueOnce(response);
		render(<Wrapped />);
		await flushMicrotasks();
	};

	it('renders loading state initially', () => {
		const Wrapped = WithAuth(TestComponent) as React.ComponentType<Record<string, unknown>>;
		fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ user: {} }) });
		render(<Wrapped />);
		expect(screen.getByText('Loading...')).toBeInTheDocument();
	});

	it('renders wrapped component after successful auth', async () => {
		await renderWithAuth();

		await waitFor(() => expect(screen.getByText('Welcome Alice')).toBeInTheDocument());
		expect(pushMock).not.toHaveBeenCalled();
	});

	it('redirects to login when response is not ok', async () => {
		await renderWithAuth(undefined, { ok: false });

		await waitFor(() => {
			expect(pushMock).toHaveBeenCalledWith('/login');
		});
	});

	it('redirects unauthorized users when required groups do not match', async () => {
		const response = {
			ok: true,
			json: () => Promise.resolve({ user: { username: 'Bob', groups: ['member'] } }),
		};

		await renderWithAuth({ requiredGroups: ['admin'] }, response);

		await waitFor(() => {
			expect(pushMock).toHaveBeenCalledWith('/unauthorized');
		});
	});

	it('redirects to login when fetch throws an error', async () => {
		fetchMock.mockRejectedValueOnce(new Error('network error'));
		const Wrapped = WithAuth(TestComponent) as React.ComponentType<Record<string, unknown>>;
		render(<Wrapped />);

		await waitFor(() => {
			expect(pushMock).toHaveBeenCalledWith('/login');
		});
	});

	it('allows users with matching required groups', async () => {
		const response = {
			ok: true,
			json: () => Promise.resolve({ user: { username: 'Admin', groups: ['admin', 'moderator'] } }),
		};

		await renderWithAuth({ requiredGroups: ['admin'] }, response);

		await waitFor(() => {
			expect(screen.getByText('Welcome Admin')).toBeInTheDocument();
		});

		expect(pushMock).not.toHaveBeenCalled();
	});

	it('allows users when no groups are required', async () => {
		const response = {
			ok: true,
			json: () => Promise.resolve({ user: { username: 'Anyone', groups: [] } }),
		};

		await renderWithAuth(undefined, response);

		await waitFor(() => {
			expect(screen.getByText('Welcome Anyone')).toBeInTheDocument();
		});

		expect(pushMock).not.toHaveBeenCalled();
	});

	it('redirects when user has no groups but groups are required', async () => {
		const response = {
			ok: true,
			json: () => Promise.resolve({ user: { username: 'NoGroups', groups: [] } }),
		};

		await renderWithAuth({ requiredGroups: ['admin'] }, response);

		await waitFor(() => {
			expect(pushMock).toHaveBeenCalledWith('/unauthorized');
		});
	});

	it('redirects when user groups are undefined and groups are required', async () => {
		const response = {
			ok: true,
			json: () => Promise.resolve({ user: { username: 'UndefinedGroups' } }),
		};

		await renderWithAuth({ requiredGroups: ['admin'] }, response);

		await waitFor(() => {
			expect(pushMock).toHaveBeenCalledWith('/unauthorized');
		});
	});

	it('makes fetch request to /api/auth/me', async () => {
		await renderWithAuth();

		await waitFor(() => {
			expect(fetchMock).toHaveBeenCalledWith('/api/auth/me');
		});
	});

	it('passes user data as prop to wrapped component', async () => {
		const response = {
			ok: true,
			json: () => Promise.resolve({ user: { username: 'TestUser', groups: ['test'] } }),
		};

		await renderWithAuth(undefined, response);

		await waitFor(() => {
			expect(screen.getByText('Welcome TestUser')).toBeInTheDocument();
		});
	});

	it('handles multiple required groups', async () => {
		const response = {
			ok: true,
			json: () => Promise.resolve({ user: { username: 'MultiGroup', groups: ['admin', 'moderator', 'editor'] } }),
		};

		await renderWithAuth({ requiredGroups: ['admin', 'editor'] }, response);

		await waitFor(() => {
			expect(screen.getByText('Welcome MultiGroup')).toBeInTheDocument();
		});

		expect(pushMock).not.toHaveBeenCalled();
	});

	it('does not render wrapped component before auth check completes', () => {
		const Wrapped = WithAuth(TestComponent) as React.ComponentType<Record<string, unknown>>;
		fetchMock.mockImplementationOnce(() => new Promise(() => {})); // Never resolves

		render(<Wrapped />);

		expect(screen.getByText('Loading...')).toBeInTheDocument();
		expect(screen.queryByText(/Welcome/)).not.toBeInTheDocument();
	});

	it('handles console errors during fetch failures gracefully', async () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		
		fetchMock.mockRejectedValueOnce(new Error('Fetch failed'));
		const Wrapped = WithAuth(TestComponent) as React.ComponentType<Record<string, unknown>>;
		render(<Wrapped />);

		await waitFor(() => {
			expect(pushMock).toHaveBeenCalledWith('/login');
		});

		consoleSpy.mockRestore();
	});
});
