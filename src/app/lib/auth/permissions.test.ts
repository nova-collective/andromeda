import { describe, expect, it } from 'vitest';

import type { User } from '@/app/lib/types';

import { hasGroup, isAdmin, hasAnyGroup, hasAllGroups } from './permissions';


const buildUser = (overrides: Partial<User> = {}): User => ({
	id: 1,
	username: 'alice',
	email: 'alice@example.com',
	password: 'hash',
	groups: [],
	...overrides,
});

describe('auth/permissions helpers', () => {
	describe('hasGroup', () => {
		it('returns true when the user belongs to the group', () => {
			const user = buildUser({ groups: ['admin', 'editor'] });
			expect(hasGroup(user, 'admin')).toBe(true);
		});

		it('returns false when the user lacks the group', () => {
			const user = buildUser({ groups: ['editor'] });
			expect(hasGroup(user, 'admin')).toBe(false);
		});

		it('returns false when user groups are undefined', () => {
			const user = buildUser({ groups: undefined });
			expect(hasGroup(user, 'admin')).toBe(false);
		});
	});

	describe('isAdmin', () => {
		it('delegates to hasGroup for the admin group', () => {
			const user = buildUser({ groups: ['admin'] });
			expect(isAdmin(user)).toBe(true);
			expect(isAdmin(buildUser({ groups: ['editor'] }))).toBe(false);
		});
	});

	describe('hasAnyGroup', () => {
		it('returns true when at least one group matches', () => {
			const user = buildUser({ groups: ['author', 'reviewer'] });
			expect(hasAnyGroup(user, ['admin', 'reviewer'])).toBe(true);
		});

		it('returns false when none of the groups match', () => {
			const user = buildUser({ groups: ['author'] });
			expect(hasAnyGroup(user, ['admin', 'reviewer'])).toBe(false);
		});
	});

	describe('hasAllGroups', () => {
		it('returns true when user belongs to every group', () => {
			const user = buildUser({ groups: ['admin', 'author'] });
			expect(hasAllGroups(user, ['admin', 'author'])).toBe(true);
		});

		it('returns false when any required group is missing', () => {
			const user = buildUser({ groups: ['admin'] });
			expect(hasAllGroups(user, ['admin', 'author'])).toBe(false);
		});
	});
});
