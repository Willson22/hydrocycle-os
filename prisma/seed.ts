import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_URI });
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 12;

async function main() {
    const passwordHash = await bcrypt.hash('TestPassword123!', SALT_ROUNDS);

    const testManager = await prisma.user.upsert({
        where: { email: 'manager@hydrocycle.com' },
        update: {}, //Pokud user existuje, nic neměníme (indempotence)
        create: {
            email: 'manager@hydrocycle.com',
            passwordHash,
            role: 'FacilityManager',
        },
    });

    console.log('Seeded user:', testManager.email, '| role:', testManager.role);
}

main()
    .catch((e) => {
        console.error('Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });