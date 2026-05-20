import type { Request, Response } from 'express';
import { asyncHandler } from '../../core/utils/asyncHandler.js';
import { sendResponse } from '../../core/utils/sendResponse.js';
import { AUTH_MESSAGES, AUTH_CONFIG } from '../../shared/constants/auth.constants.js';
import { env } from '../../config/env.js';
import authService from './auth.service.js';
import type { RegisterDto, LoginDto } from './auth.interface.js';

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const registerDto: RegisterDto = req.body as RegisterDto;
  const result = await authService.register(registerDto);

  // Set refresh token in cookie
  res.cookie(AUTH_CONFIG.COOKIE_NAME, result.tokens.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
  });

  return sendResponse(res, 201, AUTH_MESSAGES.REGISTER_SUCCESS, {
    user: result.user,
    accessToken: result.tokens.accessToken,
  });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const loginDto: LoginDto = req.body as LoginDto;
  const result = await authService.login(loginDto);

  // Set refresh token in cookie
  res.cookie(AUTH_CONFIG.COOKIE_NAME, result.tokens.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
  });

  return sendResponse(res, 200, AUTH_MESSAGES.LOGIN_SUCCESS, {
    user: result.user,
    accessToken: result.tokens.accessToken,
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  // req.user will be populated by protect middleware later
  const userId = req.user?.id;

  if (!userId) {
    return sendResponse(res, 401, AUTH_MESSAGES.UNAUTHORIZED);
  }

  const user = await authService.getMe(userId);

  return sendResponse(res, 200, 'User details retrieved successfully', { user });
});

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.cookie(AUTH_CONFIG.COOKIE_NAME, 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  return sendResponse(res, 200, 'User logged out successfully');
});

/**
 * @desc    Refresh Token
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies[AUTH_CONFIG.COOKIE_NAME];

  if (!refreshToken) {
    return sendResponse(res, 401, 'No refresh token provided');
  }

  const result = await authService.refreshTokens(refreshToken);

  // Set new refresh token in cookie
  res.cookie(AUTH_CONFIG.COOKIE_NAME, result.tokens.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
  });

  return sendResponse(res, 200, 'Token refreshed successfully', {
    user: result.user,
    accessToken: result.tokens.accessToken,
  });
});
