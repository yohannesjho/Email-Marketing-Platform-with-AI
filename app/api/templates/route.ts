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

export async function POST(req: Request) {
    try {
        const user = await getUserFromToken();

        if(!user) {
            return NextResponse.json({message: "Unauthorized"}, { status: 401})
        }

        const body = await req.json();

        const { name, subject, body: templateBody } = body

        if( !name || !subject || !templateBody ) {
            return NextResponse.json({message: "Missing fields"}, { status: 400})
        }

        const template = await prisma.template.create({
            data: {
                userId: user.id,
                name,
                subject,
                body: templateBody,
                 
            }
        })

        return NextResponse.json(template, { status: 201})
    } catch (error) {
        return NextResponse.json({message: "Internal Server Error"}, { status: 500})
    }
}