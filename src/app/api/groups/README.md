## Groups API

REST handlers for `/api/groups`, implemented in `route.ts`. All handlers return JSON with a consistent shape:

```json
{
	"success": boolean,
	"message": string,
	"group" | "groups" | "groupId": ...,
	"error"?: string
}
```

### Authorization

Handlers validate the `Authorization` bearer token (`Authorization: Bearer <token>`) and ensure the caller has `groups` permission with the relevant CRUD action:

- `POST` → `groups:create`
- `GET` → `groups:read`
- `PUT` → `groups:update`
- `DELETE` → `groups:delete`

### POST `/api/groups`

Create a new group document. Requires authentication at the caller level (middleware or client) before invoking the endpoint.

#### Request Body
```typescript
interface CreateGroupRequest {
	name: string;
	createdBy: string; // creator's user id or wallet address
	description?: string;
	members?: string[]; // user ids to associate immediately
	permissions?: Array<{ name: string; description?: string; crud: Record<'create'|'read'|'update'|'delete', boolean>; }>;
	settings?: { isPublic?: boolean; requiresApproval?: boolean; };
}
```

#### Validation & Responses
- The body is processed through `validateRequestBody(validateCreateGroup, body)`, so Joi error details map to a `400` response.
- `ensureGroupNameUnique` rejects duplicate names with a `400`.
- Successful requests return `200` with the new `group` document.
- `500` signals unexpected failures.

### GET `/api/groups`

Fetch groups. The handler optionally filters by creator and enriches each group's `members` array with lightweight user objects.

#### Query Parameters
- `createdBy` (optional): when present, only groups created by the supplied user are returned.

#### Response
```typescript
interface GroupListResponse {
	success: true;
	message: string;
	group: Array<
		IGroup & {
			members: Array<{ id: string; walletAddress?: string; username?: string; }>;
		}
	>;
}
```

Returned `members` omit users that cannot be resolved (the service logs a warning but continues).

### PUT `/api/groups`

Update an existing group. Only fields provided in the body are mutated.

#### Request Body
```typescript
interface UpdateGroupRequest {
	id: string; // required
	// Any subset of group fields to patch
	name?: string;
	description?: string;
	members?: string[];
	permissions?: CreateGroupRequest['permissions'];
	settings?: CreateGroupRequest['settings'];
}
```

#### Validation & Responses
- Bodies go through `validateRequestBody(validateUpdateGroup, body)` before applying changes.
- Renaming a group triggers `ensureGroupNameUnique`; duplicates produce a `400`.
- `200` returns the updated `group`, `404` indicates the group was not found, and `500` covers other errors.

### DELETE `/api/groups`

Remove a group by id supplied as a query parameter.

#### Query Parameters
- `id` (required): string identifier of the group to delete.

#### Responses
- `200` with `{ success: true, message, groupId }` when deletion succeeds.
- `400` when `id` is omitted.
- `404` if the group does not exist.
- `500` for unhandled failures.

### Implementation Notes

- `validateRequestBody` centralizes schema validation and consistent error messaging.
- Business logic is delegated to `GroupService` and `UserService`. The latter is used to populate member metadata on GET requests.
- `ensureGroupNameUnique` provides early conflict detection, complementing persistence-layer constraints.
- Error handling is centralized via `handleError`, which normalizes unknown exceptions into a 500 JSON response while logging the original message.
- `authorizeRequest` protects each handler by decoding the bearer token and enforcing scoped permissions.
