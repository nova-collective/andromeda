import { NextRequest, NextResponse } from 'next/server';
import { comparePassword } from '@/app/lib/utils';
import { MongoDBUserRepository } from '@/app/lib/repositories';
import {
  generateToken,
  verifyToken,
  TOKEN_MAX_AGE_SECONDS,
} from '@/app/lib/auth/auth';
import {
  AuthResponse,
  LoginRequest,
  IUser,
  JWTPayload,
} from '@/app/lib/types';
import { TOKEN_EXPIRATION } from '@/app/lib/config';

type ApiResponse = NextResponse<AuthResponse>;

/**
 * Build the JSON response body that the auth endpoints return.
 *
 * @param user - The user document fetched from the repository.
 * @param token - Optional JWT token (included on login responses).
 */
function buildResponseBody(
  user: IUser,
  token?: string,
): AuthResponse {
  const stringId = user._id ? String(user._id) : (user as unknown as { id?: string | number }).id;
  const groups = Array.isArray(user.groups)
    ? user.groups.map((group) => String(group))
    : [];

  return {
    message: token ? 'Login successful' : 'Authenticated',
    user: {
      id: stringId,
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
 *
 * @param response - Response object returned by NextResponse.json.
 * @param token - Signed JWT token to persist in the cookie.
 */
function withAuthCookie(response: ApiResponse, token: string): ApiResponse {
  response.cookies.set('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: TOKEN_MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  return response;
}

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

/**
 * GET /api/auth
 *
 * Validates the JWT stored in the `token` cookie and returns the associated
 * user object. Returns 401 when the cookie is missing or invalid.
 */
export async function GET(request: NextRequest): Promise<ApiResponse> {
  try {
    const token = request.cookies.get('token')?.value;

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

    const repo = new MongoDBUserRepository();
    const user = await repo.findByUsername(decoded.username);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' } as AuthResponse,
        { status: 401 },
      );
    }

    return NextResponse.json(buildResponseBody(user));
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Invalid token' } as AuthResponse,
      { status: 401 },
    );
  }
}