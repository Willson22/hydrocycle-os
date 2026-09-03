import { z } from 'zod';

export const loginDtoInSchema = z.object({
    body: z.object({
        email: z.email('Invalid email format'),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
        }).strict(),
});

export const loginDtoOutSchema = z.object({
    token: z.string(),
    user: z.object({
        id: z.string(),
        email: z.email(),
        role: z.string(),
    }),
});

export type LoginDtoIn = z.infer<typeof loginDtoInSchema>['body'];
export type LoginDtoOut = z.infer<typeof loginDtoOutSchema>;