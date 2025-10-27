import mongoose, { Schema, Model } from 'mongoose';
import { IGroup } from '../types';

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
  members: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    default: []
  },
  // Permissions are embedded objects (application-level type), not DB refs
  permissions: {
    type: [
      {
        name: { type: String, required: true, enum: ['users', 'groups'] },
        description: { type: String },
        crud: {
          read: { type: Boolean, default: false },
          create: { type: Boolean, default: false },
          update: { type: Boolean, default: false },
          delete: { type: Boolean, default: false },
        },
      },
    ],
    default: [],
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