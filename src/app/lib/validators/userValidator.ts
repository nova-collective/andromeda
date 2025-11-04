import Joi from 'joi';

import {
	objectIdPattern,
	usernamePattern,
	emailPattern,
	passwordPattern,
	walletPattern,
} from '@/app/lib/utils';
import { isBcryptHash } from '@/app/lib/utils/passwordUtil';
import { permissionSchema } from '@/app/lib/validators';

/** Joi schema for optional user settings metadata. */
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
	.custom((value: string, helpers) => {
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

/** Base Joi field definitions shared across user validation schemas. */
const baseUserFields = {
	username: usernameSchema,
	email: emailSchema,
	password: passwordSchema,
	groups: Joi.array().items(Joi.string().trim().pattern(objectIdPattern)).optional(),
	permissions: Joi.array().items(permissionSchema).optional(),
	settings: settingsSchema,
	lastLogin: Joi.date(),
};

/**
 * Joi schema describing the payload for creating or upserting a user.
 * Requires walletAddress while applying shared base field validations.
 */
export const upsertUserSchema = Joi.object({
	walletAddress: Joi.string()
		.trim()
		.pattern(walletPattern)
		.required()
		.messages({ 'string.pattern.base': 'Wallet address must be a valid 0x address or alphanumeric identifier.' }),
	...baseUserFields,
}).prefs({ abortEarly: false, stripUnknown: true });

/**
 * Joi schema for updating an existing user by id and optional fields.
 */
export const updateUserSchema = Joi.object({
	id: Joi.string().trim().pattern(objectIdPattern).required(),
	walletAddress: Joi.string()
		.trim()
		.pattern(walletPattern)
		.messages({ 'string.pattern.base': 'Wallet address must be a valid 0x address or alphanumeric identifier.' }),
	...baseUserFields,
}).prefs({ abortEarly: false, stripUnknown: true });

/** Validate a user create/upsert payload using {@link upsertUserSchema}. */
export function validateUpsertUser(input: unknown) {
	return upsertUserSchema.validate(input);
}

/** Validate a user update payload using {@link updateUserSchema}. */
export function validateUpdateUser(input: unknown) {
	return updateUserSchema.validate(input);
}

type UserIdentifier = { _id?: unknown; id?: unknown } | null | undefined;

/** Resolve a consistent string id from different user identifier shapes. */
const resolveUserId = (user: UserIdentifier): string | null => {
	if (!user || typeof user !== 'object') {
		return null;
	}

	if ('_id' in user && user._id != null) {
		const id = user._id;
		if (typeof id === 'object' && id !== null && 'toString' in id) {
			return String((id as { toString(): string }).toString());
		}
		if (typeof id === 'string') {
			return id;
		}
		return null;
	}

	if ('id' in user && user.id != null) {
		const id = user.id;
		if (typeof id === 'object' && id !== null && 'toString' in id) {
			return String((id as { toString(): string }).toString());
		}
		if (typeof id === 'string') {
			return id;
		}
		return null;
	}

	return null;
};

/** Contract used by uniqueness helpers to fetch users based on various identifiers. */
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

/**
 * Ensure that username and email are unique when creating/upserting users.
 * @returns Error message if a conflict exists; otherwise null.
 */
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

/**
 * Ensure that username/email remain unique when updating an existing user.
 * @param id - user id being updated (string form of ObjectId)
 * @returns Error message for conflicts, otherwise null.
 */
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
