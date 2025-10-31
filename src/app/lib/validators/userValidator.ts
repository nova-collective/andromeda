import Joi from 'joi';
import { isBcryptHash } from '@/app/lib/utils/password';
import {
	objectIdPattern,
	usernamePattern,
	emailPattern,
	passwordPattern,
	walletPattern,
} from '@/app/lib/utils';
import { permissionSchema } from '@/app/lib/validators';

const settingsSchema = Joi.object({
	theme: Joi.string().trim(),
	notifications: Joi.boolean(),
}).optional();

const usernameSchema = Joi.string()
	.trim()
	.pattern(usernamePattern)
	.messages({ 'string.pattern.base': 'Username must be 3-32 characters and contain only letters, numbers, or ._-.' });

const emailSchema = Joi.string()
	.trim()
	.pattern(emailPattern)
	.messages({ 'string.pattern.base': 'Email must be a valid email address.' });

const passwordSchema = Joi.string()
	.trim()
	.custom((value, helpers) => {
		if (isBcryptHash(value)) {
			return value;
		}
		if (!passwordPattern.test(value)) {
			return helpers.error('string.pattern.base', {
				value,
				name: 'password',
			});
		}
		return value;
	}, 'password strength validation')
	.messages({ 'string.pattern.base': 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.' });

const baseUserFields = {
	username: usernameSchema,
	email: emailSchema,
	password: passwordSchema,
	groups: Joi.array().items(Joi.string().trim().pattern(objectIdPattern)).optional(),
	permissions: Joi.array().items(permissionSchema).optional(),
	settings: settingsSchema,
	lastLogin: Joi.date(),
};

export const upsertUserSchema = Joi.object({
	walletAddress: Joi.string()
		.trim()
		.pattern(walletPattern)
		.required()
		.messages({ 'string.pattern.base': 'Wallet address must be a valid 0x address or alphanumeric identifier.' }),
	...baseUserFields,
}).prefs({ abortEarly: false, stripUnknown: true });

export const updateUserSchema = Joi.object({
	id: Joi.string().trim().pattern(objectIdPattern).required(),
	walletAddress: Joi.string()
		.trim()
		.pattern(walletPattern)
		.messages({ 'string.pattern.base': 'Wallet address must be a valid 0x address or alphanumeric identifier.' }),
	...baseUserFields,
}).prefs({ abortEarly: false, stripUnknown: true });

export function validateUpsertUser(input: unknown) {
	return upsertUserSchema.validate(input);
}

export function validateUpdateUser(input: unknown) {
	return updateUserSchema.validate(input);
}

type UserIdentifier = { _id?: unknown; id?: unknown } | null | undefined;

const resolveUserId = (user: UserIdentifier): string | null => {
	if (!user || typeof user !== 'object') {
		return null;
	}

	if ('_id' in user && user._id != null) {
		return String(user._id);
	}

	if ('id' in user && user.id != null) {
		return String(user.id);
	}

	return null;
};

export interface UserLookupService {
	getUserByUsername(username: string): Promise<UserIdentifier>;
	getUserByEmail(email: string): Promise<UserIdentifier>;
	getUserByWalletAddress?(walletAddress: string): Promise<UserIdentifier>;
}

interface CreateUserPayload {
	walletAddress: string;
	username?: string;
	email?: string;
}

export async function ensureCreateUserUniqueness(
	service: UserLookupService,
	payload: CreateUserPayload,
): Promise<string | null> {
	const { walletAddress, username, email } = payload;

	const existingByWallet = walletAddress && service.getUserByWalletAddress
		? await service.getUserByWalletAddress(walletAddress)
		: null;
	const walletId = resolveUserId(existingByWallet);

	if (username) {
		const existingByUsername = await service.getUserByUsername(username);
		const usernameId = resolveUserId(existingByUsername);
		if (usernameId && usernameId !== walletId) {
			return 'Username must be unique';
		}
	}

	if (email) {
		const existingByEmail = await service.getUserByEmail(email);
		const emailId = resolveUserId(existingByEmail);
		if (emailId && emailId !== walletId) {
			return 'Email must be unique';
		}
	}

	return null;
}

interface UpdateUserPayload {
	username?: string;
	email?: string;
}

export async function ensureUpdateUserUniqueness(
	service: UserLookupService,
	id: string,
	payload: UpdateUserPayload,
): Promise<string | null> {
	const normalizedId = String(id);

	if (payload.username) {
		const existing = await service.getUserByUsername(payload.username);
		const existingId = resolveUserId(existing);
		if (existingId && existingId !== normalizedId) {
			return 'Username must be unique';
		}
	}

	if (payload.email) {
		const existing = await service.getUserByEmail(payload.email);
		const existingId = resolveUserId(existing);
		if (existingId && existingId !== normalizedId) {
			return 'Email must be unique';
		}
	}

	return null;
}
