# Authentication Layer

This folder contains the authentication and authorization system for the Andromeda application. It provides JWT-based authentication, user registration/login, and permission management utilities.

## Architecture Overview

```
Client Request → Auth Middleware → JWT Verification → User Context → Protected Resources
```

The authentication layer provides:
- **JWT Token Management**: Secure token generation, verification, and cookie handling
- **User Authentication**: Login and registration with password validation
- **Session Management**: Token-based sessions with secure HTTP-only cookies
- **Permission Checking**: Group-based and role-based access control utilities
- **Security Features**: Password hashing, token expiry, and secure cookie policies

## Files Overview

- **`auth.ts`** - Core JWT utilities (generate, verify, cookie management)
- **`login.ts`** - Login endpoint handler with password verification
- **`register.ts`** - Registration endpoint handler with validation
- **`me.ts`** - Current user endpoint for session validation
- **`permissions.ts`** - Group-based permission checking utilities
- **`index.ts`** - Central export barrel for all auth functions

## Core JWT Utilities (`auth.ts`)

The core authentication module provides JWT token management and secure cookie operations.

### Environment Configuration

```typescript
const JWT_SECRET = process.env.JWT_SECRET as string;
```

**Required Environment Variable**: `JWT_SECRET` - Used to sign and verify JWT tokens.

### Token Management

#### Generate JWT Token
```typescript
function generateToken(payload: JWTPayload): string
```

- **Purpose**: Creates a signed JWT with 7-day expiry
- **Payload**: User ID, username, groups array
- **Security**: Uses HS256 signing algorithm with environment secret

#### Verify JWT Token
```typescript
function verifyToken(token: string): JWTPayload | null
```

- **Purpose**: Validates and decodes JWT tokens
- **Returns**: Decoded payload on success, `null` on failure
- **Error Handling**: Logs verification failures, graceful error handling

### Cookie Management

#### Set Authentication Cookie
```typescript
function setTokenCookie(res: NextApiResponse, token: string): void
```

**Cookie Policy**:
- **HttpOnly**: Prevents client-side JavaScript access
- **SameSite=Strict**: CSRF protection
- **Max-Age=604800**: 7-day expiry (matches token expiry)
- **Secure**: HTTPS-only in production
- **Path=/**: Available across entire application

#### Clear Authentication Cookie
```typescript
function clearTokenCookie(res: NextApiResponse): void
```

- **Purpose**: Logout functionality by expiring the cookie
- **Method**: Sets cookie with past expiration date

## Authentication Endpoints

### Login Handler (`login.ts`)

Handles `POST /api/auth/login` requests for user authentication.

#### Request Format
```typescript
interface LoginRequest {
  username: string;
  password: string; // Plain text (sent over TLS)
}
```

#### Response Format
```typescript
interface AuthResponse {
  message: string;
  user?: Omit<User, 'password'>; // Safe user object without password
}
```

#### Authentication Flow

1. **Input Validation**: Verify username and password are provided
2. **User Lookup**: Find user by username in database
3. **Password Verification**: Compare plain text password with stored bcrypt hash
4. **JWT Generation**: Create token with user information
5. **Cookie Setting**: Set secure HTTP-only authentication cookie
6. **Response**: Return success message with safe user object

#### Security Features

- **Password Hashing**: Uses bcrypt for secure password comparison
- **Login Tracking**: Updates `lastLogin` timestamp on successful authentication
- **Error Handling**: Generic "Invalid credentials" message for security
- **Rate Limiting**: Should be implemented at reverse proxy level

### Registration Handler (`register.ts`)

Handles `POST /api/auth/register` requests for new user creation.

#### Request Format
```typescript
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

#### Registration Flow

1. **Input Validation**: Verify all required fields are present
2. **Password Matching**: Confirm password and confirmPassword match
3. **Password Strength**: Validate password meets security requirements
4. **Duplicate Checking**: Verify username and email are unique
5. **Password Hashing**: Hash password using bcrypt before storage
6. **User Creation**: Create new user document in database
7. **Auto Login**: Generate JWT and set authentication cookie
8. **Response**: Return success with user information

#### Validation Rules

- **All Fields Required**: username, email, password, confirmPassword
- **Password Matching**: password === confirmPassword
- **Password Strength**: Minimum 8 characters (configurable via utility)
- **Unique Constraints**: username and email must be unique
- **Email Format**: Should be valid email format (add validation as needed)

### Current User Handler (`me.ts`)

Handles `GET /api/auth/me` requests for session validation and user information.

#### Authentication Flow

1. **Cookie Extraction**: Read `token` cookie from request
2. **Token Verification**: Validate JWT signature and expiry
3. **User Lookup**: Find current user by username from token
4. **Response Mapping**: Return safe user object (no password)

#### Use Cases

- **Session Validation**: Check if user is still authenticated
- **User Context**: Get current user information for UI
- **Protected Routes**: Verify authentication before accessing resources
- **Token Refresh**: Validate token is still valid

## Permission System (`permissions.ts`)

Group-based permission checking utilities for authorization.

### Group Membership Checking

#### Single Group Check
```typescript
function hasGroup(user: User, group: string): boolean
```

- **Purpose**: Check if user belongs to a specific group
- **Returns**: `true` if user is member, `false` otherwise
- **Null Safety**: Handles undefined groups array gracefully

#### Admin Check
```typescript
function isAdmin(user: User): boolean
```

- **Purpose**: Convenience method to check admin status
- **Implementation**: Checks for membership in 'admin' group
- **Usage**: Common administrative permission checks

#### Multiple Group Checks
```typescript
function hasAnyGroup(user: User, groups: string[]): boolean
function hasAllGroups(user: User, groups: string[]): boolean
```

- **hasAnyGroup**: User must belong to at least one of the specified groups
- **hasAllGroups**: User must belong to all specified groups
- **Use Cases**: Complex permission scenarios with multiple role requirements

## Usage Examples

### Basic Authentication Flow

```typescript
import { generateToken, setTokenCookie, verifyToken } from '@/app/lib/auth';

// Login endpoint
export async function POST(request: Request) {
  const { username, password } = await request.json();
  
  // Verify credentials (pseudocode)
  const user = await authenticateUser(username, password);
  if (!user) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  
  // Generate token and set cookie
  const token = generateToken({
    userId: user.id,
    username: user.username,
    groups: user.groups
  });
  
  const response = Response.json({ message: 'Login successful' });
  setTokenCookie(response, token);
  return response;
}
```

### Protected Route Middleware

```typescript
import { verifyToken } from '@/app/lib/auth';

export function withAuth(handler: Function) {
  return async (req: Request) => {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const payload = verifyToken(token);
    if (!payload) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Add user context to request
    req.user = payload;
    return handler(req);
  };
}
```

### Permission-Based Access Control

```typescript
import { hasGroup, isAdmin, hasAnyGroup } from '@/app/lib/auth/permissions';

// Check admin access
if (isAdmin(user)) {
  // Allow admin operations
}

// Check specific group membership
if (hasGroup(user, 'moderators')) {
  // Allow moderator operations
}

// Check multiple group permissions
if (hasAnyGroup(user, ['admin', 'moderator', 'editor'])) {
  // Allow content management operations
}
```

### API Route with Authentication

```typescript
import { verifyToken } from '@/app/lib/auth';
import { hasGroup } from '@/app/lib/auth/permissions';

export async function GET(request: Request) {
  // Extract and verify token
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const payload = verifyToken(token);
  if (!payload) {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }
  
  // Get user and check permissions
  const user = await getUserById(payload.userId);
  if (!hasGroup(user, 'users')) {
    return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
  }
  
  // Proceed with protected operation
  return Response.json({ data: 'Protected data' });
}
```

## Security Considerations

### JWT Security

1. **Secret Management**: Store JWT_SECRET securely, rotate regularly
2. **Token Expiry**: 7-day expiry balances security and user experience
3. **Signature Verification**: Always verify token signature before trusting
4. **Token Storage**: HTTP-only cookies prevent XSS token theft

### Password Security

1. **Hashing**: Uses bcrypt with appropriate cost factor
2. **Never Store Plain Text**: Passwords hashed before database storage
3. **Comparison**: Use bcrypt.compare for timing attack resistance
4. **Strength Validation**: Enforce minimum password requirements

### Cookie Security

1. **HttpOnly**: Prevents client-side JavaScript access
2. **SameSite=Strict**: Prevents CSRF attacks
3. **Secure Flag**: HTTPS-only in production environments
4. **Path Restriction**: Limit cookie scope to application paths

### General Security

1. **Input Validation**: Validate all user inputs
2. **Error Messages**: Generic messages to prevent information disclosure
3. **Rate Limiting**: Implement at reverse proxy level
4. **HTTPS**: Enforce HTTPS in production
5. **Session Management**: Proper logout and token invalidation

## Error Handling

### Common Error Scenarios

```typescript
// Invalid credentials (login)
return res.status(401).json({ message: 'Invalid credentials' });

// Missing token (protected routes)
return res.status(401).json({ message: 'Not authenticated' });

// Invalid/expired token
return res.status(401).json({ message: 'Invalid token' });

// Insufficient permissions
return res.status(403).json({ message: 'Insufficient permissions' });

// Method not allowed
return res.status(405).json({ message: 'Method not allowed' });
```

### Error Logging

```typescript
try {
  // Authentication operations
} catch (error) {
  console.error('Auth error:', error);
  // Return generic error to client
  return res.status(500).json({ message: 'Internal server error' });
}
```

## Testing Authentication

### Unit Testing

```typescript
import { generateToken, verifyToken } from '@/app/lib/auth';

describe('JWT utilities', () => {
  test('should generate and verify valid token', () => {
    const payload = { userId: 1, username: 'test', groups: ['user'] };
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    
    expect(decoded).toMatchObject(payload);
  });
  
  test('should reject invalid token', () => {
    const result = verifyToken('invalid-token');
    expect(result).toBeNull();
  });
});
```

### Integration Testing

```typescript
import request from 'supertest';
import app from '../app';

describe('Authentication endpoints', () => {
  test('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.headers['set-cookie']).toBeDefined();
  });
  
  test('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'wrongpassword' });
    
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });
});
```

## Best Practices

1. **Environment Variables**: Always use environment variables for secrets
2. **Token Expiry**: Balance security and user experience
3. **Password Policies**: Enforce strong password requirements
4. **Error Handling**: Consistent error responses, avoid information leakage
5. **Logging**: Log authentication events for monitoring
6. **Testing**: Comprehensive test coverage for auth flows
7. **Documentation**: Document permission requirements for endpoints
8. **Monitoring**: Monitor failed login attempts and suspicious activity

## Future Enhancements

### Potential Improvements

1. **Refresh Tokens**: Implement refresh token rotation
2. **Multi-Factor Authentication**: Add 2FA support
3. **OAuth Integration**: Support third-party authentication
4. **Session Management**: Active session tracking and revocation
5. **Audit Logging**: Comprehensive authentication audit trail
6. **Rate Limiting**: Built-in rate limiting for auth endpoints
7. **Password Reset**: Secure password reset functionality
8. **Role-Based Permissions**: More granular permission system
9. **Token Blacklisting**: Revoke tokens before expiry
10. **Biometric Authentication**: Support for modern authentication methods