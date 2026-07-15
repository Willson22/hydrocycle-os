# Error Handling Policy - HydroCycle OS MVP

This document defines the standardized error handling strategy for the HydroCycle OS REST API. A unified error response structure is critical for frontend developers and B2B integrators, ensuring predictable behavior and easier debugging.

## 1. Standardized JSON Error Response

Every API error will return a strictly typed JSON object. The backend will never leak stack traces to the client in the production environment.

```json
{
  "status": "error",
  "code": "VALIDATION_FAILED",
  "message": "Invalid input data provided.",
  "details": [
    {
      "field": "sensorMacAddress",
      "message": "Invalid MAC address format"
    }
  ],
  "timestamp": "2026-07-15T07:51:28Z"
}
```

Property Definitions:
* error (Object): The root wrapper indicating a failed request.
* code (String - UPPER_SNAKE_CASE): A machine-readable string categorized for programmatic handling on the client (e.g., UNAUTHORIZED, RESOURCE_NOT_FOUND).
* message (String): A human-readable description of the error. Must not expose sensitive database stack traces.
* details (Array of Objects, Optional): Used primarily for validation errors to list specific fields that failed constraints.

## 2. Standartized HTTP Status Codes

Standardized error status codes will be implemented along this model.

## 3. Implementation Strategy (Express.js)

To enforce this policy, the Express application will utilize a Global Error Handling Middleware

1. Controllers and Services should throw custom error classes.
2. The global middleware (next(err)) intercepts these exceptions.
3. The middleware formats the exception into stadardized JSON structure and applies the correct HTTP status code before sending the response.