import { describe, expect, it } from 'vitest';

import { TOKEN_EXPIRATION } from '@/app/lib/config';
import type { IUser, Permission } from '@/app/lib/types';

import { buildResponseBody, normalizePermissions, withAuthHeader } from './helpers';

import type { ApiResponse } from './helpers';


const createUser = (overrides: Partial<IUser> = {}): IUser => {
	const base = {
		_id: '507f1f77bcf86cd799439011',
		walletAddress: '0x123',
		username: 'stellar',
		email: 'stellar@example.com',
		password: 'hashed-secret',
		settings: { theme: 'default', notifications: true },
		permissions: [],
		groups: [
			{ toString: () => 'group-1' },
			{ toString: () => 'group-2' },
		],
		createdAt: new Date('2024-01-01T00:00:00.000Z'),
		lastLogin: new Date('2024-02-02T00:00:00.000Z'),
	};

	return { ...base, ...overrides } as unknown as IUser;
};

describe('buildResponseBody', () => {
	it('returns a login payload with token metadata when token is provided', () => {
		const user = createUser();
		const permissions: Permission[] = [
			{
				name: 'User',
				description: 'manage users',
				crud: { read: true, create: false, update: false, delete: false },
			},
		];

		const result = buildResponseBody(user, { token: 'jwt-token', permissions });

		expect(result).toEqual({
			message: 'Login successful',
			user: {
				id: String(user._id),
				username: 'stellar',
				email: 'stellar@example.com',
				groups: ['group-1', 'group-2'],
				permissions,
				token: 'jwt-token',
				tokenExpiresIn: TOKEN_EXPIRATION,
				lastLogin: user.lastLogin,
			},
		});
	});

	it('falls back to legacy id field and omits token data when token is absent', () => {
		const user = createUser({
			_id: undefined,
			groups: [],
			permissions: [],
		});
		const userWithFallbackId = { ...user, id: 42 } as unknown as IUser;

		const result = buildResponseBody(userWithFallbackId);

		expect(result).toEqual({
			message: 'Authenticated',
			user: {
				id: '42',
				username: 'stellar',
				email: 'stellar@example.com',
				groups: [],
				permissions: [],
				lastLogin: userWithFallbackId.lastLogin,
			},
		});
	});
});

describe('normalizePermissions', () => {
	it('normalizes crud flags to booleans and preserves metadata', () => {
		const rawPermissions = [
			{
				name: 'Group',
				description: 'manage groups',
				crud: {
					read: 1,
					create: 0,
					update: undefined,
					delete: 'yes',
				},
			},
		] as unknown as Permission[];

		const result = normalizePermissions(rawPermissions);

		expect(result).toEqual([
			{
				name: 'Group',
				description: 'manage groups',
				crud: {
					read: true,
					create: false,
					update: false,
					delete: true,
				},
			},
		]);
	});
});

describe('withAuthHeader', () => {
	it('sets the Authorization header and exposes it when none were present', () => {
		const response = { headers: new Headers() } as unknown as ApiResponse;

		const result = withAuthHeader(response, 'token-value');

		expect(result).toBe(response);
		expect(response.headers.get('Authorization')).toBe('Bearer token-value');
		expect(response.headers.get('Access-Control-Expose-Headers')).toBe('Authorization');
	});

	it('appends Authorization to existing exposed headers only once', () => {
		const response = {
			headers: new Headers([
				['Access-Control-Expose-Headers', 'X-Custom, Authorization'],
			]),
		} as unknown as ApiResponse;

		withAuthHeader(response, 'another-token');

		expect(response.headers.get('Authorization')).toBe('Bearer another-token');
		expect(response.headers.get('Access-Control-Expose-Headers')).toBe('X-Custom, Authorization');
	});

	it('preserves existing headers while adding Authorization exposure', () => {
		const response = {
			headers: new Headers([
				['Access-Control-Expose-Headers', 'X-Trace'],
			]),
		} as unknown as ApiResponse;

		withAuthHeader(response, 'sample');

		expect(response.headers.get('Access-Control-Expose-Headers')).toBe('X-Trace, Authorization');
	});
});
