import { NextResponse } from 'next/server';

import type Joi from 'joi';

type JoiValidator<T> = (input: unknown) => Joi.ValidationResult<T>;

/**
 * Run a Joi validator against an unknown request body and build a standardized response.
 * @param validator - Joi validation function to execute.
 * @param body - raw request body to validate.
 * @returns Validated value when successful, or a JSON 400 response when invalid.
 */
export function validateRequestBody<T>(
  validator: JoiValidator<T>,
  body: unknown
): { value?: T; errorResponse?: NextResponse } {
  const { value, error } = validator(body);
  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');
    return { errorResponse: NextResponse.json({ error: message }, { status: 400 }) };
  }

  return { value };
}