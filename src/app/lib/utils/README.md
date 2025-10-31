# Validation Utilities

Helpers under this directory support authentication and request validation.
`index.ts` re-exports the modules so consumers can import from `@/app/lib/utils`.

## Password Helpers

All password helpers live in `password.ts` and wrap `bcryptjs`.

- `hashPassword(password: string, saltRounds = 12)` returns a bcrypt hash.
- `comparePassword(password: string, hashedPassword: string)` verifies a hash.
- `isBcryptHash(value: string)` detects whether the input already looks hashed.
- `validatePasswordStrength(password: string)` enforces the baseline complexity rules used by the API validators.

```typescript
import { hashPassword, validatePasswordStrength } from '@/app/lib/utils';

const { isValid, error } = validatePasswordStrength(candidatePassword);
if (!isValid) throw new Error(error);

const hashedPassword = await hashPassword(candidatePassword);
```

These helpers are consumed by the `/api/users`, `/api/auth/login`, and
`/api/auth/register` routes to keep hashing and comparison logic consistent.

## Pattern Constants

`patterns.ts` centralizes regular expressions referenced by the validators.

- `objectIdPattern` matches a 24-character MongoDB ObjectId.
- `usernamePattern` allows 3-32 characters using alphanumerics, dot, underscore, or hyphen.
- `emailPattern` enforces a simple RFC-style email shape for form validation.
- `passwordPattern` requires uppercase, lowercase, numeric, and symbol characters.
- `walletPattern` accepts Ethereum-like `0x...` addresses or 3-64 character aliases.
- `groupNamePattern` ensures group names start alphanumeric and permit spaces, underscores, or hyphens.

```typescript
import { usernamePattern } from '@/app/lib/utils';

const isValidUsername = usernamePattern.test(candidateUsername);
```

Validators pull these constants to guarantee requests and database writes share the
same validation rules.

## Testing

Run `node test-password-utils.mjs` from the repository root to execute the password utility smoke tests.