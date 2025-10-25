import { NextApiRequest, NextApiResponse } from 'next';
import { generateToken, setTokenCookie } from './auth';
import { MongoDBUserRepository } from '@/app/lib/repositories';
import bcrypt from 'bcryptjs';
import { LoginRequest, AuthResponse } from '@/app/lib/types';

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

    // If your user model supports an `isActive` flag, check it here.
    // The current `IUser` type used by the repository does not include `isActive`.

    const isValidPassword = await bcrypt.compare(password, (user as any).password || '');
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update lastLogin timestamp (best-effort)
    try {
      await repo.update(String((user as any)._id || user.id), { lastLogin: new Date() } as any);
    } catch (err) {
      console.error('Failed to update last login:', err);
    }

    const token = generateToken(({
      userId: (user as any)._id ? String((user as any)._id) : (user as any).id,
      username: user.username || '',
      role: 'user'
    } as unknown) as any);

    setTokenCookie(res, token);

    // Return a simplified user object. Cast to AuthResponse to satisfy
    // the declared response generic while keeping the repository-shaped
    // user document separate from our API contract.
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: (user as any)._id ? String((user as any)._id) : (user as any).id,
        username: user.username,
        email: user.email,
        role: 'user'
      }
    } as unknown as AuthResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}