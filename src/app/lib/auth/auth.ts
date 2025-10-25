import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/auth';

/**
 * JWT secret used to sign and verify tokens. Must be set in the environment.
 * Casting to string here — if it's missing at runtime jwt operations will throw.
 */
const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * Generate a signed JWT for the provided payload.
 *
 * @param payload - Data to include in the token (user id, username, role, etc.)
 * @returns A signed JWT string with a 7-day expiry.
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify and decode a JWT.
 *
 * Returns the decoded payload when verification succeeds, or null if the
 * token is invalid or verification fails.
 *
 * @param token - JWT string to verify
 * @returns Decoded JWTPayload or null on failure
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Set the authentication token as an HTTP-only cookie on the provided response.
 *
 * This helper uses a conservative cookie policy (HttpOnly, SameSite=Strict)
 * and sets Max-Age to 7 days to match the token expiry.
 *
 * @param res - Server response object (must implement setHeader)
 * @param token - Signed JWT string to set as cookie
 */
export function setTokenCookie(res: any, token: string): void {
  res.setHeader('Set-Cookie', [
    `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`
  ]);
}

/**
 * Clear the authentication cookie by setting an expired cookie value.
 *
 * @param res - Server response object (must implement setHeader)
 */
export function clearTokenCookie(res: any): void {
  res.setHeader('Set-Cookie', [
    `token=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`
  ]);
}