import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from './auth';
import { MongoDBUserRepository } from '../repositories';
import { AuthResponse } from '../types';

/**
 * GET /api/auth/me
 *
 * Validate the authentication cookie (JWT) and return a simplified user
 * representation when authenticated.
 *
 * Responses:
 * - 200: { message, user }
 * - 401: Not authenticated / invalid token / user not found
 * - 405: Method not allowed
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

    // Shape the returned user to the AuthResponse contract. The DB user
    // document may have Mongoose/ObjectId fields; safely map them to strings
    // and provide conservative defaults for missing fields.
    res.status(200).json({
      message: 'Authenticated',
      user: {
        id: (user as any)._id ? String((user as any)._id) : (user as any).id,
        username: user.username,
        email: user.email,
        role: (user as any).role || 'user',
        lastLogin: (user as any).lastLogin
      }
    } as unknown as AuthResponse);
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}