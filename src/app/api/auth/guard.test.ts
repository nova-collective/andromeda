import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const { verifyTokenMock, jsonMock, createResponse } = vi.hoisted(() => {
	const baseResponse = (body: unknown, init?: { status?: number }) => ({
		body,
		status: init?.status ?? 200,
	});
	return {
		verifyTokenMock: vi.fn(),
		jsonMock: vi.fn(baseResponse),
		createResponse: baseResponse,
	};
});

vi.mock('@/app/lib/auth/auth', () => ({
	__esModule: true,
	verifyToken: verifyTokenMock,
}));

vi.mock('next/server', () => ({
	__esModule: true,
	NextRequest: class {},
	NextResponse: {
		json: jsonMock,
	},
}));

import { authorizeRequest, extractBearerToken } from './guard';

const buildRequest = (headers: Record<string, string> = {}): NextRequest => (
	{ headers: new Headers(headers) } as unknown as NextRequest
);

describe('extractBearerToken', () => {
	it('returns token when Authorization header contains a bearer token', () => {
		const request = buildRequest({ Authorization: 'Bearer abc123' });
		expect(extractBearerToken(request)).toBe('abc123');
	});

	it('trims whitespace around the token', () => {
		const request = buildRequest({ Authorization: '  Bearer   token-value  ' });
		expect(extractBearerToken(request)).toBe('token-value');
	});

	it('returns null when header is missing or malformed', () => {
		expect(extractBearerToken(buildRequest())).toBeNull();
		expect(extractBearerToken(buildRequest({ Authorization: 'Basic foo' }))).toBeNull();
	});
});

describe('authorizeRequest', () => {
	beforeEach(() => {
		verifyTokenMock.mockReset();
		jsonMock.mockReset();
		jsonMock.mockImplementation(createResponse);
	});

	it('returns 401 when token is absent', () => {
		const result = authorizeRequest(buildRequest(), 'User', 'read');

		expect(result.ok).toBe(false);
		expect(result).toMatchObject({
			response: { body: { error: 'Authentication required' }, status: 401 },
		});
	});

	it('returns 401 when token verification fails', () => {
		verifyTokenMock.mockReturnValueOnce(null);
		const result = authorizeRequest(buildRequest({ Authorization: 'Bearer invalid' }), 'User', 'read');

		expect(verifyTokenMock).toHaveBeenCalledWith('invalid');
		expect(result).toMatchObject({
			ok: false,
			response: { body: { error: 'Invalid or expired token' }, status: 401 },
		});
	});

	it('returns 403 when payload lacks required permission', () => {
		verifyTokenMock.mockReturnValueOnce({ permissions: [] });
		const result = authorizeRequest(buildRequest({ Authorization: 'Bearer token' }), 'User', 'read');

		expect(result).toMatchObject({
			ok: false,
			response: { body: { error: 'Forbidden' }, status: 403 },
		});
	});

	it('returns 403 when action flag is false on matching permission', () => {
		verifyTokenMock.mockReturnValueOnce({
			permissions: [
				{ name: 'User', crud: { read: false, create: false, update: false, delete: false } },
			],
		});
		const result = authorizeRequest(buildRequest({ Authorization: 'Bearer token' }), 'User', 'read');

		expect(result).toMatchObject({
			ok: false,
			response: { body: { error: 'Forbidden' }, status: 403 },
		});
	});

	it('returns payload when token and permission checks pass', () => {
		const payload = {
			permissions: [
				{ name: 'User', crud: { read: true, create: false, update: false, delete: false } },
			],
		};
		verifyTokenMock.mockReturnValueOnce(payload);
		const result = authorizeRequest(buildRequest({ Authorization: 'Bearer token' }), 'User', 'read');

		expect(result).toEqual({ ok: true, payload });
		expect(jsonMock).not.toHaveBeenCalled();
	});
});
