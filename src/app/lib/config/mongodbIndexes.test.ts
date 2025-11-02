import type { Db, MongoClient } from 'mongodb';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ensureMongoIndexes } from './mongodbIndexes';

const createIndexesMock = vi.fn();
const collectionMock = vi.fn(() => ({ createIndexes: createIndexesMock }));
const dbMock = vi.fn(() => ({ collection: collectionMock } as unknown as Db));
const mockClient = { db: dbMock } as unknown as MongoClient;

describe('ensureMongoIndexes', () => {
	beforeEach(() => {
		createIndexesMock.mockClear();
		collectionMock.mockClear();
		dbMock.mockClear();
	});

	it('creates user indexes on first invocation', async () => {
		await ensureMongoIndexes(mockClient);

		expect(dbMock).toHaveBeenCalledWith('andromeda');
		expect(collectionMock).toHaveBeenCalledWith('users');
		expect(createIndexesMock).toHaveBeenCalledWith([
			{ key: { email: 1 }, unique: true, name: 'users_email_unique' },
			{ key: { username: 1 }, unique: true, name: 'users_username_unique' },
		]);
	});
});
