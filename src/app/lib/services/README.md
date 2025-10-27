# Services Layer

This folder contains the business logic services for the Andromeda application. Services act as an intermediary layer between API routes and data repositories, providing business logic, validation, and coordination between different data sources.

## Architecture Overview

```
API Routes → Services → Repositories → Database
```

- **API Routes**: Handle HTTP requests and responses
- **Services**: Business logic, validation, and coordination
- **Repositories**: Data access abstraction layer
- **Database**: MongoDB with Mongoose

## Files Overview

- **`userService.ts`** - User management and authentication business logic
- **`groupService.ts`** - Group management and membership operations
- **`index.ts`** - Central export barrel for all services

## UserService

The `UserService` handles all user-related business operations including authentication, permissions, and group membership.

### Constructor

```typescript
constructor(
  repository?: MongoDBUserRepository,
  groupRepository?: MongoDBGroupRepository
)
```

Supports dependency injection for testing. If no repositories are provided, creates default MongoDB implementations.

### Core User Operations

#### User CRUD Operations
```typescript
// Retrieve users
async getUserById(id: string): Promise<IUser | null>
async getUserByWalletAddress(walletAddress: string): Promise<IUser | null>
async getAllUsers(): Promise<IUser[]>

// Create and update users
async createUser(userData: Omit<IUser, 'id' | 'createdAt'>): Promise<IUser>
async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null>
async upsertUser(walletAddress: string, userData: Partial<IUser>): Promise<IUser>

// Delete users
async deleteUser(id: string): Promise<boolean>
```

#### Authentication
```typescript
// Password validation using bcrypt
async validatePassword(user: IUser, password: string): Promise<boolean>
```

**Security Note**: Passwords are automatically hashed using the password utilities before storage.

### Group Management

#### User-Group Relationships
```typescript
// Add/remove users from groups
async addUserToGroup(userId: string, group: string): Promise<IUser | null>
async removeUserFromGroup(userId: string, group: string): Promise<IUser | null>

// Check group membership
isUserInGroup(user: IUser, group: string): boolean
isUserAdmin(user: IUser): boolean
```

### Permission System

#### Permission Resolution
```typescript
// Get effective permissions (user + group permissions)
async getUserPermissions(userId: string): Promise<Permission[]>

// Verify specific permission and CRUD capability
async verifyUserPermission(
  userId: string,
  permissionName: string,
  crud: keyof Permission['crud']
): Promise<boolean>
```

**Permission Hierarchy**:
1. User-level permissions (highest priority)
2. Group-level permissions (inherited)
3. Permissions are deduplicated by name (first seen wins)

## GroupService

The `GroupService` manages group operations, membership, and group-level permissions.

### Constructor

```typescript
constructor(repository?: MongoDBGroupRepository)
```

Supports dependency injection for testing. Creates default MongoDB repository if none provided.

### Group Operations

#### Basic CRUD
```typescript
// Retrieve groups
async getGroupById(id: string): Promise<IGroup | null>
async getAllGroups(): Promise<IGroup[]>
async getGroupsByCreator(createdBy: string): Promise<IGroup[]>

// Create and update groups
async createGroup(groupData: Omit<IGroup, 'id' | 'createdAt'>): Promise<IGroup>
async updateGroup(id: string, groupData: Partial<IGroup>): Promise<IGroup | null>

// Delete groups
async deleteGroup(id: string): Promise<boolean>
```

#### Membership Management
```typescript
// User membership operations
async addUserToGroup(groupId: string, userId: string): Promise<IGroup | null>
async removeUserFromGroup(groupId: string, userId: string): Promise<IGroup | null>

// Find groups by user
async getGroupsByUserId(userId: string): Promise<IGroup[]>
async getGroupsWithMembers(createdBy?: string): Promise<IGroup[]>
```

**Note**: The `updateUserRole` method is deprecated and throws an error, as group-level user roles were removed from the data model.

## Usage Examples

### Basic Service Usage

```typescript
import { UserService, GroupService } from '@/app/lib/services';

// Create service instances
const userService = new UserService();
const groupService = new GroupService();

// User operations
const user = await userService.getUserById('user123');
const groups = await groupService.getGroupsByUserId('user123');
```

### Dependency Injection (Testing)

```typescript
import { UserService } from '@/app/lib/services';
import { MockUserRepository, MockGroupRepository } from './mocks';

// Inject mock repositories for testing
const userService = new UserService(
  new MockUserRepository(),
  new MockGroupRepository()
);
```

### Permission Checking

```typescript
import { UserService } from '@/app/lib/services';

const userService = new UserService();

// Check if user can create groups
const canCreate = await userService.verifyUserPermission(
  'user123',
  'groups',
  'create'
);

if (canCreate) {
  // User has permission to create groups
}
```

### API Route Integration

```typescript
import { UserService } from '@/app/lib/services';
import { NextRequest, NextResponse } from 'next/server';

const userService = new UserService();

export async function GET(request: NextRequest) {
  try {
    const users = await userService.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
```

## Error Handling

Services use defensive programming patterns:

- Return `null` for not-found scenarios
- Return `boolean` for success/failure operations
- Throw errors for invalid operations or system failures
- Log errors appropriately for debugging

```typescript
// Example error handling
try {
  const user = await userService.updateUser(id, updateData);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user);
} catch (error) {
  console.error('Update failed:', error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
```

## Performance Considerations

### Repository Caching
- `UserService` caches the `MongoDBGroupRepository` instance to avoid creating new instances for each permission check
- This reduces overhead for frequent permission validation operations

### Batch Operations
- Services support batch operations where appropriate
- Group membership operations are optimized for multiple user scenarios

### Permission Caching
- Permission resolution involves multiple database queries
- Consider implementing TTL caching for frequently accessed permissions

## Testing Best Practices

### Mock Repositories
```typescript
// Create mock implementations
class MockUserRepository implements Repository<IUser> {
  async findById(id: string): Promise<IUser | null> {
    // Mock implementation
    return mockUser;
  }
  // ... other methods
}

// Use in tests
const userService = new UserService(new MockUserRepository());
```

### Test Scenarios
1. **CRUD Operations**: Test create, read, update, delete operations
2. **Permission Logic**: Test permission resolution and hierarchy
3. **Error Cases**: Test not-found, validation errors, and system failures
4. **Group Membership**: Test adding/removing users from groups
5. **Authentication**: Test password validation and user lookup

## Security Considerations

1. **Password Security**: Passwords are hashed using bcrypt utilities
2. **Permission Validation**: Always validate permissions before operations
3. **Input Sanitization**: Services expect sanitized input from API routes
4. **Group Access**: Check user permissions before group operations
5. **Data Isolation**: Services respect user access boundaries

## Best Practices

1. **Single Responsibility**: Each service handles one domain area
2. **Dependency Injection**: Support repository injection for testing
3. **Error Handling**: Use consistent error handling patterns
4. **Type Safety**: Leverage TypeScript for compile-time safety
5. **Documentation**: Document complex business logic
6. **Validation**: Validate inputs at service boundaries
7. **Logging**: Log important operations and errors appropriately

## Future Enhancements

- **Caching Layer**: Add Redis caching for frequently accessed data
- **Event System**: Emit events for important operations (user created, group joined)
- **Audit Logging**: Track important user and group operations
- **Rate Limiting**: Add rate limiting for sensitive operations
- **Batch APIs**: Support bulk operations for efficiency