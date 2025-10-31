import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/app/lib/auth/auth';
import { UserService } from '@/app/lib/services';
import { hashPassword, validatePasswordStrength } from '@/app/lib/utils';
import { AuthResponse, IUser, JWTPayload } from '@/app/lib/types';
import { ApiResponse, buildResponseBody, withAuthCookie } from '../helpers';

const userService = new UserService();

interface RegisterRequest {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

/**
 * POST /api/auth/register
 *
 * Registers a new account, enforcing basic validation, hashing the password,
 * and returning an authentication payload with a JWT cookie.
 */
export async function POST(request: NextRequest): Promise<ApiResponse> {
	try {
		const body = (await request.json()) as Partial<RegisterRequest>;
		const username = typeof body.username === 'string' ? body.username.trim() : '';
		const email = typeof body.email === 'string' ? body.email.trim() : '';
		const password = body.password;
		const confirmPassword = body.confirmPassword;

		if (!username || !email || !password || !confirmPassword) {
			return NextResponse.json(
				{ message: 'All fields are required' } as AuthResponse,
				{ status: 400 },
			);
		}

		if (password !== confirmPassword) {
			return NextResponse.json(
				{ message: 'Passwords do not match' } as AuthResponse,
				{ status: 400 },
			);
		}

		const passwordValidation = validatePasswordStrength(password);
		if (!passwordValidation.isValid) {
			return NextResponse.json(
				{ message: passwordValidation.error ?? 'Invalid password' } as AuthResponse,
				{ status: 400 },
			);
		}

		const existingUsername = await userService.getUserByUsername(username);
		if (existingUsername) {
			return NextResponse.json(
				{ message: 'Username already exists' } as AuthResponse,
				{ status: 400 },
			);
		}

		const existingEmail = await userService.getUserByEmail(email);
		if (existingEmail) {
			return NextResponse.json(
				{ message: 'Email already exists' } as AuthResponse,
				{ status: 400 },
			);
		}

		const hashedPassword = await hashPassword(password);

		const userPayload = {
			username,
			email,
			password: hashedPassword,
			walletAddress: '',
			settings: { theme: 'default', notifications: true },
			permissions: [],
			groups: [],
			lastLogin: new Date(),
		} as unknown as Omit<IUser, 'id' | 'createdAt'>;

		const createdUser = await userService.createUser(userPayload);

			const userId = createdUser._id
				? String(createdUser._id)
				: String((createdUser as unknown as { id?: string | number }).id);

			const groups = Array.isArray(createdUser.groups)
				? createdUser.groups.map((group) => String(group))
				: [];

			const rawPermissions = await userService.getUserPermissions(userId);
			const permissions: JWTPayload['permissions'] = rawPermissions.map((permission) => ({
				name: permission.name,
				description: permission.description,
				crud: {
					read: permission.crud.read,
					create: permission.crud.create,
					update: permission.crud.update,
					delete: permission.crud.delete,
				},
			}));

			const tokenPayload: JWTPayload = {
				userId,
				username: createdUser.username,
				groups,
				permissions,
			};

		const token = generateToken(tokenPayload);

		const responseBody = buildResponseBody(createdUser, token);
		responseBody.message = 'Registration successful';

		const response = NextResponse.json(responseBody, { status: 201 });
		return withAuthCookie(response as ApiResponse, token);
	} catch (error) {
		console.error('Registration error:', error);
		return NextResponse.json(
			{ message: 'Internal server error' } as AuthResponse,
			{ status: 500 },
		);
	}
}
