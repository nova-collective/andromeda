import { NextApiRequest, NextApiResponse } from 'next';
import { generateToken, setTokenCookie } from './auth';
import { MongoDBUserRepository } from '../repositories';
import { hashPassword, validatePasswordStrength } from '../utils';
import { AuthResponse, IUser } from '../types';

/**
 * Payload expected by the registration endpoint.
 *
 * This mirrors the client-side form values for creating a new account.
 */
interface RegisterRequest {
  /** Chosen display / login name */
  username: string;
  /** Contact email address */
  email: string;
  /** Plain-text password supplied by the client (must be sent over TLS) */
  password: string;
  /** Password confirmation, must match `password` */
  confirmPassword: string;
}

/**
 * Registration API route.
 *
 * Accepts a POST with a JSON body matching {@link RegisterRequest}. Validates
 * inputs, rejects duplicate usernames/emails, hashes the password, creates the
 * user via the repository, sets an authentication cookie, and returns an
 * {@link AuthResponse} containing a simplified user object.
 *
 * Responses:
 * - 201: Registration successful
 * - 400: Validation error (missing fields, duplicates, weak password)
 * - 405: Method not allowed
 * - 500: Internal server error
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Cast the incoming body to the expected DTO shape to avoid `any`.
  const body = req.body as unknown as RegisterRequest;
  const { username, email, password, confirmPassword } = body;

  try {
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Validate password strength using our utility
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.error || 'Invalid password' });
    }

    const repo = new MongoDBUserRepository();
    const existingUser = await repo.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const existingEmail = await repo.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashed = await hashPassword(password);

    // Construct a minimal DB user payload. Cast via unknown to satisfy the
    // repository signature without using `any`.
    const created = await repo.create({
      username,
      email,
      password: hashed,
      walletAddress: '',
      settings: { theme: 'default', notifications: true },
      groups: [],
      lastLogin: new Date(),
    } as unknown as Omit<IUser, 'id' | 'createdAt'>);

    /**
     * Local DB user shape used for safe property access.
     * @internal
     */
    type LocalDbUser = IUser & {
      _id?: { toString(): string } | string;
      id?: string | number;
      username?: string;
      email?: string;
      groups?: unknown[];
      lastLogin?: Date;
    };

    const newUser = created as unknown as LocalDbUser;

    const userId = newUser._id
      ? (typeof newUser._id === 'string' ? newUser._id : newUser._id.toString())
      : String(newUser.id);

    // Build JWT payload defensively and cast to the expected type.
    const jwtPayload = ({
      userId,
      username: newUser.username || '',
      // normalize groups to string[] for the token
      groups: newUser.groups ? newUser.groups.map((g) => String(g)) : [],
    } as unknown) as unknown as import('../types/auth').JWTPayload;

    const token = generateToken(jwtPayload);

    setTokenCookie(res, token);

    const response = {
      message: 'Registration successful',
      user: {
        id: userId,
        username: newUser.username,
        email: newUser.email,
        role: 'user',
      },
    } as unknown as AuthResponse;

    res.status(201).json(response);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Registration error:', message);
    res.status(500).json({ message: 'Internal server error' } as AuthResponse);
  }
}