import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from './auth';
import { MongoDBUserRepository } from '../repositories';
import { AuthResponse } from '../types';

/**
 * GET /api/auth/me
 *
 * Validate the JWT stored in the `token` cookie and return a simplified
 * user object when authenticated. Returns 401 for missing/invalid tokens
 * and 405 for invalid methods.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const repo = new MongoDBUserRepository();
    const user = await repo.findByUsername(decoded.username);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Map DB user document to API-friendly shape. Handle ObjectId -> string
    // conversions and provide conservative defaults where appropriate.
    const apiUser = {
      id: (user as any)._id ? String((user as any)._id) : (user as any).id,
      username: user.username,
      email: user.email,
      groups: (user as any).groups ? (user as any).groups.map((g: any) => String(g)) : ['user'],
      lastLogin: (user as any).lastLogin
    };

    res.status(200).json({ message: 'Authenticated', user: apiUser } as unknown as AuthResponse);
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}