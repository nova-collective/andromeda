import mongoose, { Schema, Model } from 'mongoose';
import { IPermission } from '../types';

/**
 * Mongoose schema for Permission documents.
 * Keeps shape aligned with the `IPermission` application interface.
 */
const permissionSchema: Schema<IPermission> = new Schema({
	name: { type: String, required: true, unique: true },
	description: { type: String },
	crud: {
		read: { type: Boolean, default: false },
		create: { type: Boolean, default: false },
		update: { type: Boolean, default: false },
		delete: { type: Boolean, default: false },
	},
});

/**
 * Mongoose model for permissions. Export as default to match other models.
 */
const Permission: Model<IPermission> =
	mongoose.models.Permission || mongoose.model<IPermission>('Permission', permissionSchema);

export default Permission;

