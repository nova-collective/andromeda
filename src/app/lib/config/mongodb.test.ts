import type { MongoClient } from 'mongodb';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let connectMock: ReturnType<typeof vi.fn>;
let mockClient: MongoClient;
let MongoClientCtor: ReturnType<typeof vi.fn>;
let ensureMongoIndexesMock: ReturnType<typeof vi.fn>;
let attachDatabasePoolMock: ReturnType<typeof vi.fn>;

const ORIGINAL_URI = process.env.MONGODB_URI;

function setupModuleMocks(): void {
	connectMock = vi.fn().mockResolvedValue(undefined);
	mockClient = { connect: connectMock } as unknown as MongoClient;
	MongoClientCtor = vi.fn(function MockMongoClient() {
		return mockClient;
	});
	ensureMongoIndexesMock = vi.fn().mockResolvedValue(undefined);
	attachDatabasePoolMock = vi.fn();

	vi.doMock('mongodb', () => ({
		MongoClient: MongoClientCtor,
	}));

	vi.doMock('@vercel/functions', () => ({
		attachDatabasePool: attachDatabasePoolMock,
	}));

	vi.doMock('./mongodbIndexes', () => ({
		ensureMongoIndexes: ensureMongoIndexesMock,
	}));
}

describe('getClient', () => {
	beforeEach(() => {
		vi.resetModules();
		setupModuleMocks();
		process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
	});

	afterEach(() => {
		if (ORIGINAL_URI === undefined) {
			delete process.env.MONGODB_URI;
		} else {
			process.env.MONGODB_URI = ORIGINAL_URI;
		}
	});

	it('connects and ensures indexes on first invocation', async () => {
		const { default: getClient } = await import('./mongodb');

		const client = await getClient();

		expect(MongoClientCtor).toHaveBeenCalledTimes(1);
		expect(connectMock).toHaveBeenCalledTimes(1);
		expect(attachDatabasePoolMock).toHaveBeenCalledWith(mockClient);
		expect(ensureMongoIndexesMock).toHaveBeenCalledWith(mockClient);
		expect(client).toBe(mockClient);
	});

	it('reuses the established connection on subsequent calls', async () => {
		const { default: getClient } = await import('./mongodb');

		const firstCall = await getClient();

		expect(connectMock).toHaveBeenCalledTimes(1);
		expect(ensureMongoIndexesMock).toHaveBeenCalledTimes(1);

		const secondCall = await getClient();

		expect(firstCall).toBe(secondCall);
		expect(connectMock).toHaveBeenCalledTimes(1);
		expect(ensureMongoIndexesMock).toHaveBeenCalledTimes(1);
	});
});
