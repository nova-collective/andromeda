import mongoose from 'mongoose';
import { afterAll, describe, expect, it } from 'vitest';

import User from './User';

const baseUser = {
	username: 'alice',
	email: 'alice@example.com',
	password: 'hashed-password',
};

describe('User schema', () => {
	afterAll(() => {
		delete mongoose.models.User;
	});

	it('applies defaults for settings and timestamps', async () => {
		const user = new User(baseUser);
		await user.validate();

		expect(user.settings).toEqual({ theme: 'light', notifications: true });
		expect(user.createdAt).toBeInstanceOf(Date);
		expect(user.lastLogin).toBeInstanceOf(Date);
	});

	it('allows nullable wallet addresses', async () => {
		const user = new User(baseUser);
		await user.validate();

		expect(user.walletAddress).toBeUndefined();
	});

	it('requires CRUD flags inside permission entries', async () => {
		const user = new User({
			...baseUser,
			permissions: [
				{
					name: 'users.manage',
					crud: { read: true, create: true, update: false, delete: false },
				},
			],
		});

		await expect(user.validate()).resolves.toBeUndefined();

		const invalidUser = new User({
			...baseUser,
			permissions: [
				{
					name: 'users.manage',
					crud: { read: true, create: true, update: false },
				},
			],
		});

		await expect(invalidUser.validate()).rejects.toThrow(/Path `crud\.delete` is required/);
	});
});
