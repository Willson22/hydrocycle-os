import { Request, Response, NextFunction } from 'express';
import { telemetryIngestionService } from '../services/telemetry.service';
import { TelemetryCreateDtoIn } from '../dto/telemetry.dto';

export const createTelemetry = async (
    // Strongly typing the request body based on our Zod DTO
    req: Request<{}, {}, TelemetryCreateDtoIn>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await telemetryIngestionService.processPayload(req.body);

        // Fast response to the IoT edge device (The Twelve-Factor App philosophy)
        res.status(201).json({
            status: 'success',
            message: 'Telemetry data successfully ingested'
        });
    } catch (error: unknown) {
        // Catches database connection drops and forwards to Global Error Handler
        next(error);
    }
};