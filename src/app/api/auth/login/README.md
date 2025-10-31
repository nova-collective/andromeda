## Auth Login API

Handler for `/api/auth/login`, located in `route.ts`. Accepts wallet/password credentials,
validates them with shared helpers, and issues session responses.

### Endpoint Overview

- **Method**: `POST`
- **Consumes**: JSON body containing login credentials
- **Produces**: JSON response indicating authentication status

### Request Body

```typescript
interface LoginRequest {
  walletAddress?: string;
  usernameOrEmail?: string;
  password: string;
}
```

At least one of `walletAddress` or `usernameOrEmail` must be provided. The validators enforce
format rules using the shared regex patterns in `@/app/lib/utils`.

### Validation Flow

The handler uses `validateRequestBody` together with the `validateLoginCredentials` schema to:

- strip unknown fields
- enforce required identifiers and password complexity
- normalize values before service invocation

Invalid payloads return `400` with a Joi-derived error message.

### Authentication Flow

1. Determine the lookup key (wallet address or username/email).
2. Use `UserService` to fetch the user record.
3. Compare the provided password against the stored hash with `comparePassword`.
4. On success, issue a response containing `success: true`, a descriptive `message`, and minimal
   user metadata (e.g., `id`, `walletAddress`, `username`).

Failures produce:

- `401` when credentials are wrong or the user does not exist
- `500` when an unexpected error bubbles up (logged server-side)

### Response Shape

```json
{
  "success": boolean,
  "message": string,
  "user"?: {
    "id": string,
    "walletAddress": string,
    "username"?: string,
    "email"?: string
  },
  "error"?: string
}
```

### Implementation Notes

- Password hashing and comparison reuse the helpers in `@/app/lib/utils/password`.
- The route does not mint tokens directly; integrate with your session or token issuance logic
  after a successful login response.
- Apply middleware to guard the endpoint against brute-force attempts (rate limiting, captcha,
  etc.) as needed for your deployment.
