import { NextRequest, NextResponse } from 'next/server';
import { comparePassword } from '@/app/lib/utils';
import { MongoDBUserRepository } from '@/app/lib/repositories';
import { generateToken } from '@/app/lib/auth/auth';
import { AuthResponse, IUser, JWTPayload, LoginRequest } from '@/app/lib/types';
import { buildResponseBody, withAuthCookie, ApiResponse } from '../helpers';

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

    const repo = new MongoDBUserRepository();
    const user = await repo.findByUsername(username);

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
      await repo.update(id, { lastLogin: new Date() } as Partial<IUser>);
    } catch (error) {
      console.error('Failed to update lastLogin:', error);
    }

    const payload = {
      userId: user._id ? String(user._id) : String((user as { id?: string | number }).id),
      username: user.username,
      groups: Array.isArray(user.groups)
        ? user.groups.map((group) => String(group))
        : [],
    } as unknown as JWTPayload;

    const token = generateToken(payload);

    const response = NextResponse.json(buildResponseBody(user, token));
    return withAuthCookie(response as ApiResponse, token);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' } as AuthResponse,
      { status: 500 },
    );
  }
}
