export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  password: string;
  createdAt?: Date;
}

export interface JWTPayload {
  userId: number;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  message: string;
  user?: Omit<User, 'password'>;
}

export interface LoginRequest {
  username: string;
  password: string;
}