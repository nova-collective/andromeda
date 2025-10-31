## Validators Module

Shared Joi schemas and helper utilities for API request validation.

### Overview

- **userValidator.ts** – payload schemas for user create/update operations plus uniqueness helpers.
- **groupValidator.ts** – schemas for group management with name uniqueness enforcement.
- **permissionsValidator.ts** – reusable schemas for permission CRUD definitions.
- **helpers.ts** – generic helpers like `validateRequestBody` to standardize validation flow.

### Usage

Import validators via the barrel file:

```ts
import {
	validateUpsertUser,
	validateCreateGroup,
	ensureGroupNameUnique,
	validateRequestBody,
} from '@/app/lib/validators';
```

In a route handler:

```ts
const rawBody = await request.json();
const { value, errorResponse } = validateRequestBody(validateCreateGroup, rawBody);
if (errorResponse) return errorResponse;

const conflict = await ensureGroupNameUnique(groupService, value.name);
if (conflict) return NextResponse.json({ error: conflict }, { status: 400 });
```

### Uniqueness Helpers

`ensureCreateUserUniqueness`, `ensureUpdateUserUniqueness`, and `ensureGroupNameUnique` accept a service implementing minimal lookup methods and return either `null` or a localized error string.

### Patterns

Regex patterns used across validators live in `src/app/lib/utils/patterns.ts`. Update patterns there when tightening validation rules.

