import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

/**
 * Zod validation middleware.
 * Uses safeParse to enforce Garbage In, Garbage Out without throwing exceptions.
 */
export const validate = (schema: ZodType) => 
    (req: Request, res: Response, next: NextFunction): void => {
        // Synchronous safe parsing - never throws an exception
        const parseResult = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        if (!parseResult.success) {
            // Using '.issues' instead of '.errors' ensures strict TypeScript compatibility
            res.status(400).json({
                status: "error",
                code: "VALIDATION_FAILED",
                message: "Invalid input data provided.",
                details: parseResult.error.issues.map(err => ({
                    field: err.path.join('.').replace('body.', ''),
                    message: err.message
                })),
                timestamp: new Date().toISOString()
            });
            return;
        }

        // Proceed to the next middleware or controller if validation succeeds
        next();
    };