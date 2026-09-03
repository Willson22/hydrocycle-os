// HTTP brain: Middleware, Routes and Global Error Handler
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { telemetryRouter } from './routes/telemetry.routes';
import { authRouter } from './routes/auth.routes';

export const app = express();

// 1. Cross-Cutting Concerns (Security and Audit)
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// 2. Module Entry Points (Routes)
app.use('/api/v1/telemetry', telemetryRouter);
app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/buildings', buildingRouter);

// 3. Fallback for nonexistent resources (404)
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        status: "error",
        code: "RESOURCE_NOT_FOUND",
        message: "Endpoint not found",
        timestamp: new Date().toISOString()
    });
});

// 4. Global Error Handler (Strictly according to Error Handling Policy)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // 4.a: Record to local Ubuntu terminal / Logging system
    console.error(`[ERROR]: ${err.message}`, err.stack);

    // 4.b: Catch syntax errors from Zod validation (Fail-fast from Controller)
    if (err.name === 'ZodError') {
        return res.status(400).json({
            status: "error",
            code: "VALIDATION_FAILED",
            message: "Invalid input data.",
            details: err.errors.map((e: any) => ({
                field: e.path.join('.'),
                message: e.message
            })),
            timestamp: new Date().toISOString()
        });
    }

    // 4.c: Formatting business/system exceptions (Stack Trace protection in production)
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: "error",
        code: err.errorCode || "INTERNAL_SERVER_ERROR",
        // Mask details of critical errors (500), return a controlled message for others
        message: statusCode === 500 ? "Unexpected server error." : err.message,
        timestamp: new Date().toISOString()
    });
});