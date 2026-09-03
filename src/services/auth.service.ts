import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'  
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { LoginDtoIn } from '../dto/auth.dto';

const adapter = new PrismaPg({ connectionString: process.env.POSTGRE_URI });
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
}

class AuthError extends Error {
    statusCode = 401;
    errorCode = 'INVALID_CREDENTIALS';
}

export async function login({ email, password }: LoginDtoIn) {
    const user = await prisma.user.findUnique({ where: { email } });

    //Both error messages for defence against attackers due user enumeration
    if (!user) {
        throw new AuthError('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
        throw new AuthError('Invalide email or password');
    }

    const token = jwt.sign(
        {
            sub: user.id,
            email: user.email,
            role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    return { token, user: { id: user.id, email: user.email, role: user.role } };
}