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

#### Responses
- `201` success payload with the persisted `group` document.
- `400` when `name` or `createdBy` is missing.
- `500` for unexpected errors (see logs for details).

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

#### Responses
- `200` with updated `group` when found.
- `400` if `id` is missing.
- `404` if no group matches the provided `id`.
- `500` otherwise.

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

- Business logic is delegated to `GroupService` and `UserService`. The latter is used to populate member metadata on GET requests.
- Error handling is centralized via `handleError`, which normalizes unknown exceptions into a 500 JSON response while logging the original message.
- The handlers do not enforce authentication or authorization themselves; integrate route middleware or edge checks to restrict access where necessary.
