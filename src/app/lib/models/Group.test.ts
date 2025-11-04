import mongoose from 'mongoose';
import { afterAll, describe, expect, it } from 'vitest';

import Group from './Group';

const baseInput = {
	name: 'Writers Guild',
	description: 'Collaborative writing group',
	createdBy: '0xabc123',
};

describe('Group schema', () => {
	afterAll(() => {
		delete mongoose.models.Group;
	});

	it('fills defaults for members, permissions, settings, and timestamps', async () => {
		const group = new Group(baseInput);
		await group.validate();

		expect(group.members).toEqual([]);
		expect(group.permissions).toEqual([]);
		expect(group.settings).toEqual({ isPublic: false, requiresApproval: false });
		expect(group.createdAt).toBeInstanceOf(Date);
	});

	it('requires a group name', async () => {
		const group = new Group({ createdBy: baseInput.createdBy });

		await expect(group.validate()).rejects.toThrow(/Path `name` is required/);
	});

	it('limits permission names to allowed values', () => {
		const permissionArrayPath = Group.schema.path('permissions');
		const namePath = permissionArrayPath.schema.path('name');

		expect(namePath.enumValues).toEqual(['users', 'groups']);
	});
});
