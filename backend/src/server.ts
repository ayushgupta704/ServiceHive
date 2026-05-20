import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';
import { env } from './config/env.js';
import logger from './core/logger/logger.js';

// Connect to database
connectDB();

const server = app.listen(env.PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(`${err.name}: ${err.message}`);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(`${err.name}: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM (e.g., from Docker)
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false).then(() => {
      logger.info('💥 Process terminated!');
    });
  });
});
