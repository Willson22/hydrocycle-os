// src/db/postgres.ts
import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';

// Prevent multiple instances of Prisma Client during hot-reloading in development
declare global {
    var prisma: PrismaClient | undefined;
}

// Initialize Prisma Client with query logging enabled for development mode
export const prisma = global.prisma || new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

if (env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

/**
 * Establishes and verifies the connection to the PostgreSQL database.
 * Designed to fail-fast if the database is unreachable.
 */
export const connectPostgres = async (): Promise<void> => {
    try {
        await prisma.$connect();
        console.log('[INFO] Successfully connected to PostgreSQL (Entities).');
    } catch (error) {
        console.error('[FATAL] Failed to connect to PostgreSQL:', error);
        // Terminate the process immediately to comply with The Twelve-Factor App
        process.exit(1);
    }
};