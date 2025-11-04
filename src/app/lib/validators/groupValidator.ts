import Joi from 'joi';

import {
	objectIdPattern,
	groupNamePattern,
} from '@/app/lib/utils';
import { permissionSchema } from '@/app/lib/validators/permissionsValidator';

const settingsSchema = Joi.object({
	isPublic: Joi.boolean(),
	requiresApproval: Joi.boolean(),
}).optional();

/**
 * Joi schema describing the payload required to create a group.
 * Validates core fields (name, creator) and optional metadata.
 */
export const createGroupSchema = Joi.object({
	name: Joi.string().trim().pattern(groupNamePattern).required(),
	description: Joi.string().trim().allow('', null).optional(),
	createdBy: Joi.string().trim().required(),
	members: Joi.array().items(Joi.string().trim().pattern(objectIdPattern)).optional(),
	permissions: Joi.array().items(permissionSchema).optional(),
	settings: settingsSchema,
}).prefs({ abortEarly: false, stripUnknown: true });

/**
 * Joi schema for updating an existing group.
 * Requires a valid group id and optionally accepts other mutable fields.
 */
export const updateGroupSchema = Joi.object({
	id: Joi.string().trim().pattern(objectIdPattern).required(),
	name: Joi.string().trim().pattern(groupNamePattern).optional(),
	description: Joi.string().trim().allow('', null).optional(),
	members: Joi.array().items(Joi.string().trim().pattern(objectIdPattern)).optional(),
	permissions: Joi.array().items(permissionSchema).optional(),
	settings: settingsSchema,
}).prefs({ abortEarly: false, stripUnknown: true });

/** Validate payloads against {@link createGroupSchema}. */
export function validateCreateGroup(input: unknown) {
	return createGroupSchema.validate(input);
}

/** Validate payloads against {@link updateGroupSchema}. */
export function validateUpdateGroup(input: unknown) {
	return updateGroupSchema.validate(input);
}

type GroupIdentifier = { _id?: unknown; id?: unknown } | null | undefined;

/** Resolve a string id from a group document or repository result. */
const resolveGroupId = (group: GroupIdentifier): string | null => {
	if (!group || typeof group !== 'object') {
		return null;
	}

	if ('_id' in group && group._id != null) {
		const id = group._id;
		if (typeof id === 'object' && id !== null && 'toString' in id) {
			return String((id as { toString(): string }).toString());
		}
		if (typeof id === 'string') {
			return id;
		}
		return null;
	}

	if ('id' in group && group.id != null) {
		const id = group.id;
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

/** Contract describing the lookups required for uniqueness checks. */
export interface GroupLookupService {
	getGroupByName(name: string): Promise<GroupIdentifier>;
}

/**
 * Ensure a group name is not already taken by another group.
 * @param service - implementation able to look up groups by name
 * @param name - proposed group name
 * @param currentId - optional current group id when updating
 * @returns Error message when duplicate detected; otherwise null
 */
export async function ensureGroupNameUnique(
	service: GroupLookupService,
	name: string,
	currentId?: string,
): Promise<string | null> {
	const existing = await service.getGroupByName(name);
	const existingId = resolveGroupId(existing);
	const normalizedCurrentId = typeof currentId === 'string' ? String(currentId) : null;

	if (existingId && existingId !== normalizedCurrentId) {
		return 'Group name must be unique';
	}

	return null;
}
