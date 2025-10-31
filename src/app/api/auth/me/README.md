## Auth Me API

Handler for `/api/auth/me`, located in `route.ts`. Returns the authenticated user's profile
information. The route expects authentication middleware to attach user identity details to the
request context before execution.

### Endpoint Overview

- **Method**: `GET`
- **Consumes**: No request body
- **Produces**: JSON response containing the current user's profile data

### Expected Middleware State

The handler relies on upstream middleware (e.g., Next.js middleware, edge functions, or API route
wrappers) to:

1. Validate the session or token (JWT, API key, etc.).
2. Resolve the associated user id or wallet address.
3. Inject the resolved identity into the request via headers or custom properties (see
   `middleware.ts` for the project's implementation).

If the middleware fails to provide identity details, the route responds with `401`.

### Response Shape

Successful responses include the normalized user payload fetched from `UserService`:

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "user": {
    "id": "...",
    "walletAddress": "0x...",
    "username": "...",
    "email": "...",
    "permissions": ["..."],
    "groups": ["..."],
    "settings": { "theme": "dark", "notifications": true }
  }
}
```

Errors return:

- `401` when the request lacks authentication context
- `404` if the associated user cannot be found
- `500` for unexpected failures

### Implementation Notes

- `UserService.getUserById` (or wallet address, depending on middleware) performs the data lookup.
- The handler uses the shared `handleError` helper pattern to normalize server errors.
- Extend or customize the middleware to align with your chosen authentication strategy (JWT, API
  tokens, session cookies).
