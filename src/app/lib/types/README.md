# Type Definitions

This folder contains TypeScript type definitions used throughout the Andromeda application. The types are organized into logical modules and provide comprehensive typing for authentication, database entities, and data access patterns.

## Files Overview

- **`auth.ts`** - Authentication-related types (users, JWT, login/register)
- **`database.ts`** - Database entity interfaces and repository patterns
- **`index.ts`** - Central export barrel for all types

## Authentication Types (`auth.ts`)

### `User`
Represents an application user for authentication purposes.

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  groups?: string[];
  password: string; // ⚠️ Internal only - never return to clients
  createdAt?: Date;
}
```

**Security Note**: The `password` field contains hashed passwords and should never be returned in API responses.

### `JWTPayload`
Payload structure for JWT authentication tokens.

```typescript
interface JWTPayload {
  userId: number;
  username: string;
  groups: string[];
  iat?: number; // Issued at
  exp?: number; // Expires at
}
```

### `AuthResponse`
Standardized response format for authentication endpoints.

```typescript
interface AuthResponse {
  message: string;
  user?: Omit<User, 'password'>; // Safe user object without password
}
```

### `LoginRequest`
Request payload for login endpoints.

```typescript
interface LoginRequest {
  username: string;
  password: string; // Plain text (sent over TLS)
}
```

### `Permission`
Permission system for users and groups with CRUD capabilities.

```typescript
type Permission = {
  name: 'users' | 'groups'; // Restricted to known resources
  description?: string;
  crud: {
    read: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}
```

## Database Types (`database.ts`)

### `IUser`
Database document interface for users (extends Mongoose Document).

```typescript
interface IUser extends Document {
  walletAddress: string;    // Unique identifier
  username: string;
  email: string;
  password: string;         // Bcrypt hashed
  settings: {
    theme: string;
    notifications: boolean;
  };
  permissions: Permission[]; // Direct user permissions
  groups: ObjectId[];       // Group memberships
  createdAt: Date;
  lastLogin: Date;
}
```

### `IGroup`
Database document interface for groups.

```typescript
interface IGroup {
  id?: string;
  name: string;
  description?: string;
  createdBy: string;        // Wallet address of creator
  members: ObjectId[];      // User references
  permissions: Permission[]; // Group-level permissions
  settings: {
    isPublic: boolean;
    requiresApproval: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
```

### `Repository<T>`
Generic repository interface for data access layers.

```typescript
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findByField(field: keyof T & string, value: unknown): Promise<T | null>;
  findAll(query?: Record<string, unknown>): Promise<T[]>;
  create(data: Omit<T, 'id' | 'createdAt'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  upsert(filter: Record<string, unknown>, data: Partial<T>): Promise<T>;
}
```

## Usage Examples

### Importing Types

```typescript
// Import specific types
import { IUser, Permission } from '@/app/lib/types';

// Import from specific modules
import { AuthResponse } from '@/app/lib/types/auth';
import { Repository } from '@/app/lib/types/database';
```

### Using in Services

```typescript
import { IUser, Permission } from '@/app/lib/types';

class UserService {
  async createUser(userData: Omit<IUser, 'id' | 'createdAt'>): Promise<IUser> {
    // Implementation
  }
  
  async getUserPermissions(userId: string): Promise<Permission[]> {
    // Implementation
  }
}
```

### Using in API Routes

```typescript
import { AuthResponse, LoginRequest } from '@/app/lib/types';

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  const body: LoginRequest = await request.json();
  // Handle login logic
  return NextResponse.json({ message: 'Login successful', user: safeUser });
}
```

## Type Safety Guidelines

1. **Never expose passwords**: Always use `Omit<User, 'password'>` for client responses
2. **Use proper error handling**: Cast unknown errors appropriately
3. **Validate input data**: Use type guards or validation libraries for request payloads
4. **Repository patterns**: Use the `Repository<T>` interface for consistent data access
5. **Permission checking**: Always validate permissions using the `Permission` type

## Permission System

The application uses a hierarchical permission system:

1. **User permissions**: Direct permissions assigned to users (highest priority)
2. **Group permissions**: Permissions inherited from group membership
3. **CRUD operations**: Each permission specifies create/read/update/delete capabilities
4. **Resource-based**: Currently supports 'users' and 'groups' resources

### Permission Priority
- User-level permissions take precedence over group permissions
- First matching permission determines access level
- Permissions are checked in order: user permissions first, then group permissions

## Best Practices

1. **Type imports**: Use specific imports to avoid circular dependencies
2. **Generic constraints**: Use `keyof T & string` for type-safe field access
3. **Partial updates**: Use `Partial<T>` for update operations
4. **Safe casting**: Cast via `unknown` when necessary, avoid `any`
5. **Documentation**: Include JSDoc comments for complex types
6. **Validation**: Always validate data at API boundaries

## Security Considerations

- Passwords are always stored as bcrypt hashes
- JWT tokens contain only necessary user identification
- Permission names are restricted to known resources
- Database ObjectIds are properly typed and validated
- API responses exclude sensitive fields automatically