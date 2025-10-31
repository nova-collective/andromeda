import Joi from 'joi';

export const crudSchema = Joi.object({
	read: Joi.boolean().required(),
	create: Joi.boolean().required(),
	update: Joi.boolean().required(),
	delete: Joi.boolean().required(),
});

export const permissionSchema = Joi.object({
	name: Joi.string().trim().min(1).required(),
	description: Joi.string().trim().allow('', null),
	crud: crudSchema.required(),
});
