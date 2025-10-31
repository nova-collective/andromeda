import { NextResponse } from 'next/server';
import { TOKEN_MAX_AGE_SECONDS } from '@/app/lib/auth/auth';
import { TOKEN_EXPIRATION } from '@/app/lib/config';
import { AuthResponse, IUser } from '@/app/lib/types';

export type ApiResponse = NextResponse<AuthResponse>;

/**
 * Normalize the user identifier to a string when available.
 * Falls back to `user.id` when `_id` is absent.
 */
function resolveStringId(user: IUser): string | number | undefined {
  if (user._id) {
    return String(user._id);
  }
  const fallback = (user as unknown as { id?: string | number }).id;
  return fallback;
}

/**
 * Compose the authentication response payload, optionally embedding an access token.
 * @param user - The authenticated user entity
 * @param token - Optional token issued for the session
 */
export function buildResponseBody(user: IUser, token?: string): AuthResponse {
  const id = resolveStringId(user);
  const groups = Array.isArray(user.groups)
    ? user.groups.map((group) => String(group))
    : [];

  return {
    message: token ? 'Login successful' : 'Authenticated',
    user: {
      id,
      username: user.username,
      email: user.email,
      groups,
      ...(token
        ? {
            token,
            tokenExpiresIn: TOKEN_EXPIRATION,
          }
        : {}),
      lastLogin: user.lastLogin,
    },
  } as AuthResponse;
}

/**
 * Attach the auth token as an HTTP-only cookie on the response.
 * @param response - The response to decorate
 * @param token - The token value to store
 */
export function withAuthCookie(response: ApiResponse, token: string): ApiResponse {
  response.cookies.set('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: TOKEN_MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  return response;
}
