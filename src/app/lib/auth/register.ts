import { NextApiRequest, NextApiResponse } from 'next';
import { generateToken, setTokenCookie } from './auth';
import { MongoDBUserRepository } from '../repositories';
import bcrypt from 'bcryptjs';
import { AuthResponse, IUser, User } from '../types';

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

  const { username, email, password, confirmPassword }: RegisterRequest = req.body;

  try {
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
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

    const hashed = await bcrypt.hash(password, 10);

    // The repository-backed IUser shape contains additional fields; cast
    // to `any` here so we can provide a minimal new user object.
    const newUser = await repo.create({
      username,
      email,
      password: hashed,
      walletAddress: '',
      settings: { theme: 'default', notifications: true },
      groups: [],
      lastLogin: new Date(),
    } as any);

    const token = generateToken(({
      userId: (newUser as any)._id ? String((newUser as any)._id) : (newUser as any).id,
      username: newUser.username || '',
      role: 'user'
    } as unknown) as any);

    setTokenCookie(res, token);

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: (newUser as any)._id ? String((newUser as any)._id) : (newUser as any).id,
        username: newUser.username,
        email: newUser.email,
        role: 'user'
      }
    } as unknown as AuthResponse);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}