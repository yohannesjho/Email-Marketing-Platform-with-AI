import { getUserFromToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromToken();

        if(!user) {
            return NextResponse.json({message: "Unauthorized"}, { status: 401})
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '5')

        const skip = (page - 1) * limit;
        
        const templates = await prisma.template.findMany({
            where: {userId: user.id},
            orderBy: { createdAt: 'desc'},
            skip,
            take: limit,
        })

        const totalCount = await prisma.template.count({
            where: {userId: user.id}
        })

        return NextResponse.json({ templates, totalCount }, { status: 200 })
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