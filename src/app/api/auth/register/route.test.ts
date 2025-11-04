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
		generateTokenMock: vi.fn(),
		getUserByUsernameMock: vi.fn(),
		getUserByEmailMock: vi.fn(),
		getUserPermissionsMock: vi.fn(),
		createUserMock: vi.fn(),
		hashPasswordMock: vi.fn(),
		validatePasswordStrengthMock: vi.fn(),
		withAuthHeaderMock: vi.fn(),
		buildResponseBodyMock: vi.fn(),
		normalizePermissionsMock: vi.fn(),
	};
});

const {
	jsonMock,
	createJsonResponse,
	generateTokenMock,
	getUserByUsernameMock,
	getUserByEmailMock,
	getUserPermissionsMock,
	createUserMock,
	hashPasswordMock,
	validatePasswordStrengthMock,
	withAuthHeaderMock,
	buildResponseBodyMock,
	normalizePermissionsMock,
} = mocks;

vi.mock('@/app/lib/auth/auth', () => ({
	__esModule: true,
	generateToken: generateTokenMock,
}));

vi.mock('@/app/lib/services', () => ({
	__esModule: true,
	UserService: class {
		getUserByUsername = getUserByUsernameMock;
		getUserByEmail = getUserByEmailMock;
		createUser = createUserMock;
		getUserPermissions = getUserPermissionsMock;
	},
}));

vi.mock('@/app/lib/utils', async () => {
	const original = await import('@/app/lib/utils');
	return {
		__esModule: true,
		...original,
		hashPassword: hashPasswordMock,
		validatePasswordStrength: validatePasswordStrengthMock,
	};
});

vi.mock('../helpers', async () => {
	const original = await import('../helpers');
	return {
		__esModule: true,
		...original,
		withAuthHeader: withAuthHeaderMock,
		buildResponseBody: buildResponseBodyMock,
		normalizePermissions: normalizePermissionsMock,
	};
});

vi.mock('next/server', () => ({
	__esModule: true,
	NextRequest: class {},
	NextResponse: { json: jsonMock },
}));

const registerRoute = await import('./route');
const { POST } = registerRoute;

type MockedRequest = NextRequest & { json: () => Promise<unknown>; headers: Headers };

const createRequest = (body: unknown): MockedRequest => ({
	headers: new Headers(),
	json: () => Promise.resolve(body),
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

describe('POST /api/auth/register', () => {
	const requestBody = {
		username: 'nova',
		email: 'nova@example.com',
		password: 'StrongPassw0rd!',
		confirmPassword: 'StrongPassw0rd!',
	};

	beforeEach(() => {
		jsonMock.mockReset();
		jsonMock.mockImplementation(createJsonResponse);
		generateTokenMock.mockReset();
		getUserByUsernameMock.mockReset();
		getUserByEmailMock.mockReset();
		getUserPermissionsMock.mockReset();
		createUserMock.mockReset();
		hashPasswordMock.mockReset();
		validatePasswordStrengthMock.mockReset();
		withAuthHeaderMock.mockReset();
		buildResponseBodyMock.mockReset();
		normalizePermissionsMock.mockReset();
	});

	it('returns 400 when required fields are missing', async () => {
		const response = await POST(createRequest({ username: 'nova' }));

		expect(response.status).toBe(400);
		expect(jsonMock).toHaveBeenCalledWith({ message: 'All fields are required' }, { status: 400 });
	});

	it('returns 400 when passwords do not match', async () => {
		const response = await POST(createRequest({ ...requestBody, confirmPassword: 'Mismatch' }));

		expect(response.status).toBe(400);
		expect(jsonMock).toHaveBeenCalledWith({ message: 'Passwords do not match' }, { status: 400 });
	});

	it('returns 400 when password strength check fails', async () => {
		validatePasswordStrengthMock.mockReturnValueOnce({ isValid: false, error: 'Weak password' });

		const response = await POST(createRequest(requestBody));

		expect(validatePasswordStrengthMock).toHaveBeenCalledWith('StrongPassw0rd!');
		expect(response.status).toBe(400);
	});

	it('returns 400 when username already exists', async () => {
		validatePasswordStrengthMock.mockReturnValueOnce({ isValid: true });
		getUserByUsernameMock.mockResolvedValueOnce(buildUser());

		const response = await POST(createRequest(requestBody));

		expect(getUserByUsernameMock).toHaveBeenCalledWith('nova');
		expect(response.status).toBe(400);
	});

	it('returns 400 when email already exists', async () => {
		validatePasswordStrengthMock.mockReturnValueOnce({ isValid: true });
		getUserByUsernameMock.mockResolvedValueOnce(null);
		getUserByEmailMock.mockResolvedValueOnce(buildUser());

		const response = await POST(createRequest(requestBody));

		expect(getUserByEmailMock).toHaveBeenCalledWith('nova@example.com');
		expect(response.status).toBe(400);
	});

	it('returns 201 with tokenized response on success', async () => {
		const createdUser = buildUser();
		validatePasswordStrengthMock.mockReturnValueOnce({ isValid: true });
		getUserByUsernameMock.mockResolvedValueOnce(null);
		getUserByEmailMock.mockResolvedValueOnce(null);
		hashPasswordMock.mockResolvedValueOnce('$2b$hashed');
		createUserMock.mockResolvedValueOnce(createdUser);
		const permissions = buildPermissions();
		getUserPermissionsMock.mockResolvedValueOnce(permissions);
		normalizePermissionsMock.mockReturnValueOnce(permissions);
		generateTokenMock.mockReturnValueOnce('jwt-token');
		const responseBody = { message: 'Registration successful', user: { token: 'jwt-token' } };
		buildResponseBodyMock.mockReturnValueOnce(responseBody);
		withAuthHeaderMock.mockImplementation((res) => res);

		const response = await POST(createRequest(requestBody));

		expect(hashPasswordMock).toHaveBeenCalledWith('StrongPassw0rd!');
		expect(createUserMock).toHaveBeenCalledWith(expect.objectContaining({ username: 'nova', password: '$2b$hashed' }));
		expect(generateTokenMock).toHaveBeenCalledWith({
			userId: String(createdUser._id),
			username: 'nova',
			groups: ['group-1'],
			permissions,
		});
		expect(withAuthHeaderMock).toHaveBeenCalledWith(expect.objectContaining({ body: responseBody, status: 201 }), 'jwt-token');
		expect(response.status).toBe(201);
	});

	it('returns 500 when an unexpected error occurs', async () => {
		validatePasswordStrengthMock.mockReturnValueOnce({ isValid: true });
		getUserByUsernameMock.mockRejectedValueOnce(new Error('db down'));
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const response = await POST(createRequest(requestBody));

		expect(consoleSpy).toHaveBeenCalledWith('Registration error:', expect.any(Error));
		expect(response.status).toBe(500);
		consoleSpy.mockRestore();
	});
});
