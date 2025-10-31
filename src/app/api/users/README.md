## Users API

Handlers for `/api/users`, defined in `route.ts`. Responses follow a consistent JSON shape:

```json
{
	"success": boolean,
	"message": string,
	"user" | "users" | "userId"?: ...,
	"error"?: string
}
```

### GET `/api/users`

Retrieve users. Supports optional filters to fetch a single record.

#### Query Parameters
- `id` (optional): when provided, returns a single user by document id.
- `walletAddress` (optional): fetch by wallet address. Ignored if `id` is supplied.

#### Responses
- `200` with either `{ user }` or `{ users }` depending on the query.
- `404` when `id` is given but no user matches.
- `500` on unexpected failures.

### POST `/api/users`

Create or update a user keyed by wallet address (`upsert`). Intended for administrative flows where the server controls the payload.

#### Request Body
```typescript
interface UpsertUserRequest {
	walletAddress: string;
	username?: string;
	email?: string;
	password?: string; // plaintext; hashed server-side
	groups?: string[];
	permissions?: Permission[];
	settings?: { theme?: string; notifications?: boolean };
}
```

#### Validation & Side Effects
- Passwords are validated for strength and hashed unless already a bcrypt hash.
- Username and email must be unique; the handler returns `400` if duplicates are detected.
- Delegates persistence to `UserService.upsertUser`, which lowercases the wallet address and applies timestamps.

#### Responses
- `200` with `{ user }` on success.
- `400` when validation fails (missing wallet, weak password, duplicate username/email).
- `500` otherwise.

### PUT `/api/users`

Update an existing user by document id.

#### Request Body
```typescript
interface UpdateUserRequest {
	id: string; // required
	username?: string;
	email?: string;
	password?: string; // plaintext allowed
	groups?: string[];
	permissions?: Permission[];
	walletAddress?: string;
	settings?: { theme?: string; notifications?: boolean };
}
```

Passwords undergo the same validation/hashing path as the POST handler. Username/email uniqueness errors return a `400`.

#### Responses
- `200` with updated `{ user }`.
- `400` when `id` is missing or uniqueness rules fail.
- `404` if the user does not exist.
- `500` for other errors.

### DELETE `/api/users`

Remove a user by id via query string.

#### Query Parameters
- `id`: string identifier of the user to delete (required).

#### Responses
- `200` with `{ success: true, message, userId }` on success.
- `400` if `id` is omitted.
- `404` when the user cannot be found.
- `500` for unexpected errors.

### Implementation Notes

- `UserService` encapsulates data access and password utilities, keeping route handlers thin.
- Password validation/hashing uses helpers in `src/app/lib/utils/password`.
- Duplicate username/email protection is handled both at the repository layer (MongoDB unique indexes) and with pre-flight checks in the POST handler to provide clear 400 responses.
- Authorization is not enforced in this file; secure these routes with middleware or edge protection suited to your deployment.
