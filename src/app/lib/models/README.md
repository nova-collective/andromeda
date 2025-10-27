# Mongoose Models

This folder contains Mongoose schema definitions and models for the Andromeda application. Models define the structure, validation rules, and behavior of documents stored in MongoDB collections.

## Architecture Overview

```
Application Types (IUser, IGroup) → Mongoose Schemas → MongoDB Collections
```

The models layer provides:
- **Schema Definition**: Structure and validation rules for MongoDB documents
- **Type Safety**: TypeScript integration with application interfaces
- **Data Validation**: Built-in validation, defaults, and constraints
- **Model Methods**: Mongoose query and manipulation methods
- **Indexing**: Database performance optimization

## Files Overview

- **`User.ts`** - Mongoose schema and model for user documents
- **`Group.ts`** - Mongoose schema and model for group documents
- **`index.ts`** - Central export barrel for all models

## User Model

The User model defines the schema for user documents in the `users` collection.

### Schema Definition

```typescript
const userSchema: Schema<IUser> = new Schema({
  walletAddress: { 
    type: String, 
    required: false, 
    sparse: true 
  },
  username: { 
    type: String, 
    unique: true, 
    required: true 
  },
  email: { 
    type: String, 
    unique: true, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  settings: {
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true }
  },
  groups: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Group' 
  }],
  permissions: [{
    name: { type: String, required: true },
    description: { type: String, required: false },
    crud: {
      read: { type: Boolean, required: true },
      create: { type: Boolean, required: true },
      update: { type: Boolean, required: true },
      delete: { type: Boolean, required: true }
    }
  }],
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});
```

### Key Features

#### Authentication Fields
- **`walletAddress`**: Optional, sparse index (supports non-wallet users)
- **`username`**: Required, unique identifier for login
- **`email`**: Required, unique contact information
- **`password`**: Required, stores bcrypt hash (never plain text)

#### User Preferences
- **`settings.theme`**: UI theme preference (default: 'light')
- **`settings.notifications`**: Notification preferences (default: true)

#### Relationships
- **`groups`**: Array of ObjectId references to Group documents
- **`permissions`**: Embedded permission objects (user-level permissions)

#### Timestamps
- **`createdAt`**: Account creation timestamp (auto-generated)
- **`lastLogin`**: Last authentication timestamp

### Security Considerations

1. **Password Storage**: Passwords are automatically hashed using bcrypt utilities before storage
2. **Unique Constraints**: Username and email must be unique across all users
3. **Sparse Indexing**: walletAddress uses sparse indexing to allow multiple null values
4. **Permission Structure**: Embedded permissions with explicit CRUD flags

## Group Model

The Group model defines the schema for group documents in the `groups` collection.

### Schema Definition

```typescript
const groupSchema: Schema<IGroup> = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: String,
  createdBy: { 
    type: String, 
    required: true 
  },
  members: { 
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
    default: [] 
  },
  permissions: {
    type: [{
      name: { type: String, required: true, enum: ['users', 'groups'] },
      description: { type: String },
      crud: {
        read: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        update: { type: Boolean, default: false },
        delete: { type: Boolean, default: false }
      }
    }],
    default: []
  },
  settings: {
    isPublic: { type: Boolean, default: false },
    requiresApproval: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now }
});
```

### Key Features

#### Group Identity
- **`name`**: Required group display name
- **`description`**: Optional longer description
- **`createdBy`**: Required wallet address of the group creator

#### Membership Management
- **`members`**: Array of ObjectId references to User documents
- **Default empty array**: New groups start with no members

#### Permission System
- **`permissions`**: Embedded permission objects with enum validation
- **Enum constraint**: Permission names restricted to 'users' | 'groups'
- **CRUD structure**: Each permission has read/create/update/delete flags
- **Default values**: All CRUD operations default to false (secure by default)

#### Group Settings
- **`isPublic`**: Whether group is visible to non-members (default: false)
- **`requiresApproval`**: Whether joining requires approval (default: false)

### Validation Rules

- **Permission names**: Restricted to enum values ['users', 'groups']
- **Required fields**: name, createdBy
- **Default values**: Secure defaults for all permission and setting fields
- **ObjectId references**: Proper referencing to User documents

## Usage Examples

### Importing Models

```typescript
// Import specific models
import User from '@/app/lib/models/User';
import Group from '@/app/lib/models/Group';

// Import from barrel
import { User, Group } from '@/app/lib/models';
```

### Creating Documents

```typescript
import User from '@/app/lib/models/User';

// Create a new user
const newUser = new User({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'hashedPassword123', // Should be pre-hashed
  walletAddress: '0x123...',
  settings: {
    theme: 'dark',
    notifications: true
  }
});

await newUser.save();
```

### Querying Documents

```typescript
import User from '@/app/lib/models/User';

// Find user by username
const user = await User.findOne({ username: 'johndoe' });

// Find users with specific theme preference
const darkThemeUsers = await User.find({ 'settings.theme': 'dark' });

// Populate group references
const userWithGroups = await User.findById(userId).populate('groups');
```

### Group Operations

```typescript
import Group from '@/app/lib/models/Group';

// Create a group
const newGroup = new Group({
  name: 'Developers',
  description: 'Development team group',
  createdBy: 'wallet-address',
  members: [userId1, userId2],
  permissions: [{
    name: 'users',
    description: 'Manage users',
    crud: { read: true, create: false, update: false, delete: false }
  }]
});

await newGroup.save();
```

### Adding Members to Groups

```typescript
import Group from '@/app/lib/models/Group';
import { ObjectId } from 'mongoose';

// Add user to group
await Group.findByIdAndUpdate(
  groupId,
  { $addToSet: { members: new ObjectId(userId) } },
  { new: true }
);

// Remove user from group
await Group.findByIdAndUpdate(
  groupId,
  { $pull: { members: new ObjectId(userId) } },
  { new: true }
);
```

## Validation and Constraints

### Built-in Validation

- **Required fields**: Enforced at schema level
- **Unique constraints**: Username and email uniqueness
- **Enum validation**: Permission names restricted to allowed values
- **Type validation**: Automatic type checking for all fields

### Custom Validation Example

```typescript
// Add custom validation to schema
userSchema.pre('save', function(next) {
  // Custom validation logic
  if (this.password && this.password.length < 8) {
    next(new Error('Password must be at least 8 characters'));
  }
  next();
});
```

## Indexing Strategy

### Recommended Indexes

```typescript
// User collection indexes
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ walletAddress: 1 }, { sparse: true });
userSchema.index({ 'groups': 1 }); // For membership queries

// Group collection indexes
groupSchema.index({ name: 1 });
groupSchema.index({ createdBy: 1 });
groupSchema.index({ members: 1 }); // For member lookup queries
```

### Performance Considerations

- **Sparse indexes**: walletAddress uses sparse indexing for optional field
- **Compound indexes**: Consider compound indexes for complex queries
- **Text indexes**: Add text indexes for search functionality if needed

## Schema Evolution

### Migration Strategies

When updating schemas:

1. **Backward compatibility**: Add new fields as optional
2. **Default values**: Provide sensible defaults for new fields
3. **Data migration**: Write migration scripts for breaking changes
4. **Version tracking**: Consider adding schema version fields

### Example Migration

```typescript
// Adding a new optional field
userSchema.add({
  profile: {
    avatar: { type: String, default: null },
    bio: { type: String, default: '' }
  }
});
```

## Testing Models

### Unit Testing Schemas

```typescript
import User from '@/app/lib/models/User';
import mongoose from 'mongoose';

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should create user with valid data', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.createdAt).toBeDefined();
  });

  test('should fail validation for duplicate username', async () => {
    const userData = {
      username: 'duplicate',
      email: 'unique@example.com',
      password: 'hashedpassword'
    };

    await new User(userData).save();
    
    const duplicateUser = new User({
      ...userData,
      email: 'different@example.com'
    });

    await expect(duplicateUser.save()).rejects.toThrow();
  });
});
```

## Security Best Practices

### Password Security
```typescript
// Never store plain text passwords
// Passwords are hashed by the API layer before reaching models
const user = new User({
  username: 'user',
  password: 'hashed_password_here', // Already hashed by bcrypt
  email: 'user@example.com'
});
```

### Permission Security
```typescript
// Permissions default to false (secure by default)
const securePermission = {
  name: 'users',
  crud: {
    read: false,   // Explicitly grant permissions
    create: false,
    update: false,
    delete: false
  }
};
```

### Data Sanitization
```typescript
// Sanitize user input before saving
userSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.username) {
    this.username = this.username.trim();
  }
  next();
});
```

## Error Handling

### Common Error Scenarios

```typescript
try {
  const user = new User(userData);
  await user.save();
} catch (error) {
  if (error.code === 11000) {
    // Duplicate key error (username/email already exists)
    console.error('Duplicate user data:', error.keyValue);
  } else if (error.name === 'ValidationError') {
    // Schema validation error
    console.error('Validation failed:', error.errors);
  } else {
    // Other database errors
    console.error('Database error:', error);
  }
}
```

## Best Practices

1. **Type Alignment**: Keep schemas in sync with TypeScript interfaces
2. **Validation**: Use schema validation for data integrity
3. **Defaults**: Provide sensible default values
4. **Security**: Never store sensitive data in plain text
5. **Indexing**: Create appropriate indexes for query performance
6. **Documentation**: Document schema fields and business rules
7. **Testing**: Write comprehensive tests for schema validation
8. **Evolution**: Plan for schema changes and migrations

## Future Enhancements

### Potential Improvements

1. **Schema Versioning**: Add version tracking for schema evolution
2. **Soft Deletes**: Implement soft delete functionality
3. **Audit Trail**: Add audit fields (createdBy, updatedBy, etc.)
4. **Validation Enhancements**: Add more sophisticated validation rules
5. **Hooks**: Implement pre/post middleware for complex business logic
6. **Text Search**: Add text indexes and search capabilities
7. **Aggregation Helpers**: Create helper methods for complex aggregations