## Auth Register API

Handler for `POST /api/auth/register`, implemented in `route.ts`. Creates a new user account,
performs basic validation, and issues an authentication cookie on success.

### Request Body

```typescript
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

### Validation Steps

1. Ensure all fields are present.
2. Confirm `password` and `confirmPassword` match.
3. Run `validatePasswordStrength` to enforce baseline password rules.
4. Check for existing users by username and email.

Failures return `400` with a descriptive message.

### Creation Flow

- Hash the password with `hashPassword`.
- Create the user via `UserService.createUser`, populating default settings.
- Generate a JWT using `generateToken`.
- Build the response body with `buildResponseBody` and override the message to
  "Registration successful".
- Attach the token as an HTTP-only cookie using `withAuthCookie`.

### Responses

- `201` with `{ success: true, message: 'Registration successful', user, tokenExpiresIn }` and
  a `token` cookie on success.
- `400` for validation errors (missing fields, password mismatch, weak password, duplicates).
- `500` for unexpected errors.

### Notes

- Email format validation relies on upstream form checks; enhance with a dedicated validator if
  needed.
- The route currently seeds an empty `walletAddress`; adjust if wallet onboarding is part of
  registration.
- Apply rate limiting or captcha via middleware to mitigate abuse.
