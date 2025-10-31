import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/auth/auth';
import { MongoDBUserRepository } from '@/app/lib/repositories';
import { AuthResponse } from '@/app/lib/types';
import { buildResponseBody, ApiResponse } from '../helpers';

/**
 * GET /api/auth/me
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
