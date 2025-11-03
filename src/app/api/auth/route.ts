import { type NextRequest, NextResponse } from 'next/server';

import { extractBearerToken } from './guard';
import {
  type ApiResponse,
  buildResponseBody,
  normalizePermissions,
  withAuthHeader,
} from './helpers';

import { generateToken, verifyToken } from '@/app/lib/auth/auth';
import { UserService } from '@/app/lib/services';
import {
  type AuthResponse,
  type LoginRequest,
  type IUser,
  type JWTPayload,
} from '@/app/lib/types';
import { comparePassword } from '@/app/lib/utils';

const userService = new UserService();

/**
 * POST /api/auth
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

    // Update last login timestamp best-effort.
    try {
      const id = user._id ? String(user._id) : String((user as { id?: string | number }).id);
      await userService.updateUser(id, { lastLogin: new Date() } as Partial<IUser>);
    } catch (error) {
      console.error('Failed to update lastLogin:', error);
    }

    const userId = user._id ? String(user._id) : String((user as { id?: string | number }).id);
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

/**
 * GET /api/auth
 *
 * Validates the JWT supplied via the `Authorization` header and returns the associated
 * user object. Returns 401 when the header is missing or invalid.
 */
export async function GET(request: NextRequest): Promise<ApiResponse> {
  try {
    const token = extractBearerToken(request);

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' } as AuthResponse,
        { status: 401 },
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' } as AuthResponse,
        { status: 401 },
      );
    }

    const user = await userService.getUserByUsername(decoded.username);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' } as AuthResponse,
        { status: 401 },
      );
    }

    const userId = user._id ? String(user._id) : String((user as { id?: string | number }).id);
    const rawPermissions = await userService.getUserPermissions(userId);
    const permissions = normalizePermissions(rawPermissions);

    return NextResponse.json(buildResponseBody(user, { permissions }));
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Invalid token' } as AuthResponse,
      { status: 401 },
    );
  }
}