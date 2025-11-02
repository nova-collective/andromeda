import { describe, expect, it, vi } from 'vitest';
import { objectIdPattern } from '../utils';
vi.mock('@/app/lib/utils', async () => ({
	__esModule: true,
	...await vi.importActual('../utils'),
}));

vi.mock('@/app/lib/validators/permissionsValidator', async () => ({
	__esModule: true,
	...await vi.importActual('./permissionsValidator'),
}));

import {
	createGroupSchema,
	ensureGroupNameUnique,
	updateGroupSchema,
	validateCreateGroup,
	validateUpdateGroup,
} from './groupValidator';

const buildValidGroup = () => ({
	name: 'Writers Guild',
	description: 'Collaborative writing group',
	createdBy: '0xabc',
	members: ['507f1f77bcf86cd799439011'],
	permissions: [
		{
			name: 'User',
			description: 'Manage users',
			crud: { read: true, create: false, update: false, delete: false },
		},
	],
	settings: { isPublic: true, requiresApproval: false },
});

describe('groupValidator', () => {
	describe('createGroupSchema', () => {
		it('accepts valid payloads and strips unknown fields', () => {
			const payload = {
				...buildValidGroup(),
				extra: 'remove me',
			};

			const { error, value } = createGroupSchema.validate(payload);

			expect(error).toBeUndefined();
			expect(value.extra).toBeUndefined();
			expect(value.name).toBe(payload.name);
		});

		it('rejects invalid members and group name', () => {
			const { error } = createGroupSchema.validate({
				name: '!!',
				createdBy: '0xabc',
				members: ['not-object-id'],
			});

			expect(error?.details.map(d => d.message)).toEqual(expect.arrayContaining([
				expect.stringContaining('fails to match the required pattern'),
			]));
		});
	});

	describe('updateGroupSchema', () => {
		it('requires id and validates fields', () => {
			const { error } = updateGroupSchema.validate({ name: 'Valid Group' });
			expect(error).toBeDefined();
		});

		it('accepts partial updates with valid data', () => {
			const update = {
				id: '507f1f77bcf86cd799439012',
				name: 'New Name',
				members: ['507f1f77bcf86cd799439011'],
			};

			const { error, value } = updateGroupSchema.validate(update);

			expect(error).toBeUndefined();
			expect(objectIdPattern.test(value.id)).toBe(true);
		});
	});

	describe('validateCreateGroup', () => {
		it('delegates to createGroupSchema', () => {
			const payload = buildValidGroup();
			const result = validateCreateGroup(payload);

			expect(result.error).toBeUndefined();
		});
	});

	describe('validateUpdateGroup', () => {
		it('delegates to updateGroupSchema', () => {
			const update = { id: '507f1f77bcf86cd799439012', name: 'Renamed' };
			const result = validateUpdateGroup(update);

			expect(result.error).toBeUndefined();
		});
	});

	describe('ensureGroupNameUnique', () => {
		it('returns null when no existing group found', async () => {
			const service = { getGroupByName: vi.fn().mockResolvedValueOnce(null) };

			await expect(ensureGroupNameUnique(service, 'Group')).resolves.toBeNull();
			expect(service.getGroupByName).toHaveBeenCalledWith('Group');
		});

		it('returns error when name taken by different group', async () => {
			const service = { getGroupByName: vi.fn().mockResolvedValueOnce({ _id: '507f1f77bcf86cd799439011' }) };

			await expect(ensureGroupNameUnique(service, 'Group', '507f1f77bcf86cd799439012'))
				.resolves.toBe('Group name must be unique');
		});

		it('allows matching current group id', async () => {
			const service = { getGroupByName: vi.fn().mockResolvedValueOnce({ id: '507f1f77bcf86cd799439011' }) };

			await expect(ensureGroupNameUnique(service, 'Group', '507f1f77bcf86cd799439011')).resolves.toBeNull();
		});
	});
});
