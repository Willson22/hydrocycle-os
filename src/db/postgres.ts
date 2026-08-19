// src/db/postgres.ts
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../config/env';

declare global {
    var prisma: PrismaClient | undefined;
}

const createPrismaClient = (): PrismaClient => {
    const adapter = new PrismaPg({ connectionString: env.POSTGRES_URI });

    return new PrismaClient({
        adapter,
        log: env.NODE_ENV === 'development'
            ? ['query', 'info', 'warn', 'error']
            : ['error'],
    });
};

export const prisma = globalThis.prisma ?? createPrismaClient();

if (env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}

export const connectPostgres = async (): Promise<void> => {
    try {
        await prisma.$connect();
        console.log('[INFO] Successfully connected to PostgreSQL (Entities).');
    } catch (error) {
        console.error('[FATAL] Failed to connect to PostgreSQL:', error);
        process.exit(1);
    }
};