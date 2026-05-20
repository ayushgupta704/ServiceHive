import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';

import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { AppError } from './core/errors/AppError.js';
import { mongoSanitizeMiddleware } from './middleware/mongo-sanitize.middleware.js';
import { xssMiddleware } from './middleware/xss.middleware.js';

const app: Application = express();

// Body parser
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set security headers
app.use(helmet());

// Prevent NoSQL injection (Custom wrapper for Express 5)
app.use(mongoSanitizeMiddleware);

// Prevent XSS attacks (Custom wrapper for Express 5)
app.use(xssMiddleware);

// Prevent HTTP parameter pollution
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

if (env.NODE_ENV === 'production') {
  app.use('/api', limiter);
}

// Enable CORS
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

// Mount routes
app.use('/api/v1', routes);

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorMiddleware);

export default app;
