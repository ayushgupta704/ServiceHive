import { sanitize } from 'express-mongo-sanitize';
import type { Request, Response, NextFunction } from 'express';

export const mongoSanitizeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  if (req.headers) sanitize(req.headers);
  next();
};
