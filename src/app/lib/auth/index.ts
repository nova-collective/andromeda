/**
 * Auth module re-exports.
 *
 * Provides token helpers and the API route handlers for auth-related
 * endpoints (login, me). Handlers are the default exports from their
 * respective modules and are re-exported here for convenience.
 */
import { generateToken, verifyToken, setTokenCookie, clearTokenCookie } from './auth';

export {
    generateToken,
    verifyToken,
    setTokenCookie,
    clearTokenCookie,
};