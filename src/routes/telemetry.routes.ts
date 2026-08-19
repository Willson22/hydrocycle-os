import { Router } from 'express';
import { createTelemetry } from '../controllers/telemetry.controller';
import { validate } from '../middlewares/validate.middleware';
import { telemetryDataCreateDtoInSchema } from '../dto/telemetry.dto';

export const telemetryRouter = Router();

/**
 * POST /api/v1/telemetry
 * Endpoint for IIot sensors to ingest telemetry data.
 * Protected by Zod validation middleware.
 */
telemetryRouter.post(
    '/',
    validate(telemetryDataCreateDtoInSchema),
    createTelemetry
);