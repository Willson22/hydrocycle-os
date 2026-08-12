import { z } from 'zod';

// 1. DtoIn: validatio of the income payload from IoT sensor
export const telemetryDataCreateDtoInSchema = z.object({
    body: z.object({
        sensorMacAddress: z.string().regex(
            /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
            "Invalid MAC address format"
        ),
        timestamp: z.string().datetime("Timestamp must be a valid ISO 8601 date"),
        flowRate: z.number().nonnegative("Flow rate cannot be negative"),
        volumeTotal: z.number().nonnegative("Total volume cannot be negative")
    }).strict() // Rejects any other properties
});

// 2. DtoOut: Safe format for response
export const telemetryDataDtoOutSchema = z.object({
    id: z.string(), // Mongoose ObjectId nebo UUID z Postgres
    sensorMacAddress: z.string(),
    timestamp: z.string().datetime(),
    flowRate: z.number(),
    volumeTotal: z.number()
});

// Generation of TypeScript types for use in Services and Controllers
export type TelemetryCreateDtoIn = z.infer<typeof telemetryDataCreateDtoInSchema>['body'];
export type TelemetryDtoOut = z.infer<typeof telemetryDataDtoOutSchema>;