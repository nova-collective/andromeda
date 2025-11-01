import { beforeEach, describe, expect, it, vi } from 'vitest';
import bcrypt from 'bcryptjs';
import { comparePassword, hashPassword, isBcryptHash, validatePasswordStrength } from './passwordUtil';

vi.mock('bcryptjs', () => ({
	__esModule: true,
	default: {
		genSalt: vi.fn(),
		hash: vi.fn(),
		compare: vi.fn(),
	},
}));

const mockedBcrypt = vi.mocked(bcrypt, true) as unknown as {
	genSalt: ReturnType<typeof vi.fn>;
	hash: ReturnType<typeof vi.fn>;
	compare: ReturnType<typeof vi.fn>;
};

describe('passwordUtil', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('hashPassword', () => {
		it('hashes password with generated salt', async () => {
			mockedBcrypt.genSalt.mockResolvedValueOnce('salt');
			mockedBcrypt.hash.mockResolvedValueOnce('hashed');

			const result = await hashPassword('secret', 10);

			expect(mockedBcrypt.genSalt).toHaveBeenCalledWith(10);
			expect(mockedBcrypt.hash).toHaveBeenCalledWith('secret', 'salt');
			expect(result).toBe('hashed');
		});

		it('throws when password is missing', async () => {
			await expect(hashPassword(''))
				.rejects.toThrow('Password is required');
		});

		it('wraps underlying hashing errors', async () => {
			mockedBcrypt.genSalt.mockRejectedValueOnce(new Error('boom'));

			await expect(hashPassword('secret')).rejects.toThrow(/Failed to hash password/);
		});
	});

	describe('comparePassword', () => {
		it('returns false when password or hash missing', async () => {
			expect(await comparePassword('', 'hash')).toBe(false);
			expect(await comparePassword('secret', '')).toBe(false);
		});

		it('delegates to bcrypt.compare and returns result', async () => {
			mockedBcrypt.compare.mockResolvedValueOnce(true);

			const result = await comparePassword('secret', 'hash');

			expect(mockedBcrypt.compare).toHaveBeenCalledWith('secret', 'hash');
			expect(result).toBe(true);
		});

		it('returns false and logs on error', async () => {
			const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
			mockedBcrypt.compare.mockRejectedValueOnce(new Error('fail'));

			const result = await comparePassword('secret', 'hash');

			expect(result).toBe(false);
			expect(consoleError).toHaveBeenCalled();
			consoleError.mockRestore();
		});
	});

	describe('isBcryptHash', () => {
		it('returns false for non-string or empty values', () => {
			expect(isBcryptHash('')).toBe(false);
			expect(isBcryptHash(undefined as unknown as string)).toBe(false);
			expect(isBcryptHash(123 as unknown as string)).toBe(false);
		});

		it('recognizes valid bcrypt format', () => {
			const valid = '$2b$12$123456789012345678901uQ7hfvsI6yRaY1oWXKOQG3HjS3X8s5Hm';
			expect(isBcryptHash(valid)).toBe(true);
		});

		it('rejects invalid patterns', () => {
			expect(isBcryptHash('$2a$bad')).toBe(false);
			expect(isBcryptHash('not-hash')).toBe(false);
		});
	});

	describe('validatePasswordStrength', () => {
		it('requires password to be provided', () => {
			expect(validatePasswordStrength('')).toEqual({ isValid: false, error: 'Password is required' });
		});

		it('enforces minimum length', () => {
			expect(validatePasswordStrength('short')).toEqual({
				isValid: false,
				error: 'Password must be at least 8 characters long',
			});
		});

		it('passes strong enough passwords', () => {
			expect(validatePasswordStrength('longenough')).toEqual({ isValid: true });
		});
	});
});
