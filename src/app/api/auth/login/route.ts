import { type NextRequest, NextResponse } from 'next/server';


import { generateToken } from '@/app/lib/auth/auth';
import { UserService } from '@/app/lib/services';
import { type AuthResponse, type IUser, type JWTPayload, type LoginRequest } from '@/app/lib/types';
import { comparePassword } from '@/app/lib/utils';

import { buildResponseBody, withAuthHeader, type ApiResponse, normalizePermissions } from '../helpers';


const userService = new UserService();

/**
 * POST /api/auth/login
 *
 * Authenticates a user via username and password, issuing a JWT on success.
 *
 * Expected request payload:
 * {
 *   "username": "alice",
 *   "password": "plaintext password"
 * }
 */
export async function POST(request: NextRequest): Promise<ApiResponse> {
  try {
    const body = (await request.json()) as Partial<LoginRequest>;
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' } as AuthResponse,
        { status: 400 },
      );
    }

    const user = await userService.getUserByUsername(username);

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' } as AuthResponse,
        { status: 401 },
      );
    }

    const passwordValid = await comparePassword(password, user.password ?? '');
    if (!passwordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' } as AuthResponse,
        { status: 401 },
      );
    }

    const userId = user._id ? String(user._id) : String((user as { id?: string | number }).id);

    // Update last login timestamp best-effort.
    try {
      await userService.updateUser(userId, { lastLogin: new Date() } as Partial<IUser>);
    } catch (error) {
      console.error('Failed to update lastLogin:', error);
    }

    const groups = Array.isArray(user.groups)
      ? user.groups.map((group) => String(group))
      : [];

    const rawPermissions = await userService.getUserPermissions(userId);
    const permissions = normalizePermissions(rawPermissions);

    const payload: JWTPayload = {
      userId,
      username: user.username,
      groups,
      permissions,
    };

    const token = generateToken(payload);

    const response = NextResponse.json(
      buildResponseBody(user, { token, permissions }),
    ) as ApiResponse;
    return withAuthHeader(response, token);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' } as AuthResponse,
      { status: 500 },
    );
  }
}
