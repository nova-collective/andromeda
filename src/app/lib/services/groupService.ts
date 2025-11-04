import { MongoDBGroupRepository } from '@/app/lib/repositories';
import { type IGroup } from '@/app/lib/types';

/**
 * GroupService wraps repository operations for group-related business logic.
 */
export class GroupService {
  private repository: MongoDBGroupRepository;

  constructor() {
    this.repository = new MongoDBGroupRepository();
  }

  /** Get a single group by id */
  async getGroupById(id: string): Promise<IGroup | null> {
    return this.repository.findById(id);
  }

  /** Get groups created by a specific wallet address */
  async getGroupsByCreator(createdBy: string): Promise<IGroup[]> {
    const query = { createdBy: createdBy.toLowerCase() };
    return this.repository.findAll(query);
  }

  /** Find a group by its name */
  async getGroupByName(name: string): Promise<IGroup | null> {
    return this.repository.findByField('name', name);
  }

  /** Retrieve all groups */
  async getAllGroups(): Promise<IGroup[]> {
    return this.repository.findAll();
  }

  /** Create a new group */
  async createGroup(groupData: Omit<IGroup, 'id' | 'createdAt'>): Promise<IGroup> {
    return this.repository.create(groupData);
  }

  /** Update a group by id */
  async updateGroup(id: string, groupData: Partial<IGroup>): Promise<IGroup | null> {
    return this.repository.update(id, groupData);
  }

  /** Delete a group by id */
  async deleteGroup(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  /** Add a user to a group (by user id) */
  async addUserToGroup(groupId: string, userId: string): Promise<IGroup | null> {
    return this.repository.addUser(groupId, userId);
  }

  /** Remove a user from a group (by user id) */
  async removeUserFromGroup(groupId: string, userId: string): Promise<IGroup | null> {
    return this.repository.removeUser(groupId, userId);
  }

  /** Find groups where a user id is a member */
  async getGroupsByUserId(userId: string): Promise<IGroup[]> {
    return this.repository.findByUserId(userId);
  }

  /** Get groups and optionally include members; filter by creator when provided */
  async getGroupsWithMembers(createdBy?: string): Promise<IGroup[]> {
    const query = createdBy ? { createdBy: createdBy.toLowerCase() } : {};
    return this.repository.findAll(query);
  }
}