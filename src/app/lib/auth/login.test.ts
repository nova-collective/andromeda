import type { NextApiRequest, NextApiResponse } from 'next';
import { describe, it, expect, beforeEach, vi } from 'vitest';

type RepoMock = {
	findByUsername: ReturnType<typeof vi.fn>;
	update: ReturnType<typeof vi.fn>;
};

const createRepoMock = (): RepoMock => ({
	findByUsername: vi.fn(),
	update: vi.fn(),
});

let repoMock: RepoMock = createRepoMock();
const repoConstructor = vi.fn(() => repoMock);

vi.mock('../repositories', () => ({
	MongoDBUserRepository: repoConstructor,
}));

const mockGenerateToken = vi.fn();
const mockSetTokenCookie = vi.fn();

vi.mock('./auth', () => ({
	generateToken: mockGenerateToken,
	setTokenCookie: mockSetTokenCookie,
}));

const mockComparePassword = vi.fn();

vi.mock('../utils', () => ({
	comparePassword: mockComparePassword,
}));

const createMockResponse = () => {
	const res: Partial<NextApiResponse> & {
		statusCode?: number;
		jsonPayload?: unknown;
	} = {
		status(code: number) {
			this.statusCode = code;
			return this as NextApiResponse;
		},
		json(payload: unknown) {
			this.jsonPayload = payload;
			return this as NextApiResponse;
		},
		setHeader: vi.fn(),
	};

	return res as NextApiResponse & {
		statusCode?: number;
		jsonPayload?: unknown;
	};
};

const loadHandler = () => import('./login').then(module => module.default);

describe('auth/login handler', () => {
	beforeEach(() => {
		vi.resetModules();
		repoMock = createRepoMock();
		repoConstructor.mockClear();
		repoConstructor.mockImplementation(() => repoMock);
		mockGenerateToken.mockReset();
		mockSetTokenCookie.mockReset();
		mockComparePassword.mockReset();
	});

	it('rejects non-POST methods with 405', async () => {
		const handler = await loadHandler();
		const req = { method: 'GET', body: {} } as unknown as NextApiRequest;
		const res = createMockResponse();

		await handler(req, res);

		expect(res.statusCode).toBe(405);
		expect(res.jsonPayload).toEqual({ message: 'Method not allowed' });
	});

	it('returns 400 when credentials are missing', async () => {
		const handler = await loadHandler();
		const req = { method: 'POST', body: { username: '', password: '' } } as unknown as NextApiRequest;
		const res = createMockResponse();

		await handler(req, res);

		expect(res.statusCode).toBe(400);
		expect(res.jsonPayload).toEqual({ message: 'Username and password are required' });
		expect(repoMock.findByUsername).not.toHaveBeenCalled();
	});

	it('returns 500 when an unexpected error occurs', async () => {
		const error = new Error('database offline');
		repoMock.findByUsername.mockRejectedValueOnce(error);
		const handler = await loadHandler();
		const req = { method: 'POST', body: { username: 'alice', password: 'secret' } } as unknown as NextApiRequest;
		const res = createMockResponse();
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		await handler(req, res);

		expect(errorSpy).toHaveBeenCalled();
		expect(res.statusCode).toBe(500);
		expect(res.jsonPayload).toEqual({ message: 'Internal server error' });

		errorSpy.mockRestore();
	});
});
