import { Request, Response, NextFunction } from "express";
import { loginDtoInSchema, loginDtoOutSchema } from "../dto/auth.dto";
import { login } from '../services/auth.service';

export async function loginController(req: Request, res: Response, next: NextFunction) {
    try {
        const { body } = loginDtoInSchema.parse({ body: req.body });
        const result = await login(body);

        // Out filtering
        const safeResponse = loginDtoOutSchema.parse(result);

        res.status(200).json(safeResponse);
    } catch (err) {
        next(err);
    }
}