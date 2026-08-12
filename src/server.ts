// Outside communication: configuration reading, initializing DB connections before accepting requests
import 'dotenv/config'; // Loading variables from .env file
import { app } from './app';
import { connectPostgres } from './db/postgre';
import { connectMongoDB } from './db/mongo';

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Here we initialize Polyglot Persistence (waiting for implementation of Mongoose and Postgres clients)
        console.log('[INFO] Connecting to MongoDB Atlas (Time-Series)...');
        await connectMongoDB();
        console.log('[INFO] Connecting to PostgreSQL (Entities)...');
        await connectPostgres();

        app.listen(PORT, () => {
            console.log(`[INFO] HydroCycle OS successfully running on port ${PORT}`);
            console.log(`[INFO] Expecting telemetry on http://localhost:${PORT}/api/v1/telemetry`);
        });
    }catch (error) {
        // Critical crash on startup (e.g., missing database)
        console.error('[FATAL] Server initialization failed', error);
        process.exit(1);
    }
}

startServer();