import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/auth/auth';
import { JWTPayload, Permission } from '@/app/lib/types';

export type CrudAction = keyof Permission['crud'];

interface AuthorizationSuccess {
  ok: true;
  payload: JWTPayload;
}

interface AuthorizationFailure {
  ok: false;
  response: NextResponse;
}

export type AuthorizationResult = AuthorizationSuccess | AuthorizationFailure;

/**
 * Extract a bearer token from the Authorization header.
 * Returns null when the header is missing or malformed.
 */
export function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization') ?? '';
  const match = /^\s*Bearer\s+(.+)$/i.exec(authHeader);
  return match ? match[1].trim() : null;
}

/**
 * Validate the bearer token supplied via the Authorization header and ensure
 * the payload grants the required permission for the specified CRUD action.
 */
export function authorizeRequest(
  request: NextRequest,
  permission: Permission['name'],
  action: CrudAction,
): AuthorizationResult {
  const token = extractBearerToken(request);
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      ),
    };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 },
      ),
    };
  }

  const permissions = Array.isArray(payload.permissions) ? payload.permissions : [];
  const matched = permissions.find((entry) => entry?.name === permission);

  if (!matched || !matched.crud?.[action]) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 },
      ),
    };
  }

  return { ok: true, payload };
}
