import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/errors/AppError.js';
import { asyncHandler } from '../core/utils/asyncHandler.js';
import { verifyAccessToken } from '../core/utils/jwt.js';
import { AUTH_MESSAGES, AUTH_CONFIG } from '../shared/constants/auth.constants.js';
import { UserRole } from '../shared/enums/user.enum.js';
import authRepository from '../modules/auth/auth.repository.js';
import logger from '../core/logger/logger.js';

/**
 * Helper: Extract Bearer token from Authorization header or Cookie fallback
 */
const extractToken = (req: Request): string | null => {
  let token: string | null = null;

  // 1. Check Authorization header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1] || null;
  }
  // 2. Fallback to HttpOnly cookie (for browser-based flows/refresh)
  else if (req.cookies?.[AUTH_CONFIG.COOKIE_NAME]) {
    token = req.cookies[AUTH_CONFIG.COOKIE_NAME];
  }

  return token;
};

/**
 * Protect middleware: Authentication (Who are you?)
 */
export const protect = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);

  if (!token) {
    logger.warn(`Failed access attempt: Missing token from ${req.ip}`);
    return next(new AppError(AUTH_MESSAGES.UNAUTHORIZED, 401));
  }

  try {
    // 1. Verify token
    const decoded = verifyAccessToken(token);

    // 2. Check if user still exists (prevents stale token for deleted users)
    const user = await authRepository.findById(decoded.id, true);

    if (!user) {
      logger.warn(`Security Event: Token for non-existent user ${decoded.id} used by ${req.ip}`);
      return next(new AppError('The user belonging to this token no longer exists', 401));
    }

    // 3. Attach user to request
    req.user = {
      id: user._id.toString(),
      role: user.role as UserRole,
    };

    next();
  } catch (error: unknown) {
    logger.error(`Authentication error: ${error instanceof Error ? error.message : 'Unknown'}`);
    return next(new AppError(AUTH_MESSAGES.UNAUTHORIZED, 401));
  }
});

/**
 * Authorize middleware: RBAC (What are you allowed to do?)
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(AUTH_MESSAGES.UNAUTHORIZED, 401));
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        `Forbidden access attempt: User ${req.user.id} (${req.user.role}) tried to access restricted route as ${roles.join(', ')}`,
      );
      return next(new AppError(AUTH_MESSAGES.FORBIDDEN(req.user.role), 403));
    }

    next();
  };
};
