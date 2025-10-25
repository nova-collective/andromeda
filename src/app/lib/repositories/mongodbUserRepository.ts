import { BaseRepository } from './baseRepository';
import { IUser } from '@/app/lib/types';
import getClient from '@/app/lib/config/mongodb';
import { ObjectId, Document, Filter } from 'mongodb';

/**
 * MongoDB-backed implementation of the user repository.
 */
export class MongoDBUserRepository extends BaseRepository<IUser> {
  private collectionName = 'users';

  /** Find a user by string id */
  async findById(id: string): Promise<IUser | null> {
    const client = await getClient();
    const db = client.db('andromeda');
    const user = await db.collection(this.collectionName).findOne({ 
      _id: new ObjectId(id) 
    });
    return user as unknown as IUser | null;
  }
  /** Find a single user by a field name */
  async findByField(field: keyof IUser & string, value: unknown): Promise<IUser | null> {
    const client = await getClient();
    const db = client.db('andromeda');
    const user = await db.collection(this.collectionName).findOne({ 
      [field]: value as unknown 
    });
    return user as unknown as IUser | null;
  }

  /** Find all users matching an optional query */
  async findAll(query?: Record<string, unknown>): Promise<IUser[]> {
    const client = await getClient();
    const db = client.db('andromeda');
    const users = await db.collection(this.collectionName).find(query || {}).toArray();
    return users as unknown as IUser[];
  }

  /** Create a new user */
  async create(data: Omit<IUser, 'id' | 'createdAt'>): Promise<IUser> {
    const client = await getClient();
    const db = client.db('andromeda');
    
    // Ensure we don't accidentally pass a non-ObjectId `_id` to insertOne
    const rest = data as unknown as Record<string, unknown>;
    const userData = {
      ...rest,
      createdAt: new Date(),
      lastLogin: new Date()
    };

    const result = await db.collection(this.collectionName).insertOne(userData as unknown as Document);
    const user = await this.findById(result.insertedId.toString());
    return user!;
  }

  /** Update a user by id */
  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const user = await db.collection(this.collectionName).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...data,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    return user as unknown as IUser | null;
  }

  /** Delete a user by id */
  async delete(id: string): Promise<boolean> {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const result = await db.collection(this.collectionName).deleteOne({ 
      _id: new ObjectId(id) 
    });
    
    return result.deletedCount === 1;
  }

  /** Upsert a user matching the filter */
  async upsert(filter: Record<string, unknown>, data: Partial<IUser>): Promise<IUser> {
    const client = await getClient();
    const db = client.db('andromeda');
    
    const user = await db.collection(this.collectionName).findOneAndUpdate(
      filter as unknown as Filter<Document>,
      { 
        $set: {
          ...data,
          lastLogin: new Date(),
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { 
        upsert: true,
        returnDocument: 'after'
      }
    );

    return user as unknown as IUser;
  }
}