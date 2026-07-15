# DTO Validation Schemas  - HydroCycle OS MVP

This document defines the Data Transfer Object (DTO) structure for the HydroCycle OS REST API. The architecture strictly separates DtoIn for external input validation and DtoOut for secure output formatting. This approach adheres to B2B SaaS best practices and provides a robust defensive shield against data leakage and mass assignment attacks.

## 1. M2M Telemetry Ingestion DTO

Endpoint: 'POST api/v1/telemetry'
Ingestion data validation from IoT

```typescript
import { z } from 'zod';

export const telemetryIngestionSchema = z.object({
    body: z.object({
        sensorMacAddress: z.string().regex(
            /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
            "Invalid MAC address format"
        ),
        timestamp: z.string().datetime("Timestamp must be a valid ISO 8601 date"),
        flowRate: z.number().nonnegative("Flow rate cannot be negative"),
        volumeTotal: z.number().nonnegative("Total volume cannot be negative")
    }).strict() // Disallows any additional (unknown) properties in the payload.
});
```

## 2. Authentication Login DTO

Endpoint: POST /api/v1/auth/login
Client login validation before passing to bcrypt/PostgreSQL.

```typescript
export const loginAuthSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(8, "Password must be at least 8 characters long")
    }).strict()
});
```

## 3. Building DTO

DtoIn:
```typescript
export const buildingCreateDtoInSchema = z.object({
    body: z.object ({
        name: z.string().min(3),
        address: z.string()
        // Client is only allowed to send the name and address from Dashboard.
    }).strict() // Zod disallows anything else.
});
```
DtoOut:
```typescript
export const buildingDtoOutSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    address: z.string(),
    activeMeasurementPoints: z.number(), // Data not included in DtoIn because backend calculated them
    createdAt: z.string().datetime()
});
```
## 4. Measurement Point DTO

DtoIn:
```typescript
export const measurementPointCreateDtoInSchema = z.object({
    body: z.object({
        locationName: z.string().min(3),
        sensorMacAddress: z.string()
    }).strict()
});
```
DtoOut:
```typescript
export const measurementPointDtoOutSchema = z.object({
    id: z.string().uuid(),
    locationName: z.string(),
    sensorMacAddress: z.string(),
    createdAt: z.string().datetime()
});
```

## 5. Telemetry Data DTO

DtoIn
```typescript
export const telemetryDataCreateDtoInSchema = z.object({
    body: z.object({
        sensorMacAddress: z.string(),
        timestamp: z.string().datetime(),
        flowRate: z.number(),
        volumeTotal: z.number()
    }).strict()
});
```

DtoOut:
```typescript
export const telemetryDataDtoOut = z.object({
    id: z.string().uuid(),
    sensorMacAddress: z.string(),
    timestamp: z.string().datetime(),
    flowRate: z.number(),
    volumeTotal: z.number()
});
```

## 6. Aggregated Savings DTO

DtoIn:
```typescript
export const aggregatedSavingsCreateDtoInSchema = z.object({
    body: z.object({
        periodStart: z.string().datetime(),
        periodEnd: z.string().datetime(),
        waterSavedLitres: z.number(),
        co2SavedKg: z.number(),
        financialSavingsEur: z.number()
    }).strict()
})
```

DtoOut:
```typescript
export const aggregatedSavingsDtoOut = z.object({
    id: z.string().uuid(),
    periodStart: z.string().datetime(),
    periodEnd: z.string().datetime(),
    waterSavedLitres: z.number(),
    co2SavedKg: z.number(),
    financialSavingsEur: z.number()
})