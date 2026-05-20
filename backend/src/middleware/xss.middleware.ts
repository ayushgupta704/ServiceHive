// @ts-ignore
import { clean } from 'xss-clean/lib/xss.js';
import type { Request, Response, NextFunction } from 'express';

export const xssMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    const cleaned = clean(req.body);
    Object.assign(req.body, cleaned);
  }
  if (req.query) {
    // In Express 5 req.query is often a getter, but we can try to modify it if it's an object
    const cleaned = clean(req.query);
    // Note: Re-assigning might still fail, so we modify the properties
    for (const key in req.query) {
      if (!(key in cleaned)) {
        delete req.query[key];
      }
    }
    Object.assign(req.query, cleaned);
  }
  if (req.params) {
    const cleaned = clean(req.params);
    Object.assign(req.params, cleaned);
  }
  next();
};
