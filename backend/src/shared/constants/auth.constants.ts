export const AUTH_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User with this email already exists',
  NOT_FOUND: 'User not found',
  REGISTER_SUCCESS: 'Registration successful',
  LOGIN_SUCCESS: 'Login successful',
  UNAUTHORIZED: 'Not authorized to access this route',
  FORBIDDEN: (role: string) => `User role ${role} is not authorized to access this route`,
};

export const AUTH_CONFIG = {
  TOKEN_ISSUER: 'servicehive-api',
  TOKEN_AUDIENCE: 'servicehive-app',
  COOKIE_NAME: 'refreshToken',
};
