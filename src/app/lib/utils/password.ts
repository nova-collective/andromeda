import bcrypt from 'bcryptjs';

/**
 * Password utility functions for hashing and comparing passwords.
 * Uses bcrypt for secure password hashing.
 */

/**
 * Hash a plain text password using bcrypt.
 * @param password - The plain text password to hash
 * @param saltRounds - Number of salt rounds (default: 12)
 * @returns Promise resolving to the hashed password
 */
export async function hashPassword(password: string, saltRounds: number = 12): Promise<string> {
  if (!password) {
    throw new Error('Password is required');
  }
  
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Failed to hash password: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Compare a plain text password with a hashed password.
 * @param password - The plain text password to verify
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise resolving to true if passwords match, false otherwise
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  if (!password || !hashedPassword) {
    return false;
  }
  
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
}

/**
 * Check if a string is already a bcrypt hash.
 * Bcrypt hashes start with $2a$, $2b$, $2x$, or $2y$ followed by cost and salt.
 * @param value - The string to check
 * @returns True if the string appears to be a bcrypt hash
 */
export function isBcryptHash(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }
  
  // Bcrypt hash pattern: $2[abxy]$[cost]$[22 char salt][31 char hash]
  const bcryptPattern = /^\$2[abxy]\$\d{2}\$[./A-Za-z0-9]{53}$/;
  return bcryptPattern.test(value);
}

/**
 * Validate password strength (basic validation).
 * @param password - The password to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validatePasswordStrength(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  // Add more validation rules as needed
  // e.g., require uppercase, lowercase, numbers, special characters
  
  return { isValid: true };
}