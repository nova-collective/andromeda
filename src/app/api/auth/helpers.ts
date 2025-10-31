import { NextResponse } from 'next/server';
import { TOKEN_MAX_AGE_SECONDS } from '@/app/lib/auth/auth';
import { TOKEN_EXPIRATION } from '@/app/lib/config';
import { AuthResponse, IUser } from '@/app/lib/types';

export type ApiResponse = NextResponse<AuthResponse>;

function resolveStringId(user: IUser): string | number | undefined {
  if (user._id) {
    return String(user._id);
  }
  const fallback = (user as unknown as { id?: string | number }).id;
  return fallback;
}

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
