import { ObjectId } from 'mongodb';

import getClient from '@/app/lib/config/mongodb';
import type { IGroup } from '@/app/lib/types';

import { BaseRepository } from './baseRepository';

import type { Document, Filter, UpdateFilter } from 'mongodb';


/**
 * MongoDB-backed repository for groups.
 */
export class MongoDBGroupRepository extends BaseRepository<IGroup> {
  private collectionName = 'groups';

  /** Find a group by string id */
  async findById(id: string): Promise<IGroup | null> {
    const client = await getClient();
    const db = client.db('andromeda');
    const group = await db.collection(this.collectionName).findOne({ 
      _id: new ObjectId(id) 
    });
    return this.mapGroup(group as Document | null);
  }

  /** Find a group by a specific field */
  async findByField(field: keyof IGroup, value: unknown): Promise<IGroup | null> {
    const client = await getClient();
    const db = client.db('andromeda');
    const group = await db.collection(this.collectionName).findOne({ 
      [field]: value 
    });
    return this.mapGroup(group as Document | null);
  }

  /** Find all groups matching an optional query */
  async findAll(query?: Record<string, unknown>): Promise<IGroup[]> {
    const client = await getClient();
    const db = client.db('andromeda');
  const groups = await db.collection(this.collectionName).find(query ?? {}).toArray();
    return groups.map(group => this.mapGroup(group as Document)!).filter(Boolean);
  }

  /** Create a new group */
  async create(data: Omit<IGroup, 'id' | 'createdAt'>): Promise<IGroup> {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const groupData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection(this.collectionName).insertOne(groupData as unknown as Document);
    const group = await this.findById(result.insertedId.toString());
    return group!;
  }

  /** Update a group by id */
  async update(id: string, data: Partial<IGroup>): Promise<IGroup | null> {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const group = await db.collection(this.collectionName).findOneAndUpdate(
      { _id: new ObjectId(id) },
      ({ $set: { ...data, updatedAt: new Date() } } as unknown) as UpdateFilter<Document>,
      { returnDocument: 'after' }
    );

    return this.mapGroup(group as Document | null);
  }

  /** Delete a group by id */
  async delete(id: string): Promise<boolean> {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const result = await db.collection(this.collectionName).deleteOne({ 
      _id: new ObjectId(id) 
    });
    
    return result.deletedCount === 1;
  }

  /** Upsert a group matching the filter */
  async upsert(filter: Record<string, unknown>, data: Partial<IGroup>): Promise<IGroup> {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const group = await db.collection(this.collectionName).findOneAndUpdate(
      filter as Filter<Document>,
      ({
        $set: { ...data, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() }
      } as unknown) as UpdateFilter<Document>,
      { upsert: true, returnDocument: 'after' }
    );

    return this.mapGroup(group as Document | null)!;
  }

  // Group-specific methods
  /** Add a user id to a group's members array */
  async addUser(groupId: string, userId: string): Promise<IGroup | null> {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const group = await db.collection(this.collectionName).findOneAndUpdate(
      { _id: new ObjectId(groupId) },
      ({
        $push: { members: new ObjectId(userId) },
        $set: { updatedAt: new Date() }
      } as unknown) as UpdateFilter<Document>,
      { returnDocument: 'after' }
    );

    return this.mapGroup(group as Document | null);
  }

  /** Remove a user id from a group's members array */
  async removeUser(groupId: string, userId: string): Promise<IGroup | null> {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const group = await db.collection(this.collectionName).findOneAndUpdate(
      { _id: new ObjectId(groupId) },
      ({ $pull: { members: new ObjectId(userId) }, $set: { updatedAt: new Date() } } as unknown) as UpdateFilter<Document>,
      { returnDocument: 'after' }
    );

    return this.mapGroup(group as Document | null);
  }
  /** Find groups where a given user id is a member */
  async findByUserId(userId: string): Promise<IGroup[]> {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const groups = await db.collection(this.collectionName).find({ members: new ObjectId(userId) }).toArray();

    return groups.map(group => this.mapGroup(group as Document)!).filter(Boolean);
  }

  /**
   * Map a raw MongoDB document into the IGroup shape used by the app.
   * This performs minimal normalization (e.g. `_id` -> `id`).
   */
  private mapGroup(group: Document | null): IGroup | null {
    if (!group) return null;
    const obj = group as unknown as Record<string, unknown>;

    let groupId: string | undefined;
    if (obj._id) {
      const id = obj._id;
      if (typeof id === 'object' && id !== null && 'toString' in id) {
        groupId = String((id as { toString(): string }).toString());
      } else if (typeof id === 'string') {
        groupId = id;
      }
    }

    return {
      id: groupId,
      name: obj.name as string,
      description: obj.description as string | undefined,
      createdBy: obj.createdBy as string,
      members: (obj.members as IGroup['members'] | undefined) ?? [],
      permissions: (obj.permissions as IGroup['permissions'] | undefined) ?? [],
      settings: (obj.settings as IGroup['settings'] | undefined) ?? { isPublic: false, requiresApproval: false },
      createdAt: obj.createdAt as Date | undefined,
      updatedAt: obj.updatedAt as Date | undefined
    };
  }
}