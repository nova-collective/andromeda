import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
  username?: string;
  email?: string;
  settings: {
    theme: string;
    notifications: boolean;
  };
  groups: Types.ObjectId[];
  createdAt: Date;
  lastLogin: Date;
}

export interface IGroup extends Document {
  name: string;
  description?: string;
  createdBy: string;
  members: Array<{
    walletAddress: string;
    role: 'admin' | 'member';
    joinedAt: Date;
  }>;
  permissions: {
    canInvite: boolean;
    canPost: boolean;
  };
  settings: {
    isPublic: boolean;
    requiresApproval: boolean;
  };
  createdAt: Date;
}