import type { NextRequest } from 'next/server';

import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import type { IUser, Permission } from '@/app/lib/types';
import type { ObjectId } from 'mongoose';

const mocks = vi.hoisted(() => {
	const createJsonResponse = (body: unknown, init?: { status?: number }) => ({
		body,
		status: init?.status ?? 200,
		headers: new Headers(),
	});
	return {
		comparePasswordMock: vi.fn(),
		getUserByUsernameMock: vi.fn(),
		updateUserMock: vi.fn(),
		getUserPermissionsMock: vi.fn(),
		generateTokenMock: vi.fn(),
		verifyTokenMock: vi.fn(),
		jsonMock: vi.fn(createJsonResponse),
		createJsonResponse,
	};
});

const {
	comparePasswordMock,
	getUserByUsernameMock,
	updateUserMock,
	getUserPermissionsMock,
	generateTokenMock,
	verifyTokenMock,
	jsonMock,
	createJsonResponse,
} = mocks;

vi.mock('@/app/lib/utils', () => ({
	__esModule: true,
	comparePassword: comparePasswordMock,
}));

vi.mock('@/app/lib/services', () => ({
	__esModule: true,
	UserService: class {
		getUserByUsername = getUserByUsernameMock;
		updateUser = updateUserMock;
		getUserPermissions = getUserPermissionsMock;
	},
}));

vi.mock('@/app/lib/auth/auth', () => ({
	__esModule: true,
	generateToken: generateTokenMock,
	verifyToken: verifyTokenMock,
}));

vi.mock('./guard', () => ({
	__esModule: true,
	extractBearerToken: vi.fn(),
}));

vi.mock('./helpers', async (importOriginal) => {
	const helpers = await importOriginal<typeof import('./helpers')>();
	return {
		__esModule: true,
		...helpers,
		withAuthHeader: vi.fn((response, token) => helpers.withAuthHeader(response, token)),
	};
});

vi.mock('next/server', () => ({
	__esModule: true,
	NextRequest: class {},
	NextResponse: { json: jsonMock },
}));

const { POST, GET } = await import('./route');
const { extractBearerToken } = await import('./guard');
const { buildResponseBody, withAuthHeader } = await import('./helpers');
const withAuthHeaderMock = withAuthHeader as unknown as Mock;

type MockedNextRequest = NextRequest & { json: () => Promise<unknown>; headers: Headers };

const createRequest = (options: {
	method?: 'POST' | 'GET';
	body?: unknown;
	headers?: Record<string, string>;
} = {}): MockedNextRequest => {
	const { body, headers = {} } = options;
	return {
		headers: new Headers(headers),
		json: async () => body,
	} as unknown as MockedNextRequest;
};

const buildUser = (overrides: Partial<IUser> = {}) => ({
	_id: '507f1f77bcf86cd799439011',
	walletAddress: '0x123',
	username: 'nova',
	email: 'nova@example.com',
	password: 'hashed',
	settings: { theme: 'default', notifications: true },
	groups: [
		{ toString: () => 'group-1' } as unknown as ObjectId,
	],
	permissions: [],
	createdAt: new Date('2023-01-01T00:00:00.000Z'),
	lastLogin: new Date('2024-01-01T00:00:00.000Z'),
	...overrides,
}) as unknown as IUser;

const buildPermissions = (): Permission[] => ([
	{ name: 'User', description: 'manage users', crud: { read: true, create: false, update: false, delete: false } },
]);

describe('POST /api/auth', () => {
	beforeEach(() => {
		comparePasswordMock.mockReset();
		getUserByUsernameMock.mockReset();
		updateUserMock.mockReset();
		getUserPermissionsMock.mockReset();
		generateTokenMock.mockReset();
		jsonMock.mockClear();
		withAuthHeaderMock.mockClear();
		jsonMock.mockImplementation(createJsonResponse);
	});

	it('returns 401 when user is not found', async () => {
		getUserByUsernameMock.mockResolvedValueOnce(null);
		const request = createRequest({ body: { username: 'nova', password: 'secret' } });

		const response = await POST(request);

		expect(getUserByUsernameMock).toHaveBeenCalledWith('nova');
		expect(jsonMock).toHaveBeenCalledWith({ message: 'Invalid credentials' }, { status: 401 });
		expect(response.status).toBe(401);
	});

	it('returns 401 when password comparison fails', async () => {
		getUserByUsernameMock.mockResolvedValueOnce(buildUser());
		comparePasswordMock.mockResolvedValueOnce(false);
		const request = createRequest({ body: { username: 'nova', password: 'wrong' } });

		const response = await POST(request);

		expect(comparePasswordMock).toHaveBeenCalledWith('wrong', 'hashed');
		expect(response.status).toBe(401);
	});

	it('returns tokenized payload and updates last login on success', async () => {
		const user = buildUser();
		const permissions = buildPermissions();
		getUserByUsernameMock.mockResolvedValueOnce(user);
		comparePasswordMock.mockResolvedValueOnce(true);
		getUserPermissionsMock.mockResolvedValueOnce(permissions);
		generateTokenMock.mockReturnValueOnce('jwt-token');

		const request = createRequest({ body: { username: 'nova', password: 'secret' } });
		const response = await POST(request);

		expect(getUserPermissionsMock).toHaveBeenCalledWith(String(user._id));
		expect(generateTokenMock).toHaveBeenCalledWith({
			userId: String(user._id),
			username: 'nova',
			groups: ['group-1'],
			permissions,
		});
		expect(updateUserMock).toHaveBeenCalledWith(String(user._id), expect.objectContaining({ lastLogin: expect.any(Date) }));
		expect(withAuthHeaderMock).toHaveBeenCalledWith(expect.objectContaining({ body: expect.anything(), status: 200 }), 'jwt-token');
		expect(response).toEqual(expect.objectContaining({ status: 200 }));
	});

	it('logs and continues when updating last login throws', async () => {
		const user = buildUser();
		getUserByUsernameMock.mockResolvedValueOnce(user);
		comparePasswordMock.mockResolvedValueOnce(true);
		getUserPermissionsMock.mockResolvedValueOnce(buildPermissions());
		generateTokenMock.mockReturnValueOnce('jwt-token');
		updateUserMock.mockRejectedValueOnce(new Error('update failed'));

		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const response = await POST(createRequest({ body: { username: 'nova', password: 'secret' } }));

		expect(consoleSpy).toHaveBeenCalledWith('Failed to update lastLogin:', expect.any(Error));
		expect(response.status).toBe(200);
		consoleSpy.mockRestore();
	});

	it('returns 500 on unexpected errors', async () => {
		const request = createRequest({ body: { username: 'nova', password: 'secret' } });
		getUserByUsernameMock.mockRejectedValueOnce(new Error('db down'));
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const response = await POST(request);

		expect(consoleSpy).toHaveBeenCalledWith('Login error:', expect.any(Error));
		expect(response.status).toBe(500);
		consoleSpy.mockRestore();
	});
});

describe('GET /api/auth', () => {
	const extractBearerTokenMock = extractBearerToken as unknown as Mock;

	beforeEach(() => {
		jsonMock.mockClear();
		extractBearerTokenMock.mockReset();
		verifyTokenMock.mockReset();
		getUserByUsernameMock.mockReset();
		getUserPermissionsMock.mockReset();
		jsonMock.mockImplementation(createJsonResponse);
	});

	it('returns 401 when token is missing', async () => {
		extractBearerTokenMock.mockReturnValueOnce(null);
		const response = await GET(createRequest());

		expect(jsonMock).toHaveBeenCalledWith({ message: 'Not authenticated' }, { status: 401 });
		expect(response.status).toBe(401);
	});

	it('returns 401 when verifyToken fails', async () => {
		extractBearerTokenMock.mockReturnValueOnce('token');
		verifyTokenMock.mockReturnValueOnce(null);

		const response = await GET(createRequest());

		expect(jsonMock).toHaveBeenCalledWith({ message: 'Invalid token' }, { status: 401 });
		expect(response.status).toBe(401);
	});

	it('returns 401 when user is not found', async () => {
		extractBearerTokenMock.mockReturnValueOnce('token');
		verifyTokenMock.mockReturnValueOnce({ username: 'nova' });
		getUserByUsernameMock.mockResolvedValueOnce(null);

		const response = await GET(createRequest());

		expect(jsonMock).toHaveBeenCalledWith({ message: 'User not found' }, { status: 401 });
		expect(response.status).toBe(401);
	});

	it('returns normalized user data when token is valid', async () => {
		extractBearerTokenMock.mockReturnValueOnce('token');
		verifyTokenMock.mockReturnValueOnce({ username: 'nova' });
		const user = buildUser();
		getUserByUsernameMock.mockResolvedValueOnce(user);
		const permissions = buildPermissions();
		getUserPermissionsMock.mockResolvedValueOnce(permissions);

		const response = await GET(createRequest());

		expect(getUserPermissionsMock).toHaveBeenCalledWith(String(user._id));
		expect(response.body).toEqual(buildResponseBody(user, { permissions }));
	});

	it('returns 401 and logs when exceptions occur', async () => {
		extractBearerTokenMock.mockReturnValueOnce('token');
		verifyTokenMock.mockImplementationOnce(() => {
			throw new Error('boom');
		});
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const response = await GET(createRequest());

		expect(consoleSpy).toHaveBeenCalledWith('Auth check error:', expect.any(Error));
		expect(response.status).toBe(401);
		consoleSpy.mockRestore();
	});
});
