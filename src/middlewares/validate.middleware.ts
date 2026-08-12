import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';

/**
 * Zod validation middleware.
 * Intercepts incoming requests and validates them against the provided DtoIn schema.
 * Enforces the Garbage In, Garbage Out principle.
 */
export const validate = (schema: ZodSchema) => 
    (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Synchronous parsing of the incoming request structure
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                // Formatting the response strictly according to the HydroCycle OS Error Handling Policy
                res.status(400).json({
                    status: "error",
                    code: "VALIDATION_FAILED",
                    message: "Invalid input data provided.",
                    details: error.errors.map((err: ZodIssue) => ({
                        // Stripping the internal 'body.' prefix to keep the client output clean
                        field: err.path.join('.').replace('body.', ''),
                        message: err.message
                    })),
                    timestamp: new Date().toISOString()
                });
                return;
            }
            
            // Forwarding unexpected internal errors to the global Express error handler
            next(error);
        }
    };