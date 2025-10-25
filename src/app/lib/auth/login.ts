import { NextApiRequest, NextApiResponse } from 'next';
import { generateToken, setTokenCookie } from './auth';
import { MongoDBUserRepository } from '../repositories';
import bcrypt from 'bcryptjs';
import { LoginRequest, AuthResponse } from '../types';

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
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Validate password hash (user.password is expected to be a hash)
    const isValidPassword = await bcrypt.compare(password, (user as any).password || '');
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Best-effort: update lastLogin timestamp (ignore failures)
    try {
      await repo.update(String((user as any)._id || (user as any).id), { lastLogin: new Date() } as any);
    } catch (err) {
      console.error('Failed to update lastLogin:', err);
    }

    const token = generateToken(({
      userId: (user as any)._id ? String((user as any)._id) : (user as any).id,
      username: user.username || '',
      groups: (user as any).groups ? (user as any).groups.map((g: any) => String(g)) : []
    } as unknown) as any);

    setTokenCookie(res, token);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: (user as any)._id ? String((user as any)._id) : (user as any).id,
        username: user.username,
        email: user.email,
        groups: (user as any).groups ? (user as any).groups.map((g: any) => String(g)) : [],
        lastLogin: (user as any).lastLogin
      }
    } as unknown as AuthResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}