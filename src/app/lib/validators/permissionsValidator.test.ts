import { describe, expect, it } from 'vitest';
import { crudSchema, permissionSchema } from './permissionsValidator';

describe('permissionsValidator', () => {
	describe('crudSchema', () => {
		it('accepts valid CRUD flags', () => {
			const { error } = crudSchema.validate({ read: true, create: false, update: true, delete: false });
			expect(error).toBeUndefined();
		});

		it('rejects missing or non-boolean crud flags', () => {
			const { error } = crudSchema.validate({ read: true, create: 'yes', update: true });
			expect(error).toBeDefined();
		});
	});

	describe('permissionSchema', () => {
		it('validates complete permission object', () => {
			const permission = {
				name: 'User',
				description: 'Manage users',
				crud: { read: true, create: false, update: false, delete: false },
			};
			const { error, value } = permissionSchema.validate(permission);

			expect(error).toBeUndefined();
			expect(value).toEqual(permission);
		});

		it('rejects missing name or crud fields', () => {
			const { error } = permissionSchema.validate({ description: '', crud: { read: true, create: true, update: true, delete: true } });

			expect(error).toBeDefined();
			const { error: crudError } = permissionSchema.validate({ name: 'Test' });
			expect(crudError).toBeDefined();
		});

		it('trims name and allows empty description', () => {
			const permission = {
				name: '  Group  ',
				description: '',
				crud: { read: true, create: true, update: true, delete: true },
			};
			const { value } = permissionSchema.validate(permission);

			expect(value.name).toBe('Group');
			expect(value.description).toBe('');
		});
	});
});
