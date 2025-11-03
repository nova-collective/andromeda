import type { NextRequest } from 'next/server';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { IUser, Permission } from '@/app/lib/types';

import type { ObjectId } from 'mongoose';

const mocks = vi.hoisted(() => {
	const createJsonResponse = (body: unknown, init?: { status?: number }) => ({
		body,
		status: init?.status ?? 200,
		headers: new Headers(),
	});
	return {
		jsonMock: vi.fn(createJsonResponse),
		createJsonResponse,
		comparePasswordMock: vi.fn(),
		generateTokenMock: vi.fn(),
		getUserByUsernameMock: vi.fn(),
		updateUserMock: vi.fn(),
		getUserPermissionsMock: vi.fn(),
		buildResponseBodyMock: vi.fn(),
		withAuthHeaderMock: vi.fn(),
		normalizePermissionsMock: vi.fn(),
	};
});

const {
	jsonMock,
	createJsonResponse,
	comparePasswordMock,
	generateTokenMock,
	getUserByUsernameMock,
	updateUserMock,
	getUserPermissionsMock,
	buildResponseBodyMock,
	withAuthHeaderMock,
	normalizePermissionsMock,
} = mocks;

vi.mock('@/app/lib/utils', async (importOriginal) => {
	const original = await importOriginal<typeof import('@/app/lib/utils')>();
	return {
		__esModule: true,
		...original,
		comparePassword: comparePasswordMock,
	};
});

vi.mock('@/app/lib/auth/auth', () => ({
	__esModule: true,
	generateToken: generateTokenMock,
}));

vi.mock('@/app/lib/services', () => ({
	__esModule: true,
	UserService: class {
		getUserByUsername = getUserByUsernameMock;
		updateUser = updateUserMock;
		getUserPermissions = getUserPermissionsMock;
	},
}));

vi.mock('../helpers', async (importOriginal) => {
	const original = await importOriginal<typeof import('../helpers')>();
	return {
		__esModule: true,
		...original,
		buildResponseBody: buildResponseBodyMock,
		withAuthHeader: withAuthHeaderMock,
		normalizePermissions: normalizePermissionsMock,
	};
});

vi.mock('next/server', () => ({
	__esModule: true,
	NextRequest: class {},
	NextResponse: { json: jsonMock },
}));

const loginRoute = await import('./route');
const { POST } = loginRoute;

type MockedRequest = NextRequest & { json: () => Promise<unknown>; headers: Headers };

const createRequest = (body: unknown): MockedRequest => ({
	headers: new Headers(),
	json: async () => body,
} as unknown as MockedRequest);

const buildUser = (overrides: Partial<IUser> = {}) => ({
	_id: '507f1f77bcf86cd799439011',
	username: 'nova',
	email: 'nova@example.com',
	password: '$2b$hash',
	walletAddress: '0x123',
	settings: { theme: 'default', notifications: true },
	permissions: [],
	groups: [{ toString: () => 'group-1' } as unknown as ObjectId],
	lastLogin: new Date('2023-01-01T00:00:00.000Z'),
	...overrides,
}) as unknown as IUser;

const buildPermissions = (): Permission[] => ([
	{ name: 'User', description: 'manage users', crud: { read: true, create: false, update: false, delete: false } },
]);

describe('POST /api/auth/login', () => {
	const requestBody = { username: 'nova', password: 'secret' };

	beforeEach(() => {
		jsonMock.mockReset();
		jsonMock.mockImplementation(createJsonResponse);
		comparePasswordMock.mockReset();
		generateTokenMock.mockReset();
		getUserByUsernameMock.mockReset();
		updateUserMock.mockReset();
		getUserPermissionsMock.mockReset();
		buildResponseBodyMock.mockReset();
		withAuthHeaderMock.mockReset();
		normalizePermissionsMock.mockReset();
	});

	it('returns 400 when username or password missing', async () => {
		const response = await POST(createRequest({ username: 'nova' }));

		expect(jsonMock).toHaveBeenCalledWith({ message: 'Username and password are required' }, { status: 400 });
		expect(response.status).toBe(400);
	});

	it('returns 401 when user is not found', async () => {
		getUserByUsernameMock.mockResolvedValueOnce(null);

		const response = await POST(createRequest(requestBody));

		expect(getUserByUsernameMock).toHaveBeenCalledWith('nova');
		expect(jsonMock).toHaveBeenCalledWith({ message: 'Invalid credentials' }, { status: 401 });
		expect(response.status).toBe(401);
	});

	it('returns 401 when password comparison fails', async () => {
		getUserByUsernameMock.mockResolvedValueOnce(buildUser());
		comparePasswordMock.mockResolvedValueOnce(false);

		const response = await POST(createRequest(requestBody));

		expect(comparePasswordMock).toHaveBeenCalledWith('secret', '$2b$hash');
		expect(jsonMock).toHaveBeenCalledWith({ message: 'Invalid credentials' }, { status: 401 });
		expect(response.status).toBe(401);
	});

	it('returns tokenized response and updates last login on success', async () => {
		const user = buildUser();
		getUserByUsernameMock.mockResolvedValueOnce(user);
		comparePasswordMock.mockResolvedValueOnce(true);
		const permissions = buildPermissions();
		getUserPermissionsMock.mockResolvedValueOnce(permissions);
		normalizePermissionsMock.mockReturnValueOnce(permissions);
		generateTokenMock.mockReturnValueOnce('jwt-token');
		const responseBody = { message: 'Authenticated', user: { token: 'jwt-token' } };
		buildResponseBodyMock.mockReturnValueOnce(responseBody);
		withAuthHeaderMock.mockImplementation((res) => res);

		const response = await POST(createRequest(requestBody));

		expect(updateUserMock).toHaveBeenCalledWith(String(user._id), expect.objectContaining({ lastLogin: expect.any(Date) }));
		expect(getUserPermissionsMock).toHaveBeenCalledWith(String(user._id));
		expect(generateTokenMock).toHaveBeenCalledWith({
			userId: String(user._id),
			username: 'nova',
			groups: ['group-1'],
			permissions,
		});
		expect(withAuthHeaderMock).toHaveBeenCalledWith(expect.objectContaining({ body: responseBody, status: 200 }), 'jwt-token');
		expect(response.status).toBe(200);
	});

	it('logs and continues when last login update fails', async () => {
		const user = buildUser();
		getUserByUsernameMock.mockResolvedValueOnce(user);
		comparePasswordMock.mockResolvedValueOnce(true);
		updateUserMock.mockRejectedValueOnce(new Error('update failed'));
		const permissions = buildPermissions();
		getUserPermissionsMock.mockResolvedValueOnce(permissions);
		normalizePermissionsMock.mockReturnValueOnce(permissions);
		generateTokenMock.mockReturnValueOnce('jwt-token');
		buildResponseBodyMock.mockReturnValueOnce({ message: 'Authenticated', user: {} });
		withAuthHeaderMock.mockImplementation((res) => res);
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const response = await POST(createRequest(requestBody));

		expect(consoleSpy).toHaveBeenCalledWith('Failed to update lastLogin:', expect.any(Error));
		expect(response.status).toBe(200);
		consoleSpy.mockRestore();
	});

	it('returns 500 when unexpected error occurs', async () => {
		getUserByUsernameMock.mockRejectedValueOnce(new Error('db down'));
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const response = await POST(createRequest(requestBody));

		expect(consoleSpy).toHaveBeenCalledWith('Login error:', expect.any(Error));
		expect(response.status).toBe(500);
		consoleSpy.mockRestore();
	});
});
