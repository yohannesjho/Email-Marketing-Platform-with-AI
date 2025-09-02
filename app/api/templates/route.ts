import { getUserFromToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET() {
    try {
        const user = await getUserFromToken();

        if(!user) {
            return NextResponse.json({message: "Unauthorized"}, { status: 401})
        }

        const templates = prisma.template.findMany({
            where: {userId: user.id},
            orderBy: { createdAt: 'desc'},
            include: {
                emails: true
            }
        })

        return NextResponse.json(templates)
    } catch (error) {
        return NextResponse.json({message: "Internal Server Error"}, { status: 500})
    }
}