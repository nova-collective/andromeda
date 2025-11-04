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
		extractBearerTokenMock: vi.fn(),
		verifyTokenMock: vi.fn(),
		getUserByUsernameMock: vi.fn(),
		getUserPermissionsMock: vi.fn(),
		normalizePermissionsMock: vi.fn(),
		buildResponseBodyMock: vi.fn(),
		jsonMock: vi.fn(createJsonResponse),
		createJsonResponse,
	};
});

const {
	extractBearerTokenMock,
	verifyTokenMock,
	getUserByUsernameMock,
	getUserPermissionsMock,
	normalizePermissionsMock,
	buildResponseBodyMock,
	jsonMock,
	createJsonResponse,
} = mocks;

vi.mock('@/app/api/auth/guard', () => ({
	__esModule: true,
	extractBearerToken: extractBearerTokenMock,
}));

vi.mock('@/app/lib/auth/auth', () => ({
	__esModule: true,
	verifyToken: verifyTokenMock,
}));

vi.mock('@/app/lib/services', () => ({
	__esModule: true,
	UserService: class {
		getUserByUsername = getUserByUsernameMock;
		getUserPermissions = getUserPermissionsMock;
	},
}));

vi.mock('../helpers', async () => {
	const original = await import('../helpers');
	return {
		__esModule: true,
		...original,
		normalizePermissions: normalizePermissionsMock,
		buildResponseBody: buildResponseBodyMock,
	};
});

vi.mock('next/server', () => ({
	__esModule: true,
	NextRequest: class {},
	NextResponse: { json: jsonMock },
}));

const meRoute = await import('./route');
const { GET } = meRoute;

type MockedRequest = NextRequest & { headers: Headers };

const createRequest = (): MockedRequest => ({
	headers: new Headers(),
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

describe('GET /api/auth/me', () => {
	const extractMock = extractBearerTokenMock as unknown as Mock;
	const verifyMock = verifyTokenMock as unknown as Mock;

	beforeEach(() => {
		extractMock.mockReset();
		verifyMock.mockReset();
		getUserByUsernameMock.mockReset();
		getUserPermissionsMock.mockReset();
		normalizePermissionsMock.mockReset();
		buildResponseBodyMock.mockReset();
		jsonMock.mockReset();
		jsonMock.mockImplementation(createJsonResponse);
	});

	it('returns 401 when token is missing', async () => {
		extractMock.mockReturnValueOnce(null);

		const response = await GET(createRequest());

		expect(jsonMock).toHaveBeenCalledWith({ message: 'Not authenticated' }, { status: 401 });
		expect(response.status).toBe(401);
	});

	it('returns 401 when token verification fails', async () => {
		extractMock.mockReturnValueOnce('token');
		verifyMock.mockReturnValueOnce(null);

		const response = await GET(createRequest());

		expect(jsonMock).toHaveBeenCalledWith({ message: 'Invalid token' }, { status: 401 });
		expect(response.status).toBe(401);
	});

	it('returns 401 when user not found', async () => {
		extractMock.mockReturnValueOnce('token');
		verifyMock.mockReturnValueOnce({ username: 'nova' });
		getUserByUsernameMock.mockResolvedValueOnce(null);

		const response = await GET(createRequest());

		expect(jsonMock).toHaveBeenCalledWith({ message: 'User not found' }, { status: 401 });
		expect(response.status).toBe(401);
	});

	it('returns user data with normalized permissions', async () => {
		extractMock.mockReturnValueOnce('token');
		verifyMock.mockReturnValueOnce({ username: 'nova' });
		const user = buildUser();
		getUserByUsernameMock.mockResolvedValueOnce(user);
		const permissions = buildPermissions();
		getUserPermissionsMock.mockResolvedValueOnce(permissions);
		normalizePermissionsMock.mockReturnValueOnce(permissions);
		const responsePayload = { message: 'Authenticated', user: { username: 'nova' } };
		buildResponseBodyMock.mockReturnValueOnce(responsePayload);

		const response = await GET(createRequest());

		expect(getUserPermissionsMock).toHaveBeenCalledWith(String(user._id));
		expect(buildResponseBodyMock).toHaveBeenCalledWith(user, { permissions });
		expect(response.body).toEqual(responsePayload);
	});

	it('returns 401 when exception occurs', async () => {
		extractMock.mockImplementationOnce(() => {
			throw new Error('boom');
		});
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const response = await GET(createRequest());

		expect(consoleSpy).toHaveBeenCalledWith('Auth check error:', expect.any(Error));
		expect(response.status).toBe(401);
		consoleSpy.mockRestore();
	});
});
