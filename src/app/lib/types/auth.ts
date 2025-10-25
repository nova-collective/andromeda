/**
 * Represents an application user.
 *
 * Note: the `password` field is present in this type for internal use
 * (e.g. authentication). Do NOT return it to clients in API responses.
 */
export interface User {
  /** Unique numeric identifier for the user */
  id: number;
  /** Login username */
  username: string;
  /** Contact email address */
  email: string;
  /** User groups name (for example: 'admin' | 'user') */
  groups?: string[];
  /** Hashed password (internal only) */
  password: string;
  /** Optional account creation timestamp */
  createdAt?: Date;
}

/**
 * Payload stored in JWT tokens for authenticated users.
 *
 * - `userId`, `username` and `role` should be present for authenticated tokens.
 * - `iat` and `exp` are optional standard JWT timestamps (issued-at and expiry).
 */
export interface JWTPayload {
  /** Numeric id of the user that the token represents */
  userId: number;
  /** Username of the authenticated user */
  username: string;
  /** User groups attached to the token */
  groups: string[];
  /** Issued-at timestamp (optional) */
  iat?: number;
  /** Expiration timestamp (optional) */
  exp?: number;
}

/**
 * Standardized response shape for authentication endpoints.
 *
 * - `message` contains a human-readable status message.
 * - `user` is optional and, if present, omits sensitive fields such as `password`.
 */
export interface AuthResponse {
  message: string;
  user?: Omit<User, 'password'>;
}

/**
 * Request payload for login endpoints using username/password credentials.
 */
export interface LoginRequest {
  /** Username or login identifier */
  username: string;
  /** Plain-text password supplied by the client (over TLS) */
  password: string;
}