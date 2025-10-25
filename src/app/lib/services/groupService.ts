import { IGroup, IGroupMember } from '@/app/lib/types';
import { MongoDBGroupRepository } from '@/app/lib/repositories/mongodbGroupRepository';

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

  /** Add a member to a group */
  async addMemberToGroup(groupId: string, member: IGroupMember): Promise<IGroup | null> {
    return this.repository.addMember(groupId, member);
  }

  /** Remove a member from a group */
  async removeMemberFromGroup(groupId: string, walletAddress: string): Promise<IGroup | null> {
    return this.repository.removeMember(groupId, walletAddress);
  }

  /** Update a member's role in a group */
  async updateMemberRole(groupId: string, walletAddress: string, role: string): Promise<IGroup | null> {
    return this.repository.updateMemberRole(groupId, walletAddress, role);
  }

  /** Find groups where a wallet address is a member */
  async getGroupsByMember(walletAddress: string): Promise<IGroup[]> {
    return this.repository.findByMember(walletAddress);
  }

  /** Get groups and optionally include members; filter by creator when provided */
  async getGroupsWithMembers(createdBy?: string): Promise<IGroup[]> {
    const query = createdBy ? { createdBy: createdBy.toLowerCase() } : {};
    return this.repository.findAll(query);
  }
}