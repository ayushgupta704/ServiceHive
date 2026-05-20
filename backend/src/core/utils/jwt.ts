import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { AUTH_CONFIG } from '../../shared/constants/auth.constants.js';
import { AppError } from '../errors/AppError.js';
import type { AccessTokenPayload, RefreshTokenPayload } from '../../modules/auth/auth.interface.js';

/**
 * Generate Access Token (Short-lived)
 */
export const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRE as jwt.SignOptions['expiresIn'],
    issuer: AUTH_CONFIG.TOKEN_ISSUER,
    audience: AUTH_CONFIG.TOKEN_AUDIENCE,
  });
};

/**
 * Generate Refresh Token (Long-lived)
 */
export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRE as jwt.SignOptions['expiresIn'],
    issuer: AUTH_CONFIG.TOKEN_ISSUER,
    audience: AUTH_CONFIG.TOKEN_AUDIENCE,
  });
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET, {
      issuer: AUTH_CONFIG.TOKEN_ISSUER,
      audience: AUTH_CONFIG.TOKEN_AUDIENCE,
    }) as AccessTokenPayload;
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Access token expired', 401);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid access token', 401);
    }
    throw error;
  }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET, {
      issuer: AUTH_CONFIG.TOKEN_ISSUER,
      audience: AUTH_CONFIG.TOKEN_AUDIENCE,
    }) as RefreshTokenPayload;
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Refresh token expired', 401);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid refresh token', 401);
    }
    throw error;
  }
};
