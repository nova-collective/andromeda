import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '../types';

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
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  settings: {
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true },
  },
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'Group',
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
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;