import { type NextRequest, NextResponse } from 'next/server';

import { extractBearerToken } from '../guard';
import { buildResponseBody, type ApiResponse, normalizePermissions } from '../helpers';

import { verifyToken } from '@/app/lib/auth/auth';
import { UserService } from '@/app/lib/services';
import { type AuthResponse } from '@/app/lib/types';

const userService = new UserService();

/**
 * GET /api/auth/me
 *
 * Validates the JWT supplied via the `Authorization` header and returns the associated
 * user object along with effective permissions. Returns 401 when the header is missing
 * or invalid.
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
