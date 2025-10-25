import { IUser } from '@/app/lib/types';
import { MongoDBUserRepository } from '@/app/lib/repositories';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * UserService is a small application-level service that wraps
 * repository calls for user-related operations.
 */
export class UserService {
  private repository: MongoDBUserRepository;

  constructor() {
    this.repository = new MongoDBUserRepository();
  }

  /**
   * Get a user by their string id.
   * @param id - The document id (string form of ObjectId)
   * @returns The user document or null if not found
   */
  async getUserById(id: string): Promise<IUser | null> {
    return this.repository.findById(id);
  }

  /**
   * Look up a user by wallet address (case-sensitive as passed).
   * @param walletAddress - Wallet address to query
   */
  async getUserByWalletAddress(walletAddress: string): Promise<IUser | null> {
    return this.repository.findByField('walletAddress', walletAddress);
  }

  /**
   * Retrieve all users (optionally this could accept pagination later).
   */
  async getAllUsers(): Promise<IUser[]> {
    return this.repository.findAll();
  }

  /**
   * Create a new user.
   * The repository will add timestamps and other DB-managed fields.
   */
  async createUser(userData: Omit<IUser, 'id' | 'createdAt'>): Promise<IUser> {
    return this.repository.create(userData);
  }

  /**
   * Update user by id with partial data
   */
  async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    return this.repository.update(id, userData);
  }

  /**
   * Delete a user by id
   */
  async deleteUser(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  /**
   * Upsert a user by wallet address (lowercased). Useful for login/registration flows.
   */
  async upsertUser(walletAddress: string, userData: Partial<IUser>): Promise<IUser> {
    return this.repository.upsert(
      { walletAddress: walletAddress.toLowerCase() }, 
      userData
    );
  }

  /**
   * Validate a plain-text password against the user's stored hash.
   * Returns `false` when the user has no password set or on error.
   */
  async validatePassword(user: IUser, password: string): Promise<boolean> {
    try {
      if (!user.password) {
        return false;
      }
      
      return await bcrypt.compare(password, user.password);
    } catch (error) {
      console.error('Error validating password:', error);
      return false;
    }
  }
  /**
   * Add a user to a group (idempotent). Returns the updated user or null if
   * the user was not found.
   */
  async addUserToGroup(userId: string, group: string): Promise<IUser | null> {
    try {
      const user = await this.repository.findById(userId);
      if (!user) return null;

      const currentGroups = user.groups || [];
      if (!currentGroups.map(g => String(g)).includes(group)) {
        const updatedGroups = [...currentGroups, new Types.ObjectId(group)];
        return await this.repository.update(userId, {
          groups: updatedGroups
        } as Partial<IUser>);
      }
      return user;
    } catch (error) {
      console.error('Error adding user to group:', error);
      return null;
    }
  }

  /**
   * Remove a user from a group. Returns the updated user or null if not found.
   */
  async removeUserFromGroup(userId: string, group: string): Promise<IUser | null> {
    try {
      const user = await this.repository.findById(userId);
      if (!user) return null;

      const currentGroups = user.groups || [];
      const updatedGroups = currentGroups.filter(g => String(g) !== group);
      
      return await this.repository.update(userId, {
        groups: updatedGroups as unknown as Types.ObjectId[]
      } as Partial<IUser>);
    } catch (error) {
      console.error('Error removing user from group:', error);
      return null;
    }
  }

  /**
   * Check whether the supplied user belongs to the given group.
   */
  isUserInGroup(user: IUser, group: string): boolean {
  return user.groups?.map(g => String(g)).includes(group) || false;
  }

  /**
   * Convenience: check whether the user is an 'admin' group member.
   */
  isUserAdmin(user: IUser): boolean {
    return this.isUserInGroup(user, 'admin');
  }
}