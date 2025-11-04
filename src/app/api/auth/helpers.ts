import { type NextResponse } from 'next/server';

import { TOKEN_EXPIRATION } from '@/app/lib/config';
import { type AuthResponse, type IUser, type JWTPayload, type Permission } from '@/app/lib/types';

export type ApiResponse = NextResponse<AuthResponse>;

/**
 * Normalize the user identifier to a string when available.
 * Falls back to `user.id` when `_id` is absent.
 */
function resolveStringId(user: IUser): string | number | undefined {
  if (user._id) {
    if (typeof user._id === 'object' && user._id !== null && 'toString' in user._id) {
      return String((user._id as { toString(): string }).toString());
    }
    if (typeof user._id === 'string') {
      return user._id;
    }
  }
  const fallback = (user as unknown as { id?: string | number }).id;
  return fallback;
}

/**
 * Compose the authentication response payload, optionally embedding an access token.
 * @param user - The authenticated user entity
 * @param token - Optional token issued for the session
 */
export function buildResponseBody(
  user: IUser,
  options: {
    token?: string;
    permissions?: JWTPayload['permissions'];
  } = {},
): AuthResponse {
  const idValue = resolveStringId(user);
  const id = typeof idValue === 'undefined' ? undefined : String(idValue);
  const groups = Array.isArray(user.groups)
    ? user.groups.map((group) => {
        if (typeof group === 'string') return group;
        if (typeof group === 'object' && group !== null && 'toString' in group) {
          return String((group as { toString(): string }).toString());
        }
        return '';
      }).filter((id) => id !== '')
    : [];
  const permissions = options.permissions ?? [];

  return {
    message: options.token ? 'Login successful' : 'Authenticated',
    user: {
      id,
      username: user.username,
      email: user.email,
      groups,
      permissions,
      ...(options.token
        ? {
            token: options.token,
            tokenExpiresIn: TOKEN_EXPIRATION,
          }
        : {}),
      lastLogin: user.lastLogin,
    },
  } as AuthResponse;
}

export function normalizePermissions(
  rawPermissions: Permission[],
): JWTPayload['permissions'] {
  return rawPermissions.map((permission) => ({
    name: permission.name,
    description: permission.description,
    crud: {
      read: Boolean(permission.crud?.read),
      create: Boolean(permission.crud?.create),
      update: Boolean(permission.crud?.update),
      delete: Boolean(permission.crud?.delete),
    },
  }));
}

/**
 * Attach the auth token to the response using the Authorization header.
 * Adds `Authorization: Bearer <token>` and exposes the header for CORS clients.
 */
export function withAuthHeader(response: ApiResponse, token: string): ApiResponse {
  response.headers.set('Authorization', `Bearer ${token}`);
  const exposeHeaders = response.headers.get('Access-Control-Expose-Headers');
  const headerNames = exposeHeaders ? exposeHeaders.split(',').map((name) => name.trim()) : [];
  if (!headerNames.includes('Authorization')) {
    const updated = [...headerNames.filter(Boolean), 'Authorization'].join(', ');
    response.headers.set('Access-Control-Expose-Headers', updated);
  }
  return response;
}
