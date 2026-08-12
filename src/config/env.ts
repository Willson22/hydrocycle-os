import 'dotenv/config';
import { z } from 'zod';

// 1. Define a strict schema for all environment variables
const envSchema = z.object({
    PORT: z.string().default('3000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    
    // M2M Ingestion
    M2M_API_KEY: z.string().min(1, "M2M_API_KEY is required for the IoT simulator"),
    
    // Auth (JWT Secret must be long and secure in production)
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
    JWT_EXPIRES_IN: z.string().default('15m'),
    
    // Polyglot Persistence
    MONGO_URI: z.string().url("MONGO_URI must be a valid URL (mongodb://...)"),
    POSTGRES_URI: z.string().url("POSTGRES_URI must be a valid URL (postgresql://...)")
});

// 2. Parse and validate the current process.env
const _env = envSchema.safeParse(process.env);

// 3. Fail-Fast mechanism
if (!_env.success) {
    console.error('❌ [FATAL] Invalid or missing environment variables (.env):');
    console.error(JSON.stringify(_env.error.format(), null, 4));
    process.exit(1); // Immediate hard termination of the Node.js thread
}

// 4. Export validated data (TypeScript now infers the exact data types)
export const env = _env.data;