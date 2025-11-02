import type { NextApiResponse } from 'next';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ORIGINAL_JWT_SECRET = process.env.JWT_SECRET;
const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

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

const setNodeEnv = (value?: string) => {
	const envVars = process.env as Record<string, string | undefined>;
	if (typeof value === 'undefined') {
		delete envVars.NODE_ENV;
	} else {
		envVars.NODE_ENV = value;
	}
};

beforeEach(() => {
	vi.resetModules();
	vi.doUnmock('../config');
	process.env.JWT_SECRET = 'unit-test-secret';
	setNodeEnv('test');
});

afterEach(() => {
	if (typeof ORIGINAL_JWT_SECRET === 'undefined') {
		delete process.env.JWT_SECRET;
	} else {
		process.env.JWT_SECRET = ORIGINAL_JWT_SECRET;
	}
	setNodeEnv(ORIGINAL_NODE_ENV);
	vi.restoreAllMocks();
});

describe('auth helpers', () => {
	it('computes TOKEN_MAX_AGE_SECONDS from TOKEN_EXPIRATION units', async () => {
		vi.doMock('../config', () => ({
			TOKEN_EXPIRATION: '2h',
		}));
		const { TOKEN_MAX_AGE_SECONDS } = await import('./auth');
		expect(TOKEN_MAX_AGE_SECONDS).toBe(2 * 60 * 60);
	});

	it('falls back to default max age when expiration value is invalid', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.doMock('../config', () => ({
			TOKEN_EXPIRATION: 'not-a-duration',
		}));
		const { TOKEN_MAX_AGE_SECONDS } = await import('./auth');
		expect(TOKEN_MAX_AGE_SECONDS).toBe(60 * 60 * 24 * 7);
		expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid token expiration value'));
	});

	it('falls back to default max age when expiration is non-positive', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.doMock('../config', () => ({
			TOKEN_EXPIRATION: '0h',
		}));
		const { TOKEN_MAX_AGE_SECONDS } = await import('./auth');
		expect(TOKEN_MAX_AGE_SECONDS).toBe(60 * 60 * 24 * 7);
		expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Non-positive or non-numeric token expiration value'));
	});

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

	it('includes Secure attribute for auth cookies in production', async () => {
		setNodeEnv('production');
		const { setTokenCookie } = await import('./auth');
		const response = createMockResponse();

		setTokenCookie(response as unknown as NextApiResponse, 'prod-token');

		const header = response.headers['Set-Cookie'];
		const cookie = (header as string[])[0];
		expect(cookie).toContain('Secure;');
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
