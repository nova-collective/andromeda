import { BaseRepository } from './baseRepository';
import { IGroup, IGroupMember } from '@/app/lib/types';
import getClient from '@/app/lib/config/mongodb';
import { ObjectId, Document, Filter, UpdateFilter } from 'mongodb';

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
  async findByField(field: keyof IGroup & string, value: unknown): Promise<IGroup | null> {
    const client = await getClient();
    const db = client.db('andromeda');
    const group = await db.collection(this.collectionName).findOne({ 
      [field]: value as unknown 
    });
    return this.mapGroup(group as Document | null);
  }

  /** Find all groups matching an optional query */
  async findAll(query?: Record<string, unknown>): Promise<IGroup[]> {
    const client = await getClient();
    const db = client.db('andromeda');
    const groups = await db.collection(this.collectionName).find(query || {}).toArray();
    return groups.map(group => this.mapGroup(group as Document)!).filter(Boolean) as IGroup[];
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
  /** Add a member to a group */
  async addMember(groupId: string, member: IGroupMember): Promise<IGroup | null> {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const group = await db.collection(this.collectionName).findOneAndUpdate(
      { _id: new ObjectId(groupId) },
      ({
        $push: { members: { ...member, joinedAt: new Date() } },
        $set: { updatedAt: new Date() }
      } as unknown) as UpdateFilter<Document>,
      { returnDocument: 'after' }
    );

    return this.mapGroup(group as Document | null);
  }

  /** Remove a member from a group by wallet address */
  async removeMember(groupId: string, walletAddress: string): Promise<IGroup | null> {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const group = await db.collection(this.collectionName).findOneAndUpdate(
      { _id: new ObjectId(groupId) },
      ({ $pull: { members: { walletAddress } }, $set: { updatedAt: new Date() } } as unknown) as UpdateFilter<Document>,
      { returnDocument: 'after' }
    );

    return this.mapGroup(group as Document | null);
  }

  /** Update a member's role inside the group */
  async updateMemberRole(groupId: string, walletAddress: string, role: string): Promise<IGroup | null> {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const group = await db.collection(this.collectionName).findOneAndUpdate(
      { _id: new ObjectId(groupId), 'members.walletAddress': walletAddress },
      ({ $set: { 'members.$.role': role, updatedAt: new Date() } } as unknown) as UpdateFilter<Document>,
      { returnDocument: 'after' }
    );

    return this.mapGroup(group as Document | null);
  }

  /** Find groups where a given wallet address is a member */
  async findByMember(walletAddress: string): Promise<IGroup[]> {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const groups = await db.collection(this.collectionName).find({ 'members.walletAddress': walletAddress }).toArray();

    return groups.map(group => this.mapGroup(group as Document)!).filter(Boolean) as IGroup[];
  }

  /**
   * Map a raw MongoDB document into the IGroup shape used by the app.
   * This performs minimal normalization (e.g. `_id` -> `id`).
   */
  private mapGroup(group: Document | null): IGroup | null {
    if (!group) return null;
    const obj = group as unknown as Record<string, unknown>;

    return {
      id: obj._id ? String(obj._id) : undefined,
      name: obj.name as string,
      description: obj.description as string | undefined,
      createdBy: obj.createdBy as string,
      members: (obj.members as IGroupMember[] | undefined) ?? [],
      permissions: (obj.permissions as { canInvite: boolean; canPost: boolean } | undefined) ?? { canInvite: true, canPost: true },
      settings: (obj.settings as { isPublic: boolean; requiresApproval: boolean } | undefined) ?? { isPublic: false, requiresApproval: false },
      createdAt: obj.createdAt as Date | undefined,
      updatedAt: obj.updatedAt as Date | undefined
    };
  }
}