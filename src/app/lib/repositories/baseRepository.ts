import { Repository } from '@/app/lib/types/database';

/**
 * BaseRepository provides a small abstract contract for data access
 * classes. Implementations should provide concrete Mongoose / driver
 * logic while conforming to these method signatures.
 */
export abstract class BaseRepository<T> implements Repository<T> {
  /** Find a document by its string id */
  abstract findById(id: string): Promise<T | null>;

  /** Find a single document by a field name and value */
  abstract findByField(field: keyof T & string, value: unknown): Promise<T | null>;

  /** Find all documents matching an optional query object */
  abstract findAll(query?: Record<string, unknown>): Promise<T[]>;

  /** Create a new document (omit DB-managed fields) */
  abstract create(data: Omit<T, 'id' | 'createdAt'>): Promise<T>;

  /** Update a document by id */
  abstract update(id: string, data: Partial<T>): Promise<T | null>;

  /** Delete a document by id */
  abstract delete(id: string): Promise<boolean>;

  /** Upsert a document matching the provided filter */
  abstract upsert(filter: Record<string, unknown>, data: Partial<T>): Promise<T>;
}