import { ObjectId, type Document, type MongoClient } from 'mongodb';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MongoDBGroupRepository } from './mongodbGroupRepository';

import type { IGroup } from '@/app/lib/types';

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

const GROUP_ID = '507f1f77bcf86cd799439011';
const GROUP_ID_B = '507f1f77bcf86cd799439012';
const USER_ID = '507f1f77bcf86cd7994390aa';

vi.mock('@/app/lib/config/mongodb', () => ({
  __esModule: true,
  default: getClientMock,
}));

describe('MongoDBGroupRepository', () => {
  let repository: MongoDBGroupRepository;

  beforeEach(() => {
    getClientMock.mockReset();

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
    repository = new MongoDBGroupRepository();
  });

  it('findById fetches and maps a group', async () => {
    const id = GROUP_ID;
    const rawGroup = {
      _id: { toString: () => id },
      name: 'Writers',
      description: 'A writing collective',
      createdBy: 'user-1',
      members: [],
      permissions: [],
      settings: { isPublic: true, requiresApproval: false },
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
    } satisfies Document;
    mockCollection.findOne.mockResolvedValueOnce(rawGroup);

    const group = await repository.findById(id);

    expect(mockClient.db).toHaveBeenCalledWith('andromeda');
    expect(mockDb.collection).toHaveBeenCalledWith('groups');
    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: expect.any(Object) });
    expect(group).toMatchObject({
      id,
      name: 'Writers',
      description: 'A writing collective',
      createdBy: 'user-1',
      members: [],
      permissions: [],
      settings: { isPublic: true, requiresApproval: false },
    });
  });

  it('findByField queries by arbitrary field name', async () => {
    const result = { _id: 'id', name: 'Group' } as Document;
    mockCollection.findOne.mockResolvedValueOnce(result);

    const group = await repository.findByField('name', 'Group');

    expect(mockCollection.findOne).toHaveBeenCalledWith({ name: 'Group' });
    expect(group?.name).toBe('Group');
  });

  it('findAll returns mapped group array', async () => {
    const rawGroups = [
      { _id: GROUP_ID, name: 'Group A', createdBy: 'user-a' },
      { _id: GROUP_ID_B, name: 'Group B', createdBy: 'user-b' },
    ];
    const toArrayMock = vi.fn().mockResolvedValue(rawGroups);
    mockCollection.find.mockReturnValueOnce({ toArray: toArrayMock });

    const groups = await repository.findAll();

    expect(mockCollection.find).toHaveBeenCalledWith({});
    expect(toArrayMock).toHaveBeenCalled();
    expect(groups).toHaveLength(2);
    expect(groups[0]?.name).toBe('Group A');
    expect(groups[1]?.id).toBe(GROUP_ID_B);
  });

  it('create inserts a group and returns the stored document', async () => {
    const rawGroup = { _id: GROUP_ID, name: 'New Group', createdBy: 'user-1' } as Document;
    mockCollection.insertOne.mockResolvedValueOnce({ insertedId: new ObjectId(GROUP_ID) });
    mockCollection.findOne.mockResolvedValueOnce(rawGroup);

    const group = await repository.create({
      name: 'New Group',
      description: undefined,
      createdBy: 'user-1',
      members: [] as unknown as IGroup['members'],
      permissions: [] as unknown as IGroup['permissions'],
      settings: { isPublic: false, requiresApproval: false },
      updatedAt: new Date(),
    } satisfies Omit<IGroup, 'id' | 'createdAt'>);

    expect(mockCollection.insertOne).toHaveBeenCalled();
    expect(group?.name).toBe('New Group');
  });

  it('update applies partial updates and returns the updated document', async () => {
    const updatedGroup = { _id: GROUP_ID, name: 'Updated Name', createdBy: 'user-1' } as Document;
    mockCollection.findOneAndUpdate.mockResolvedValueOnce(updatedGroup);

    const group = await repository.update(GROUP_ID, { name: 'Updated Name' });

    expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: expect.any(Object) },
      expect.objectContaining({ $set: expect.objectContaining({ name: 'Updated Name' }) }),
      { returnDocument: 'after' },
    );
    expect(group?.name).toBe('Updated Name');
  });

  it('delete removes a group by id', async () => {
    mockCollection.deleteOne.mockResolvedValueOnce({ deletedCount: 1 });

    const result = await repository.delete(GROUP_ID);

    expect(mockCollection.deleteOne).toHaveBeenCalledWith({ _id: expect.any(Object) });
    expect(result).toBe(true);
  });

  it('upsert creates or updates a group and returns the result', async () => {
    const upserted = { _id: GROUP_ID, name: 'Upserted', createdBy: 'user-1' } as Document;
    mockCollection.findOneAndUpdate.mockResolvedValueOnce(upserted);

    const group = await repository.upsert({ name: 'Upserted' }, { createdBy: 'user-1' });

    expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
      { name: 'Upserted' },
      expect.objectContaining({ $set: expect.objectContaining({ createdBy: 'user-1' }) }),
      { upsert: true, returnDocument: 'after' },
    );
    expect(group?.name).toBe('Upserted');
  });

  it('addUser pushes a member and returns the updated group', async () => {
    const updated = { _id: GROUP_ID, members: [USER_ID] } as Document;
    mockCollection.findOneAndUpdate.mockResolvedValueOnce(updated);

    const group = await repository.addUser(GROUP_ID, USER_ID);

    expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: expect.any(Object) },
      expect.objectContaining({ $push: expect.objectContaining({ members: expect.any(Object) }) }),
      { returnDocument: 'after' },
    );
    expect(group?.members).toContain(USER_ID);
  });

  it('removeUser pulls a member and returns the updated group', async () => {
    const updated = { _id: GROUP_ID, members: [] } as Document;
    mockCollection.findOneAndUpdate.mockResolvedValueOnce(updated);

    const group = await repository.removeUser(GROUP_ID, USER_ID);

    expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: expect.any(Object) },
      expect.objectContaining({ $pull: expect.objectContaining({ members: expect.any(Object) }) }),
      { returnDocument: 'after' },
    );
    expect(group?.members).toEqual([]);
  });

  it('findByUserId returns groups containing the user', async () => {
    const rawGroups = [
      { _id: GROUP_ID, name: 'Members', createdBy: 'user-1' },
    ];
    mockCollection.find.mockReturnValueOnce({ toArray: vi.fn().mockResolvedValue(rawGroups) });

    const groups = await repository.findByUserId(USER_ID);

    expect(mockCollection.find).toHaveBeenCalledWith({ members: expect.any(Object) });
    expect(groups).toHaveLength(1);
    expect(groups[0]?.name).toBe('Members');
  });
});
