import Joi from 'joi';

/**
 * Joi schema describing CRUD capability flags on a permission. All flags are required booleans.
 */
export const crudSchema = Joi.object({
	read: Joi.boolean().required(),
	create: Joi.boolean().required(),
	update: Joi.boolean().required(),
	delete: Joi.boolean().required(),
});

/**
 * Joi schema for a permission object containing a name, optional description, and CRUD matrix.
 */
export const permissionSchema = Joi.object({
	name: Joi.string().trim().min(1).required(),
	description: Joi.string().trim().allow('', null),
	crud: crudSchema.required(),
});
