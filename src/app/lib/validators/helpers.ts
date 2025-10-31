import { NextResponse } from 'next/server';
import Joi from 'joi';

type JoiValidator<T> = (input: unknown) => Joi.ValidationResult<T>;

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