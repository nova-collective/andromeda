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

export const createGroupSchema = Joi.object({
	name: Joi.string().trim().pattern(groupNamePattern).required(),
	description: Joi.string().trim().allow('', null).optional(),
	createdBy: Joi.string().trim().required(),
	members: Joi.array().items(Joi.string().trim().pattern(objectIdPattern)).optional(),
	permissions: Joi.array().items(permissionSchema).optional(),
	settings: settingsSchema,
}).prefs({ abortEarly: false, stripUnknown: true });

export const updateGroupSchema = Joi.object({
	id: Joi.string().trim().pattern(objectIdPattern).required(),
	name: Joi.string().trim().pattern(groupNamePattern).optional(),
	description: Joi.string().trim().allow('', null).optional(),
	members: Joi.array().items(Joi.string().trim().pattern(objectIdPattern)).optional(),
	permissions: Joi.array().items(permissionSchema).optional(),
	settings: settingsSchema,
}).prefs({ abortEarly: false, stripUnknown: true });

export function validateCreateGroup(input: unknown) {
	return createGroupSchema.validate(input);
}

export function validateUpdateGroup(input: unknown) {
	return updateGroupSchema.validate(input);
}

type GroupIdentifier = { _id?: unknown; id?: unknown } | null | undefined;

const resolveGroupId = (group: GroupIdentifier): string | null => {
	if (!group || typeof group !== 'object') {
		return null;
	}

	if ('_id' in group && group._id != null) {
		return String(group._id);
	}

	if ('id' in group && group.id != null) {
		return String(group.id);
	}

	return null;
};

export interface GroupLookupService {
	getGroupByName(name: string): Promise<GroupIdentifier>;
}

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
