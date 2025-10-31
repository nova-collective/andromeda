## Authentication Endpoints

### Login Handler (`login/route.ts`)

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
  user?: {
    id?: string;
    username: string;
    email: string;
    groups: string[];
    permissions: Permission[];
    token?: string;            // Present on login/register responses
    tokenExpiresIn?: string;   // Mirrors TOKEN_EXPIRATION config
    lastLogin?: string;        // ISO string when available
  };
}
```

#### Authentication Flow

1. **Input Validation**: `validateRequestBody` with `validateLoginCredentials` ensures the shape is correct.
2. **User Lookup**: Find user by username in database
3. **Password Verification**: Compare plain text password with stored bcrypt hash
4. **JWT Generation**: Create token with user information and effective permissions
5. **Authorization Header**: Return a bearer token in the `Authorization` response header
6. **Response**: Return success message with safe user object, permissions, and optional token metadata

#### Security Features

- **Password Hashing**: Uses bcrypt for secure password comparison
- **Login Tracking**: Updates `lastLogin` timestamp on successful authentication
- **Error Handling**: Generic "Invalid credentials" message for security
- **Rate Limiting**: Should be implemented at reverse proxy level

### Registration Handler (`register/route.ts`)

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
7. **Auto Login**: Generate JWT (including merged permissions) and expose it via the `Authorization` header
8. **Response**: Return success with user information, permissions, and bearer token metadata

#### Validation Rules

- **All Fields Required**: username, email, password, confirmPassword
- **Password Matching**: password === confirmPassword
- **Password Strength**: Minimum 8 characters (configurable via utility)
- **Unique Constraints**: username and email must be unique
- **Email Format**: Should be valid email format (add validation as needed)

### Current User Handler (`me/route.ts`)

Handles `GET /api/auth/me` requests for session validation and user information.

#### Authentication Flow

1. **Authorization Header**: Read bearer token from the `Authorization` request header
2. **Token Verification**: Validate JWT signature and expiry
3. **User Lookup**: Find current user by username from token
4. **Response Mapping**: Return safe user object (no password) plus effective permissions

#### Use Cases

- **Session Validation**: Check if user is still authenticated
- **User Context**: Get current user information for UI
- **Protected Routes**: Verify authentication before accessing resources
- **Token Refresh**: Validate token is still valid

### Authorization Guard

`src/app/api/auth/guard.ts` exports `authorizeRequest`, a helper used by protected routes (e.g., users and groups APIs). It reads the bearer token from the `Authorization` header, validates it, and enforces permission-specific CRUD access using the `permissions` array embedded in the payload.