import bcrypt from 'bcryptjs';
import { ObjectId, MongoServerError } from 'mongodb';

import { BaseRepository } from './baseRepository';

import type { IUser } from '../types';
import type { Document, Filter } from 'mongodb';

import getClient from '@/app/lib/config/mongodb';

/**
 * MongoDB-backed implementation of the user repository.
 */
export class MongoDBUserRepository extends BaseRepository<IUser> {
  private collectionName = 'users';

  /** Translate MongoDB duplicate key errors into domain-friendly messages */
  private handleDuplicateKey(error: unknown): never {
    if (error instanceof MongoServerError && error.code === 11000) {
      const keyPattern = (error.keyPattern ?? {}) as Record<string, unknown>;
      if (Object.prototype.hasOwnProperty.call(keyPattern, 'email')) {
        throw new Error('Email must be unique');
      }
      if (Object.prototype.hasOwnProperty.call(keyPattern, 'username')) {
        throw new Error('Username must be unique');
      }
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(String(error));
  }

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
      username 
    });
    return user as unknown as IUser | null;
  }

  /** Find a user by email */
  async findByEmail(email: string): Promise<IUser | null> {
    const client = await getClient();
    const db = client.db('andromeda');
    const user = await db.collection(this.collectionName).findOne({ 
      email 
    });
    return user as unknown as IUser | null;
  }

  /** Find a single user by a field name */
  async findByField(field: keyof IUser & string, value: unknown): Promise<IUser | null> {
    const client = await getClient();
    const db = client.db('andromeda');
    const user = await db.collection(this.collectionName).findOne({ 
      [field]: value 
    });
    return user as unknown as IUser | null;
  }

  /** Find all users matching an optional query */
  async findAll(query?: Record<string, unknown>): Promise<IUser[]> {
    const client = await getClient();
    const db = client.db('andromeda');
  const users = await db.collection(this.collectionName).find(query ?? {}).toArray();
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

    try {
      const result = await db.collection(this.collectionName).insertOne(userData as unknown as Document);
      const user = await this.findById(result.insertedId.toString());
      return user!;
    } catch (error) {
      this.handleDuplicateKey(error);
    }
  }

  /** Update a user by id */
  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    const client = await getClient();
    const db = client.db('andromeda');
    
    try {
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
    } catch (error) {
      this.handleDuplicateKey(error);
    }
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

    try {
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
    } catch (error) {
      this.handleDuplicateKey(error);
    }
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
    
    try {
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
    } catch (error) {
      this.handleDuplicateKey(error);
    }
  }
}