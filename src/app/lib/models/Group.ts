import mongoose, { Schema, Model } from 'mongoose';
import { IGroup } from '../types/database';

/**
 * Mongoose schema for the Group collection.
 * Fields align with the `IGroup` application interface.
 */
const groupSchema: Schema<IGroup> = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  createdBy: {
    type: String,
    required: true,
  },
  members: [{
    walletAddress: String,
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now },
  }],
  permissions: {
    canInvite: { type: Boolean, default: true },
    canPost: { type: Boolean, default: true },
  },
  settings: {
    isPublic: { type: Boolean, default: false },
    requiresApproval: { type: Boolean, default: false },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Mongoose model for groups. Exported as the default so application code
 * can `import Group from '@/app/lib/models/Group'` and use Mongoose model methods.
 */
const Group: Model<IGroup> = mongoose.models.Group || mongoose.model<IGroup>('Group', groupSchema);

export default Group;