import type { NextRequest } from 'next/server';

import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import type { IUser } from '@/app/lib/types';

import type { ObjectId } from 'mongoose';

const mocks = vi.hoisted(() => {
	const createJsonResponse = (body: unknown, init?: { status?: number }) => ({
		body,
		status: init?.status ?? 200,
		headers: new Headers(),
	});
	return {
		authorizeRequestMock: vi.fn(),
		getUserByIdMock: vi.fn(),
		getUserByWalletMock: vi.fn(),
		getAllUsersMock: vi.fn(),
		upsertUserMock: vi.fn(),
		updateUserMock: vi.fn(),
		deleteUserMock: vi.fn(),
		hashPasswordMock: vi.fn(),
		isBcryptHashMock: vi.fn(),
		validateRequestBodyMock: vi.fn(),
		validateUpsertUserMock: vi.fn(),
		validateUpdateUserMock: vi.fn(),
		ensureCreateUserUniquenessMock: vi.fn(),
		ensureUpdateUserUniquenessMock: vi.fn(),
		jsonMock: vi.fn(createJsonResponse),
		createJsonResponse,
	};
});

const {
	authorizeRequestMock,
	getUserByIdMock,
	getUserByWalletMock,
	getAllUsersMock,
	upsertUserMock,
	updateUserMock,
	deleteUserMock,
	hashPasswordMock,
	isBcryptHashMock,
	validateRequestBodyMock,
	validateUpsertUserMock,
	validateUpdateUserMock,
	ensureCreateUserUniquenessMock,
	ensureUpdateUserUniquenessMock,
	jsonMock,
	createJsonResponse,
} = mocks;

vi.mock('@/app/api/auth/guard', () => ({
	__esModule: true,
	authorizeRequest: authorizeRequestMock,
}));

vi.mock('@/app/lib/services', () => ({
	__esModule: true,
	UserService: class {
		getUserById = getUserByIdMock;
		getUserByWalletAddress = getUserByWalletMock;
		getAllUsers = getAllUsersMock;
		upsertUser = upsertUserMock;
		updateUser = updateUserMock;
		deleteUser = deleteUserMock;
		getUserByUsername = vi.fn();
		getUserByEmail = vi.fn();
		getUserPermissions = vi.fn();
	},
}));

vi.mock('@/app/lib/utils/passwordUtil', () => ({
	__esModule: true,
	hashPassword: hashPasswordMock,
	isBcryptHash: isBcryptHashMock,
}));

vi.mock('@/app/lib/validators', async () => {
	const validators = await import('@/app/lib/validators');
	return {
		__esModule: true,
		...validators,
		validateUpsertUser: validateUpsertUserMock,
		validateUpdateUser: validateUpdateUserMock,
		validateRequestBody: validateRequestBodyMock,
		ensureCreateUserUniqueness: ensureCreateUserUniquenessMock,
		ensureUpdateUserUniqueness: ensureUpdateUserUniquenessMock,
	};
});

vi.mock('next/server', () => ({
	__esModule: true,
	NextRequest: class {},
	NextResponse: { json: jsonMock },
}));

const usersRoute = await import('./route');
const { GET, POST, PUT, DELETE } = usersRoute;

type MockedNextRequest = NextRequest & { json: () => Promise<unknown>; headers: Headers; url: string };

const createRequest = (options: {
	url?: string;
	body?: unknown;
	headers?: Record<string, string>;
} = {}): MockedNextRequest => {
	const { url = 'https://example.com/api/users', body, headers = {} } = options;
	return {
		url,
		headers: new Headers(headers),
		json: () => Promise.resolve(body),
	} as unknown as MockedNextRequest;
};

const buildUser = (overrides: Partial<IUser> = {}) => ({
	_id: '507f1f77bcf86cd799439011',
	walletAddress: '0xabc',
	username: 'nova',
	email: 'nova@example.com',
	password: '$2b$10$abcdef',
	settings: { theme: 'default', notifications: true },
	createdAt: new Date('2023-01-01T00:00:00.000Z'),
	lastLogin: new Date('2024-01-01T00:00:00.000Z'),
	groups: [{ toString: () => 'group-1' } as unknown as ObjectId],
	permissions: [],
	...overrides,
}) as unknown as IUser;

const authDenied = (status: number, message: string) => ({
	ok: false,
	response: jsonMock({ error: message }, { status }),
});

const authGranted = () => ({ ok: true, payload: { userId: '1' } });

describe('GET /api/users', () => {
	const authorizeMock = authorizeRequestMock as unknown as Mock;

	beforeEach(() => {
		authorizeMock.mockReset();
		getUserByIdMock.mockReset();
		getUserByWalletMock.mockReset();
		getAllUsersMock.mockReset();
		jsonMock.mockReset();
		jsonMock.mockImplementation(createJsonResponse);
	});

	it('returns auth response when authorization fails', async () => {
		authorizeMock.mockReturnValueOnce(authDenied(401, 'Forbidden'));
		const response = await GET(createRequest());

		expect(response.status).toBe(401);
		expect(jsonMock).toHaveBeenCalledTimes(1);
	});

	it('fetches user by id when query includes id', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		const user = buildUser();
		getUserByIdMock.mockResolvedValueOnce(user);

		const response = await GET(createRequest({ url: 'https://example.com/api/users?id=123' }));

		expect(getUserByIdMock).toHaveBeenCalledWith('123');
		expect(response.body).toEqual({
			success: true,
			message: 'User retrieved successfully',
			user,
		});
	});

	it('returns 404 when user by id is missing', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		getUserByIdMock.mockResolvedValueOnce(null);

		const response = await GET(createRequest({ url: 'https://example.com/api/users?id=missing' }));

		expect(response.status).toBe(404);
		const lastCall = jsonMock.mock.calls.at(-1);
		expect(lastCall?.[0]).toEqual({ error: 'User not found' });
	});

	it('fetches user by walletAddress and returns even when null', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		getUserByWalletMock.mockResolvedValueOnce(null);

		const response = await GET(createRequest({ url: 'https://example.com/api/users?walletAddress=0xabc' }));

		expect(getUserByWalletMock).toHaveBeenCalledWith('0xabc');
		expect(response.body).toEqual({
			success: true,
			message: 'User retrieved successfully',
			user: null,
		});
	});

	it('lists all users when no query filters provided', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		const users = [buildUser({ _id: '1' as unknown as ObjectId })];
		getAllUsersMock.mockResolvedValueOnce(users as unknown as IUser[]);

		const response = await GET(createRequest());

		expect(getAllUsersMock).toHaveBeenCalledTimes(1);
		expect(response.body).toEqual({
			success: true,
			message: 'Users retrieved successfully',
			users,
		});
	});

	it('returns 500 when fetching users throws', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		getAllUsersMock.mockRejectedValueOnce(new Error('boom'));

		const response = await GET(createRequest());

		expect(response.status).toBe(500);
	});
});

describe('POST /api/users', () => {
	const authorizeMock = authorizeRequestMock as unknown as Mock;
	const validateMock = validateRequestBodyMock as unknown as Mock;

	beforeEach(() => {
		authorizeMock.mockReset();
		validateMock.mockReset();
		validateUpsertUserMock.mockReset();
		validateRequestBodyMock.mockReset();
		ensureCreateUserUniquenessMock.mockReset();
		hashPasswordMock.mockReset();
		isBcryptHashMock.mockReset();
		upsertUserMock.mockReset();
		jsonMock.mockReset();
		jsonMock.mockImplementation(createJsonResponse);
	});

	it('returns auth error when not authorized', async () => {
		authorizeMock.mockReturnValueOnce(authDenied(403, 'Forbidden'));

		const response = await POST(createRequest({ body: {} }));

		expect(response.status).toBe(403);
	});

	it('returns validation error when body fails schema', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ errorResponse: jsonMock({ error: 'Invalid' }, { status: 400 }) });

		const response = await POST(createRequest({ body: {} }));

		expect(validateMock).toHaveBeenCalled();
		expect(response.status).toBe(400);
	});

	it('hashes password when not bcrypt hash and creates user', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ value: { walletAddress: '0xabc', password: 'PlainPass!' } });
		isBcryptHashMock.mockReturnValueOnce(false);
		hashPasswordMock.mockResolvedValueOnce('hashed-pass');
		ensureCreateUserUniquenessMock.mockResolvedValueOnce(null);
		const user = buildUser();
		upsertUserMock.mockResolvedValueOnce(user);

		const response = await POST(createRequest({ body: {} }));

		expect(hashPasswordMock).toHaveBeenCalledWith('PlainPass!');
		expect(upsertUserMock).toHaveBeenCalledWith('0xabc', expect.objectContaining({ password: 'hashed-pass' }));
		expect(response.body).toEqual({
			success: true,
			message: 'User created/updated successfully',
			user,
		});
	});

	it('skips hashing when password already hashed', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ value: { walletAddress: '0xabc', password: '$2b$hashed' } });
		isBcryptHashMock.mockReturnValueOnce(true);
		ensureCreateUserUniquenessMock.mockResolvedValueOnce(null);
		upsertUserMock.mockResolvedValueOnce(buildUser());

		await POST(createRequest({ body: {} }));

		expect(hashPasswordMock).not.toHaveBeenCalled();
	});

	it('returns 400 when uniqueness check fails', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ value: { walletAddress: '0xabc' } });
		ensureCreateUserUniquenessMock.mockResolvedValueOnce('Username must be unique');

		const response = await POST(createRequest({ body: {} }));

		expect(response.status).toBe(400);
	});

	it('propagates known uniqueness errors from service', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ value: { walletAddress: '0xabc' } });
		ensureCreateUserUniquenessMock.mockResolvedValueOnce(null);
		upsertUserMock.mockRejectedValueOnce(new Error('Username must be unique'));

		const response = await POST(createRequest({ body: {} }));

		expect(response.status).toBe(400);
	});

	it('returns 500 on unexpected errors', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ value: { walletAddress: '0xabc' } });
		ensureCreateUserUniquenessMock.mockResolvedValueOnce(null);
		upsertUserMock.mockRejectedValueOnce(new Error('db down'));

		const response = await POST(createRequest({ body: {} }));

		expect(response.status).toBe(500);
	});
});

describe('PUT /api/users', () => {
	const authorizeMock = authorizeRequestMock as unknown as Mock;
	const validateMock = validateRequestBodyMock as unknown as Mock;

	beforeEach(() => {
		authorizeMock.mockReset();
		validateMock.mockReset();
		validateUpdateUserMock.mockReset();
		ensureUpdateUserUniquenessMock.mockReset();
		hashPasswordMock.mockReset();
		isBcryptHashMock.mockReset();
		updateUserMock.mockReset();
		jsonMock.mockReset();
		jsonMock.mockImplementation(createJsonResponse);
	});

	it('returns auth error when unauthorized', async () => {
		authorizeMock.mockReturnValueOnce(authDenied(403, 'Forbidden'));

		const response = await PUT(createRequest({ body: {} }));

		expect(response.status).toBe(403);
	});

	it('returns validation error when schema fails', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ errorResponse: jsonMock({ error: 'Invalid' }, { status: 400 }) });

		const response = await PUT(createRequest({ body: {} }));

		expect(response.status).toBe(400);
	});

	it('hashes password update and returns updated user', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ value: { id: '507f1f77bcf86cd799439011', password: 'Plain123!' } });
		isBcryptHashMock.mockReturnValueOnce(false);
		hashPasswordMock.mockResolvedValueOnce('hashed-pass');
		ensureUpdateUserUniquenessMock.mockResolvedValueOnce(null);
		const user = buildUser();
		updateUserMock.mockResolvedValueOnce(user);

		const response = await PUT(createRequest({ body: {} }));

		expect(hashPasswordMock).toHaveBeenCalledWith('Plain123!');
		expect(updateUserMock).toHaveBeenCalledWith('507f1f77bcf86cd799439011', expect.objectContaining({ password: 'hashed-pass' }));
		expect(response.body).toEqual({
			success: true,
			message: 'User updated successfully',
			user,
		});
	});

	it('returns 400 when uniqueness check fails', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ value: { id: '1' } });
		ensureUpdateUserUniquenessMock.mockResolvedValueOnce('Email must be unique');

		const response = await PUT(createRequest({ body: {} }));

		expect(response.status).toBe(400);
	});

	it('returns 404 when user not found', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ value: { id: '1' } });
		ensureUpdateUserUniquenessMock.mockResolvedValueOnce(null);
		updateUserMock.mockResolvedValueOnce(null);

		const response = await PUT(createRequest({ body: {} }));

		expect(response.status).toBe(404);
	});

	it('propagates known uniqueness errors from service', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ value: { id: '1' } });
		ensureUpdateUserUniquenessMock.mockResolvedValueOnce(null);
		updateUserMock.mockRejectedValueOnce(new Error('Username must be unique'));

		const response = await PUT(createRequest({ body: {} }));

		expect(response.status).toBe(400);
	});

	it('returns 500 on unexpected errors', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		validateMock.mockReturnValueOnce({ value: { id: '1' } });
		ensureUpdateUserUniquenessMock.mockResolvedValueOnce(null);
		updateUserMock.mockRejectedValueOnce(new Error('db down'));

		const response = await PUT(createRequest({ body: {} }));

		expect(response.status).toBe(500);
	});
});

describe('DELETE /api/users', () => {
	const authorizeMock = authorizeRequestMock as unknown as Mock;

	beforeEach(() => {
		authorizeMock.mockReset();
		deleteUserMock.mockReset();
		jsonMock.mockReset();
		jsonMock.mockImplementation(createJsonResponse);
	});

	it('returns auth error when unauthorized', async () => {
		authorizeMock.mockReturnValueOnce(authDenied(403, 'Forbidden'));

		const response = await DELETE(createRequest({ url: 'https://example.com/api/users?id=1' }));

		expect(response.status).toBe(403);
	});

	it('returns 400 when id is missing', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());

		const response = await DELETE(createRequest());

		expect(response.status).toBe(400);
	});

	it('returns 404 when delete returns false', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		deleteUserMock.mockResolvedValueOnce(false);

		const response = await DELETE(createRequest({ url: 'https://example.com/api/users?id=missing' }));

		expect(response.status).toBe(404);
	});

	it('returns success when user deleted', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		deleteUserMock.mockResolvedValueOnce(true);

		const response = await DELETE(createRequest({ url: 'https://example.com/api/users?id=123' }));

		expect(response.body).toEqual({ success: true, message: 'User deleted successfully', userId: '123' });
	});

	it('returns 500 when delete throws', async () => {
		authorizeMock.mockReturnValueOnce(authGranted());
		deleteUserMock.mockRejectedValueOnce(new Error('boom'));

		const response = await DELETE(createRequest({ url: 'https://example.com/api/users?id=1' }));

		expect(response.status).toBe(500);
	});
});
