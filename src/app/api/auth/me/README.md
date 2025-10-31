## Auth Me API

Handler for `/api/auth/me`, located in `route.ts`. Returns the authenticated user's profile
information together with merged permissions. The route reads the bearer token directly from the
`Authorization` header and does not depend on cookies or upstream context injection.

### Endpoint Overview

- **Method**: `GET`
- **Consumes**: No request body
- **Produces**: JSON response containing the current user's profile data

### Authentication Requirements

- Clients must send `Authorization: Bearer <JWT>` with the request.
- The JWT is verified server-side using the shared auth utilities.
- On success, the handler looks up the user by username and re-computes effective permissions via
  `UserService.getUserPermissions`.

If the header is missing or the token is invalid, the route responds with `401`.

### Response Shape

Successful responses use the shared `AuthResponse` shape:

```jsonc
{
  "message": "Authenticated",
  "user": {
    "id": "...",
    "username": "...",
    "email": "...",
    "groups": ["..."],
    "permissions": [
      {
        "name": "User",
        "crud": { "read": true, "create": false, "update": false, "delete": false }
      }
    ],
    "lastLogin": "2024-01-01T12:34:56.000Z"
  }
}
```

Errors return:

- `401` when the request lacks a valid bearer token
- `404` if the associated user cannot be found
- `500` for unexpected failures

### Implementation Notes

- `UserService.getUserByUsername` performs the data lookup and ensures Mongo-specific fields remain server-side.
- `normalizePermissions` converts Mongoose documents into JSON-safe objects for the response payload.
- Extend or customize the guard to align with your chosen authentication strategy (JWT bearer tokens, API keys, etc.).
