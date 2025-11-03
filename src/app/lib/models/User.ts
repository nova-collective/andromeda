import mongoose, { Schema } from 'mongoose';

import type { IUser } from '../types';
import type { Model } from 'mongoose';

/**
 * Mongoose schema for users. Mirrors the `IUser` application interface.
 * Fields:
 * - walletAddress: primary identifier for a user (unique, lowercased)
 * - username, email: optional profile fields
 * - settings: user preferences
 * - groups: references to Group documents
 * - createdAt, lastLogin: timestamps
 */
const userSchema: Schema<IUser> = new Schema({
  /**
   * The walletAddress field was changed from required to optional to support users
   * who register with alternative identifiers (username and email). Authentication
   * and identification can now be performed using username and email, both of which
   * are required and unique. This change allows for non-wallet-based user accounts
   * and improves flexibility in user onboarding.
   */
  walletAddress: {
    type: String,
    required: false,
    sparse: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  settings: {
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true },
  },
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'Group',
  }],
  permissions: [{
    name: { type: String, required: true },
    description: { type: String, required: false },
    crud: {
      read: { type: Boolean, required: true },
      create: { type: Boolean, required: true },
      update: { type: Boolean, required: true },
      delete: { type: Boolean, required: true },
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Mongoose Model for users. Import this default export to interact with the
 * users collection via Mongoose (queries, updates, etc.).
 */
const User: Model<IUser> = mongoose.models.User ?? mongoose.model<IUser>('User', userSchema);

export default User;