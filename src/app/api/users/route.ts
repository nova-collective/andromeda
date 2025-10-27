// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/app/lib/services';
import { hashPassword, isBcryptHash, validatePasswordStrength } from '@/app/lib/utils/password';

const userService = new UserService();

/**
 * Convert an unknown error into a JSON NextResponse with a 500 status.
 * Centralized so handlers can call it in catch blocks.
 * @param error - The thrown value
 */
function handleError(error: unknown): NextResponse {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  return NextResponse.json({ error: errorMessage }, { status: 500 });
}

/**
 * GET handler for `/api/users`.
 * Query params:
 * - `id`: return a single user by id
 * - `walletAddress`: return a single user by wallet address
 * Returns a single user or an array of users.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const walletAddress = searchParams.get('walletAddress');

    if (id) {
      const user = await userService.getUserById(id);
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
      return NextResponse.json(user);
    }

    if (walletAddress) {
      const user = await userService.getUserByWalletAddress(walletAddress);
      return NextResponse.json(user);
    }

    const users = await userService.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST handler to create or update a user by walletAddress.
 * Expects a JSON body containing at minimum:
 * - `walletAddress` (string)
 * Additional user fields may be provided and will be stored/merged.
 * If a password is provided, it will be hashed before storage.
 * Returns the created/updated user document.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    // Hash password if provided and not already hashed
    if (body.password && !isBcryptHash(body.password)) {
      // Validate password strength
      const validation = validatePasswordStrength(body.password);
      if (!validation.isValid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
      
      // Hash the password
      body.password = await hashPassword(body.password);
    }
    
    // body should contain at least `walletAddress`. The service will
    // lowercase it and perform an upsert (create or update).
    const user = await userService.upsertUser(body.walletAddress, body);
    return NextResponse.json(user);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT handler to update a user by id.
 * Expects a JSON body with:
 * - `id` (string) - the document id to update
 * - other fields to update
 * If a password is provided, it will be hashed before storage.
 * Returns the updated user document or 404 if not found.
 */
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Hash password if provided and not already hashed
    if (updateData.password && !isBcryptHash(updateData.password)) {
      // Validate password strength
      const validation = validatePasswordStrength(updateData.password);
      if (!validation.isValid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
      
      // Hash the password
      updateData.password = await hashPassword(updateData.password);
    }

    const user = await userService.updateUser(id, updateData);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE handler to remove a user by id via query parameter `id`.
 * Returns 200 with success flag or 404 if not found.
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const success = await userService.deleteUser(id);
    if (!success) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return handleError(error);
  }
}