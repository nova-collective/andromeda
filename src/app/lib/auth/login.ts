import { NextApiRequest, NextApiResponse } from 'next';
import { generateToken, setTokenCookie } from './auth';
import { MongoDBUserRepository } from '../repositories';
import { comparePassword } from '../utils';
import { LoginRequest, AuthResponse, IUser, JWTPayload } from '../types';

/**
 * POST /api/auth/login
 *
 * Authenticate a user using username and password. Expects a JSON body
 * matching {@link LoginRequest}. On success sets an auth cookie and returns
 * a simplified user object inside {@link AuthResponse}.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password }: LoginRequest = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const repo = new MongoDBUserRepository();
    const user = await repo.findByUsername(username);
    type LocalDbUser = IUser & {
      _id?: { toString(): string } | string;
      id?: string | number;
      password?: string;
      groups?: unknown[];
      username?: string;
      email?: string;
      lastLogin?: Date;
    };
    const dbUser = user as unknown as LocalDbUser;
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Validate password hash (user.password is expected to be a hash)
    const isValidPassword = await comparePassword(password, dbUser.password || '');
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Best-effort: update lastLogin timestamp (ignore failures)
    try {
      await repo.update(String(dbUser._id ? (typeof dbUser._id === 'string' ? dbUser._id : dbUser._id.toString()) : dbUser.id), { lastLogin: new Date() } as Partial<IUser>);
    } catch (err) {
      console.error('Failed to update lastLogin:', err);
    }

    const jwtPayload = {
      userId: dbUser._id ? (typeof dbUser._id === 'string' ? dbUser._id : dbUser._id.toString()) : String(dbUser.id),
      username: dbUser.username || '',
      groups: dbUser.groups ? dbUser.groups.map((g) => String(g)) : [],
    } as unknown as JWTPayload;

    const token = generateToken(jwtPayload);

    setTokenCookie(res, token);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: dbUser._id ? (typeof dbUser._id === 'string' ? dbUser._id : dbUser._id.toString()) : dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        groups: dbUser.groups ? dbUser.groups.map((g) => String(g)) : [],
        lastLogin: dbUser.lastLogin,
      },
    } as unknown as AuthResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}