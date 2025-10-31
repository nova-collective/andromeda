import mainConfig from './mainConfig.json';

const authConfig = mainConfig.auth ?? {};
const jwtConfig = authConfig.jwt ?? {};

/**
 * Application-wide JWT expiration setting (for example: '7d').
 * Falls back to a default of '7d' if not provided in configuration.
 */
export const TOKEN_EXPIRATION: string = typeof jwtConfig.expiresIn === 'string' && jwtConfig.expiresIn.length > 0
  ? jwtConfig.expiresIn
  : '7d';

export default mainConfig;
