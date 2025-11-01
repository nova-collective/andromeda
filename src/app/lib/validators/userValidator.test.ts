import { describe, expect, it, beforeEach, vi } from 'vitest';

const { isBcryptHashMock } = vi.hoisted(() => ({
	isBcryptHashMock: vi.fn<(value: string) => boolean>(),
}));

vi.mock('@/app/lib/utils', async () => ({
	__esModule: true,
	...await vi.importActual('../utils'),
}));

vi.mock('@/app/lib/utils/passwordUtil', () => ({
	__esModule: true,
	isBcryptHash: isBcryptHashMock,
}));

vi.mock('@/app/lib/validators', async () => {
	const { permissionSchema } = await vi.importActual('./permissionsValidator');
	return {
		__esModule: true,
		permissionSchema,
	};
});

import {
	ensureCreateUserUniqueness,
	ensureUpdateUserUniqueness,
	upsertUserSchema,
	updateUserSchema,
	validateUpsertUser,
	validateUpdateUser,
} from './userValidator';

const buildPermission = () => ({
	name: 'UserAdmin',
	description: 'Manage users',
	crud: { read: true, create: false, update: false, delete: false },
});

const validWallet = `0x${'a'.repeat(40)}`;
const hashedPassword = '$2b$10$123456789012345678901uVz4PXqYvWqg2RB5R7BsN0xgPRgdJZK';

describe('userValidator', () => {
	beforeEach(() => {
		isBcryptHashMock.mockReset();
		isBcryptHashMock.mockImplementation((value: string) => value.startsWith('$2'));
	});

	describe('upsertUserSchema', () => {
		it('accepts valid payloads and strips unknown fields', () => {
			const payload = {
				walletAddress: validWallet,
				username: 'valid.user',
				email: 'user@example.com',
				password: 'Str0ng!Pass1',
				permissions: [buildPermission()],
				settings: { theme: 'dark', notifications: true },
				lastLogin: new Date('2024-01-01T00:00:00Z'),
				extra: 'remove me',
			};

			const { error, value } = upsertUserSchema.validate(payload);

			expect(error).toBeUndefined();
			expect(value.extra).toBeUndefined();
			expect(value.walletAddress).toBe(validWallet);
		});

		it('accepts bcrypt hashes without enforcing strength pattern', () => {
			const { error, value } = upsertUserSchema.validate({
				walletAddress: validWallet,
				password: hashedPassword,
			});

			expect(error).toBeUndefined();
			expect(isBcryptHashMock).toHaveBeenCalledWith(hashedPassword);
			expect(value.password).toBe(hashedPassword);
		});

		it('collects validation errors for malformed fields', () => {
			const { error } = upsertUserSchema.validate({
				walletAddress: 'bad wallet',
				username: 'ab',
				email: 'not-an-email',
				password: 'weak',
			});

			expect(error).toBeDefined();
			const messages = error?.details.map(detail => detail.message) ?? [];
			expect(messages).toEqual(expect.arrayContaining([
				'Wallet address must be a valid 0x address or alphanumeric identifier.',
				'Username must be 3-32 characters and contain only letters, numbers, or ._-.',
				'Email must be a valid email address.',
				'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
			]));
		});
	});

	describe('updateUserSchema', () => {
		it('requires an id for updates', () => {
			const { error } = updateUserSchema.validate({ walletAddress: validWallet });

			expect(error).toBeDefined();
			const messages = error?.details.map(detail => detail.message) ?? [];
			expect(messages.some(message => message.includes('id'))).toBe(true);
		});

		it('accepts partial updates and preserves bcrypt hashes', () => {
			const { error, value } = updateUserSchema.validate({
				id: '507f1f77bcf86cd799439012',
				password: hashedPassword,
				lastLogin: new Date('2024-02-02T00:00:00Z'),
			});

			expect(error).toBeUndefined();
			expect(value.id).toBe('507f1f77bcf86cd799439012');
			expect(value.password).toBe(hashedPassword);
		});
	});

	describe('validate helpers', () => {
		it('validateUpsertUser delegates to schema', () => {
			const result = validateUpsertUser({
				walletAddress: validWallet,
				username: 'valid.user',
				password: 'Str0ng!Pass1',
			});

			expect(result.error).toBeUndefined();
		});

		it('validateUpdateUser delegates to schema', () => {
			const result = validateUpdateUser({
				id: '507f1f77bcf86cd799439012',
				username: 'new.username',
			});

			expect(result.error).toBeUndefined();
		});
	});

	describe('ensureCreateUserUniqueness', () => {
		it('returns null when all identifiers are unique', async () => {
			const service = {
				getUserByWalletAddress: vi.fn().mockResolvedValue(null),
				getUserByUsername: vi.fn().mockResolvedValue(null),
				getUserByEmail: vi.fn().mockResolvedValue(null),
			};

			await expect(ensureCreateUserUniqueness(service, {
				walletAddress: validWallet,
				username: 'unique.user',
				email: 'unique@example.com',
			})).resolves.toBeNull();

			expect(service.getUserByWalletAddress).toHaveBeenCalledWith(validWallet);
			expect(service.getUserByUsername).toHaveBeenCalledWith('unique.user');
			expect(service.getUserByEmail).toHaveBeenCalledWith('unique@example.com');
		});

		it('permits matching ids across wallet, username, and email', async () => {
			const service = {
				getUserByWalletAddress: vi.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011' }),
				getUserByUsername: vi.fn().mockResolvedValue({ id: '507f1f77bcf86cd799439011' }),
				getUserByEmail: vi.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011' }),
			};

			await expect(ensureCreateUserUniqueness(service, {
				walletAddress: validWallet,
				username: 'existing.user',
				email: 'existing@example.com',
			})).resolves.toBeNull();
		});

		it('returns error when username belongs to another user', async () => {
			const service = {
				getUserByWalletAddress: vi.fn().mockResolvedValue(null),
				getUserByUsername: vi.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439012' }),
				getUserByEmail: vi.fn().mockResolvedValue(null),
			};

			await expect(ensureCreateUserUniqueness(service, {
				walletAddress: validWallet,
				username: 'taken.user',
			})).resolves.toBe('Username must be unique');
		});

		it('returns error when email belongs to another user', async () => {
			const service = {
				getUserByWalletAddress: vi.fn().mockResolvedValue(null),
				getUserByUsername: vi.fn().mockResolvedValue(null),
				getUserByEmail: vi.fn().mockResolvedValue({ id: '507f1f77bcf86cd799439013' }),
			};

			await expect(ensureCreateUserUniqueness(service, {
				walletAddress: validWallet,
				email: 'taken@example.com',
			})).resolves.toBe('Email must be unique');
		});

		it('skips wallet lookup when service does not implement it', async () => {
			const service = {
				getUserByUsername: vi.fn().mockResolvedValue(null),
				getUserByEmail: vi.fn().mockResolvedValue(null),
			};

			await expect(ensureCreateUserUniqueness(service, {
				walletAddress: validWallet,
				username: 'optional-wallet',
			})).resolves.toBeNull();
		});
	});

	describe('ensureUpdateUserUniqueness', () => {
		it('returns null when no username or email provided', async () => {
			const service = {
				getUserByUsername: vi.fn(),
				getUserByEmail: vi.fn(),
			};

			await expect(ensureUpdateUserUniqueness(service, '507f1f77bcf86cd799439011', {})).resolves.toBeNull();
			expect(service.getUserByUsername).not.toHaveBeenCalled();
			expect(service.getUserByEmail).not.toHaveBeenCalled();
		});

		it('allows username when it belongs to the same user', async () => {
			const service = {
				getUserByUsername: vi.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011' }),
				getUserByEmail: vi.fn(),
			};

			await expect(ensureUpdateUserUniqueness(service, '507f1f77bcf86cd799439011', {
				username: 'current.user',
			})).resolves.toBeNull();
		});

		it('returns error when username taken by another user', async () => {
			const service = {
				getUserByUsername: vi.fn().mockResolvedValue({ id: '507f1f77bcf86cd799439015' }),
				getUserByEmail: vi.fn(),
			};

			await expect(ensureUpdateUserUniqueness(service, '507f1f77bcf86cd799439011', {
				username: 'taken.user',
			})).resolves.toBe('Username must be unique');
		});

		it('returns error when email taken by another user', async () => {
			const service = {
				getUserByUsername: vi.fn(),
				getUserByEmail: vi.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439016' }),
			};

			await expect(ensureUpdateUserUniqueness(service, '507f1f77bcf86cd799439011', {
				email: 'taken@example.com',
			})).resolves.toBe('Email must be unique');
		});
	});
});
