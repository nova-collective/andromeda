import { type NextResponse } from 'next/server';

import Joi from 'joi';
import { describe, expect, it, vi } from 'vitest';

import { validateRequestBody } from './helpers';

vi.mock('next/server', () => ({
	NextResponse: {
		json: vi.fn((payload, init = {}) => ({
			payload,
			init,
			status: init?.status ?? 200,
		})) as unknown as typeof NextResponse.json,
	},
}));

describe('validateRequestBody', () => {
	it('returns validated value when schema passes', () => {
		const schema = Joi.object({ name: Joi.string().required() });
		const validator = schema.validate.bind(schema);

		const result = validateRequestBody(validator, { name: 'Group' });

		expect(result.value).toEqual({ name: 'Group' });
		expect(result.errorResponse).toBeUndefined();
	});

	it('returns error response when validation fails', () => {
		const schema = Joi.object({ name: Joi.string().required() });
		const validator = schema.validate.bind(schema);

		const result = validateRequestBody(validator, {});

		expect(result.value).toBeUndefined();
		expect(result.errorResponse?.status).toBe(400);
		const { payload } = result.errorResponse as unknown as { payload: { error: string } };
		expect(payload.error).toContain('name');
	});

	it('aggregates multiple error messages', () => {
		const schema = Joi.object({
			name: Joi.string().required(),
			email: Joi.string().email().required(),
		}).prefs({ abortEarly: false });
		const validator = schema.validate.bind(schema);

		const result = validateRequestBody(validator, {});

		const { payload } = result.errorResponse as unknown as { payload: { error: string } };
		expect(payload.error).toContain('name');
		expect(payload.error).toContain('email');
	});
});
