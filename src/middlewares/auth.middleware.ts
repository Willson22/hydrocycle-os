import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { timeStamp } from 'node:console';

const   JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthenticatedRequest extends Request {
    user?: { id: string; email: string; role: string };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            status:'error',
            code: 'MISSING_TOKEN',
            message: 'Authorization header with Bearer token is required.',
            timestamp: new Date().toISOString(),
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; email: string; role: string};
        req.user = { id: decoded.sub, email: decoded.email, role: decoded.role};
        next();
    } catch {
        return res.status(401).json({
            status: 'error',
            code: 'INVALID_TOKEN',
            message: 'Insufficient permissions for this resource.',
            timestamp: new Date().toISOString(),
        });
    }
}

// RBAC guard (Building endpoints)
export function requireRole(...allowedRoles: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                code: 'FORBIDDEN',
                message: 'Insufficient permissions for this resource',
                timestamp: new Date().toISOString(),
            });
        }
        next();
    };
}