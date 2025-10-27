# Password Utilities

This module provides secure password handling utilities using bcrypt for hashing and validation.

## Functions

### `hashPassword(password: string, saltRounds?: number): Promise<string>`

Hashes a plain text password using bcrypt.

- **password**: The plain text password to hash
- **saltRounds**: Number of salt rounds (default: 12)
- **returns**: Promise resolving to the hashed password

```typescript
import { hashPassword } from '@/app/lib/utils/password';

const hashedPassword = await hashPassword('myPassword123');
```

### `comparePassword(password: string, hashedPassword: string): Promise<boolean>`

Compares a plain text password with a hashed password.

- **password**: The plain text password to verify
- **hashedPassword**: The hashed password to compare against
- **returns**: Promise resolving to true if passwords match, false otherwise

```typescript
import { comparePassword } from '@/app/lib/utils/password';

const isValid = await comparePassword('myPassword123', hashedPassword);
```

### `isBcryptHash(value: string): boolean`

Checks if a string is already a bcrypt hash.

- **value**: The string to check
- **returns**: True if the string appears to be a bcrypt hash

```typescript
import { isBcryptHash } from '@/app/lib/utils/password';

const isHash = isBcryptHash('$2a$12$...');
```

### `validatePasswordStrength(password: string): { isValid: boolean; error?: string }`

Validates password strength (basic validation).

- **password**: The password to validate
- **returns**: Object with isValid boolean and error message if invalid

```typescript
import { validatePasswordStrength } from '@/app/lib/utils/password';

const validation = validatePasswordStrength('myPassword123');
if (!validation.isValid) {
  console.error(validation.error);
}
```

## Usage in API Routes

The password utilities are automatically used in:

- **POST /api/users**: Hashes passwords when creating users
- **PUT /api/users**: Hashes passwords when updating user passwords
- **POST /api/auth/login**: Compares passwords during authentication
- **POST /api/auth/register**: Hashes passwords during registration

## Security Features

- **Secure hashing**: Uses bcrypt with configurable salt rounds (default: 12)
- **Password validation**: Ensures minimum password requirements
- **Hash detection**: Prevents double-hashing of already hashed passwords
- **Error handling**: Graceful error handling with appropriate logging

## Testing

Run the test script to verify functionality:

```bash
node test-password-utils.mjs
```