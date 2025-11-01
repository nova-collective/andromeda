import type { NextApiResponse } from 'next';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ORIGINAL_JWT_SECRET = process.env.JWT_SECRET;

/**
 * Create a lightweight mock that captures headers written by auth helpers.
 */
const createMockResponse = () => {
	const headers: Record<string, unknown> = {};
	return {
		headers,
		setHeader(name: string, value: unknown) {
			headers[name] = value;
				return this;
		},
	};
};

beforeEach(() => {
	vi.resetModules();
	process.env.JWT_SECRET = 'unit-test-secret';
});

afterEach(() => {
	if (typeof ORIGINAL_JWT_SECRET === 'undefined') {
		delete process.env.JWT_SECRET;
	} else {
		process.env.JWT_SECRET = ORIGINAL_JWT_SECRET;
	}
	vi.restoreAllMocks();
});

describe('auth helpers', () => {
	it('generates a JWT that verifies back to the original payload', async () => {
		const { generateToken, verifyToken } = await import('./auth');

		const payload = {
			userId: 'user-123',
			username: 'alice',
			groups: ['admin'],
			permissions: [],
		};

		const token = generateToken(payload);
		expect(typeof token).toBe('string');
		expect(token.length).toBeGreaterThan(0);

		const decoded = verifyToken(token);
		expect(decoded).not.toBeNull();
		expect(decoded).toMatchObject({
			userId: payload.userId,
			username: payload.username,
			groups: payload.groups,
			permissions: payload.permissions,
		});
	});

	it('returns null and logs a warning when verification fails', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const { verifyToken } = await import('./auth');

		const result = verifyToken('totally.invalid.token');
		expect(result).toBeNull();
		expect(warnSpy).toHaveBeenCalled();
	});

	it('writes the auth cookie with expected directives', async () => {
		const { setTokenCookie, TOKEN_MAX_AGE_SECONDS } = await import('./auth');
		const response = createMockResponse();

		setTokenCookie(response as unknown as NextApiResponse, 'signed-token');

		const header = response.headers['Set-Cookie'];
		expect(Array.isArray(header)).toBe(true);
		const cookie = (header as string[])[0];
		expect(cookie).toContain('token=signed-token');
		expect(cookie).toContain('HttpOnly');
		expect(cookie).toContain('SameSite=Strict');
		expect(cookie).toContain(`Max-Age=${TOKEN_MAX_AGE_SECONDS}`);
		if (process.env.NODE_ENV !== 'production') {
			expect(cookie).not.toContain('Secure');
		}
	});

	it('clears the auth cookie by setting an expired value', async () => {
		const { clearTokenCookie } = await import('./auth');
		const response = createMockResponse();

		clearTokenCookie(response as unknown as NextApiResponse);

		const header = response.headers['Set-Cookie'];
		expect(Array.isArray(header)).toBe(true);
		const cookie = (header as string[])[0];
		expect(cookie).toContain('token=;');
		expect(cookie).toContain('Expires=Thu, 01 Jan 1970 00:00:00 GMT');
	});
});
