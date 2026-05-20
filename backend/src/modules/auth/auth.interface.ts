import { UserRole } from '../../shared/enums/user.enum.js';
import type { IUser } from '../users/user.interface.js';

// DTOs
export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

// Token Payloads
export interface AccessTokenPayload {
  id: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  id: string;
}

// Token Container
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// User Response Sanitized
export interface AuthUserResponse extends Omit<IUser, 'password'> {
  _id: string;
}

// Final Auth Response
export interface AuthResponse {
  user: AuthUserResponse;
  tokens: AuthTokens;
}

// Current Authenticated User (Internal)
export interface AuthenticatedUser {
  id: string;
  role: UserRole;
}
