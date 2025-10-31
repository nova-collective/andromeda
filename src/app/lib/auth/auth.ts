import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import type { NextApiResponse } from 'next';
import { JWTPayload } from '../types/auth';
import { TOKEN_EXPIRATION } from '../config';

/**
 * JWT secret used to sign and verify tokens. Must be set in the environment.
 * Casting to string here — if it's missing at runtime jwt operations will throw.
 */
const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * Convert the configured token expiration string into seconds.
 * Supports the shorthand suffixes recognized by many JWT utilities:
 *  - s (seconds)
 *  - m (minutes)
 *  - h (hours)
 *  - d (days)
 * Falls back to a 7 day default when parsing fails.
 */
function resolveTokenMaxAge(expiration: string): number {
  const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
  const match = /^\s*(\d+)\s*([smhd])?\s*$/i.exec(expiration);
  if (!match) {
    console.warn(
      `[auth] Invalid token expiration value "${expiration}". Falling back to default (${DEFAULT_MAX_AGE} seconds = 7 days).`
    );
    return DEFAULT_MAX_AGE;
  }

  const value = Number(match[1]);
  if (!Number.isFinite(value) || value <= 0) {
    console.warn(
      `[auth] Non-positive or non-numeric token expiration value "${expiration}". Falling back to default (${DEFAULT_MAX_AGE} seconds = 7 days).`
    );
    return DEFAULT_MAX_AGE;
  }

  const unit = (match[2] ?? 's').toLowerCase();
  const unitMap: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
  };

  return value * (unitMap[unit] ?? unitMap.s);
}

const JWT_EXPIRES_IN: SignOptions['expiresIn'] = TOKEN_EXPIRATION as SignOptions['expiresIn'];
export const TOKEN_MAX_AGE_SECONDS = resolveTokenMaxAge(TOKEN_EXPIRATION);

/**
 * Generate a signed JWT for the provided payload.
 *
 * @param payload - Data to include in the token (user id, username, role, etc.)
 * @returns A signed JWT string with configured expiry.
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
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
    console.warn('Token verification failed:', error);
    return null;
  }
}

/**
 * Set the authentication token as an HTTP-only cookie on the provided response.
 *
 * This helper uses a conservative cookie policy (HttpOnly, SameSite=Strict)
 * and sets Max-Age to the configured token expiration (defaulting to 7 days).
 *
 * @param res - Server response object (must implement setHeader)
 * @param token - Signed JWT string to set as cookie
 */
export function setTokenCookie(res: NextApiResponse, token: string): void {
  res.setHeader('Set-Cookie', [
    `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${TOKEN_MAX_AGE_SECONDS}; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`
  ]);
}

/**
 * Clear the authentication cookie by setting an expired cookie value.
 *
 * @param res - Server response object (must implement setHeader)
 */
export function clearTokenCookie(res: NextApiResponse): void {
  res.setHeader('Set-Cookie', [
    `token=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`
  ]);
}