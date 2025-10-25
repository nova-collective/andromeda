import bcrypt from 'bcryptjs';
import { BaseRepository } from './baseRepository';
import { IUser } from '../types';
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

  /** Find a user by username */
  async findByUsername(username: string): Promise<IUser | null> {
    const client = await getClient();
    const db = client.db('andromeda');
    const user = await db.collection(this.collectionName).findOne({ 
      username: username 
    });
    return user as unknown as IUser | null;
  }

  /** Find a user by email */
  async findByEmail(email: string): Promise<IUser | null> {
    const client = await getClient();
    const db = client.db('andromeda');
    const user = await db.collection(this.collectionName).findOne({ 
      email: email 
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
    
    const result = await db.collection(this.collectionName).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...data,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    // `findOneAndUpdate` returns an object with a `value` property that
    // contains the updated document (or null). Return that document as IUser.
    return (result?.value as unknown) as IUser | null;
  }

  /**
   * Patch specific fields of a user by id.
   *
   * This method updates only the provided fields. If `password` is provided
   * it will be hashed before storage. Returns the updated user document or
   * null if no user was found.
   *
   * @param id - string id of the user to patch
   * @param data - partial fields to update on the user
   */
  async patch(id: string, data: Partial<IUser>): Promise<IUser | null> {
    const client = await getClient();
    const db = client.db('andromeda');

    // Clone and prepare update data
    const updateData: Record<string, unknown> = { ...data } as Record<string, unknown>;

    // If password present, hash it before updating
    if (typeof updateData.password === 'string' && updateData.password.length > 0) {
      updateData.password = await bcrypt.hash(String(updateData.password), 10);
    } else {
      // Ensure we don't accidentally set password to undefined/null
      delete updateData.password;
    }

    const result = await db.collection(this.collectionName).findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    return (result?.value as unknown) as IUser | null;
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
    
    const result = await db.collection(this.collectionName).findOneAndUpdate(
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

    // upsert:true with returnDocument:'after' should return the upserted document.
    // Use a non-null assertion because the driver guarantees a value when upserting.
    return (result!.value as unknown) as IUser;
  }
}