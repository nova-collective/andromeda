import { type ObjectId, Types } from 'mongoose';

import type { IUser, Permission } from '@/app/lib/types';

import { MongoDBUserRepository, MongoDBGroupRepository } from '@/app/lib/repositories';
import { comparePassword } from '@/app/lib/utils';

/**
 * UserService is a small application-level service that wraps
 * repository calls for user-related operations.
 */
export class UserService {
  private repository: MongoDBUserRepository;
  // Cached instance reused for group lookups — avoids creating a new
  // repository for every permission check which can be expensive.
  private groupRepository: MongoDBGroupRepository;

  /**
   * Accept repository instances for easier testing and DI. If omitted,
   * concrete MongoDB repository implementations are created for runtime use.
   *
   * @param repository - optional user repository instance
   * @param groupRepository - optional group repository instance
   */
  constructor(
    repository?: MongoDBUserRepository,
    groupRepository?: MongoDBGroupRepository
  ) {
    this.repository = repository ?? new MongoDBUserRepository();
    this.groupRepository = groupRepository ?? new MongoDBGroupRepository();
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

  /** Retrieve a user by email address */
  async getUserByEmail(email: string): Promise<IUser | null> {
    return this.repository.findByEmail(email);
  }

  /** Retrieve a user by username */
  async getUserByUsername(username: string): Promise<IUser | null> {
    return this.repository.findByUsername(username);
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
      { walletAddress }, 
      userData
    );
  }

  /**
   * Validate a plain-text password against the user's stored hash.
   * Returns `false` when the user has no password set or on error.
   */
  async validatePassword(user: IUser, password: string): Promise<boolean> {
    if (!user.password) {
      return false;
    }
    
    return await comparePassword(password, user.password);
  }
  /**
   * Add a user to a group (idempotent). Returns the updated user or null if
   * the user was not found.
   */
  async addUserToGroup(userId: string, group: string): Promise<IUser | null> {
    try {
      const user = await this.repository.findById(userId);
      if (!user) return null;

  const currentGroups = user.groups ?? [];
  if (!currentGroups.map((g) => String(g)).includes(group)) {
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

  const currentGroups = user.groups ?? [];
  const updatedGroups = currentGroups.filter((g) => String(g) !== group);
      
      return await this.repository.update(userId, {
        groups: updatedGroups as unknown as ObjectId[]
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
    const groups = user.groups ?? [];
    return groups.map((g) => String(g)).includes(group);
  }

  /**
   * Convenience: check whether the user is an 'admin' group member.
   */
  isUserAdmin(user: IUser): boolean {
    return this.isUserInGroup(user, 'admin');
  }

  /**
   * Get the concrete permission objects for a user.
   *
   * This returns the union of the user's explicit `permissions` and the
   * permissions granted by groups the user belongs to. Returned permissions
   * are de-duplicated by permission `name` (first seen wins).
   *
   * @param userId - string id of the user (ObjectId.toString())
   * @returns Array of permission objects (may be empty)
   */
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const user = await this.repository.findById(userId);
    if (!user) return [];

    const permsMap = new Map<string, Permission>();

    // Add explicit user permissions first (they take precedence)
    const userPermissions = Array.isArray(user.permissions) ? user.permissions : [];
    for (const p of userPermissions) {
      if (p && p.name) permsMap.set(p.name, p);
    }

    // Resolve permissions from groups using cached repository instance
    const groups = Array.isArray(user.groups) ? user.groups : [];
    for (const g of groups) {
      try {
        const groupId = typeof g === 'string' ? g : String(g);
        const group = await this.groupRepository.findById(groupId);
        if (group && Array.isArray(group.permissions)) {
          for (const gp of group.permissions) {
            if (gp && gp.name && !permsMap.has(gp.name)) {
              permsMap.set(gp.name, gp);
            }
          }
        }
      } catch (err) {
        // Ignore individual group resolution failures and continue
        console.error('Failed to resolve group permissions for', g, err);
      }
    }

    return Array.from(permsMap.values());
  }

  /**
   * Verify whether a user has a specific permission and CRUD capability.
   * 
   * If you expect to call this frequently, consider caching group lookups or the 
   * computed effective permissions per user (with a TTL) to reduce DB round-trips.
   *
   * @param userId - string id of the user (ObjectId.toString())
   * @param permissionName - name of the permission to check (e.g. 'users')
   * @param crud - one of 'read' | 'create' | 'update' | 'delete'
   * @returns boolean indicating whether the user has that CRUD capability for the permission
   */
  async verifyUserPermission(
    userId: string,
    permissionName: string,
    crud: keyof Permission['crud']
  ): Promise<boolean> {
    // Use getUserPermissions to resolve all effective permissions (user + groups)
    const permissions = await this.getUserPermissions(userId);
    const perm = permissions.find((p) => p.name === permissionName);
    if (perm && perm.crud && typeof perm.crud[crud] !== 'undefined') {
      return Boolean(perm.crud[crud]);
    }
    return false;
  }
}