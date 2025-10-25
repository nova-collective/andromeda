import { IUser } from '@/app/lib/types';
import { MongoDBUserRepository } from '@/app/lib/repositories';

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
}