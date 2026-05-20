import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/errors/AppError.js';
import { env } from '../config/env.js';
import logger from '../core/logger/logger.js';

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  errors?: unknown;
}

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = { ...err } as CustomError;
  error.message = err.message;
  error.name = err.name;

  // Log for development
  logger.error(err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors && typeof err.errors === 'object') {
    const message = Object.values(err.errors as Record<string, { message: string }>).map((val) => val.message).join(', ');
    error = new AppError(message, 400);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || [],
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
