# Repository Layer

This folder contains the data access layer (repository pattern) for the Andromeda application. Repositories provide an abstraction layer between the business logic (services) and data storage, allowing for clean separation of concerns and easy testing with different database implementations.

## Architecture Overview

```
Services → Repositories → Database
```

The repository pattern provides:
- **Abstraction**: Common interface regardless of database implementation
- **Testability**: Easy mocking and testing with different data sources
- **Flexibility**: Switch between database implementations without changing business logic
- **Consistency**: Standardized data access methods across the application

## Files Overview

- **`baseRepository.ts`** - Abstract base class defining the repository contract
- **`mongodbUserRepository.ts`** - MongoDB implementation for user data access
- **`mongodbGroupRepository.ts`** - MongoDB implementation for group data access
- **`postgresUserRepository.ts`** - PostgreSQL implementation (placeholder/future)
- **`index.ts`** - Central export barrel for all repositories

## BaseRepository

The `BaseRepository<T>` abstract class implements the `Repository<T>` interface and defines the standard contract that all repository implementations must follow.

### Interface Definition

```typescript
abstract class BaseRepository<T> implements Repository<T> {
  // Core CRUD operations
  abstract findById(id: string): Promise<T | null>;
  abstract findByField(field: keyof T & string, value: unknown): Promise<T | null>;
  abstract findAll(query?: Record<string, unknown>): Promise<T[]>;
  abstract create(data: Omit<T, 'id' | 'createdAt'>): Promise<T>;
  abstract update(id: string, data: Partial<T>): Promise<T | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract upsert(filter: Record<string, unknown>, data: Partial<T>): Promise<T>;
}
```

### Method Contracts

- **`findById`**: Retrieve single document by ID, returns `null` if not found
- **`findByField`**: Find single document by any field, type-safe field names
- **`findAll`**: Query multiple documents with optional filters
- **`create`**: Insert new document, auto-generates ID and timestamps
- **`update`**: Modify existing document by ID, returns updated document or `null`
- **`delete`**: Remove document by ID, returns success boolean
- **`upsert`**: Insert or update based on filter criteria

## MongoDBUserRepository

MongoDB implementation for user data access operations.

### Core Features

```typescript
class MongoDBUserRepository extends BaseRepository<IUser> {
  private collectionName = 'users';

  // Standard repository methods
  async findById(id: string): Promise<IUser | null>
  async findByField(field: keyof IUser & string, value: unknown): Promise<IUser | null>
  async findAll(query?: Record<string, unknown>): Promise<IUser[]>
  async create(data: Omit<IUser, 'id' | 'createdAt'>): Promise<IUser>
  async update(id: string, data: Partial<IUser>): Promise<IUser | null>
  async delete(id: string): Promise<boolean>
  async upsert(filter: Record<string, unknown>, data: Partial<IUser>): Promise<IUser>

  // User-specific methods
  async findByUsername(username: string): Promise<IUser | null>
  async findByEmail(email: string): Promise<IUser | null>
  async findByWalletAddress(walletAddress: string): Promise<IUser | null>
}
```

### User-Specific Operations

- **`findByUsername`**: Lookup user by username (case-sensitive)
- **`findByEmail`**: Find user by email address
- **`findByWalletAddress`**: Locate user by wallet address

### Data Mapping

- Converts MongoDB `_id` to application `id` field
- Handles ObjectId conversions for references (groups)
- Manages timestamps and MongoDB-specific fields

## MongoDBGroupRepository

MongoDB implementation for group data access operations.

### Core Features

```typescript
class MongoDBGroupRepository extends BaseRepository<IGroup> {
  private collectionName = 'groups';

  // Standard repository methods
  async findById(id: string): Promise<IGroup | null>
  async findByField(field: keyof IGroup & string, value: unknown): Promise<IGroup | null>
  async findAll(query?: Record<string, unknown>): Promise<IGroup[]>
  async create(data: Omit<IGroup, 'id' | 'createdAt'>): Promise<IGroup>
  async update(id: string, data: Partial<IGroup>): Promise<IGroup | null>
  async delete(id: string): Promise<boolean>
  async upsert(filter: Record<string, unknown>, data: Partial<IGroup>): Promise<IGroup>

  // Group-specific methods
  async addUser(groupId: string, userId: string): Promise<IGroup | null>
  async removeUser(groupId: string, userId: string): Promise<IGroup | null>
  async findByUserId(userId: string): Promise<IGroup[]>
}
```

### Group-Specific Operations

- **`addUser`**: Add a user to group membership (by ObjectId reference)
- **`removeUser`**: Remove a user from group membership
- **`findByUserId`**: Get all groups where a user is a member

### Membership Management

- Uses MongoDB `$addToSet` for adding members (prevents duplicates)
- Uses MongoDB `$pull` for removing members
- Stores member references as ObjectId array
- Handles ObjectId string conversion properly

## Usage Examples

### Basic Repository Usage

```typescript
import { MongoDBUserRepository, MongoDBGroupRepository } from '@/app/lib/repositories';

// Create repository instances
const userRepo = new MongoDBUserRepository();
const groupRepo = new MongoDBGroupRepository();

// Basic CRUD operations
const user = await userRepo.findById('user123');
const users = await userRepo.findAll({ username: { $regex: 'john' } });
const newUser = await userRepo.create({
  username: 'johndoe',
  email: 'john@example.com',
  walletAddress: '0x123...',
  // ... other fields
});
```

### Advanced Queries

```typescript
// Find users with specific criteria
const activeUsers = await userRepo.findAll({
  lastLogin: { $gte: new Date('2024-01-01') }
});

// Find groups by creator
const userGroups = await groupRepo.findAll({
  createdBy: 'wallet-address'
});

// Get groups where user is a member
const memberGroups = await groupRepo.findByUserId('user123');
```

### Group Membership Operations

```typescript
const groupRepo = new MongoDBGroupRepository();

// Add user to group
const updatedGroup = await groupRepo.addUser('group123', 'user456');

// Remove user from group
await groupRepo.removeUser('group123', 'user456');

// Find all groups for a user
const userGroups = await groupRepo.findByUserId('user456');
```

### Repository in Services

```typescript
import { MongoDBUserRepository } from '@/app/lib/repositories';

class UserService {
  private repository: MongoDBUserRepository;

  constructor(repository?: MongoDBUserRepository) {
    this.repository = repository ?? new MongoDBUserRepository();
  }

  async getUser(id: string) {
    return await this.repository.findById(id);
  }
}
```

## Error Handling

Repositories follow consistent error handling patterns:

### Return Values
- `null` for not-found scenarios (findById, findByField, update)
- `boolean` for success/failure operations (delete)
- `T` or `T[]` for successful data operations
- Throw exceptions for system errors (connection issues, invalid data)

### Error Examples

```typescript
try {
  const user = await userRepo.findById('invalid-id');
  // Returns null for not found, doesn't throw
  
  const result = await userRepo.delete('user123');
  // Returns false if user doesn't exist, true if deleted
  
} catch (error) {
  // Handle system errors (DB connection, validation, etc.)
  console.error('Repository error:', error);
}
```

## Testing

### Mock Repository Pattern

```typescript
class MockUserRepository extends BaseRepository<IUser> {
  private users: IUser[] = [];

  async findById(id: string): Promise<IUser | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async create(data: Omit<IUser, 'id' | 'createdAt'>): Promise<IUser> {
    const user = {
      ...data,
      id: `mock-${Date.now()}`,
      createdAt: new Date()
    } as IUser;
    this.users.push(user);
    return user;
  }

  // ... implement other methods
}

// Use in tests
const mockRepo = new MockUserRepository();
const userService = new UserService(mockRepo);
```

### Testing Best Practices

1. **Mock Implementations**: Create in-memory mock repositories for unit tests
2. **Integration Tests**: Test with real database for integration scenarios
3. **Error Scenarios**: Test connection failures, invalid data, not-found cases
4. **Data Integrity**: Verify proper ObjectId handling and referential integrity

## Database Configuration

### MongoDB Connection

Repositories use the shared MongoDB client from `@/app/lib/config/mongodb`:

```typescript
import getClient from '@/app/lib/config/mongodb';

const client = await getClient();
const db = client.db('andromeda');
const collection = db.collection('users');
```

### Collection Names
- **Users**: `users`
- **Groups**: `groups`
- **Permissions**: `permissions` (if implemented as separate collection)

## Data Mapping

### ObjectId Handling

```typescript
// Convert string ID to ObjectId for queries
const objectId = new ObjectId(id);

// Convert ObjectId back to string for application
const id = objectId.toString();

// Handle ObjectId arrays (group members)
const memberIds = members.map(id => new ObjectId(id));
```

### Field Mapping

```typescript
// MongoDB document → Application object
const mapUser = (doc: Document | null): IUser | null => {
  if (!doc) return null;
  
  return {
    id: doc._id.toString(),
    walletAddress: doc.walletAddress,
    username: doc.username,
    // ... other fields
    createdAt: doc.createdAt,
  } as IUser;
};
```

## Performance Considerations

### Indexing Strategy
- **Users**: Index on `walletAddress`, `username`, `email`
- **Groups**: Index on `createdBy`, `members` (for membership queries)
- **Permissions**: Index on `name` if implemented as separate collection

### Query Optimization
- Use projection to limit returned fields when appropriate
- Implement pagination for large result sets
- Consider aggregation pipelines for complex queries
- Cache frequently accessed data at service layer

### Connection Management
- Repositories reuse the shared MongoDB client connection
- Connection pooling handled at the client level
- No need to manage connections in individual repositories

## Security Considerations

1. **Input Validation**: Validate ObjectId format before database queries
2. **Query Injection**: Use parameterized queries, avoid string concatenation
3. **Field Access**: Use type-safe field access with `keyof T & string`
4. **Data Sanitization**: Sanitize user input before storage
5. **Access Control**: Repository layer doesn't enforce permissions (handled in services)

## Future Enhancements

### Multiple Database Support
```typescript
// Interface-based repository selection
interface UserRepositoryFactory {
  createUserRepository(type: 'mongodb' | 'postgres'): BaseRepository<IUser>;
}
```

### Advanced Features
- **Caching Layer**: Add Redis caching for frequently accessed data
- **Read Replicas**: Support read/write splitting for better performance
- **Audit Logging**: Track all repository operations for compliance
- **Soft Deletes**: Implement soft delete functionality
- **Versioning**: Add document versioning support
- **Transactions**: Support multi-document transactions where needed

## Best Practices

1. **Single Responsibility**: Each repository handles one entity type
2. **Interface Compliance**: Always implement the full BaseRepository contract
3. **Error Handling**: Use consistent error handling patterns
4. **Type Safety**: Leverage TypeScript for compile-time safety
5. **Data Mapping**: Properly map between database and application models
6. **Testing**: Write comprehensive tests for all repository methods
7. **Documentation**: Document complex queries and business logic
8. **Performance**: Consider query performance and indexing strategies