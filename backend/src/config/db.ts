import mongoose from 'mongoose';
import { env } from './env.js';
import logger from '../core/logger/logger.js';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`);
    } else {
      logger.error('An unknown error occurred during database connection');
    }
    process.exit(1);
  }
};

export default connectDB;
