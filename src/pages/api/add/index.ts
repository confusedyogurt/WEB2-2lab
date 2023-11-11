import { PrismaClient, competition, Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {

    try {
        let { name, email, password } = req.body
        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: password
            },
        })

        return res.status(201).json(user)
    }

    catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).json({ error: "An error occurred." });
    }
}