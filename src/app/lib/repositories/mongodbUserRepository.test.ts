import { MongoServerError, ObjectId, type Document, type MongoClient } from 'mongodb';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IUser } from '@/app/lib/types';
import { MongoDBUserRepository } from './mongodbUserRepository';

type CollectionMock = {
	findOne: ReturnType<typeof vi.fn>;
	find: ReturnType<typeof vi.fn>;
	findOneAndUpdate: ReturnType<typeof vi.fn>;
	insertOne: ReturnType<typeof vi.fn>;
	deleteOne: ReturnType<typeof vi.fn>;
};

let mockCollection: CollectionMock;
let mockDb: { collection: ReturnType<typeof vi.fn> };
let mockClient: { db: ReturnType<typeof vi.fn> };

const getClientMock = vi.hoisted(() => vi.fn());
const hashMock = vi.hoisted(() => vi.fn());

const USER_ID = '507f1f77bcf86cd7994390aa';
const USER_OBJECT_ID = new ObjectId(USER_ID);
const USER_ID_ALT = '507f1f77bcf86cd7994390bb';

vi.mock('@/app/lib/config/mongodb', () => ({
	__esModule: true,
	default: getClientMock,
}));

vi.mock('bcryptjs', () => ({
	__esModule: true,
	default: { hash: hashMock },
}));

const buildUserDoc = (overrides: Partial<Document> = {}) => ({
	_id: USER_OBJECT_ID,
	username: 'jane',
	email: 'jane@example.com',
	password: 'hashed',
	walletAddress: '0x123',
	settings: { theme: 'default', notifications: true },
	permissions: [],
	groups: [],
	createdAt: new Date('2024-01-01T00:00:00.000Z'),
	updatedAt: new Date('2024-01-02T00:00:00.000Z'),
	lastLogin: new Date('2024-01-03T00:00:00.000Z'),
	...overrides,
});

const buildUserPayload = (overrides: Partial<Record<string, unknown>> = {}) => ({
	username: 'jane',
	email: 'jane@example.com',
	password: 'hashed',
	walletAddress: '0x123',
	settings: { theme: 'default', notifications: true } as IUser['settings'],
	permissions: [] as IUser['permissions'],
	groups: [] as IUser['groups'],
	lastLogin: new Date('2024-01-03T00:00:00.000Z'),
	...overrides,
}) as unknown as Omit<IUser, 'id' | 'createdAt'>;

describe('MongoDBUserRepository', () => {
	let repository: MongoDBUserRepository;

	beforeEach(() => {
		getClientMock.mockReset();
		hashMock.mockReset();

		mockCollection = {
			findOne: vi.fn(),
			find: vi.fn(),
			findOneAndUpdate: vi.fn(),
			insertOne: vi.fn(),
			deleteOne: vi.fn(),
		};

		mockDb = {
			collection: vi.fn(() => mockCollection),
		};

		mockClient = {
			db: vi.fn(() => mockDb),
		};

		getClientMock.mockResolvedValue(mockClient as unknown as MongoClient);
		repository = new MongoDBUserRepository();
	});

	it('findById fetches a user by ObjectId', async () => {
		const rawUser = buildUserDoc();
		mockCollection.findOne.mockResolvedValueOnce(rawUser);

		const user = await repository.findById(USER_ID);

		expect(mockClient.db).toHaveBeenCalledWith('andromeda');
		expect(mockDb.collection).toHaveBeenCalledWith('users');
		expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: expect.any(Object) });
		expect(user).toEqual(rawUser as unknown as IUser);
	});

	it('findByUsername queries users collection by username', async () => {
		const rawUser = buildUserDoc({ username: 'doe' });
		mockCollection.findOne.mockResolvedValueOnce(rawUser);

		const user = await repository.findByUsername('doe');

		expect(mockCollection.findOne).toHaveBeenCalledWith({ username: 'doe' });
		expect(user?.username).toBe('doe');
	});

	it('findByEmail queries users collection by email', async () => {
		const rawUser = buildUserDoc({ email: 'other@example.com' });
		mockCollection.findOne.mockResolvedValueOnce(rawUser);

		const user = await repository.findByEmail('other@example.com');

		expect(mockCollection.findOne).toHaveBeenCalledWith({ email: 'other@example.com' });
		expect(user?.email).toBe('other@example.com');
	});

	it('findByField allows dynamic field lookup', async () => {
		const rawUser = buildUserDoc({ username: 'dynamic' });
		mockCollection.findOne.mockResolvedValueOnce(rawUser);

		const user = await repository.findByField('username', 'dynamic');

		expect(mockCollection.findOne).toHaveBeenCalledWith({ username: 'dynamic' });
		expect(user?.username).toBe('dynamic');
	});

	it('findAll returns all users mapped as IUser[]', async () => {
		const rawUsers = [buildUserDoc(), buildUserDoc({ _id: new ObjectId(USER_ID_ALT) })];
		const toArrayMock = vi.fn().mockResolvedValue(rawUsers);
		mockCollection.find.mockReturnValueOnce({ toArray: toArrayMock });

		const users = await repository.findAll();

		expect(mockCollection.find).toHaveBeenCalledWith({});
		expect(toArrayMock).toHaveBeenCalled();
		expect(users).toHaveLength(2);
	});

	it('findAll passes provided query object', async () => {
		const query = { role: 'admin' } as Record<string, unknown>;
		const toArrayMock = vi.fn().mockResolvedValue([]);
		mockCollection.find.mockReturnValueOnce({ toArray: toArrayMock });

		await repository.findAll(query);

		expect(mockCollection.find).toHaveBeenCalledWith(query);
	});

	it('create inserts a user and retrieves it by id', async () => {
			const rawUser = buildUserDoc();
			mockCollection.insertOne.mockResolvedValueOnce({ insertedId: USER_OBJECT_ID });
			mockCollection.findOne.mockResolvedValueOnce(rawUser);

				const user = await repository.create(buildUserPayload());

		expect(mockCollection.insertOne).toHaveBeenCalledWith(expect.objectContaining({
			createdAt: expect.any(Date),
			lastLogin: expect.any(Date),
		}));
		expect(user).toEqual(rawUser as unknown as IUser);
	});

	it('create throws friendly error on duplicate email', async () => {
		const duplicateError = new MongoServerError({
			message: 'E11000 duplicate key error',
			code: 11000,
			keyPattern: { email: 1 },
		});
		mockCollection.insertOne.mockRejectedValueOnce(duplicateError);

			await expect(
						repository.create(buildUserPayload({ email: 'jane@example.com', password: 'secret', lastLogin: new Date() })),
			).rejects.toThrow('Email must be unique');
	});

	it('update returns updated user document', async () => {
		const updatedUser = buildUserDoc({ username: 'updated' });
		mockCollection.findOneAndUpdate.mockResolvedValueOnce({ value: updatedUser });

		const user = await repository.update(USER_ID, { username: 'updated' });

		expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
			{ _id: expect.any(Object) },
			expect.objectContaining({ $set: expect.objectContaining({ username: 'updated' }) }),
			{ returnDocument: 'after' },
		);
		expect(user?.username).toBe('updated');
	});

	it('update surfaces duplicate username error', async () => {
		const duplicateError = new MongoServerError({
			message: 'E11000 duplicate key error',
			code: 11000,
			keyPattern: { username: 1 },
		});
		mockCollection.findOneAndUpdate.mockRejectedValueOnce(duplicateError);

		await expect(repository.update(USER_ID, { username: 'taken' })).rejects.toThrow('Username must be unique');
	});

	it('patch hashes password before persisting', async () => {
		hashMock.mockResolvedValueOnce('hashed-password');
		const updatedUser = buildUserDoc({ password: 'hashed-password' });
		mockCollection.findOneAndUpdate.mockResolvedValueOnce({ value: updatedUser });

		const user = await repository.patch(USER_ID, { password: 'plain-pass' });

		expect(hashMock).toHaveBeenCalledWith('plain-pass', 10);
		expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
			{ _id: expect.any(Object) },
			expect.objectContaining({
				$set: expect.objectContaining({ password: 'hashed-password' }),
			}),
			{ returnDocument: 'after' },
		);
		expect(user?.password).toBe('hashed-password');
	});

	it('patch ignores falsy password values', async () => {
		mockCollection.findOneAndUpdate.mockResolvedValueOnce({ value: buildUserDoc() });

		await repository.patch(USER_ID, { password: '' });

		expect(hashMock).not.toHaveBeenCalled();
		expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
			{ _id: expect.any(Object) },
			expect.objectContaining({
				$set: expect.not.objectContaining({ password: expect.anything() }),
			}),
			{ returnDocument: 'after' },
		);
	});

	it('patch rethrows duplicate email error', async () => {
		const duplicateError = new MongoServerError({
			message: 'E11000 duplicate key error',
			code: 11000,
			keyPattern: { email: 1 },
		});
		mockCollection.findOneAndUpdate.mockRejectedValueOnce(duplicateError);

		await expect(repository.patch(USER_ID, { email: 'exists@example.com' })).rejects.toThrow('Email must be unique');
	});

	it('delete removes user by id and returns success flag', async () => {
		mockCollection.deleteOne.mockResolvedValueOnce({ deletedCount: 1 });

		const result = await repository.delete(USER_ID);

		expect(mockCollection.deleteOne).toHaveBeenCalledWith({ _id: expect.any(Object) });
		expect(result).toBe(true);
	});

	it('upsert updates existing user and returns document', async () => {
		const upserted = buildUserDoc({ username: 'upserted' });
		mockCollection.findOneAndUpdate.mockResolvedValueOnce({ value: upserted });

		const user = await repository.upsert({ email: 'jane@example.com' }, { username: 'upserted' });

		expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
			{ email: 'jane@example.com' },
			expect.objectContaining({
				$set: expect.objectContaining({ username: 'upserted', lastLogin: expect.any(Date), updatedAt: expect.any(Date) }),
				$setOnInsert: expect.objectContaining({ createdAt: expect.any(Date) }),
			}),
			{ upsert: true, returnDocument: 'after' },
		);
		expect(user.username).toBe('upserted');
	});

	it('upsert throws duplicate username error', async () => {
		const duplicateError = new MongoServerError({
			message: 'E11000 duplicate key error',
			code: 11000,
			keyPattern: { username: 1 },
		});
		mockCollection.findOneAndUpdate.mockRejectedValueOnce(duplicateError);

		await expect(repository.upsert({ email: 'exists@example.com' }, { username: 'taken' })).rejects.toThrow('Username must be unique');
	});
});
