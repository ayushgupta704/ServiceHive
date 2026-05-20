import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodObject, type ZodRawShape } from 'zod';
import { AppError } from '../core/errors/AppError.js';

export const validate =
  (schema: ZodObject<ZodRawShape>) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path[issue.path.length - 1] as string,
          message: issue.message,
        }));
        return next(new AppError('Validation failed', 400, errors));
      }
      return next(error);
    }
  };
