import mongoose from 'mongoose';
import { env } from '../config/env';

/**
 * Establishes a connection to the MongoDB Time-Series database.
 * Designed to fail-fast if the connection string is invalid or unreachable.
 */
export const connectMongoDB = async (): Promise<void> => {
    try {
        // Set Mongoose to strict mode to prevent saving fields not specified in schemas
        mongoose.set('strictQuery', true);

        // Connect using the validated URI from our Zod environment schema
        await mongoose.connect(env.MONGO_URI, {
            // Additional connection options can be configured here for production
            serverSelectionTimeoutMS: 5000, 
        });

        console.log('[INFO] Successfully connected to MongoDB Atlas (Time-Series).');
    } catch (error) {
        console.error('[FATAL] Failed to connect to MongoDB:', error);
        // We terminate the process immediately to comply with The Twelve-Factor App
        // The container orchestrator should restart the application
        process.exit(1);
    }
};

// Monitor connection events for logging purposes during runtime
mongoose.connection.on('disconnected', () => {
    console.warn('[WARN] Lost connection to MongoDB.');
});